<script setup lang="ts">
import { Check, ChevronsUpDown } from 'lucide-vue-next'
import {ref, onMounted, provide, inject} from 'vue';
import { useRoute } from 'vue-router';
import Calendar from "@/components/ui/calendar/Calendar.vue";
import CalendarProvider from "@/components/ui/calendar/CalendarProvider.vue";
import type { Turma } from '@/components/interfaces';
import { fetchTurmaById } from '@/api/turmas';
import { useToast } from '@/components/ui/toast/use-toast'
import { Toaster } from '@/components/ui/toast'

const { toast } = useToast();

import { cn } from '@/lib/utils'

/**
 * SignalR-Related-Data
 */
const route = useRoute();
const turmaId = ref(Number(route.params.id));
const events = ref([])
const showClassModal = ref(false)
const ON_CONNECTION_START = "Send"
const CONNECTION_HUB = "/hubdobloco"
const API_BASE_URL = "https://localhost:7223"

provide("events", events)

let connectionState = ref("LOADING");
let horarioId = 0
import {HubConnectionBuilder} from "@microsoft/signalr"
import CalendarHolder from "@/components/ui/calendar/CalendarHolder.vue";
import {Button} from "@/components/ui/button";
import {Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList} from "@/components/ui/command";
import {Popover, PopoverTrigger, PopoverContent} from "@/components/ui/popover";
const salas = ref([])

fetchSalas().then((val) =>{
  salas.value = val
})

function handleSubmit(){
  showClassModal.value = false;
  
}

const open = ref(false)
const value = ref('')
async function fetchHorarioId() {
  const response = await fetch(`${API_BASE_URL}/api/signalR/bloco` , {headers: {'content-type': 'application/json'}, method: 'POST', body: '3'});
  if (!response.ok) throw new Error(response);
  return await response.json();
}

async function fetchAulas() {
  const response = await fetch(`${API_BASE_URL}/api/aulas/turma/${turmaId.value}` );
  if (!response.ok) throw new Error(response);
  return await response.json();
}

async function fetchSalas() {
  const response = await fetch(`${API_BASE_URL}/api/salas/` );
  if (!response.ok) throw new Error(response);
  return await response.json();
}

async function fetchBlocos(){
  const response = await fetch(`${API_BASE_URL}/api/blocos/turma/${turmaId.value}` );
  if (!response.ok) throw new Error(response);
  return await response.json();
}

var aulas = []
fetchAulas().then((value) => {
  aulas = value
  fetchBlocos().then((value) => {
    convertToEvents(aulas)
    console.log(value)
    value.forEach((bloco) => {
      events.value.push(convertToEvent(bloco))
      console.log(events.value)
    })
  })
});

function onDragEnd(e){
  showClassModal.value = true;
}
provide('calendar_on_drag_end_event', onDragEnd);

function convertToEvent(val){
  var aula = null;
  aulas.forEach((a) =>{
    if(val.aulaFK == a.id){
      aula = a;
    }
  })
  var time = timeToY(val.hora_Inicio)
  var duracao = 4
  return generateEvent(val.id.toString(), 0, 0, time, duracao, aula.cadeira.cadeira, aula.tipologia.tipologia, null, aula.professor.userName )
}

function timeToY(time : string){
  var t = time.split(':')
  var h = (parseInt(t[0])-9)*2
  var m = Math.trunc(parseInt(t[1])/30)
  return h+m
}

function convertToEvents(val){
  events.value.length = 0;
  var duracao = 4;
  var count = 0;
  val.forEach((e) => {
    events.value.push(generateEvent(e.id.toString(), 1, 0, count, duracao, e.cadeira.cadeira, e.tipologia.tipologia, null, e.professor.userName ))
    count+=duracao;
  })
}

function generateEvent(id, table, weekday, timeslot, time, name, type, classroom, teacher) {
  table = parseInt(table);
  weekday = parseInt(weekday);
  time = parseInt(time);
  timeslot = parseInt(timeslot);
  let result = {
    id: events.value.length.toString(),
    aulaId: id,
    table: table,
    oldTable: table,
    x: weekday,
    y: timeslot,
    tempX: 0,
    tempY: 0,
    offsetX: 0,
    offsetY: 0,
    time: time,
    name: name,
    type: type,
    classroom: classroom,
    teacher: teacher
  };
  return result;
}

fetchHorarioId().then((val) => {
  horarioId = val;
  console.log("Sucessfully connected to schedule: " + horarioId);
}).catch((result) => {
  console.log("AIAIIA:" + result)
});

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
const turmaSelecionada = ref<Turma | null>(null)
const connected = ref(false)

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

    <CalendarProvider events="events" v-if="connected" cell_width="148" cell_height="30" style={}>
        <div class="flex">
          <Calendar table="0" />
          <CalendarHolder table="1" slotsW="1" slotsH="50"/>
        </div>
    </CalendarProvider>
    <div v-else>
      {{connectionState}}
    </div>
  <div v-if="showClassModal" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
    <div class="bg-white rounded-lg p-6 w-96">
      <h2 class="text-xl mb-4">Escolher Sala</h2>
      <form @submit.prevent="handleSubmit">
        <div class="mb-4">
          <Popover v-model:open="open">
            <PopoverTrigger as-child>
              <Button
                  variant="outline"
                  role="combobox"
                  :aria-expanded="open"
                  class="w-[200px] justify-between"
              >
                {{ value ? salas.find((sala) => sala.id === value)?.sala : 'Escolha a sala...' }}

                <ChevronsUpDown class="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent class="w-[200px] p-0">
              <Command v-model="value">
                <CommandInput placeholder="Escolha a sala..." />
                <CommandEmpty>Não existem salas com esse nome.</CommandEmpty>
                <CommandList>
                  <CommandGroup>
                    <CommandItem
                        v-for="sala in salas"
                        :key="sala.id"
                        :value="sala.id"
                        @select="open = false"
                    >
                      <Check
                          :class="cn(
                  'mr-2 h-4 w-4',
                  value === sala.id ? 'opacity-100' : 'opacity-0',
                )"
                      />
                      {{ sala.sala }}
                    </CommandItem>
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>

        <div class="flex justify-center space-x-2">
          <button
              type="submit"
              class="px-4 py-2 text-white bg-iptGreen hover:bg-green-100 hover:border-iptGreen hover:text-iptGreen rounded"
          >
            Guardar
          </button>
        </div>
      </form>
    </div>
  </div>
</template>