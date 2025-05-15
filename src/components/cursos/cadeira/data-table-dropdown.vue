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
  cadeira: {
    id: number;
    nome: string;
    ano: number;
    semestre: number;
    ects: number;
  };
}>();

const editarCadeira = ref({ ...props.cadeira });
const isEditOpen = ref(false);
const isDeleteOpen = ref(false);

const handleEdit = () => {
  editarCadeira.value = { ...props.cadeira };
  isEditOpen.value = true;
};

const handleDelete = () => {
  editarCadeira.value = { ...props.cadeira };
  isDeleteOpen.value = true;
};

const handleSave = () => {
  console.log("Salvando alterações no item:", editarCadeira.value);
  isEditOpen.value = false;
};

const handleDeleteConfirm = () => {
  console.log("Excluindo item:", editarCadeira.value);
  isDeleteOpen.value = false;
};

const limitValue = (field: 'ano' | 'semestre' | 'ects', min: number, max: number) => {
  const value = editarCadeira.value[field];
  if (value < min) editarCadeira.value[field] = min;
  if (value > max) editarCadeira.value[field] = max;
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
        <DialogTitle>Editar Cadeira</DialogTitle>
        <DialogDescription>Faça alterações na cadeira e clique em "Guardar".</DialogDescription>
      </DialogHeader>

      <form @submit.prevent="handleSave" class="space-y-4">
        <div>
          <label class="block text-sm mb-1">Nome da Cadeira</label>
          <input v-model="editarCadeira.nome" type="text" class="w-full border border-gray-300 rounded px-2 py-1"
            required />
        </div>

        <div>
          <label class="block text-sm mb-1">Ano</label>
          <input v-model.number="editarCadeira.ano" type="number" min="1" max="4" @input="limitValue('ano', 1, 4)"
            class="w-full border border-gray-300 rounded px-2 py-1" required />
        </div>

        <div>
          <label class="block text-sm mb-1">Semestre</label>
          <input v-model.number="editarCadeira.semestre" type="number" min="1" max="3"
            @input="limitValue('semestre', 1, 3)" class="w-full border border-gray-300 rounded px-2 py-1" required />
          <p class="text-xs text-gray-500">* 3 - Para cadeiras anuais</p>
        </div>

        <div>
          <label class="block text-sm mb-1">ECTS</label>
          <input v-model.number="editarCadeira.ects" type="number" min="1" max="30" @input="limitValue('ects', 1, 30)"
            class="w-full border border-gray-300 rounded px-2 py-1" required />
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
        <DialogDescription>Tem certeza de que deseja apagar esta cadeira?</DialogDescription>
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