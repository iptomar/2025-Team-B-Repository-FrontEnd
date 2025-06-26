<script setup lang="ts">
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-vue-next";
import type { Localidade } from "@/components/interfaces";

const props = defineProps({
  localidade: {
    type: Object as () => Localidade,
    required: true
  }
});

const emit = defineEmits(['edit', 'delete']);

const handleEdit = () => {
  emit('edit', props.localidade);
};

const handleDelete = () => {
  emit('delete', props.localidade.id);
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
      <DropdownMenuItem @click="handleEdit">Editar</DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem @click="handleDelete" class="text-red-500">Eliminar</DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>