<script setup lang="ts">
import { University, MapPin, Award, ClipboardType, Users } from 'lucide-vue-next';
import { onMounted, ref } from 'vue';
import { createColumns as columnsGraus } from '@/components/espaco_admin/graus/columns.ts';
import DataTableGraus from '@/components/espaco_admin/graus/data-table.vue';
import { getColumns as columnsLocalidade } from '@/components/espaco_admin/localidades/columns.ts';
import DataTableLocalidade from '@/components/espaco_admin/localidades/data-table.vue';
import { getColumns as columnsInstituicao } from '@/components/espaco_admin/instituicao/columns.ts';
import DataTableInstituicao from '@/components/espaco_admin/instituicao/data-table.vue';
import DataTableTipologia from '@/components/espaco_admin/tipologia/data-table.vue';
import { createColumns as columnsTipologia } from '@/components/espaco_admin/tipologia/columns.ts'
import type { Instituicao, Localidade, Grau, Tipologia } from '@/components/interfaces';
import csv_picker from '@/components/espaco_admin/csv_picker/csv_picker.vue';
import { getLocalidades } from '@/api/localidades';
import { getInstituicoes } from '@/api/instituicoes';
import { getGrau } from '@/api/graus';
import { getTipologia } from '@/api/tipologias';
import { useToast } from '@/components/ui/toast/use-toast'
import { Toaster } from '@/components/ui/toast'

const { toast } = useToast()

const abaAtiva = ref<'Utilizadores' | 'Localidades' | 'Instituicao' | 'Grau' | 'Tipologia' | 'ImportacaoDeDados'>('Utilizadores');

const instituicoesData = ref<Instituicao[]>([]);
const localidadesData = ref<Localidade[]>([]);
const grausData = ref<Grau[]>([]);
const tipologiasData = ref<Tipologia[]>([]);

const fetchGraus = async () => {
  try {
    grausData.value = await getGrau();
  } catch (error) {
    toast({
      title: 'Erro ao buscar graus. Por favor, tente novamente.',
      variant: 'destructive',
    });
  }
};

const fetchAllData = async () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });

  try {
    [localidadesData.value, instituicoesData.value, tipologiasData.value] = await Promise.all([
      getLocalidades(),
      getInstituicoes(),
      getTipologia()
    ]);

    await fetchGraus();

  } catch (error) {
    toast({
      title: 'Erro ao buscar os dados. Por favor, tente novamente.',
      variant: 'destructive',
    });
  }
};

onMounted(() => {
  fetchAllData();
});
</script>
<template>
  <Toaster />

  <div class="mx-auto space-y-8">
    <div class="border-b pb-6">
      <h1 class="text-3xl font-bold text-black">Espaço Administrador</h1>
    </div>

    <div class="flex gap-4 justify-center">
      <button @click="abaAtiva = 'Utilizadores'" :class="[
        'px-6 py-2 rounded-2xl font-semibold transition duration-200 inline-flex items-center border-2',
        abaAtiva === 'Utilizadores'
          ? 'bg-iptGreen text-white border-iptGreen shadow-md hover:border-black'
          : 'bg-gray-100 text-black border-gray-300 hover:border-iptGreen'
      ]">
        <Users class="w-5 h-5 mr-2 stroke-[2.5]" />
        Utilizadores
      </button>
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

      <button @click="abaAtiva = 'ImportacaoDeDados'" :class="[
        'px-6 py-2 rounded-2xl font-semibold transition duration-200 inline-flex items-center border-2',
        abaAtiva === 'ImportacaoDeDados'
          ? 'bg-iptGreen text-white border-iptGreen shadow-md hover:border-black'
          : 'bg-gray-100 text-black border-gray-300 hover:border-iptGreen'
      ]">
        <ClipboardType class="w-5 h-5 mr-2 stroke-[2.5]" />
        Importação de dados
      </button>
    </div>

    <div class="mt-6">
      <DataTableGraus v-if="abaAtiva === 'Grau'" :columns="columnsGraus" :data="grausData" />

      <DataTableLocalidade v-if="abaAtiva === 'Localidades'" :columns="columnsLocalidade" :data="localidadesData" />

      <DataTableInstituicao v-if="abaAtiva === 'Instituicao'" :columns="columnsInstituicao" :data="instituicoesData" />

      <DataTableTipologia v-if="abaAtiva === 'Tipologia'" :columns="columnsTipologia" :data="tipologiasData" />

      <div v-if="abaAtiva === 'ImportacaoDeDados'">
        <csv_picker />
      </div>
    </div>
  </div>
</template>