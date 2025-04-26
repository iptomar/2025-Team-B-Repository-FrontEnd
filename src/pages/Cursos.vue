<script setup lang="ts">
import { ref, onMounted } from 'vue'
import DataTable from '@/components/cursos/data-table.vue'
import { getData } from '@/api/api'
import { columns } from '@/components/cursos/columns.ts'
import type { Curso } from '@/components/interfaces'

const data = ref<Curso[]>([])

onMounted(async () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });

  data.value = await getData()
})
</script>

<template>
  <div class="mx-auto space-y-8">
    <div class="border-b pb-6">
      <h1 class="text-3xl font-bold text-black">Cursos</h1>
    </div>
    <DataTable :columns="columns" :data="data" />
  </div>
</template>