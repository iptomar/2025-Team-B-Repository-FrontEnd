<script setup>
import { ref } from 'vue';
import { RouterView } from 'vue-router';
import { Button } from '@/components/ui/button'


const data = ref([
  { text: "hello" },
  { text: "to" },
  { text: "you!!!" },
  {text: "fjdfjhbbje"}
]);
</script>

<template>

  
<h1 class="text-3xl font-bold underline">
    Hello world!
  </h1>

  <div v-for="(item, index) in data" :key="index">
    <input type="text" v-model="item.text">
  </div>

  <Button>Button</Button>

  {{ data }}
  <RouterView />
</template>
