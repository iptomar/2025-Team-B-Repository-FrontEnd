<script setup lang="ts">
import { Check, ChevronsUpDown } from 'lucide-vue-next'
import {ref, onMounted, provide, inject, useTemplateRef} from 'vue';
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
import {Input} from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";

/**
 * SignalR-Related-Data
 */
const route = useRoute();
const turmaId = ref(Number(route.params.id));
const events = ref([])
const showClassModal = ref(false)
const showScheduleModal = ref(false)
const ON_CONNECTION_START = "JoinHorarioGroup"
const CONNECTION_HUB = "/hubdobloco"
const API_BASE_URL = "https://localhost:7223"

const open = ref(false)
const value = ref('')
var modifiedBlock : number = null;
var aulas = []

let connectionState = ref("LOADING");
let connection = new HubConnectionBuilder().withUrl(API_BASE_URL + CONNECTION_HUB).build();
let horarioId = 1
let horarios = ref([{id: 1, inicio: '2025-12-14', fim: '2025-12-25'}, {id: 2, inicio: '1900-01-01', fim: '1900-01-01'}])
const salas = ref([])
const date1 = ref()
const date2 = ref()

var calendarItem = useTemplateRef('calendarItem');

connection.start().then(() => {
  connected.value = true;
}).catch((err) => {
  connectionState.value = err.message;
});

connection.on("NovoBlocoCriado", (bloco) => {
  var aula = getAula(bloco.aulaFK);
  var sala = getSala(bloco.salaFK);
  var time = timeToY(bloco.horaInicio)
  var duracao = 4

  var event = generateEvent(bloco.id, 0, bloco.diaDaSemana, time, duracao, aula.cadeira.cadeira, aula.tipologia.tipologia, sala.sala, aula.professor.userName, bloco.aulaFK, sala.id)

  for (var i = 0; i < events.value.length; i++) {
    if (events.value[i].table == 0 && events.value[i].x == event.x && events.value[i].y == event.y) {
      events.value.splice(i, 1);
      break;
    }
  }

  console.log("EVENT: ", event)
  events.value.push(event)
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
  console.log("Logged schedules: ", val)
  horarios.value = val
  horarioId = horarios.value[0].id
  if(val.length == 0)
    connectionState.value = "Não existem horários criados para esta turma.";
  //horarios = val
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
async function postHorario(){
  var block = {
    Inicio: date1.value,
    Fim: date2.value,
    TurmaFK: turmaId.value,
    Blocos: []
  }

  console.log(block)
  const response = await fetch(`${API_BASE_URL}/api/Horarios`, {headers: {'content-type': 'application/json'}, method: 'POST', body: JSON.stringify(block)} );
  if (!response.ok) throw new Error(response);
  return await response.json();
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

function handleSubmitSchedule(){
  showScheduleModal.value = false;
  postHorario().then((val) => {
    console.log(val)
  });
  /*events.value[modifiedBlock].classroom_id = value;
  events.value[modifiedBlock].classroom = value ;
  onClassPicked();*/
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
  }else if(events.value[i].table == 0){
    modifiedBlock = i;
    //removeCurrentBlock();
  }

}
provide('calendar_on_drag_end_event', onDragEnd);

function getAula(fk : string){
  var aula = null;
  aulas.forEach((a) =>{
    if(fk == a.id){
      aula = a;
    }
  })
  return aula
}

function getSala(fk : string){
  var sala = null;
  salas.value.forEach((s) => {
    if(fk == s.id){
      sala = s;
    }
  })
  return sala
}


function convertToEvent(val){
  var aula = getAula(val.aulaFK);
  var sala = getSala(val.salaFK);
  var time = timeToY(val.hora_Inicio)
  var duracao = 4
  console.log(val)
  return generateEvent(val.id.toString(), 0, val.diaDaSemana, time, duracao, aula.cadeira.cadeira, aula.tipologia.tipologia, sala.sala, aula.professor.userName, val.aulaFK, sala.id)
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


connection.onclose((err) => {
  connected.value = false;
  connectionState.value = err.message;
})

function printSchedule(){

  window.print();
}

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
          <p>
            {{ turmaSelecionada?.curso.curso }}
          </p>
        </div>
      </div>

      <div class="w-full">
        <select v-if="horarios.length > 0" v-model="horarioId" class="h-[2.6rem] border border-gray-300 rounded px-2 py-1 rounded-r-none">
          <option v-for="ano in horarios.slice().reverse()" :key="ano.id" :value="ano.id">
            {{ ano.inicio }} - {{ ano.fim }}
          </option>
        </select>
        <button v-if="horarios.length > 0" @click="removeOpen = true"
                class="h-full text-white bg-red hover:bg-green-100 hover:border-iptGreen hover:text-iptGreen px-4 py-2 rounded-l-none mr-5">
          ❌
        </button>
        <button @click="showScheduleModal = true"
                class="h-full text-white bg-iptGreen hover:bg-green-100 hover:border-iptGreen hover:text-iptGreen px-4 py-2 mr-5">
          Criar Horário
        </button>
        <button @click="printSchedule()"
                class="h-full text-white bg-iptGreen hover:bg-green-100 hover:border-iptGreen hover:text-iptGreen px-4 py-2">
          Imprimir
        </button>
      </div>
    </div>



    <CalendarProvider events="events" v-if="connected && horarios.length > 0" cell_width="148" cell_height="30" style={}>
        <div class="flex">
          <Calendar id="calendarItem" table="0" />
          <CalendarHolder table="1" slotsW="1" slotsH="50"/>
        </div>
    </CalendarProvider>
    <div v-else>
      {{connectionState}}
    </div>


  <Dialog v-model:open="showClassModal">
    <DialogContent class="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>Escolha a sala para o bloco</DialogTitle>
        <DialogDescription>
          Este bloco ainda não tem uma sala designada.<br/>
          Preencha-o com a sala desejada para esta aula.
        </DialogDescription>
      </DialogHeader>
      <form @submit.prevent="handleSubmit">
        <div class="mb-4">
          <Popover v-model:open="open">
            <PopoverTrigger as-child>
              <Button
                  variant="outline"
                  role="combobox"
                  :aria-expanded="open"
                  class="w-full justify-between"
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

        <DialogFooter class="mt-4">
          <div class="flex justify-center space-x-2">
            <Button type="submit"
                    class="bg-iptGreen text-white hover:bg-green-100 hover:text-iptGreen hover:border-iptGreen">
              Guardar
            </Button>
          </div>

        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>

  <Dialog v-model:open="showScheduleModal">
    <DialogContent class="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>Criar novo horário</DialogTitle>
        <DialogDescription>
          Crie um novo horário e clique em "Criar".
        </DialogDescription>
      </DialogHeader>
      <form @submit.prevent="handleSubmitSchedule">
        <div>
          <label class="block text-sm mb-1">Inicio </label>
          <input v-model="date1" type="date" class="w-full border border-gray-300 rounded px-2 py-1"
                 required />
        </div>
        <div>
          <label class="block text-sm mb-1">Fim </label>
          <input v-model="date2" type="date" class="w-full border border-gray-300 rounded px-2 py-1"
                 required />
        </div>
        <DialogFooter class="mt-4">
        <div class="flex justify-center space-x-2">
          <Button type="submit"
                  class="bg-iptGreen text-white hover:bg-green-100 hover:text-iptGreen hover:border-iptGreen">
            Criar
          </Button>
        </div>

      </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
</template>