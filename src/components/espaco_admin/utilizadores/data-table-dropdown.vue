<script setup lang="ts">
import { ref } from "vue";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { updateUser, fetchRoles } from "@/api/users";
import type { Users } from "@/components/interfaces";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { MoreHorizontal } from "lucide-vue-next";
import { useToast } from '@/components/ui/toast/use-toast'
import { Toaster } from '@/components/ui/toast'
import { Input } from "@/components/ui/input";

const { toast } = useToast();

const props = defineProps<{
  user: Users
}>();

const showEditModal = ref(false);
const editItem = ref<Users | null>(null);
const rolesOptions = ref<string[]>([]); // Opções de roles

const emit = defineEmits(['user-atualizado'])

const handleEdit = async (user: Users) => {
  try {
    // Carregar roles disponíveis
    rolesOptions.value = await fetchRoles();
    editItem.value = { ...props.user };
    showEditModal.value = true;
  } catch (error) {
    toast({
      title: 'Erro ao carregar funções',
      variant: 'destructive'
    });
  }
};

const handleSave = async () => {
  if (!editItem.value) return;

  // Validação básica
  if (!editItem.value.email.includes('@')) {
    toast({
      title: 'E-mail inválido',
      variant: 'destructive'
    });
    return;
  }

  if (editItem.value.roles.length === 0) {
    toast({
      title: 'Selecione pelo menos uma função',
      variant: 'destructive'
    });
    return;
  }

  try {
    await updateUser(editItem.value.id, editItem.value.email, editItem.value.userName, editItem.value.roles);
    emit('user-atualizado');
    toast({
      title: 'Utilizador atualizado com sucesso.',
      variant: 'success'
    });
    showEditModal.value = false;
  } catch (error) {
    toast({
      title: 'Erro ao atualizar utilizador',
      description: (error as Error).message || 'Tente novamente',
      variant: 'destructive'
    });
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
      <DropdownMenuItem @click="handleEdit(user)">Editar</DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>

  <Dialog v-model:open="showEditModal">
    <DialogContent class="w-full max-w-md">
      <DialogHeader>
        <DialogTitle>Editar Utilizador</DialogTitle>
        <DialogDescription>
          Altere os dados do utilizador e clique em "Guardar".
        </DialogDescription>
      </DialogHeader>
      <form @submit.prevent="handleSave" v-if="editItem" class="space-y-4">
        <div class="space-y-2">
          <label class="block text-sm font-medium">Nome Completo</label>
          <Input v-model="editItem.userName" required placeholder="Nome do utilizador" />
        </div>

        <div class="space-y-2">
          <label class="block text-sm font-medium">E-mail</label>
          <Input v-model="editItem.email" type="email" required placeholder="exemplo@email.com" />
        </div>

        <div class="space-y-2">
          <label class="block text-sm font-medium">Funções</label>
          <div class="space-y-2">
            <div v-for="role in rolesOptions" :key="role" class="flex items-center">
              <input type="checkbox" :id="`role-${role}`" :value="role" v-model="editItem.roles"
                class="mr-2 h-4 w-4 text-iptGreen border-gray-300 rounded focus:ring-iptGreen">
              <label :for="`role-${role}`" class="text-sm text-gray-700">{{ role }}</label>
            </div>
          </div>
        </div>

        <DialogFooter class="flex justify-end gap-2">
          <Button type="submit"
            class="bg-iptGreen text-white hover:bg-green-100 hover:text-iptGreen hover:border-iptGreen">
            Guardar
          </Button>
          <Button variant="ghost"
            class="px-4 py-2 text-white bg-gray-400 hover:bg-gray-100 hover:border-gray-400 hover:text-gray-400"
            @click="showEditModal = false; editItem = null">
            Cancelar
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
</template>