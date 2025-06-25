<script setup lang="ts">
import { Check, ChevronsUpDown } from 'lucide-vue-next'
import {ref, onMounted, provide, inject, useTemplateRef, watch, nextTick} from 'vue';
import { useRoute } from 'vue-router';
import Calendar from "@/components/ui/calendar/Calendar.vue";
import CalendarProvider from "@/components/ui/calendar/CalendarProvider.vue";
import type { Turma } from '@/components/interfaces';
import { fetchTurmaById } from '@/api/turmas';
import { useToast } from '@/components/ui/toast/use-toast';
import { Toaster } from '@/components/ui/toast';
import {isValidTeacher, parseJwt} from '@/utils/user-utils.js';
import { userIsAdmin, canSubmit} from '@/utils/user-utils.js';

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
import { useSidebar } from '@/components/ui/sidebar';

/**
 * SignalR-Related-Data
 */
const route = useRoute();
const turmaId = ref(Number(route.params.id));
const events = ref([])
const showClassModal = ref(false)
const showScheduleModal = ref(false)
const ON_CONNECTION_START = "JoinHorarioGroup"
const ON_CONNECTION_SWITCH = "LeaveHorarioGroup"
const CONNECTION_HUB = "/hubdobloco"
const API_BASE_URL = "https://localhost:7223"

const open = ref(false)
const value = ref('')
// esta variavel vai estar responsavel pela renderização condicional dos elementos para a print do horario.
const { printScheduleBol } = useSidebar()



var modifiedBlock : number = null;
var aulas = []

let connectionState = ref("LOADING");
let connection = new HubConnectionBuilder().withUrl(API_BASE_URL + CONNECTION_HUB).build();
let horarioId = ref(1)
let horarios = ref([{id: 1, inicio: '2025-12-14', fim: '2025-12-25'}, {id: 2, inicio: '1900-01-01', fim: '1900-01-01'}])
const salas = ref([])
const date1 = ref()
const date2 = ref()

const turmaSelecionada = ref<Turma | null>(null)
const connected = ref(false)
const isCoordenadorCurso = ref(false);
const userRoles = ref([]);


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


connection.on("BlocoRemovido", (bloco) => {
  for (var i = 0; i < events.value.length; i++) {
    console.log(events.value[i])
    if (events.value[i].aulaId == bloco.blocoId) {
      console.log("FOUND DELETION BLOCK", bloco.blocoId)
      events.value.splice(i, 1);
      break;
    }
  }

  console.log("DELETED EVENT: ", bloco)
})

