<script setup lang="ts">
import { ref, defineProps } from "vue";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { deleteGrau, updateGrau } from "@/api/graus";
import type { Grau } from "@/components/interfaces";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { MoreHorizontal } from "lucide-vue-next";
import { useToast } from '@/components/ui/toast/use-toast'
import { Toaster } from '@/components/ui/toast'

const { toast } = useToast();

const props = defineProps<{
  grau: Grau
}>();

const showEditModal = ref(false);
const showDeleteModal = ref(false);
const editItem = ref<Grau | null>(null);

const emit = defineEmits(['grau-atualizado'])

const handleEdit = (grau: Grau) => {
  editItem.value = { ...grau };
  showEditModal.value = true;
};

const handleDelete = (grau: Grau) => {
  editItem.value = { ...grau };
  showDeleteModal.value = true;
};

const handleSave = async () => {
  if (!editItem.value) return;
  
  try {
    await updateGrau(editItem.value);
    emit('grau-atualizado');
toast({
      title: 'Grau atualizado com sucesso.',
      variant: 'success'
    });
  showEditModal.value = false;
  } catch (error) {
    toast({
      title: 'Erro ao atualizar grau. Por favor, tente novamente.',
      variant: 'destructive'
    });
  }
};

const handleDeleteConfirm = async () => {
  if (!editItem.value?.id) return;
  
  try {
    await deleteGrau(editItem.value.id.toString());
    toast({
      title: 'Grau eliminado com sucesso.',
      variant: 'success'
    });
    emit('grau-atualizado');
  showDeleteModal.value = false;
  } catch (error) {
    toast({
      title: 'Erro ao eliminar grau. Por favor, tente novamente.',
      variant: 'destructive'
    });
  }
};
</script>

<template>
  <Toaster />

  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <Button
        variant="ghost"
        class="w-8 h-8 p-0 bg-white border hover:border-iptGreen"
      >
        <span class="sr-only">Open menu</span>
        <MoreHorizontal class="w-4 h-4" />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end">
      <DropdownMenuItem @click="handleEdit(props.grau)">Editar</DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem @click="handleDelete(props.grau)" class="text-red-500">Eliminar</DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>

<Dialog v-model:open="showEditModal">
  <DialogContent class="w-full max-w-md">
    <DialogHeader>
      <DialogTitle>Editar Grau Académico</DialogTitle>
      <DialogDescription>
            Altere o grau académico e clique em "Guardar".
          </DialogDescription>
    </DialogHeader>
    <form @submit.prevent="handleSave" v-if="editItem" class="space-y-4">
  <div>
    <label class="block mb-1">Nome do Grau</label>
    <input
      v-model="editItem.grau"
      type="text"
      class="w-full border border-gray-300 rounded px-2 py-1"
      required
    />
  </div>
  <DialogFooter class="flex justify-end gap-2">
    <Button type="submit"
            class="bg-iptGreen text-white hover:bg-green-100 hover:text-iptGreen hover:border-iptGreen">
      Guardar
    </Button>
    <Button type="button"
            class="px-4 py-2 text-white bg-gray-400 hover:bg-gray-100 hover:border-gray-400 hover:text-gray-400"
            variant="ghost" @click="showEditModal = false, editItem = null">
      Cancelar
    </Button>
  </DialogFooter>
</form>
  </DialogContent>
</Dialog>

  <Dialog v-model:open="showDeleteModal">
  <DialogContent class="w-full max-w-md">
    <DialogHeader>
      <DialogTitle>Confirmar Eliminação</DialogTitle>
      <DialogDescription>
            Tem a certeza que deseja eliminar este grau académico?
          </DialogDescription>
    </DialogHeader>
    <DialogFooter class="flex justify-center gap-2">
      <Button type="button" class="bg-red-100 text-red-500 hover:bg-red-500 hover:text-white"
            @click="handleDeleteConfirm">
            Excluir
          </Button>
          <Button type="button"
            class="px-4 py-2 text-white bg-gray-400 hover:bg-gray-100 hover:border-gray-400 hover:text-gray-400"
            variant="ghost" @click="showDeleteModal = false">
            Cancelar
          </Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
</template>