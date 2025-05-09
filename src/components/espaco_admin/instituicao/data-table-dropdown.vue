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
import type { Instituicao } from "./columns";

const showEditModal = ref(false);
const showDeleteModal = ref(false);
const editItem = ref<Instituicao | null>(null);

const props = defineProps({
  instituicao: {
    type: Object as () => Instituicao,
    required: true
  }
});

const localidades = ['Tomar', 'Torres Novas', 'Abrantes']; // Should match your API data

const handleEdit = (instituicao: Instituicao) => {
  editItem.value = { ...instituicao };
  showEditModal.value = true;
};

const handleDelete = (instituicao: Instituicao) => {
  editItem.value = { ...instituicao };
  showDeleteModal.value = true;
};

const closeModals = () => {
  showEditModal.value = false;
  showDeleteModal.value = false;
};

const handleSave = () => {
  console.log("Salvando alterações na instituição:", editItem.value);
  closeModals();
};

const handleDeleteConfirm = () => {
  console.log("Excluindo instituição:", editItem.value);
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
      <DropdownMenuItem @click="handleEdit(instituicao)">Editar</DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem @click="handleDelete(instituicao)">Eliminar</DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>

  <div
    v-if="showEditModal"
    class="fixed inset-0 flex items-center z-10 justify-center bg-black bg-opacity-50"
  >
    <div class="bg-white rounded-lg p-6 w-96">
      <h2 class="text-xl mb-4 text-center">Editar Instituição</h2>
      <form @submit.prevent="handleSave">
        <div class="mb-4">
          <label class="block mb-1 text-center">Nome da Instituição</label>
          <input
            v-model="editItem.instituicao"
            type="text"
            class="w-full border border-gray-300 rounded px-2 py-1"
            required
          />
        </div>
        <div class="mb-4">
          <label class="block mb-1 text-center">Localidade</label>
          <select
            v-model="editItem.localidade"
            class="w-full border border-gray-300 rounded px-2 py-1"
            required
          >
            <option value="">Selecione a localidade</option>
            <option v-for="localidade in localidades" :key="localidade" :value="localidade">
              {{ localidade }}
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
      <p class="mb-4 text-center">Tem certeza de que deseja apagar a instituição {{ editItem?.instituicao }}?</p>
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