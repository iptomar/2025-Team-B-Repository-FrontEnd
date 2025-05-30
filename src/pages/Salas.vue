<script setup lang="ts">
import { ref, onMounted } from 'vue'
import DataTable from '@/components/salas/data-table.vue'
import type { Sala } from '@/components/interfaces'
import { fetchSalas } from '@/api/salas'
import { getColumns } from '@/components/salas/columns'
import { useToast } from '@/components/ui/toast/use-toast'
import { Toaster } from '@/components/ui/toast'

const { toast } = useToast()

const salas = ref<Sala[]>([])

async function carregarSalas() {
  try {
    salas.value = await fetchSalas()
  } catch (error) {
    toast({
      title: 'Erro ao carregar salas. Por favor, tente novamente mais tarde.',
      variant: 'destructive'
    })
  }
}

onMounted(async () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
  await carregarSalas()
})
</script>

<template>
  <Toaster />

  <div class="mx-auto space-y-8">
    <div class="border-b pb-6">
      <h1 class="text-3xl font-bold text-black">Salas</h1>
    </div>

    <DataTable :columns="getColumns(carregarSalas)" :data="salas" @refresh="carregarSalas" />
  </div>
</template>