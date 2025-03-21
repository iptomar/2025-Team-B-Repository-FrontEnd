<script setup>
import { ref } from 'vue';
import Button from './components/ui/button/Button.vue';

const data = ref([
  { text: "hello" },
  { text: "to" },
  { text: "you!!!" },
  {text: "fjdfjhbbje"}
]);
</script>

<template>

<h1 class="text-3xl font-bold underline text-center text-red-600">
    Hello world!
  </h1>

  <div v-for="(item, index) in data" :key="index">
    <input type="text" v-model="item.text">
  </div>

  <Button>Button</Button>

  {{ data }}
  <Button class="text-red-500">CLICA ME</Button>
</template>
