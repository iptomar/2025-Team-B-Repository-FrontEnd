<script setup lang="ts">
import { ref, onMounted } from "vue";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { MoreHorizontal } from "lucide-vue-next";
import { updateCurso, deleteCurso } from '@/api/cursos'
import { useToast } from '@/components/ui/toast/use-toast'
import { Toaster } from '@/components/ui/toast'
import { fetchCoordenadores } from '@/api/cursos'

const emit = defineEmits<{
  (e: 'refresh'): void;
}>()

const { toast } = useToast()

const editarCurso = ref<any>(null);
const isEditOpen = ref(false);
const isDeleteOpen = ref(false);

defineProps({
  curso: Object,
});

const professores = ref<{ id: string; userName: string }[]>([]);

const handleEdit = (curso: any) => {
  editarCurso.value = { 
    ...curso,
    curso: curso.curso, 
    professorFK: curso.professorFK
  };
  isEditOpen.value = true;
};

const handleDelete = (curso: any) => {
  editarCurso.value = curso;
  isDeleteOpen.value = true;
};

const handleSave = async () => {
  try {
    const payload = {
      Id: editarCurso.value.id,
      Curso: editarCurso.value.curso,
      AnoLetivoFK: editarCurso.value.anoLetivoFK,
      InstituicaoFK: editarCurso.value.instituicaoFK,
      GrauFK: editarCurso.value.grauFK,
      ProfessorFK: editarCurso.value.professorFK
    };

    await updateCurso(payload.Id, payload);
    isEditOpen.value = false;
    toast({
      description: "Curso atualizado com sucesso!",
      variant: "success",
    });
    emit("refresh");
  } catch (error) {
    isEditOpen.value = false;
    toast({
      description: "Erro ao atualizar curso.",
      variant: "destructive",
    });
  }
};

const handleDeleteConfirm = async () => {
  try {
    await deleteCurso(editarCurso.value.id);
    isDeleteOpen.value = false;
    toast({
      description: 'Curso excluído com sucesso!',
      variant: 'success',
    });
    emit('refresh');
  } catch (error) {
    isDeleteOpen.value = false;
    toast({
      description: 'Erro ao excluir curso.',
      variant: 'destructive',
    });
  }
};

onMounted(async () => {
  professores.value = await fetchCoordenadores(); 
});
</script>

<template>
  <Toaster />

  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <Button variant="ghost" class="w-8 h-8 p-0 bg-white border hover:border-iptGreen">
        <span class="sr-only">Open menu</span>
        <MoreHorizontal class="w-4 h-4" />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end">
      <DropdownMenuItem @click="handleEdit(curso)">Editar</DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem @click="handleDelete(curso)">Eliminar</DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>

  <Dialog v-model:open="isEditOpen">
    <DialogContent class="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>Editar Curso</DialogTitle>
        <DialogDescription>
          Faça alterações no curso e clique em "Guardar".
        </DialogDescription>
      </DialogHeader>

      <form @submit.prevent="handleSave" class="space-y-4">
        <div>
          <label class="block text-sm mb-1">Nome do Curso</label>
          <input v-model="editarCurso.curso" type="text" class="w-full border border-gray-300 rounded px-2 py-1"
            required />
        </div>

        <div>
          <label class="block text-sm mb-1">Professor Responsável</label>
          <select v-model="editarCurso.professorFK" class="w-full border border-gray-300 rounded px-2 py-1" required>
            <option v-for="prof in professores" :key="prof.id" :value="prof.id">
              {{ prof.userName }}
            </option>
          </select>
        </div>

        <DialogFooter class="mt-4">
          <Button type="submit"
            class="bg-iptGreen text-white hover:bg-green-100 hover:text-iptGreen hover:border-iptGreen">
            Guardar
          </Button>
          <Button type="button"
            class="px-4 py-2 text-white bg-gray-400 hover:bg-gray-100 hover:border-gray-400 hover:text-gray-400"
            variant="ghost" @click="isEditOpen = false">
            Cancelar
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>

  <Dialog v-model:open="isDeleteOpen">
    <DialogContent class="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>Confirmar Eliminação</DialogTitle>
        <DialogDescription>
          Tem certeza de que deseja apagar este curso?
        </DialogDescription>
      </DialogHeader>
      <div class="flex justify-center gap-4 mt-4">
        <Button type="button" class="bg-red-100 text-red-500 hover:bg-red-500 hover:text-white"
          @click="handleDeleteConfirm">
          Excluir
        </Button>
        <Button type="button"
          class="px-4 py-2 text-white bg-gray-400 hover:bg-gray-100 hover:border-gray-400 hover:text-gray-400"
          variant="ghost" @click="isDeleteOpen = false">
          Cancelar
        </Button>
      </div>
    </DialogContent>
  </Dialog>
</template>