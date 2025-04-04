<script setup lang="ts">
import { ref, onMounted } from 'vue'
import DataTable from '@/components/cursos/data-table.vue'
import { columns, type Curso } from '@/components/cursos/columns'

const data = ref<Curso[]>([])

async function getData(): Promise<Curso[]> {
  // Simulação de chamada à API
  return [
    { id: '728ed52f', grau: 'Licenciatura', curso: 'Engenharia Informática', respProf: 'Dr. Silva', cadeiras: [], instituicao: 'ESTT', anoLetivo: '2024/2025'},
    { id: '489e1d42', grau: 'Mestrado', curso: 'Matemática', respProf: 'Dra. Costa', cadeiras: [], instituicao: 'ESTA', anoLetivo: '2024/2025'},
    { id: 'a7b2c3d4', grau: 'Doutoramento', curso: 'Física', respProf: 'Dr. Rodrigues', cadeiras: [], instituicao: 'ESTG', anoLetivo: '2024/2025'},
    { id: 'e5f6g7h8', grau: 'Licenciatura', curso: 'Química', respProf: 'Dra. Almeida', cadeiras: [], instituicao: 'ESTT', anoLetivo: '2024/2025'},
    { id: 'i9j0k1l2', grau: 'Mestrado', curso: 'Biologia', respProf: 'Dr. Pereira', cadeiras: [], instituicao: 'ESTT', anoLetivo: '2024/2025'},
    { id: 'm3n4o5p6', grau: 'Licenciatura', curso: 'Engenharia Civil', respProf: 'Dra. Santos', cadeiras: [], instituicao: 'ESTA', anoLetivo: '2024/2025'},
    { id: 'q7r8s9t0', grau: 'Mestrado', curso: 'Engenharia Eletrotécnica', respProf: 'Dr. Ferreira', cadeiras: [], instituicao: 'ESTG', anoLetivo: '2023/2024'},
    { id: 'u1v2w3x4', grau: 'Licenciatura', curso: 'Arquitetura', respProf: 'Dra. Martins', cadeiras: [], instituicao: 'ESTA', anoLetivo: '2022/2023'},
    { id: 'y5z6a7b8', grau: 'Doutoramento', curso: 'Psicologia', respProf: 'Dr. Oliveira', cadeiras: [], instituicao: 'ESTT', anoLetivo: '2021/2022'},
    { id: 'c9d0e1f2', grau: 'Licenciatura', curso: 'Educação Física', respProf: 'Dra. Costa', cadeiras: [], instituicao: 'ESTT', anoLetivo: '2020/2021'},
    { id: 'g3h4i5j6', grau: 'Mestrado', curso: 'História', respProf: 'Dr. Gomes', cadeiras: [], instituicao: 'ESTG', anoLetivo: '2023/2024'},
    { id: 'k7l8m9n0', grau: 'Licenciatura', curso: 'Geografia', respProf: 'Dra. Ribeiro', cadeiras: [], instituicao: 'ESTG', anoLetivo: '2023/2024'},
    { id: 'o1p2q3r4', grau: 'Mestrado', curso: 'Sociologia', respProf: 'Dr. Pinto', cadeiras: [], instituicao: 'Mafra', anoLetivo: '2023/2024'},
    { id: 's5t6u7v8', grau: 'Licenciatura', curso: 'Antropologia', respProf: 'Dra. Ferreira', cadeiras: [], instituicao: 'Loures', anoLetivo: '2022/2023'},
    { id: 'w9x0y1z2', grau: 'Doutoramento', curso: 'Filosofia', respProf: 'Dr. Almeida', cadeiras: [], instituicao: 'ESTA', anoLetivo: '2022/2023'},
    { id: 'a3b4c5d6', grau: 'Licenciatura', curso: 'Arqueologia', respProf: 'Dra. Santos', cadeiras: [], instituicao: 'ESTG', anoLetivo: '2021/2022'},
    { id: 'e7f8g9h0', grau: 'Mestrado', curso: 'Literatura', respProf: 'Dr. Costa', cadeiras: [], instituicao: 'ESTT', anoLetivo: '2021/2022'},
    { id: 'm5n6o7p8', grau: 'Mestrado', curso: 'Antropologia Cultural', respProf: 'Dr. Oliveira', cadeiras: [], instituicao: 'ESTA', anoLetivo: '2020/2021'},
    { id: 'q9r0s1t2', grau: 'Licenciatura', curso: 'Ciências Políticas', respProf: 'Dra. Gomes', cadeiras: [], instituicao: 'ESTA', anoLetivo: '2020/2021'},
    { id: 'u3v4w5x6', grau: 'Doutoramento', curso: 'Direito Internacional', respProf: 'Dr. Ferreira', cadeiras: [], instituicao: 'ESTG', anoLetivo: '2022/2023'},
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