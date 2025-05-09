<script setup lang="ts">
import { University, MapPin, Award, ClipboardType } from 'lucide-vue-next';
import { onMounted, ref } from 'vue';
import { columns as columnsGraus } from '@/components/espaco_admin/graus/columns.ts';
import DataTableGraus from '@/components/espaco_admin/graus/data-table.vue';
import { columns as columnsLocalidade } from '@/components/espaco_admin/localidades/columns.ts';
import DataTableLocalidade from '@/components/espaco_admin/localidades/data-table.vue';
import { columns as columnsInstituicao } from '@/components/espaco_admin/instituicao/columns.ts';
import DataTableInstituicao from '@/components/espaco_admin/instituicao/data-table.vue';
import DataTableTipologia from '@/components/espaco_admin/tipologia/data-table.vue';
import { columns as columnsTipologia } from '@/components/espaco_admin/tipologia/columns.ts'
import { getLocalidades, getInstituicoes, getGrau, getTipologia } from '@/api/api';
import type { Cadeira, Curso, Instituicao, Localidade, Grau, Tipologia } from '@/components/interfaces';

const abaAtiva = ref<'Localidades' | 'Instituicao' | 'Grau' | 'Tipologia'>('Localidades');

const cursoSelecionado = ref<Curso | null>(null);
const cadeirasCurso = ref<Cadeira[]>([]);
const instituicoesData = ref<Instituicao[]>([]);
const localidadesData = ref<Localidade[]>([]);
const grausData = ref<Grau[]>([]);
const tipologiasData = ref<Tipologia[]>([]);

onMounted(async () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });

  try {
    localidadesData.value = await getLocalidades();
    instituicoesData.value = await getInstituicoes();
    grausData.value = await getGrau();
    tipologiasData.value = await getTipologia();

    if (cursoSelecionado.value) {
      cadeirasCurso.value = cursoSelecionado.value.cadeiras || [];
    }
  } catch (error) {
    console.error('Erro ao buscar os dados:', error);
  }
});
</script>

<template>
  <!-- Secção do titulo   -->
  <div class="mx-auto space-y-8">
    <div class="border-b pb-6">
      <h1 class="text-3xl font-bold text-black">Espaço Administrador</h1>
    </div>

    <!-- Secção dos botões de navegação   -->
    <div class="flex gap-4 justify-center">
      <button @click="abaAtiva = 'Localidades'" :class="[
        'px-6 py-2 rounded-2xl font-semibold transition duration-200 inline-flex items-center border-2',
        abaAtiva === 'Localidades'
          ? 'bg-iptGreen text-white border-iptGreen shadow-md hover:border-black'
          : 'bg-gray-100 text-black border-gray-300 hover:border-iptGreen'
      ]">
        <MapPin class="w-5 h-5 mr-2 stroke-[2.5]" />
        Localidades
      </button>
      <button @click="abaAtiva = 'Instituicao'" :class="[
        'px-6 py-2 rounded-2xl font-semibold transition duration-200 inline-flex items-center border-2',
        abaAtiva === 'Instituicao'
          ? 'bg-iptGreen text-white border-iptGreen shadow-md hover:border-black'
          : 'bg-gray-100 text-black border-gray-300 hover:border-iptGreen'
      ]">
        <University class="w-5 h-5 mr-2 stroke-[2.5]" />
        Instituição
      </button>
      <button @click="abaAtiva = 'Grau'" :class="[
        'px-6 py-2 rounded-2xl font-semibold transition duration-200 inline-flex items-center border-2',
        abaAtiva === 'Grau'
          ? 'bg-iptGreen text-white border-iptGreen shadow-md hover:border-black'
          : 'bg-gray-100 text-black border-gray-300 hover:border-iptGreen'
      ]">
        <Award class="w-5 h-5 mr-2 stroke-[2.5]" />
        Grau
      </button>
      <button @click="abaAtiva = 'Tipologia'" :class="[
        'px-6 py-2 rounded-2xl font-semibold transition duration-200 inline-flex items-center border-2',
        abaAtiva === 'Tipologia'
          ? 'bg-iptGreen text-white border-iptGreen shadow-md hover:border-black'
          : 'bg-gray-100 text-black border-gray-300 hover:border-iptGreen'
      ]">
        <ClipboardType class="w-5 h-5 mr-2 stroke-[2.5]" />
        Tipologia
      </button>
    </div>

    <!-- Secção das tabelas-->
    <div class="mt-6">
      <DataTableGraus v-if="abaAtiva === 'Grau'" :columns="columnsGraus" :data="grausData" />
      <DataTableLocalidade v-if="abaAtiva === 'Localidades'" :columns="columnsLocalidade" :data="localidadesData" />
      <DataTableInstituicao v-if="abaAtiva === 'Instituicao'" :columns="columnsInstituicao" :data="instituicoesData" />
      <DataTableTipologia v-if="abaAtiva === 'Tipologia'" :columns="columnsTipologia" :data="tipologiasData" />
    </div>
  </div>
</template>