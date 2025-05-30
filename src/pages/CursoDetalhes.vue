<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import DataTableCadeiras from '@/components/cursos/cadeiras/data-table.vue';
import DataTableTurmas from '@/components/cursos/turmas/data-table.vue';
import DataTableProfessores from '@/components/cursos/professores/data-table.vue';
import { getCadeiras } from '@/components/cursos/cadeiras/columns';
import { getTurmas } from '@/components/cursos/turmas/columns';
import { getProfessores } from '@/components/cursos/professores/columns';
import { BookCopy, Presentation, University } from 'lucide-vue-next';
import type { Cadeira, Curso, Professor, Turma } from '@/components/interfaces';
import { fetchCadeirasdoCurso, fetchCursos } from '@/api/cursos';
import { fetchTurmas } from '@/api/turmas';
import { fetchProfessoresDoCurso } from '@/api/professores';
import { useToast } from '@/components/ui/toast/use-toast'
import { Toaster } from '@/components/ui/toast'

const { toast } = useToast();

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
  turmasCurso.value = todasTurmas.filter((turma: Turma) => turma.cursoFK === cursoId.value);
};

const carregarProfessores = async () => {
  if (!cursoId.value) return;
  try {
    const professores = await fetchProfessoresDoCurso(cursoId.value);
    professoresCurso.value = professores;
  } catch (error) {
    toast({
      title: 'Erro ao carregar os professores. Por favor, tente novamente mais tarde.',
      variant: 'destructive'
    });
  }
};

const carregarCadeiras = async () => {
  const todasCadeiras = await fetchCadeirasdoCurso(cursoId.value);
  cadeirasCurso.value = todasCadeiras;
};

onMounted(async () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });

  try {
    const cursos = await fetchCursos();
    data.value = cursos;
    cursoSelecionado.value = cursos.find((curso: Curso) => curso.id === cursoId.value) || null;

    if (cursoSelecionado.value) {
      await carregarTurmas();
      await carregarProfessores();
      await carregarCadeiras();
    }
  } catch (error) {
    toast({
      title: 'Erro ao carregar os dados do curso. Por favor, tente novamente mais tarde.',
      variant: 'destructive'
    });
  }
});
</script>

<template>
  <Toaster />

  <div class="w-full mx-auto space-y-8">
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

    <div class="flex gap-10 justify-center">
      <button @click="abaAtiva = 'turmas'" :class="[
        'ml-20 px-6 py-2 rounded-2xl font-semibold transition duration-200 inline-flex items-center border-2',
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
        'mr-20 px-6 py-2 rounded-2xl font-semibold transition duration-200 inline-flex items-center border-2',
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
      <DataTableCadeiras v-if="abaAtiva === 'cadeiras'" :columns="getCadeiras(carregarCadeiras, cursoId)" :data="cadeirasCurso" @refresh="carregarCadeiras"  :curso-selecionado="cursoSelecionado" />
      <DataTableProfessores v-if="abaAtiva === 'professores'" :columns="getProfessores(carregarProfessores, cursoId)" :data="professoresCurso" @refresh="carregarProfessores"  :curso-id="cursoId" :professores-no-curso="professoresCurso.map(p => ({ ...p, id: String(p.id) }))" />
    </div>
  </div>
</template>