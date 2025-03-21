<script setup>
import draggable from 'vuedraggable'
import { useWindowSize } from '@vueuse/core'

const { width } = useWindowSize()

import { ref } from 'vue'
var date_times = [
  "09:00", "09:30",
  "10:00", "10:30",
  "11:00", "11:30",
  "12:00", "12:30",
  "13:00", "13:30",
  "14:00", "14:30",
  "15:00", "15:30",
  "16:00", "16:30",
  "17:00", "17:30",
  "18:00", "18:30",
  "19:00", "19:30",
  "20:00", "20:30",
  "21:00", "21:30",
  "22:00", "22:30",
  "23:00", "23:30",
  "24:00"
]
var date_times_generated = ["HORA"];
for(var i = 0; i < date_times.length-1; i++){
  date_times_generated.push(date_times[i] + "-" + date_times[i+1])
}

const date_times_ref = ref(date_times_generated)

var temp_data = [
  {
    name: "SEG",
    values: [
    ]
  },
  {
    name: "TER",
    values: []
  },
  {
    name: "QUA",
    values: []
  },
  {
    name: "QUI",
    values: []
  },
  {
    name: "SEX",
    values: []
  },
  {
    name: "SAB",
    values: []
  }
]

var classes = [
]

function addClass(day, time, length, prof, sala, turma){
  classes.push({day: day, time: time, length: length, prof: prof, sala: sala, turma: turma});
}

addClass("SEG", "16:00", 4, "Luis M. Oliveira", "B255", "Internet das Coisas")
addClass("SEG", "18:00", 4, "Luis M. Oliveira", "I153", "Internet das Coisas")
addClass("TER", "16:00", 4, "Vasco Silva", "I154", "Sist. Inf. nas Org.")
addClass("TER", "18:00", 4, "Luis M. Oliveira", "I153", "Desenv. Operações")
addClass("QUI", "16:00", 4, "Luis A. Almeida", "B255", "Desenv. Operações")
addClass("QUI", "18:00", 4, "Paulo A. Santos", "B128", "Gestão de Proj")
addClass("SEX", "16:30", 4, "Paulo A. Santos", "B128", "Gestão de Proj")
addClass("QUA", "17:00", 4, "Vasco Silva", "I154", "Sist. Inf. nas Org.")

function findTime(time){
  for(var i = 0; i < date_times_generated.length-1; i++){
    if(date_times[i].startsWith(time))
      return i;
  }
}

function findDay(day){
  for (var i = 0; i < temp_data.length; i++) {
    if (temp_data[i].name == day)
      return i;
  }
}

for (var i = 0; i < 6; i++) {
  var cur_data = temp_data[i];
  for (var j = 0; j < 30; j++) {
    temp_data[i].values.push({ id: (j + (i * 6)), type: 'empty', date: date_times_generated[j+1]})
  }
}

for (var i = 0; i < classes.length; i++) {
  var object = classes[i];
  var time = findTime(object.time);
  var day = findDay(object.day);

  console.log(day)
  for (var j = 0; j < object.length; j++){
    temp_data[day].values[time + j].type = 'void';
  }
  temp_data[day].values[time].type = 'data';
  temp_data[day].values[time].length = object.length;
  temp_data[day].values[time].prof = object.prof;
  temp_data[day].values[time].sala = object.sala;
  temp_data[day].values[time].turma = object.turma;
}

/*
for (var i = 0; i < 6; i++) {
    var cur_data = temp_data[i];
    for (var j = 0; j < 31; j++) {

        temp_data[i].values.push({ id: (j + (i*6)), type: (i+j)%10 != 0 ? 'empty' : 'data', prof:'Manel das Nesperas', sala: "B123"})
    }
}*/

const data_ref = ref(temp_data)

var fromId = 0;
var toId = 0;
var fromIdx = 0;
var toIdx = 0;

function handleMove(e){
  const { index, futureIndex } = e.draggedContext;

  fromId = findDay(e.from.id);
  toId = findDay(e.to.id);
  fromIdx = index;
  toIdx = futureIndex-1;
  return false;
}

function handleDragEnd(){
  console.log(fromId + "-" + fromIdx);
  console.log(toId + "-" + toIdx);
  console.log(data_ref);
  var length = data_ref.value[fromId].values[fromIdx].length;
  var prof = data_ref.value[fromId].values[fromIdx].prof;
  var sala = data_ref.value[fromId].values[fromIdx].sala;
  var turma = data_ref.value[fromId].values[fromIdx].turma;


  for (var i = 0; i < length; i++) {
    if (data_ref.value[toId].values[toIdx + i].type != 'empty' ) return;
  }

  for (var i = 0; i < length; i++) {
    data_ref.value[toId].values[toIdx + i].type = 'void';

    data_ref.value[fromId].values[fromIdx + i].type = 'empty';
    data_ref.value[fromId].values[fromIdx + i].length = 1;
  }

  data_ref.value[toId].values[toIdx].type = 'data';
  data_ref.value[toId].values[toIdx].length = length;
  data_ref.value[toId].values[toIdx].prof = prof;
  data_ref.value[toId].values[toIdx].sala = sala;
  data_ref.value[toId].values[toIdx].turma = turma;
}

</script>

<template>
  <div class="data-grid">
    <div v-if="width >= 860" class="data-column">
      <div v-for="(item) in date_times_ref" class="data-element data-date data-title data-time">{{ item }}</div>
    </div>
    <div v-for="(weekday) in data_ref" class="data-column">
      <div class="data-element data-date data-title">
        {{ weekday.name }}
      </div>
      <draggable :move="handleMove" @end="handleDragEnd" v-model="weekday.values" group="dates" item-key="id"
                 v-bind:id="weekday.name">
        <template #item="{ element }" :disabled="element.type == 'data'">
          <div class="data-element" v-if="element.type != 'void'"
               v-bind:class="{ dataempty: element.type == 'empty', 'not-draggable': element.type != 'data' }"
               v-bind:style="{ height: (element.length * 25) + 'px' }">
            <div v-if="element.type == 'data'" class="data-filled">
              <p>{{ element.prof }}</p>
              <p>{{ element.sala }}</p>
              <p>{{ element.turma }}</p>
            </div>
            <div v-if="width < 860 && element.type == 'empty'">
              <p>
                {{ element.date }}
              </p>
            </div>
          </div>
        </template>
      </draggable>
    </div>
  </div>
</template>

<style>

.data-grid{
  display: flex;
  flex-direction: row;
}

@media(max-width: 1078px){
  .data-grid{
    flex-wrap: wrap;
  }
}

.data-time:nth-child(2n+1){
  background-color: #34495e;
}
.data-time:nth-child(1) {
  background-color: unset;
}

.data-title{
  text-align: center;

}

.data-column{
  display: flex;
  flex-direction: column;
}

.data-element {
  /*border: solid 2px #909090;*/
  height: 25px;
}

.data-filled{
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
}
.data-filled > p{
  font-size: 10px;
  text-align: center;
}
.data-filled > :last-child {
  /*border: solid 2px #909090;*/
}
.data-date{
  /*border: solid 1px #909090;*/
  width: 100px;
}
.not-draggable {
  cursor: no-drop;
}
.dataempty{
  width: 100%;
  padding: 0;
  margin: 0;
  border: 1px dashed #181818;
  background-color: #41b883;
  text-align: center;
}


</style>