connection.on("UpdateBloco", (bloco) => {
  console.log("Bloco: ", bloco)
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

async function fetchTurma() {
  const response = await fetch(`${API_BASE_URL}/api/Turmas/${turmaId.value}` );
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
  const response = await fetch(`${API_BASE_URL}/api/Blocos/Horario/${horarioId.value}` );
  if (!response.ok) throw new Error(response);
  return await response.json();
}

provide("events", events)


fetchSalas().then((val) =>{
  salas.value = val
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
  return h+m
}

async function postHorario(){
  var block = {
    Inicio: date1.value,
    Fim: date2.value,
    TurmaFK: turmaId.value,
    Blocos: []
  }
  const response = await fetch(`${API_BASE_URL}/api/Horarios`, {headers: {'content-type': 'application/json'}, method: 'POST', body: JSON.stringify(block)} );
  if (!response.ok) throw new Error(response);
  return await response.json();
}

async function postDeleteHorario() {
  const response = await fetch(`${API_BASE_URL}/api/Horarios/${horarioId.value}`,{headers: {'content-type': 'application/json'}, method: 'DELETE'} );
  if (!response.ok) throw new Error(response);
  return response;
}

async function postSetStatus(horario : number) {
  const response = await fetch(`${API_BASE_URL}/api/Horarios/SetStatus/${horario}/1`,{headers: {'content-type': 'application/json'}, method: 'POST', body: JSON.stringify({status: 1})} );
  if (!response.ok) throw new Error(response);
  return response;
}


async function postHorarioBlock(){
  var block = {
    HorarioId: horarioId.value,
    HoraInicio: YToTime(events.value[modifiedBlock].y),
    DiaDaSemana: events.value[modifiedBlock].x,
    SalaFK: events.value[modifiedBlock].classroom_id,
    AulaFK: events.value[modifiedBlock].class_id
  }
  const response = await fetch(`${API_BASE_URL}/api/signalR` + "/Horariobloco", {headers: {'content-type': 'application/json'}, method: 'POST', body: JSON.stringify(block)} );
  if (!response.ok) throw new Error(response);
  return await response.json();
}

async function putHorarioBlock(){
  var block = {
    Id: parseInt(events.value[modifiedBlock].aulaId),
    hora_Inicio: YToTime(events.value[modifiedBlock].y),
    DiaDaSemana: events.value[modifiedBlock].x,
    SalaFK: events.value[modifiedBlock].classroom_id,
    AulaFK: events.value[modifiedBlock].class_id
  }
  const response = await fetch(`${API_BASE_URL}/api/Blocos/` + events.value[modifiedBlock].aulaId, {headers: {'content-type': 'application/json'}, method: 'PUT', body: JSON.stringify(block)} );
  if (!response.ok) throw new Error(response);
  return await response.json();
}

async function deleteHorarioBlock(aulaId){
  const response = await fetch(`${API_BASE_URL}/api/Blocos/` + aulaId, {headers: {'content-type': 'application/json'}, method: 'DELETE'} );
  if (!response.ok) throw new Error(response);
  return await response.json();
}

var isNewBlock = false;
function onClassPicked(){
  if(!isNewBlock)
    putHorarioBlock().then((val) => {}).catch((err) => {})
  else
    postHorarioBlock().then((val) => {}).catch((err) => {})
}

function handleSubmitSchedule(){

  showScheduleModal.value = false;
  postHorario().then((val) => {});
  /*events.value[modifiedBlock].classroom_id = value;
  events.value[modifiedBlock].classroom = value ;
  onClassPicked();*/
}

function handleSubmit(){
  showClassModal.value = false;
  console.log("HELP:" , value, modifiedBlock)
  events.value[modifiedBlock].classroom_id = value;
  events.value[modifiedBlock].classroom = value ;
  onClassPicked();
}


function onDragEnd(i, aulaId){
  if(events.value[i].table == 0 && events.value[i].classroom_id == null ){
    modifiedBlock = i;
    isNewBlock = true;
    showClassModal.value = true;
  }else if(events.value[i].table == 0){
    modifiedBlock = i;
    putHorarioBlock().then((val) => {}).catch((err) => {})
    //removeCurrentBlock();
  }else{
    modifiedBlock = i;
    console.log("AULA REMOVIDA ", aulaId)
    deleteHorarioBlock(aulaId).then((val) => {}).catch((err) => {})
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
  if(aula == null)
    return null;
  var sala = getSala(val.salaFK);
  var time = timeToY(val.hora_Inicio)
  var duracao = 4
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
  connection.invoke(ON_CONNECTION_START, horarioId.value)
      .then(()=>{
        console.log("CONNECTED TO SCHEDULE " + horarioId.value);
      })
      .catch((err) =>{
    console.log(err.toString())
  })
  console.log("Sucessfully connected to schedule: " + horarioId.value);
}).catch((result) => {

});


connection.onclose((err) => {
  connected.value = false;
  connectionState.value = err.message;
})

/**
 * 1º -> Esconde os elementos.
 * 2º -> Faz o print do ecrã.
 * 3º -> Mostra os elementos.
 */
async function printSchedule(){
  printScheduleBol.value = true;
  await nextTick(); // função assicrona que espera pelo proximo tick do VDOM. 
  window.print();
  printScheduleBol.value = false;
}

function submeter(){
  postSetStatus(horarioId.value).then((val) => {

    for(let i = 0; i < horarios.value.length; i++) {
      if(horarios.value[i].id == horarioId.value){
        horarios.value[i].estado = 1;
      }
    }
    updateEstadoHorario();
  }).catch((err) =>{

  });
}

function updateHorario(){
  updateEstadoHorario();
  events.value = []
  fetchAulas().then((value) => {
    aulas = value
    fetchBlocos().then((value) => {
      convertToEvents(aulas)
      value[0].forEach((bloco) => {
        var event = convertToEvent(bloco)
        if(event)
          events.value.push(event)
      })
    })
  });
}

watch(horarioId, (value, oldValue, onCleanup) => {
  connection.invoke(ON_CONNECTION_SWITCH, oldValue)
      .then(()=>{
        console.log("DISCONNECTED FROM SCHEDULE " + oldValue);
        connection.invoke(ON_CONNECTION_START, value)
            .then(()=>{
              console.log("DISCONNECTED FROM SCHEDULE " + value);
            })
            .catch((err) => {
              console.log(err.toString())
            }
        )
      })
      .catch((err) =>{
        console.log(err.toString())
      })
  updateHorario()
})

onMounted(async () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });

  let token = localStorage.getItem('token')
  const decodedToken = parseJwt(token);
  userRoles.value = decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];

  fetchTurma().then((val) =>{
    isCoordenadorCurso.value = isValidTeacher(val.curso.professorFK) || userIsAdmin(userRoles)
  })

  fetchHorarios().then((val) => {
    horarios.value = val
    if(horarios.value.length > 0){
      horarioId.value = horarios.value[0].id
      updateHorario();
    }
    if(val.length == 0)
      connectionState.value = "Não existem horários criados para esta turma.";
    //horarios = val
  })
  try {
    turmaSelecionada.value = await fetchTurmaById(turmaId.value);
  } catch (error) {
    toast({
      title: 'Erro ao buscar a turma. Por favor, tente novamente mais tarde.',
      variant: 'destructive'
    });
  }
});

