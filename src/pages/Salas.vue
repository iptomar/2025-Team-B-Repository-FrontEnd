<script setup lang="ts">
import { ref, onMounted } from 'vue'
import DataTable from '@/components/salas/data-table.vue'
import { columns, type Sala } from '@/components/salas/columns'

const data = ref<Sala[]>([])

async function getData(): Promise<Sala[]> {
  // Dados de exemplo com o padrão B121 e localidades específicas
  return [
    { id: '728ed52f', Nome_sala: 'B101', Nome_localidade: 'Abrantes' },
    { id: '489e1d42', Nome_sala: 'B102', Nome_localidade: 'Abrantes' },
    { id: 'a7b2c3d4', Nome_sala: 'B121', Nome_localidade: 'Mafra' },
    { id: 'e5f6g7h8', Nome_sala: 'B122', Nome_localidade: 'Mafra' },
    { id: 'i9j0k1l2', Nome_sala: 'B201', Nome_localidade: 'Rio Maior' },
    { id: 'm3n4o5p6', Nome_sala: 'B202', Nome_localidade: 'Rio Maior' },
    { id: 'q7r8s9t0', Nome_sala: 'B221', Nome_localidade: 'Tomar' },
    { id: 'u1v2w3x4', Nome_sala: 'B222', Nome_localidade: 'Tomar' },
    { id: 'y5z6a7b8', Nome_sala: 'B301', Nome_localidade: 'Torres Novas' },
    { id: 'c9d0e1f2', Nome_sala: 'B302', Nome_localidade: 'Torres Novas' },
    { id: 'g3h4i5j6', Nome_sala: 'B321', Nome_localidade: 'Abrantes' },
    { id: 'k7l8m9n0', Nome_sala: 'B322', Nome_localidade: 'Mafra' },
    { id: 'o1p2q3r4', Nome_sala: 'B401', Nome_localidade: 'Rio Maior' },
    { id: 's5t6u7v8', Nome_sala: 'B402', Nome_localidade: 'Tomar' },
    { id: 'w9x0y1z2', Nome_sala: 'B421', Nome_localidade: 'Torres Novas' }
  ]
}

onMounted(async () => {
  data.value = await getData()
})
</script>

<template>
  <div class="bg-white">
    <DataTable :columns="columns" :data="data" />
  </div>
</template>