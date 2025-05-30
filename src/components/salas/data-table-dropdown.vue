<script setup lang="ts">
import { onMounted, ref } from "vue";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-vue-next";
import type { Localidade, Sala } from "../interfaces";
import { deleteSala, updateSala } from "@/api/salas";
import { useToast } from '@/components/ui/toast/use-toast'
import { Toaster } from '@/components/ui/toast'
import { getLocalidades } from "@/api/localidades";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

defineProps<{
  sala: Sala
}>()

const { toast } = useToast()

const emit = defineEmits<{
  (e: 'refresh'): void
}>();

const showEditModal = ref(false);
const showDeleteModal = ref(false);
const editItem = ref<Sala | null>(null);

const localidades = ref<Localidade[]>([]);

const handleEdit = (sala: Sala) => {
  editItem.value = { ...sala };
  showEditModal.value = true;
};

const handleDelete = (sala: Sala) => {
  editItem.value = { ...sala };
  showDeleteModal.value = true;
};

const handleSave = async () => {
  try {
    if (editItem.value) {
      await updateSala(Number(editItem.value.id), editItem.value);
      showEditModal.value = false;
      emit('refresh');
      toast({
        title: 'A sala foi atualizada com sucesso.',
        variant: 'success',
      });
    }
  } catch (error) {
    toast({
      title: 'Não foi possível atualizar a sala, por favor tente novamente.',
      variant: 'destructive',
    });
  }
};

const handleDeleteConfirm = async () => {
  try {
    showDeleteModal.value = false;
    if (editItem.value) {
      await deleteSala(editItem.value.id);
      emit('refresh');
      toast({
        title: 'A sala foi eliminada com sucesso.',
        variant: 'success',
      })
    }
  } catch (error) {
    toast({
      title: 'Não foi possível eliminar a sala, por favor tente novamente.',
      variant: 'destructive',
    })
  }
};

onMounted(async () => {
  try {
    localidades.value = await getLocalidades();
  } catch (error) {
    toast({
      title: 'Não foi possível carregar as localidades.',
      variant: 'destructive',
    })
  }
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
      <DropdownMenuItem @click="handleEdit(sala)">Editar</DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem @click="handleDelete(sala)" class="text-red-500">Eliminar</DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>

  <Dialog v-model:open="showEditModal">
    <DialogContent class="w-full max-w-md">
      <DialogHeader>
        <DialogTitle>Editar Sala</DialogTitle>
        <DialogDescription>Altere a sala e clique em "Guardar".</DialogDescription>
      </DialogHeader>
      <form @submit.prevent="handleSave" v-if="editItem" class="space-y-4">
        <div>
          <label class="block mb-1">Nome da Sala</label>
          <input v-model="editItem.sala" type="text" class="w-full border border-gray-300 rounded px-2 py-1" required />
        </div>
        <div>
          <label class="block mb-1">Localidade</label>
          <select v-model="editItem.localidadeFK" class="w-full border border-gray-300 rounded px-2 py-1" required>
            <option value="">Selecione a localidade</option>
            <option v-for="localidade in localidades" :key="localidade.id" :value="localidade.id">
              {{ localidade.localidade }}
            </option>
          </select>
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
        <DialogDescription>Tem certeza de que deseja apagar a sala?</DialogDescription>
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