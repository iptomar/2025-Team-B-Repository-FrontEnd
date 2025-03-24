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

const ghost_data = ref({
  x: 4,
  y: 11,
  time: 4,
  error: false,
  hidden : true
})

function isSpaceClear(id, x, y, time){
  for(var j = 0; j < events.value.length; j++) {
    if(events.value[j].x != x)
      continue;

    if(events.value[j].id == id)
      continue;

    var result = !(y < events.value[j].y + events.value[j].time && y + time > events.value[j].y);
    if(result)
      continue;
    return false;
  }
  return true;
}


function validatePos(id){
  var x = events.value[id].x;
  var y = events.value[id].y;
  x = Math.max(Math.min(x,4),0)
  y = Math.max(Math.min(y,date_times_generated.length - events.value[id].time),0)
  events.value[id].x = x;
  events.value[id].y = y;

  if(!isSpaceClear(id, x, y, events.value[id].time)){
    events.value[id].x = events.value[id].tempX;
    events.value[id].y = events.value[id].tempY;
  }
}

function validateGhostPos(id){
  var x = ghost_data.value.x;
  var y = ghost_data.value.y;
  x = Math.max(Math.min(x,4),0)
  y = Math.max(Math.min(y,date_times_generated.length - ghost_data.value.time),0)
  ghost_data.value.x = x;
  ghost_data.value.y = y;

  ghost_data.value.error = false;
  if(!isSpaceClear(id, x, y, events.value[id].time)){
    ghost_data.value.error = true;
  }

  //console.log(ghost_data.value.error);
}

function onDragEnd(e){

  e.target.classList.remove("data-grid-front");
  ghost_data.value.hidden = true;
  moveToPos(e.target.id, e)
  clampPos(e.target.id, e)
  validatePos(e.target.id)

}

const droppableArea = useTemplateRef('droppable-area')
const ghost = useTemplateRef('ghost');

function onDrag(e){
  if(e.screenX == 0 && e.screenY == 0)
    return;
  e.dataTransfer.dropEffect = "copy";
  moveToPos(e.target.id, e);
  clampVisualPos(e.target.id);
  validateGhostPos(e.target.id);
}

function clampPos(id, e){
  events.value[e.target.id].x = Math.round(events.value[e.target.id].x)
  events.value[e.target.id].y = Math.round(events.value[e.target.id].y)
}

function clampVisualPos(id){
  var x = events.value[id].x;
  var y = events.value[id].y;
  x = Math.max(Math.min(x,4),0)
  y = Math.max(Math.min(y,date_times_generated.length - events.value[id].time),0)
  events.value[id].x = x;
  events.value[id].y = y;
}

function moveToPos(id, e){
  var x = e.clientX - events.value[e.target.id].offsetX;
  var y = e.clientY - events.value[e.target.id].offsetY;
  var rect = droppableArea.value.getBoundingClientRect();
  x -= rect.left;
  y -= rect.top;

  events.value[e.target.id].x = (x/CELL_WIDTH)
  events.value[e.target.id].y = (y/CELL_HEIGHT)

  ghost_data.value.x = Math.round(x/CELL_WIDTH);
  ghost_data.value.y = Math.round(y/CELL_HEIGHT);

}

var draggedElement = null;

function onDragStart(e){
  e.dataTransfer.effectAllowed = "copyMove";
  e.target.classList.add("data-grid-front");
  draggedElement = e.target.id;
  events.value[e.target.id].tempX = events.value[e.target.id].x;
  events.value[e.target.id].tempY = events.value[e.target.id].y;
  events.value[e.target.id].offsetX = e.offsetX;
  events.value[e.target.id].offsetY = e.offsetY;


  e.dataTransfer.setDragImage(new Image(), 0, 0);
  ghost_data.value.hidden = false;
}

</script>

<template>
  <div class="data-grid-container">
    <div class="outer-div">

      <div class="data-grid-empty">
        <div class="data-grid-timeslot-line-container">
          <div v-for="() in date_times_generated" class="data-grid-timeslot-line"/>
        </div>
      </div>

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
          <div
               ref="ghost"
               :style="
                  {left: ghost_data.x * CELL_WIDTH + 'px',
                  top: ghost_data.y * CELL_HEIGHT + 'px',
                  height: ghost_data.time * (CELL_HEIGHT) + 'px'}"
               class="data-grid-event data-grid-ghost"
               :class="{'data-grid-hidden' : ghost_data.hidden, 'data-grid-error' : ghost_data.error}"
               >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

.data-grid-container{
  height: 600px;
  overflow-y: scroll;
  overflow-x: hidden;
}

.outer-div{
  min-width: 200px;

  height: 930px;
  flex-grow: 1;
}

.data-grid-empty{
  position: relative;
  width: 600px;
}

.data-grid-timeslot-line-container{
  position: absolute;
  width: 1000px;
  height: 100%;
}

.data-grid-event-container{
  position: absolute;
  top: v-bind('CELL_HEIGHT + "px"');
  left: v-bind('CELL_WIDTH + "px"');
}

.data-grid-event{
  display: flex;
  flex-direction: column;
  background-color: darkslategray;
  border: 3px double #41b883;
  position: absolute;
  left: v-bind('CELL_WIDTH + "px"');
  top: v-bind('CELL_HEIGHT * 3 + "px"');
  width: v-bind('CELL_WIDTH + "px"');
  height: v-bind('CELL_HEIGHT * 3 + "px"');
}

.data-grid-event > p {
}

.data-grid-timeslot-container{
  position: absolute;
  width: v-bind('CELL_WIDTH + "px"');
}

.data-grid-timeslot{
  width: 100%;
  height: v-bind('CELL_HEIGHT + "px"');

  background-color: #41b883;
  border: 1px solid #181818;
  z-index: 1;
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

  background-color: #41b883;
  border: 1px solid #181818;
}

.data-grid-timeslot-line{
  width: 1000px;
  height: v-bind("CELL_HEIGHT + "px"");
  border-bottom: 1px dashed #181818;
  z-index: 1;
}

.data-grid-front{
  z-index: 2;
}

.data-grid-ghost{
  background-color: black;
  z-index: -1;
}

.data-grid-error{
  background-color: red;
}

.data-grid-hidden{
  display: none;
}
</style>