<script setup>
import {ref, useTemplateRef} from "vue";

const CELL_HEIGHT = 30;
const CELL_WIDTH = 100;

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

const weekdays = [
  "SEG", "TER", "QUA", "QUI", "SEX"
]

const date_times_generated = [];
for(let i = 0; i < date_times.length-1; i++){
  date_times_generated.push(date_times[i] + "-" + date_times[i+1])
}

const events = ref([
  {
    id: "0",
    x: 1,
    y: 2,
    tempX: 0,
    tempY: 0,
    offsetX: 0,
    offsetY: 0,
    time: 4,
    classroom: "B215",
    teacher: "Doutor Eng. Mário Costa"
  },
  {
    id: "1",
    x: 3,
    y: 5,
    tempX: 0,
    tempY: 0,
    offsetX: 0,
    offsetY: 0,
    time: 4,
    classroom: "B215",
    teacher: "Doutor Eng. Mário Costa"
  },
  {
    id: "2",
    x: 2,
    y: 7,
    tempX: 0,
    tempY: 0,
    offsetX: 0,
    offsetY: 0,
    time: 4,
    classroom: "B222",
    teacher: "Afonso Ramos"
  },
  {
    id: "3",
    x: 4,
    y: 11,
    tempX: 0,
    tempY: 0,
    offsetX: 0,
    offsetY: 0,
    time: 4,
    classroom: "B222",
    teacher: "Afonso Ramos"
  }

]);

function validatePos(id){
  var [x, y] = e.value[id];
  x = Ma
}

function onDragEnd(e){

  e.target.classList.remove("data-grid-front");
  moveToPos(e.target.id, e)
  clampPos(e.target.id, e)
}

const droppableArea = useTemplateRef('droppable-area')

function onDrag(e){
  e.dataTransfer.dropEffect = "copy";
  moveToPos(e.target.id, e)
}

function clampPos(id, e){
  events.value[e.target.id].x = Math.round(events.value[e.target.id].x)
  events.value[e.target.id].y = Math.round(events.value[e.target.id].y)
}

function moveToPos(id, e){
  var x = e.clientX - events.value[e.target.id].offsetX;
  var y = e.clientY - events.value[e.target.id].offsetY;
  var rect = droppableArea.value.getBoundingClientRect();
  x -= rect.left;
  y -= rect.top;

  events.value[e.target.id].x = (x/CELL_WIDTH)
  events.value[e.target.id].y = (y/CELL_HEIGHT)
}

var draggedElement = null;

function onDragStart(e){
  e.dataTransfer.effectAllowed = "copyMove";
  e.target.classList.add("data-grid-front");
  console.log(e);
  draggedElement = e.target.id;
  events.value[e.target.id].tempX = events.value[e.target.id].x;
  events.value[e.target.id].tempY = events.value[e.target.id].y;
  events.value[e.target.id].offsetX = e.offsetX;
  events.value[e.target.id].offsetY = e.offsetY;

  e.z

  e.dataTransfer.setDragImage(new Image(), 0, 0);
}

</script>

<template>
  <div class="data-grid-container">
    <div class="outer-div">
      <div class="data-grid-empty">
        <div class="data-grid-timeslot-container">
          <div class="data-grid-timeslot">HORAS: </div>
          <div v-for="(item) in date_times_generated" class="data-grid-timeslot">
            {{item}}
          </div>
        </div>
      </div>

      <div class="data-grid-empty">
        <div class="data-grid-weekday-container">
          <div v-for="(item) in weekdays" class="data-grid-weekday">
            {{item}}
          </div>
        </div>
      </div>

      <div class="data-grid-empty">
        <div class="data-grid-event-container" ref="droppable-area">
          <div draggable="true"
               @dragend="onDragEnd"
               @drag="onDrag"
               @dragstart="onDragStart"
               v-for="(item) in events"
               :style="
          {left: item.x * CELL_WIDTH + 'px',
          top: item.y * CELL_HEIGHT + 'px',
          height: item.time * (CELL_HEIGHT) + 'px'}"
               :id="item.id"
               class="data-grid-event">
            <p>{{item.classroom}}</p>
            <p>{{item.teacher}}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

.data-grid-container{
  height: 600px;
  overflow: scroll;
}

.outer-div{
  background-color: blue;
  min-width: 200px;

  height: 930px;
  flex-grow: 1;
}

.data-grid-empty{
  position: relative;
  width: 600px;
}

.data-grid-event-container{
  position: absolute;
  top: v-bind('CELL_HEIGHT + "px"');
  left: v-bind('CELL_WIDTH + "px"');
}

.data-grid-event{
  background-color: darkslategray;
  border: 1px black solid;
  position: absolute;
  left: v-bind('CELL_WIDTH + "px"');
  top: v-bind('CELL_HEIGHT * 3 + "px"');
  width: v-bind('CELL_WIDTH + "px"');
  height: v-bind('CELL_HEIGHT * 3 + "px"');
}

.data-grid-timeslot-container{
  position: absolute;
  width: v-bind('CELL_WIDTH + "px"');
}

.data-grid-timeslot{
  width: 100%;
  height: v-bind('CELL_HEIGHT + "px"');


  background-color: brown;
  border: 1px solid white;
}

.data-grid-weekday-container{
  position: absolute;
  height: v-bind('CELL_HEIGHT + "px"');
  left: v-bind('CELL_WIDTH + "px"');
  display: flex;
}

.data-grid-weekday{
  width: v-bind('CELL_WIDTH + "px"');
  height: 100%;
  display: inline-block;
  float: left;

  background-color: brown;
  border: 1px solid white;
}

.data-grid-front{
  z-index: 10;
}

</style>