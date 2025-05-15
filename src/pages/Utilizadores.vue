 <script setup lang="ts">
  import { ref } from 'vue';
  import { useRouter } from 'vue-router';
  
  const users = ref([
    { id: 1, name: 'João Silva', email: 'joao@ipt.pt' },
    { id: 2, name: 'Maria Santos', email: 'maria@ipt.pt' },
  ]);
  
  const deleteUser = (id: number) => {
    users.value = users.value.filter(user => user.id !== id);
  };
</script>

<template>
    <div class="w-full">
      <div class="text-center mb-6">
        <h1 class="text-3xl font-bold text-gray-900">Utilizadores</h1>
      </div>
  
      <div class="shadow-md ">
        <table class="w-full text-sm text-left ">
          <thead class=" bg-gray-100 font-bold uppercase">
            <tr>
              <th class="px-6 py-3">Nome</th>
              <th class="px-6 py-3">Email</th>
              <th class="px-6 py-3">Ações</th>
            </tr>
          </thead>
          <tbody>
        
            <tr v-for="user in users" :key="user.id" class="bg-white border-b">
              <td class="px-6 py-4 ">{{ user.name }}</td>
              <td class="px-6 py-4">{{ user.email }}</td>
              <td class="px-6 py-4">
                <router-link :to="`/utilizadores/update-utilizador/${user.id}`">
                  <button class=" bg-yellow-600 text-white hover:bg-yellow-800">
                    Editar
                  </button>
                </router-link>
                <button @click="deleteUser(user.id)" class="bg-red-700 text-white hover:bg-red-800 ml-2">
                  Apagar
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="mb-4 text-right mt-8 flex justify-center">
        <router-link to="/utilizadores/create-utilizador">
          <a class=" text-black py-2 px-4 rounded-lg">
            Queres criar um novo utilizador? Clica aqui!
          </a>
        </router-link>
      </div>
    </div>
  </template>
 
  