<script setup lang="ts">
  import { ref, onMounted } from 'vue';
  import { useRoute } from 'vue-router';
  
  const route = useRoute();
  const user = ref({
    name: '',
    email: '',
    password: ''
  });
  
  const loadUser = async (id: string) => {
    if (id === '1') {
      user.value = {
        name: 'João Silva',
        email: 'joao@ipt.pt',
        password: ''
      };
    } else if (id === '2') {
      user.value = {
        name: 'Maria Santos',
        email: 'maria@ipt.pt',
        password: ''
      };
    }
  };
  
  onMounted(() => {
    const userId = route.params.id;
    loadUser(userId); 
  });
  
  const updateUser = () => {
    console.log('Utilizador atualizado:', user.value);
  };
  </script>
  
<template>
    <div class="w-[40vw] bg-white space-y-6">
      <div class="text-center">
        <h1 class="text-3xl font-bold text-gray-900">Editar Utilizador</h1>
      </div>
  
      <form class="space-y-5 border rounded-2xl shadow-md">
        <div class="flex mt-4">
          <div class="w-[6rem] text-sm font-bold text-black ml-4 mt-2">Nome</div>
          <input v-model="user.name" type="text" class="w-full rounded-xl border border-gray-300 px-4 py-2  mx-4" placeholder="Nome do Utilizador"/>
        </div>
  
        <div class="flex mt-4">
          <div class="w-[6rem] text-sm font-bold text-black ml-4 mt-2">Email</div>
          <input v-model="user.email" type="text" class="w-full rounded-xl border border-gray-300 px-4 py-2  mx-4" placeholder="ipt@ipt.pt"/>
        </div>
  
        <div class="pt-4 mx-4 pb-4">
          <button type="submit" class="w-full bg-iptGreen text-white font-semibold py-2 px-4 rounded-xl hover:bg-white hover:text-black transition">
            Editar Utilizador
          </button>
        </div>
      </form>
    </div>
  </template>
  
  