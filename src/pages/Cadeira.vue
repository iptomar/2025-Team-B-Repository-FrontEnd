<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { getData } from '@/api/api';
import type { Cadeira, Curso } from '@/components/interfaces';
import { columns } from '@/components/cursos/aula/columns'
import DataTable from '@/components/cursos/aula/data-table.vue'

const data = ref<Curso[]>([]);
const cadeiraSelecionada = ref<Cadeira | null>(null);
const route = useRoute();
const cadeiraId = ref(Number(route.params.id));

onMounted(async () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });

    try {
        const cursos = await getData();
        data.value = cursos;

        cadeiraSelecionada.value = cursos.flatMap(curso => curso.cadeiras).find(cadeira => cadeira.id === cadeiraId.value) || null;
    } catch (error) {
        console.error('Erro ao buscar os dados:', error);
    }
});
</script>

<template>
    <div class="mx-auto space-y-8 mb-10">
        <div class="border-b pb-6">
            <h1 class="text-3xl font-bold text-black"> {{ cadeiraSelecionada?.nome }} </h1>
            <div class="mt-2 text-gray-600 space-y-1">
                <p class="font-medium text-gray-700"> {{ cadeiraSelecionada?.ano }}ºAno</p>
                <p class="font-medium text-gray-700">
                    {{ cadeiraSelecionada?.semestre === 3 ? 'Anual' : `${cadeiraSelecionada?.semestre}º Semestre` }}
                </p>
                <p><span class="font-medium text-gray-700">ECTS:</span> {{ cadeiraSelecionada?.ects }}</p>
            </div>
        </div>
        <div class="mt-6">
            <DataTable :columns="columns" :data="cadeiraSelecionada?.aulas || []" />
        </div>
    </div>
</template>