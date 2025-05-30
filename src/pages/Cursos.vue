<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import DataTable from '@/components/cursos/data-table.vue'
import { fetchCursosPorGrau } from '@/api/cursos.ts'
import { getColumns } from '@/components/cursos/columns.ts'
import type { Curso } from '@/components/interfaces'
import { fetchGraus } from '@/api/graus'
import { useToast } from '@/components/ui/toast/use-toast'
import { Toaster } from '@/components/ui/toast'

const { toast } = useToast()

const cursos = ref<Curso[]>([])
const grauAtivo = ref<number | null>(null)
const grausDisponiveis = ref<{ id: number; grau: string }[]>([])

const cursosFiltrados = computed(() => cursos.value)

async function carregarGraus() {
  try {
    const graus = await fetchGraus()
    grausDisponiveis.value = graus

    if (graus.length > 0) {
      grauAtivo.value = graus[0].id
    }
  } catch (error) {
    toast({
      title: 'Erro ao carregar graus. Por favor, tente novamente mais tarde.',
      variant: 'destructive'
    })
  }
}

async function carregarCursos() {
  if (grauAtivo.value === null) return
  try {
    cursos.value = await fetchCursosPorGrau(grauAtivo.value)
  } catch (error) {
    toast({
      title: 'Erro ao carregar cursos. Por favor, tente novamente mais tarde.',
      variant: 'destructive'
    })
  }
}

watch(grauAtivo, () => {
  carregarCursos()
})

onMounted(async () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
  await carregarGraus()
})
</script>
<template>
  <Toaster />

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
    <DataTable :columns="getColumns(carregarCursos)" :data="cursosFiltrados" @refresh="carregarCursos" />
  </div>
</template>