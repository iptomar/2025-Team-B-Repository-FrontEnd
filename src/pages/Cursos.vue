<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import DataTable from '@/components/cursos/data-table.vue'
import { fetchCursosPorGrau } from '@/api/cursos.ts'
import { columns } from '@/components/cursos/columns.ts'
import type { Curso } from '@/components/interfaces'
import { fetchGraus } from '@/api/graus'

const cursos = ref<Curso[]>([])
const grauAtivo = ref<number | null>(null)
const grausDisponiveis = ref<{ id: number; grau: string }[]>([])

async function carregarGraus() {
  try {
    console.log('[carregarGraus] Iniciando carregamento dos graus...')
    const graus = await fetchGraus()
    console.log('[carregarGraus] Graus recebidos:', graus)
    grausDisponiveis.value = graus

    if (graus.length > 0) {
      grauAtivo.value = graus[0].id
      console.log('[carregarGraus] Grau ativo definido para:', grauAtivo.value)
      // carregarCursos será chamado pelo watcher
    } else {
      console.log('[carregarGraus] Nenhum grau disponível')
    }
  } catch (error) {
    console.error('[carregarGraus] Erro ao carregar graus:', error)
  }
}

async function carregarCursos() {
  if (grauAtivo.value === null) {
    console.log('[carregarCursos] grauAtivo é null, não carrega cursos.')
    return
  }
  try {
    console.log('[carregarCursos] Carregando cursos para grau:', grauAtivo.value)
    cursos.value = await fetchCursosPorGrau(grauAtivo.value)
    console.log('[carregarCursos] Cursos carregados:', cursos.value)
  } catch (error) {
    console.error('[carregarCursos] Erro ao carregar cursos:', error)
  }
}

watch(grauAtivo, async (novoGrau) => {
  console.log('[watch grauAtivo] Grau ativo mudou para:', novoGrau)
  if (novoGrau !== null) {
    await carregarCursos()
  }
})

onMounted(async () => {
  console.log('[onMounted] Componente montado, iniciando carregamento...')
  window.scrollTo({ top: 0, behavior: 'smooth' })
  await carregarGraus()
})
</script>

<template>
  <div class="flex flex-wrap gap-4 justify-center mb-6">
    <template v-for="grau in grausDisponiveis" :key="grau.id">
      <button @click="grauAtivo = grau.id" :class="[
        'px-6 py-2 rounded-2xl font-semibold transition duration-200 inline-flex items-center border-2',
        grauAtivo === grau.id
          ? 'bg-iptGreen text-white border-iptGreen shadow-md hover:border-black'
          : 'bg-gray-100 text-black border-gray-300 hover:border-iptGreen'
      ]">
        {{ grau.grau }}
      </button>
    </template>
  </div>

  <div class="w-full">
    <DataTable :columns="columns" :data="cursos" />
  </div>
</template>