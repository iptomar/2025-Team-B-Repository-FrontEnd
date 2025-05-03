<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import DataTable from '@/components/cursos/data-table.vue'
import { getData } from '@/api/api'
import { columns } from '@/components/cursos/columns.ts'
import type { Curso } from '@/components/interfaces'

const data = ref<Curso[]>([])
const grauAtivo = ref<string>('Licenciatura')

const grausDisponiveis = ['Licenciatura', 'Mestrado', 'Doutoramento', 'Pós-Graduação', 'TeSP', 'Microcredenciação', 'Especialização', 'Curso Breve', 'Outra formação']

const cursosFiltrados = computed(() => {
  return data.value.filter(curso => curso.grau === grauAtivo.value)
})

onMounted(async () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
  data.value = await getData()
})
</script>

<template>
  <div class="mx-auto space-y-8 mt-8">
    <div class="flex flex-wrap gap-4 justify-center">
      <template v-for="grau in grausDisponiveis" :key="grau">
        <button @click="grauAtivo = grau" :class="[
          'px-6 py-2 rounded-2xl font-semibold transition duration-200 inline-flex items-center border-2',
          grauAtivo === grau
            ? 'bg-iptGreen text-white border-iptGreen shadow-md hover:border-black'
            : 'bg-gray-100 text-black border-gray-300 hover:border-iptGreen'
        ]">
          {{ grau }}
        </button>
      </template>
    </div>

    <div class="w-full">
      <DataTable :columns="columns" :data="cursosFiltrados" />
    </div>
  </div>
</template>