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

const showEditModal = ref(false);
const showDeleteModal = ref(false);
const editItem = ref<Tipologia | null>(null);
const emit = defineEmits(['refresh']);

const props = defineProps({
  tipologia: {
    type: Object as () => Tipologia,
    required: true
  }
});

const handleEdit = (tipologia: Tipologia) => {
  editItem.value = { ...tipologia };
  showEditModal.value = true;
};

const handleDelete = (tipologia: Tipologia) => {
  editItem.value = { ...tipologia };
  showDeleteModal.value = true;
};

const closeModals = () => {
  showEditModal.value = false;
  showDeleteModal.value = false;
};

const handleSave = async () => {
  try {
    if (editItem.value) {
      await updateTipologia(editItem.value);
      emit('refresh');
      closeModals();
    }
  } catch (error) {
    console.error("Erro ao atualizar tipologia:", error);
  }
};

const handleDeleteConfirm = async () => {
  try {
    if (editItem.value) {
      await deleteTipologia(editItem.value.id);
      emit('refresh');
      closeModals();
    }
  } catch (error) {
    console.error("Erro ao deletar tipologia:", error);
  }
};
</script>

<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <Button
        variant="ghost"
        class="w-8 h-8 p-0 bg-white border border-gray-200 hover:border-iptGreen hover:bg-gray-50 rounded-md shadow-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-iptGreen focus:ring-opacity-50"
      >
        <span class="sr-only">Open menu</span>
        <MoreHorizontal class="w-4 h-4 text-gray-600 hover:text-iptGreen transition-colors duration-200" />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent 
      align="end"
      class="w-40 bg-white rounded-md shadow-lg border border-gray-200 focus:outline-none"
    >
      <DropdownMenuItem 
        class="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 cursor-pointer transition-colors duration-200 focus:bg-gray-100 focus:text-gray-900"
        @click="handleEdit(tipologia)"
      >
        Editar
      </DropdownMenuItem>
      <DropdownMenuSeparator class="h-px bg-gray-200 my-1" />
      <DropdownMenuItem 
        class="px-4 py-2 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 cursor-pointer transition-colors duration-200 focus:bg-red-50 focus:text-red-700"
        @click="handleDelete(tipologia)"
      >
        Eliminar
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>

  <!-- Edit Modal -->
  <div
    v-if="showEditModal && editItem"
    class="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 transition-opacity duration-200"
  >
    <div class="bg-white rounded-lg p-6 w-96 shadow-xl transform transition-all duration-200">
      <h2 class="text-xl font-semibold mb-4 text-center text-gray-800">Editar Tipologia</h2>
      <form @submit.prevent="handleSave">
        <div class="mb-4">
          <label class="block mb-2 text-sm font-medium text-gray-700 text-center">Nome da Tipologia</label>
          <input
            v-model="editItem.tipologia"
            type="text"
            class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-iptGreen focus:border-transparent transition-colors duration-200"
            required
          />
        </div>
        <div class="flex justify-center space-x-3">
          <button
            type="submit"
            class="px-4 py-2 text-white bg-iptGreen hover:bg-green-600 rounded-md shadow-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-iptGreen focus:ring-offset-2"
          >
            Guardar
          </button>
          <button
            type="button"
            @click="closeModals"
            class="px-4 py-2 text-white bg-gray-500 hover:bg-gray-600 rounded-md shadow-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  </div>

  <!-- Delete Confirmation Modal -->
  <div
    v-if="showDeleteModal && editItem"
    class="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 transition-opacity duration-200"
  >
    <div class="bg-white rounded-lg p-6 w-96 shadow-xl transform transition-all duration-200">
      <h2 class="text-xl font-semibold mb-4 text-center text-gray-800">Confirmar Eliminação</h2>
      <p class="mb-6 text-center text-gray-600">Tem certeza de que deseja apagar a tipologia "{{ editItem.tipologia }}"?</p>
      <div class="flex justify-center space-x-3">
        <button
          type="button"
          @click="handleDeleteConfirm"
          class="px-4 py-2 bg-red-100 text-red-600 hover:bg-red-600 hover:text-white border border-red-600 rounded-md shadow-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
        >
          Excluir
        </button>
        <button
          type="button"
          @click="closeModals"
          class="px-4 py-2 text-white bg-gray-500 hover:bg-gray-600 rounded-md shadow-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
        >
          Cancelar
        </button>        
      </div>
    </div>
  </div>
</template>