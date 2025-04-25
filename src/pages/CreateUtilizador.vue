<script setup lang="ts">

</script>

<template>
    <div class="w-[40vw] bg-white  space-y-6">
      <div class="text-center">
        <h1 class="text-3xl font-bold text-gray-900">Criar Utilizador</h1>
      </div>
  
      <form  class="space-y-5 border rounded-2xl shadow-md">
        
  
        <div class="flex mt-4">
          <div class="w-[6rem] text-sm font-bold text-black ml-4 mt-2">Email</div>
          <input v-model="nome" type="text" class="w-full rounded-xl border border-gray-300 px-4 py-2 mx-4" placeholder="ipt@ipt.pt"/>
        </div>
  
        <div class="flex mt-4">
          <div class="w-[6rem] text-sm font-bold text-black ml-4 mt-2">Password</div>
          <input v-model="password" type="password" class="w-full rounded-xl border border-gray-300 px-4 py-2 mx-4" placeholder="********"/>
        </div>
  
        <div class="pt-4 mx-4 pb-4">
          <button type="submit" class="w-full  bg-iptGreen text-white font-semibold py-2 px-4 rounded-xl hover:bg-white hover:text-black transition ">
            Criar Utilizador
          </button>
        </div>
      </form>
    </div>
  </template>