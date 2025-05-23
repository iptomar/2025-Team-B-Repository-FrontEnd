<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import DataTableCadeiras from '@/components/cursos/cadeiras/data-table.vue';
import DataTableTurmas from '@/components/cursos/turmas/data-table.vue';
import DataTableProfessores from '@/components/cursos/professores/data-table.vue';
import { getData } from '@/api/api';
import { columns as columnsCadeiras } from '@/components/cursos/cadeiras/columns';
import { getTurmas } from '@/components/cursos/turmas/columns';
import { columns as columnsProfessores } from '@/components/cursos/professores/columns';
import { BookCopy, Presentation, University } from 'lucide-vue-next';
import type { Cadeira, Curso, Professor, Turma } from '@/components/interfaces';
import { fetchCursos } from '@/api/cursos';
import { fetchTurmas } from '@/api/turmas';

const data = ref<Curso[]>([]);
const cursoSelecionado = ref<Curso | null>(null);
const cadeirasCurso = ref<Cadeira[]>([]);
const turmasCurso = ref<Turma[]>([]);
const professoresCurso = ref<Professor[]>([]);

const route = useRoute();
const cursoId = ref(Number(route.params.id));

const abaAtiva = ref<'turmas' | 'cadeiras' | 'professores'>('turmas');

const carregarTurmas = async () => {
  const todasTurmas = await fetchTurmas();
  turmasCurso.value = todasTurmas.filter(turma => turma.cursoFK === cursoId.value);
};

onMounted(async () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });

  try {
    const cursos = await fetchCursos();
    data.value = cursos;
    cursoSelecionado.value = cursos.find(curso => curso.id === cursoId.value) || null;

    if (cursoSelecionado.value) {
      await carregarTurmas();

      cadeirasCurso.value = cursoSelecionado.value.cadeiras || [];
      professoresCurso.value = cursoSelecionado.value.professores || [];
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
        <p><span class="font-medium text-gray-700">Grau:</span> {{ cursoSelecionado?.grau.grau }}</p>
        <p><span class="font-medium text-gray-700">Coordenador(a) de Curso:</span> {{
          cursoSelecionado?.professor.userName }}</p>
        <p><span class="font-medium text-gray-700">Instituição:</span> {{ cursoSelecionado?.instituicao.instituicao }}
        </p>
      </div>
    </div>

    <div class="flex gap-4 justify-center">
      <button @click="abaAtiva = 'turmas'" :class="[
        'px-6 py-2 rounded-2xl font-semibold transition duration-200 inline-flex items-center border-2',
        abaAtiva === 'turmas'
          ? 'bg-iptGreen text-white border-iptGreen shadow-md hover:border-black'
          : 'bg-gray-100 text-black border-gray-300 hover:border-iptGreen'
      ]">
        <Presentation class="w-5 h-5 mr-2 stroke-[2.5]" />
        Turmas
      </button>
      <button @click="abaAtiva = 'cadeiras'" :class="[
        'px-6 py-2 rounded-2xl font-semibold transition duration-200 inline-flex items-center border-2',
        abaAtiva === 'cadeiras'
          ? 'bg-iptGreen text-white border-iptGreen shadow-md hover:border-black'
          : 'bg-gray-100 text-black border-gray-300 hover:border-iptGreen'
      ]">
        <BookCopy class="w-5 h-5 mr-2 stroke-[2.5]" />
        Cadeiras
      </button>
      <button @click="abaAtiva = 'professores'" :class="[
        'px-6 py-2 rounded-2xl font-semibold transition duration-200 inline-flex items-center border-2',
        abaAtiva === 'professores'
          ? 'bg-iptGreen text-white border-iptGreen shadow-md hover:border-black'
          : 'bg-gray-100 text-black border-gray-300 hover:border-iptGreen'
      ]">
        <University class="w-5 h-5 mr-2 stroke-[2.5]" />
        Professores
      </button>
    </div>

    <div class="mt-6">
      <DataTableTurmas v-if="abaAtiva === 'turmas'" :columns="getTurmas(carregarTurmas)" :data="turmasCurso"
        @refresh="carregarTurmas" :curso-selecionado="cursoSelecionado" />
      <DataTableCadeiras v-if="abaAtiva === 'cadeiras'" :columns="columnsCadeiras" :data="cadeirasCurso" />
      <DataTableProfessores v-if="abaAtiva === 'professores'" :columns="columnsProfessores" :data="professoresCurso" />
    </div>
  </div>
</template>