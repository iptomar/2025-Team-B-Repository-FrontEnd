<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import Calendar from "@/components/ui/calendar/Calendar.vue";
import CalendarProvider from "@/components/ui/calendar/CalendarProvider.vue";
import type { Turma } from '@/components/interfaces';
import { fetchTurmaById } from '@/api/turmas';
import { useToast } from '@/components/ui/toast/use-toast'
import { Toaster } from '@/components/ui/toast'

const { toast } = useToast();

const turmaSelecionada = ref<Turma | null>(null);
const route = useRoute();
const turmaId = ref(Number(route.params.id));

onMounted(async () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });

    try {
        turmaSelecionada.value = await fetchTurmaById(turmaId.value);
    } catch (error) {
        toast({
            title: 'Erro ao buscar a turma. Por favor, tente novamente mais tarde.',
            variant: 'destructive'
        });
    }
});

let events = [];
events.push(
    {
        id: events.length.toString(),
        table: 1,
        x: 0,
        y: 0,
        tempX: 0,
        tempY: 0,
        offsetX: 0,
        offsetY: 0,
        time: 2,
        name: "LOL",
        type: "PL",
        classroom: "B122",
        teacher: "Ramos"
    });
events.push(
    {
        id: events.length.toString(),
        table: 1,
        x: 0,
        y: 4,
        tempX: 0,
        tempY: 0,
        offsetX: 0,
        offsetY: 0,
        time: 1,
        name: "LOL",
        type: "PL",
        classroom: "B123",
        teacher: "Ramos"
    });

let EVENTS = ref(events);
</script>

<template>
    <Toaster />

    <div class="mx-auto space-y-8 mb-10">
        <div class="border-b pb-6">
            <h1 class="text-3xl font-bold text-black">{{ turmaSelecionada?.ano }}º{{ turmaSelecionada?.letra }}</h1>
            <div class="mt-2 text-gray-600 space-y-1">
                <p class="font-medium text-gray-700">
                    {{ turmaSelecionada?.semestre === 3 ? 'Anual' : `${turmaSelecionada?.semestre}º Semestre` }}
                </p>
                <p> {{ turmaSelecionada?.curso.curso }}</p>
            </div>
        </div>
    </div>

    <CalendarProvider :events="EVENTS" cell_width="148" cell_height="30" style={}>
        <div class="flex">
            <Calendar table="0" />
        </div>
    </CalendarProvider>
</template>