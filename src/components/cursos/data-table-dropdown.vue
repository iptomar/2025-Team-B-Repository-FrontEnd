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

const showEditModal = ref(false);
const showDeleteModal = ref(false);
const editItem = ref<any>(null);

const props = defineProps({
  curso: Object,
});

const professores = ['Dr. Silva', 'Dra. Costa', 'Dr. Rodrigues'];

const handleEdit = (curso: any) => {
  editItem.value = curso;
  showEditModal.value = true;
};

const handleDelete = (curso: any) => {
  editItem.value = curso;
  showDeleteModal.value = true;
};

const closeModals = () => {
  showEditModal.value = false;
  showDeleteModal.value = false;
};

const handleSave = () => {
  // Lógica para salvar as alterações no item
  console.log("Salvando alterações no item:", editItem.value);
  closeModals();
};

const handleDeleteConfirm = () => {
  // Lógica para excluir o item
  console.log("Excluindo item:", editItem.value);
  closeModals();
};
</script>

<template>
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
      <DropdownMenuItem @click="handleEdit(curso)">Editar</DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem @click="handleDelete(curso)">Eliminar</DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>

  <div
    v-if="showEditModal"
    class="fixed inset-0 flex items-center z-10 justify-center bg-black bg-opacity-50"
  >
    <div class="bg-white rounded-lg p-6 w-96">
      <h2 class="text-xl mb-4 text-center">Editar Curso</h2>
      <form @submit.prevent="handleSave">
        <div class="mb-4">
          <label class="block mb-1 text-center">Nome do Curso</label>
          <input
            v-model="editItem.curso"
            type="text"
            class="w-full border border-gray-300 rounded px-2 py-1"
            required
          />
        </div>

        <div class="mb-4">
          <label class="block mb-1 text-center">Professor Responsável</label>
          <select
            v-model="editItem.respProf"
            class="w-full border border-gray-300 rounded px-2 py-1"
            required
          >
            <option value="">Selecione o professor</option>
            <option v-for="prof in professores" :key="prof" :value="prof">
              {{ prof }}
            </option>
          </select>
        </div>
        <div class="flex justify-center space-x-2">
          <button
            type="submit"
            class="px-4 py-2 text-white bg-iptGreen hover:bg-green-100 hover:border-iptGreen hover:text-iptGreen rounded"
          >
            Guardar
          </button>
          <button
            type="button"
            @click="closeModals"
            class="px-4 py-2 text-white bg-gray-400 hover:bg-gray-100 hover:border-gray-400 hover:text-gray-400 rounded"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  </div>

  <div
    v-if="showDeleteModal"
    class="fixed inset-0 flex items-center z-10 justify-center bg-black bg-opacity-50"
  >
    <div class="bg-white rounded-lg p-6 w-96">
      <h2 class="text-xl mb-4 text-center">Confirmar Eliminação</h2>
      <p class="mb-4 text-center">Tem certeza de que deseja apagar este curso?</p>
      <div class="flex justify-center space-x-2">
        <button
          type="button"
          @click="handleDeleteConfirm"
          class="px-4 py-2 bg-red-100 hover:bg-red-500 hover:border-red-100 border-red-500 hover:text-white text-red-500 rounded"
        >
          Excluir
        </button>
          <button
            type="button"
            @click="closeModals"
            class="px-4 py-2 text-white bg-gray-400 hover:bg-gray-100 hover:border-gray-400 hover:text-gray-400 rounded"
          >
            Cancelar
          </button>        
      </div>
    </div>
  </div>
</template>