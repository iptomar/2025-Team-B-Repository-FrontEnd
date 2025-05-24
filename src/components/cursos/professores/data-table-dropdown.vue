<script setup lang="ts">
import { ref } from "vue";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { MoreHorizontal } from "lucide-vue-next";
import { useToast } from '@/components/ui/toast/use-toast'
import { Toaster } from '@/components/ui/toast'
import { removeProfessorDoCurso } from "@/api/professores";

const { toast } = useToast();

const Professor = ref<any>(null);
const isDeleteOpen = ref(false);

const emit = defineEmits<{
  (e: 'refresh'): void
}>();

const props = defineProps<{
  professor: any,
  cursoId: number
}>();

const handleDelete = (professor: any) => {
  Professor.value = {
    CursoFK: props.cursoId,
    ProfessorFK: professor.id,
    ...professor,
  };
  isDeleteOpen.value = true;
};

const handleDeleteConfirm = async () => {
  try {
    const { CursoFK, ProfessorFK } = Professor.value;
    await removeProfessorDoCurso(CursoFK, ProfessorFK);
    isDeleteOpen.value = false;
    toast({ title: "Professor removido com sucesso.", variant: "success" });
    emit("refresh");
  } catch (error) {
    isDeleteOpen.value = false;
    toast({ title: "Não foi possível remover o professor.", variant: "destructive" });
  }
};
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
      <DropdownMenuItem @click="handleDelete(professor)">Excluir</DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>

  <Dialog v-model:open="isDeleteOpen">
    <DialogContent class="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>Excluir</DialogTitle>
        <DialogDescription>
          Tem certeza de que deseja excluir este professor deste curso?
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