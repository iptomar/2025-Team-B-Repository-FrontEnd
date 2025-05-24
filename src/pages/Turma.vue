<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { getData } from '@/api/api';
import Calendar from "@/components/ui/calendar/Calendar.vue";
import CalendarProvider from "@/components/ui/calendar/CalendarProvider.vue";
import type { Curso, Turma } from '@/components/interfaces';

/**
 * SignalR-Related-Data
 */
const ON_CONNECTION_START = "Send"
const CONNECTION_HUB = "/hubdobloco"
const API_BASE_URL = "https://localhost:7223"

let connectionState = ref("LOADING");

import {HubConnectionBuilder} from "@microsoft/signalr"

let connection = new HubConnectionBuilder()
    .withUrl(API_BASE_URL + CONNECTION_HUB)
    .build();

connection.start()
    .then(
        () => {
          connected.value = true;
          connection.invoke(ON_CONNECTION_START, turmaId)
        }
    ).catch(
    (err) =>
    {
      connectionState.value = err.message;
    }
);

connection.onclose((err) => {
  connected.value = false;
  connectionState.value = err.message;
})

const data = ref<Curso[]>([]);
const turmaSelecionada = ref<Turma | null>(null);
const route = useRoute();
const turmaId = ref(Number(route.params.id));
const connected = ref(false)

onMounted(async () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });

    try {
        const cursos = await getData();
        data.value = cursos;
        console.log(turmaId.value)
        turmaSelecionada.value = cursos.flatMap(curso => curso.turmas).find(turma => turma.id === turmaId.value) || null;
    } catch (error) {
        console.error('Erro ao buscar os dados:', error);
    }
});

</script>

<template>
    <div class="mx-auto space-y-8 mb-10">
        <div class="border-b pb-6">
            <h1 class="text-3xl font-bold text-black">{{ turmaSelecionada?.ano }}º{{ turmaSelecionada?.turma }}</h1>
            <div class="mt-2 text-gray-600 space-y-1">
                <p class="font-medium text-gray-700">{{ turmaSelecionada?.semestre }}ºSemestre</p>
            </div>
        </div>
    </div>

    <CalendarProvider v-if="connected" cell_width="148" cell_height="30" style={}>
        <div class="flex">
            <Calendar table="0" />
        </div>
    </CalendarProvider>
    <div v-else>
      {{connectionState}}
    </div>
</template>