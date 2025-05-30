<!-- @/components/espaco_admin/tipologia/data-table-dropdown.vue -->
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
import { MoreHorizontal } from "lucide-vue-next";
import type { Tipologia } from "@/components/interfaces";
import { updateTipologia, deleteTipologia } from "@/api/tipologias";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from '@/components/ui/toast/use-toast'
import { Toaster } from '@/components/ui/toast'

const { toast } = useToast();

const props = defineProps<{
  tipologia: Tipologia
}>();

const showEditModal = ref(false);
const showDeleteModal = ref(false);
const editItem = ref<Tipologia | null>(null);

const emit = defineEmits(['tipologia-atualizada']);

const handleEdit = (tipologia: Tipologia) => {
  editItem.value = { ...tipologia };
  showEditModal.value = true;
};

const handleDelete = (tipologia: Tipologia) => {
  editItem.value = { ...tipologia };
  showDeleteModal.value = true;
};

const handleSave = async () => {
  try {
    if (editItem.value) {
      await updateTipologia(editItem.value);
      emit('tipologia-atualizada');
      toast({
        title: 'Tipologia atualizada com sucesso.',
        variant: 'success'
      });
      showEditModal.value = false;
    }
  } catch (error) {
    toast({
      title: 'Erro ao atualizar tipologia. Por favor, tente novamente.',
      variant: 'destructive'
    });
  }
};

const handleDeleteConfirm = async () => {
  try {
    if (editItem.value) {
      await deleteTipologia(editItem.value.id);
      emit('tipologia-atualizada');
      toast({
        title: 'Tipologia eliminada com sucesso.',
        variant: 'success'
      });
      showDeleteModal.value = false;
    }
  } catch (error) {
    toast({
      title: 'Erro ao eliminar tipologia. Por favor, tente novamente.',
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
      <DropdownMenuItem @click="handleEdit(props.tipologia)">Editar</DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem @click="handleDelete(props.tipologia)" class="text-red-500">Eliminar</DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>

<Dialog v-model:open="showEditModal">
  <DialogContent class="w-full max-w-md">
    <DialogHeader>
      <DialogTitle>Editar Tipologia</DialogTitle>
      <DialogDescription>
            Altere a tipologia e clique em "Guardar".
          </DialogDescription>
    </DialogHeader>
    <form @submit.prevent="handleSave" v-if="editItem" class="space-y-4">
  <div>
    <label class="block mb-1">Nome da Tipologia</label>
    <input
      v-model="editItem.tipologia"
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
            Tem a certeza que deseja eliminar esta tipologia?
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