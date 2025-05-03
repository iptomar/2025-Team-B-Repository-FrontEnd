<script setup lang="ts">
import { ref } from "vue";
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

const props = defineProps<{
  aula: {
    id: number;
    duração: string;
    tipologia: string;
    professor: { id: number; nome: string };
    turma: { id: number; ano: number; turma: string; semestre: number };
  };
}>()

const editarAula = ref({ ...props.aula });
const isEditOpen = ref(false);
const isDeleteOpen = ref(false);

const handleEdit = () => {
  editarAula.value = { ...props.aula };
  isEditOpen.value = true;
};

const handleDelete = () => {
  editarAula.value = { ...props.aula };
  isDeleteOpen.value = true;
};

const handleSave = () => {
  console.log("Salvando alterações no item:", editarAula.value);
  isEditOpen.value = false;
};

const handleDeleteConfirm = () => {
  console.log("Excluindo item:", editarAula.value);
  isDeleteOpen.value = false;
};
</script>

<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <Button variant="ghost" class="w-8 h-8 p-0 bg-white border hover:border-iptGreen">
        <span class="sr-only">Open menu</span>
        <MoreHorizontal class="w-4 h-4" />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end">
      <DropdownMenuItem @click="handleEdit">Editar</DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem @click="handleDelete">Eliminar</DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>

  <Dialog v-model:open="isEditOpen">
    <DialogContent class="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>Editar Aula</DialogTitle>
        <DialogDescription>Faça alterações na aula e clique em "Guardar".</DialogDescription>
      </DialogHeader>

      <form @submit.prevent="handleSave" class="space-y-4">
        <div>
          <label class="block text-sm mb-1">Duração</label>
          <input v-model="editarAula.duração" type="text" class="w-full border border-gray-300 rounded px-2 py-1"
            required />
        </div>

        <div>
          <label class="block text-sm mb-1">Tipologia</label>
          <input v-model.number="editarAula.tipologia" type="text"
            class="w-full border border-gray-300 rounded px-2 py-1" required />
        </div>

        <div>
          <label class="block text-sm mb-1">Professor</label>
          <input v-model.number="editarAula.professor" type="text"
            class="w-full border border-gray-300 rounded px-2 py-1" required />
        </div>

        <div>
          <label class="block text-sm mb-1">Turma</label>
          <input v-model.number="editarAula.turma" type="text" class="w-full border border-gray-300 rounded px-2 py-1"
            required />
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
        <DialogDescription>Tem certeza de que deseja apagar esta aula?</DialogDescription>
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