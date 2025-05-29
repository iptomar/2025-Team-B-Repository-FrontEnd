<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import type { Cadeira } from '@/components/interfaces';
import { getAulas } from '@/components/cursos/aula/columns'
import DataTable from '@/components/cursos/aula/data-table.vue'
import { fetchCadeira } from '@/api/cadeiras';
import { fetchAulas } from '@/api/aulas';
import { fetchProfessoresDoCurso } from '@/api/professores';

const cadeiraSelecionada = ref<Cadeira | null>(null);
const route = useRoute();
const cadeiraId = ref(Number(route.params.id));
const aulasDaCadeira = ref([]);
const professoresNoCurso = ref([]);
const cursoId = window.history.state.cursoId;

const carregarAulas = async () => {
    const todasAulas = await fetchAulas();
    aulasDaCadeira.value = todasAulas.filter((aula: { cadeiraFK: number; }) => aula.cadeiraFK === cadeiraId.value);
}

onMounted(async () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });

    try {
        cadeiraSelecionada.value = await fetchCadeira(cadeiraId.value);
        professoresNoCurso.value = await fetchProfessoresDoCurso(cursoId);

        carregarAulas();
    } catch (error) {
        console.error('Erro ao buscar os dados:', error);
    }
});

</script>

<template>
    <div class="mx-auto space-y-8 mb-10">
        <div class="border-b pb-6">
            <h1 class="text-3xl font-bold text-black"> {{ cadeiraSelecionada?.cadeira }} </h1>
            <div class="mt-2 text-gray-600 space-y-1">
                <p class="font-medium text-gray-700"> {{ cadeiraSelecionada?.ano }}ºAno</p>
                <p class="font-medium text-gray-700">
                    {{ cadeiraSelecionada?.semestre === 3 ? 'Anual' : `${cadeiraSelecionada?.semestre}º Semestre` }}
                </p>
                <p><span class="font-medium text-gray-700">ECTS:</span> {{ cadeiraSelecionada?.ects }}</p>
            </div>
        </div>
        <div class="mt-6">
            <DataTable :columns="getAulas(carregarAulas, cursoId, professoresNoCurso, cadeiraSelecionada?.semestre ?? 0, cadeiraSelecionada?.ano ?? 0)" :data="aulasDaCadeira"
                @refresh="carregarAulas" :cadeiraId="cadeiraId" :cursoId="cursoId"
                :professoresNoCurso="professoresNoCurso" :semestreCadeira="cadeiraSelecionada?.semestre ?? 0"
                :anoCadeira="cadeiraSelecionada?.ano ?? 0" />
        </div>
    </div>
</template>