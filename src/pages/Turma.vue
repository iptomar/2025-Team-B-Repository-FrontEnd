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
import {Button} from "@/components/ui/button";
import {Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList} from "@/components/ui/command";
import {Popover, PopoverTrigger, PopoverContent} from "@/components/ui/popover";
import {HubConnectionBuilder} from "@microsoft/signalr"
import CalendarHolder from "@/components/ui/calendar/CalendarHolder.vue";

/**
 * SignalR-Related-Data
 */
const route = useRoute();
const turmaId = ref(Number(route.params.id));
const events = ref([])
const showClassModal = ref(false)
const ON_CONNECTION_START = "JoinHorarioGroup"
const CONNECTION_HUB = "/hubdobloco"
const API_BASE_URL = "https://localhost:7223"

const open = ref(false)
const value = ref('')
var modifiedBlock : number = null;
var aulas = []

let connectionState = ref("LOADING");
let connection = new HubConnectionBuilder().withUrl(API_BASE_URL + CONNECTION_HUB).build();
let horarioId = 0
const salas = ref([])

connection.start().then(() => {
  connected.value = true;
}).catch((err) => {
  connectionState.value = err.message;
});

connection.on("NovoBlocoCriado", (bloco) => {
  var aula = aulas.filter((aula) => aula.id == bloco.aulaFK)[0]
  var time = timeToY(bloco.horaInicio)
  var duracao = 4
  var event = generateEvent(bloco.id, 0, bloco.diaDaSemana, time, duracao, aula.cadeira.cadeira, aula.tipologia.tipologia, null, aula.professor.userName, bloco.aulaFK)
  events.value.push(event)
})
connection.onclose((err) => {
  connected.value = false;
  connectionState.value = err.message;
})

/**
 * POST CALLS
*/
async function fetchHorarios() {
  const response = await fetch(`${API_BASE_URL}/api/Horarios/horarios-turma` , {headers: {'content-type': 'application/json'}, method: 'POST', body: turmaId.value.toString()});
  if (!response.ok) throw new Error(response);
  return await response.json();
}

async function fetchHorarioId() {
  const response = await fetch(`${API_BASE_URL}/api/signalR/bloco` , {headers: {'content-type': 'application/json'}, method: 'POST', body: turmaId.value.toString()});
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

provide("events", events)


fetchSalas().then((val) =>{
  salas.value = val
})

fetchHorarios().then((val) => {
  console.log("TEST: " , val)
})

/**
 * Time conversions
 */

function YToTime(value : number){
  const min = value % 2 == 0 ? '00' : '30';
  let hour = 9;
  hour += Math.floor(value/2);
  hour = hour.toString().padStart(2, '0')
  return hour + ':' + min + ":" + '00';
}
function timeToY(time : string){
  let t = time.split(':')
  let h = (parseInt(t[0])-9)*2
  let m = Math.trunc(parseInt(t[1])/30)
  console.log(time, h, m, h+m)
  return h+m
}


async function postHorarioBlock(){
  var block = {
    HorarioId: horarioId,
    HoraInicio: YToTime(events.value[modifiedBlock].y),
    DiaDaSemana: events.value[modifiedBlock].x,
    SalaFK: events.value[modifiedBlock].classroom_id,
    AulaFK: events.value[modifiedBlock].class_id
  }
  console.log(block)
  const response = await fetch(`${API_BASE_URL}/api/signalR` + "/Horariobloco", {headers: {'content-type': 'application/json'}, method: 'POST', body: JSON.stringify(block)} );
  if (!response.ok) throw new Error(response);
  return await response.json();
}

function onClassPicked(){
  postHorarioBlock().then((val) => {
    console.log(val);
  }).catch((err) => {
    console.log(err);
  })
}

function handleSubmit(){
  showClassModal.value = false;
  events.value[modifiedBlock].classroom_id = value;
  events.value[modifiedBlock].classroom = value ;
  onClassPicked();
}


fetchAulas().then((value) => {
  aulas = value
  fetchBlocos().then((value) => {
    convertToEvents(aulas)
    value.forEach((bloco) => {
      events.value.push(convertToEvent(bloco))
    })
  })
});
function onDragEnd(i){
  if(events.value[i].table == 0 && events.value[i].classroom_id == null ){
    modifiedBlock = i;
    showClassModal.value = true;
  }

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
  console.log(val)
  return generateEvent(val.id.toString(), 0, val.diaDaSemana, time, duracao, aula.cadeira.cadeira, aula.tipologia.tipologia, val.sala.sala, aula.professor.userName, val.aulaFK, val.sala.id)
}

function convertToEvents(val){
  var id = 99999
  events.value.forEach(event => {
    if(id.toString() == event.id){
      id -= 1;
    }
  })
  events.value.length = 0;
  var duracao = 4;
  var count = 0;
  val.forEach((e) => {
    events.value.push(generateEvent(id.toString(), 1, 0, count, duracao, e.cadeira.cadeira, e.tipologia.tipologia, null, e.professor.userName, e.id, null ))
    count+=duracao;
  })
}

function generateEvent(id, table, weekday, timeslot, time, name, type, classroom, teacher, class_id, classroom_id) {
  table = parseInt(table);
  weekday = parseInt(weekday);
  time = parseInt(time);
  timeslot = parseInt(timeslot);
  return {
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
    teacher: teacher,
    class_id: class_id,
    classroom_id: classroom_id
  };
}

fetchHorarioId().then((val) => {
  horarioId = val;
  connection.invoke(ON_CONNECTION_START, horarioId)
      .then(()=>{
        console.log("CONNECTED TO SCHEDULE " + horarioId);
      })
      .catch((err) =>{
    console.log(err.toString())
  })
  console.log("Sucessfully connected to schedule: " + horarioId);
}).catch((result) => {
  console.log("AIAIIA:" + result)
});

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