const estadoHorario = ref(0)

function updateEstadoHorario(){
  horarios.value.map((val) => {
    if(val.id == horarioId.value){
      estadoHorario.value = val.estado
    }
  })
}

function onDoubleClick(e) {
  modifiedBlock = -1;
  for (var i = 0; i < events.value.length; i++) {
    if (events.value[i].id == e) {

      if (events.value[i].table != 0)
        return
      modifiedBlock = i
      break;
    }
  }
  if (modifiedBlock == -1)
    return
  isNewBlock = false;
  showClassModal.value = true;
}

provide('calendar_on_double_click', onDoubleClick);

const showDeleteModal = ref(false)
function showDeleteModalFun(){
  showDeleteModal.value = true
}

function handleDeleteConfirm(){
  showDeleteModal.value = false
  postDeleteHorario()
  for(var i = 0; i < horarios.value.length; i++){
    if(horarios.value[i].id == horarioId.value){
      horarios.value.splice(i, 1)
      break;
    }
  }
  horarioId.value = horarios.value[0].id;
}
</script>

<template>
    <Toaster />

    <div v-if="printScheduleBol === false" class="mx-auto space-y-8 mb-10">
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

      <div class="w-full flex gap-4 justify-center items-center">
        <button v-if="userIsAdmin(userRoles)" @click="showScheduleModal = true"
                class="h-full text-white bg-iptGreen hover:bg-green-100 hover:border-iptGreen hover:text-iptGreen px-4 py-2">
          Criar Horário
        </button>
        <select v-if="horarios.length > 0"  v-model="horarioId" class="h-[2.6rem] border border-gray-300 rounded px-2 py-1">
          <option v-for="ano in horarios.slice().reverse()" :key="ano.id" :value="ano.id">
            {{ ano.inicio }} - {{ ano.fim }}
          </option>
        </select>
        <button v-if="horarios.length > 0 && userIsAdmin(userRoles)" @click="showDeleteModalFun()"
                class="h-full text-white dark:bg-red bg-red-900 hover:bg-red-100 hover:border-red-500 hover:text-iptGreen px-4 py-2">
          ❌
        </button>
        <button @click="printSchedule()"
                class="h-full text-white bg-iptGreen hover:bg-green-100 hover:border-iptGreen hover:text-iptGreen px-4 py-2">
          Imprimir
        </button>
        <div class="text-iptGreen font-semibold" v-if="estadoHorario == 1">
          Horário pendente de aprovação...
        </div>
        <button v-if="isCoordenadorCurso && estadoHorario == 0" @click="submeter()"
                class="h-full text-white bg-iptGreen hover:bg-green-100 hover:border-iptGreen hover:text-iptGreen px-4 py-2">
          Submeter
        </button>
      </div>
    </div>



    <CalendarProvider events="events" v-if="connected && horarios.length > 0" cell_width="148" cell_height="30" style={}>
        <div class="flex">
          <Calendar id="calendarItem" table="0" />
          <CalendarHolder v-if="printScheduleBol === false && isCoordenadorCurso" table="1" slotsW="1" slotsH="50"/>
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
  <Dialog v-model:open="showDeleteModal">
    <DialogContent class="w-full max-w-md">
      <DialogHeader>
        <DialogTitle>Confirmar Eliminação</DialogTitle>
        <DialogDescription>Tem certeza de que deseja apagar o horario?</DialogDescription>
      </DialogHeader>
      <DialogFooter class="flex justify-center gap-2">
        <Button type="button" class="bg-red-100 text-red-500 hover:bg-red-500 hover:text-white"
                @click="handleDeleteConfirm">
          Excluir
        </Button>
        <Button type="button"
                class="px-4 py-2 text-white bg-gray-400 hover:bg-gray-100 hover:border-gray-400 hover:text-gray-400"
                variant="ghost" @click="showDeleteModal = false">
          Cancelar
        </Button>
      </DialogFooter>
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