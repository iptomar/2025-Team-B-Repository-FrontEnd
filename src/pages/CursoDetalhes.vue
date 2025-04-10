<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import DataTableCadeiras from '@/components/cadeiras/data-table.vue';
import DataTableTurmas from '@/components/turmas/data-table.vue';
import { getData } from '@/api/api';
import type { Curso, Cadeira, Turma } from '@/components/cursos/columns';
import { columns as columnsCadeiras } from '@/components/cadeiras/columns';
import { columns as columnsTurmas } from '@/components/turmas/columns';

const data = ref<Curso[]>([]);
const cursoSelecionado = ref<Curso | null>(null);
const cadeirasCurso = ref<Cadeira[]>([]);
const turmasCurso = ref<Turma[]>([]);

const route = useRoute();
const cursoId = ref(Number(route.params.id));

const abaAtiva = ref<'turmas' | 'cadeiras'>('turmas');

onMounted(async () => {
  try {
    const cursos = await getData();
    data.value = cursos;

    cursoSelecionado.value = cursos.find(curso => curso.id === cursoId.value) || null;

    if (cursoSelecionado.value) {
      cadeirasCurso.value = cursoSelecionado.value.cadeiras || [];
      turmasCurso.value = cursoSelecionado.value.turmas || [];
    }
  } catch (error) {
    console.error('Erro ao buscar os dados:', error);
  }
});
</script>

<template>
  <div class="mx-auto space-y-8">
    <div class="border-b pb-6">
      <h1 class="text-3xl font-bold text-black">{{ cursoSelecionado?.curso }}</h1>
      <div class="mt-2 text-gray-600 space-y-1">
        <p><span class="font-medium text-gray-700">Grau:</span> {{ cursoSelecionado?.grau }}</p>
        <p><span class="font-medium text-gray-700">Coordenador(a) de Curso:</span> {{ cursoSelecionado?.respProf }}</p>
        <p><span class="font-medium text-gray-700">Instituição:</span> {{ cursoSelecionado?.instituicao }}</p>
      </div>
    </div>

    <div class="flex gap-4 justify-center">
      <button @click="abaAtiva = 'turmas'" :class="[
        'px-6 py-2 rounded-2xl font-semibold transition duration-200',
        abaAtiva === 'turmas'
          ? 'bg-iptGreen text-white shadow-md'
          : 'bg-gray-100 text-black hover:bg-gray-200 hover:border-iptGreen'
      ]">
        👨‍🏫 Turmas
      </button>
      <button @click="abaAtiva = 'cadeiras'" :class="[
        'px-6 py-2 rounded-2xl font-semibold transition duration-200',
        abaAtiva === 'cadeiras'
          ? 'bg-iptGreen text-white shadow-md'
          : 'bg-gray-100 text-black hover:bg-gray-200 hover:border-iptGreen'
      ]">
        📚 Cadeiras
      </button>
    </div>

    <div class="mt-6">
      <DataTableTurmas v-if="abaAtiva === 'turmas'" :columns="columnsTurmas" :data="turmasCurso" />
      <DataTableCadeiras v-else :columns="columnsCadeiras" :data="cadeirasCurso" />
    </div>
  </div>
</template>