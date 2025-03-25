<script setup>
import {ref, useTemplateRef} from "vue";
import CalendarEvent from "@/components/ui/calendar/CalendarEvent.vue";
import {getTimeFrames, weekdays, shortened_weekdays} from "@/utils/date-utils.js"
const { width, height, cell_width, cell_height, use_shortened_names } = defineProps(['width', 'height', 'cell_width', 'cell_height', 'use_shortened_names']);

const WEEKDAYS = use_shortened_names ? shortened_weekdays : weekdays

let CELL_HEIGHT = cell_height;
let CELL_WIDTH = cell_width;


if(cell_width === undefined)
  CELL_WIDTH = width/(WEEKDAYS.length+1)

const time_frames = getTimeFrames();

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
    if(events.value[j].x !== x)
      continue;

    if(events.value[j].id === id)
      continue;

    let result = !(y < events.value[j].y + events.value[j].time && y + time > events.value[j].y);
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
  y = Math.max(Math.min(y,time_frames.length - events.value[id].time),0)
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
  y = Math.max(Math.min(y,time_frames.length - ghost_data.value.time),0)
  ghost_data.value.x = x;
  ghost_data.value.y = y;

  ghost_data.value.error = false;
  if(!isSpaceClear(id, x, y, events.value[id].time)){
    ghost_data.value.error = true;
  }

  //console.log(ghost_data.value.error);
}

function onDragEnd(e){

  e.target.classList.remove("calendar-front");
  ghost_data.value.hidden = true;
  moveToPos(e.target.id, e)
  clampPos(e.target.id, e)
  validatePos(e.target.id)

}

const droppableArea = useTemplateRef('droppable-area')
const ghost = useTemplateRef('ghost');

function onDrag(e){
  if(e.screenX === 0 && e.screenY === 0)
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
  y = Math.max(Math.min(y,time_frames.length - events.value[id].time),0)
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

let draggedElement = null;

function onDragStart(e){
  e.dataTransfer.effectAllowed = "copyMove";
  e.target.classList.add("calendar-front");
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
  <div class="calendar-container">
    <div class="outer-div">

      <div class="calendar-empty">
        <div class="calendar-timeslot-line-container">
          <div v-for="() in time_frames" class="calendar-timeslot-line"/>
        </div>
      </div>

      <div class="calendar-empty">
        <div class="calendar-timeslot-container">
          <div class="calendar-timeslot">HORAS: </div>
          <div v-for="(item) in time_frames" class="calendar-timeslot">
            {{item}}
          </div>
        </div>
      </div>
      <div class="calendar-empty">
        <div class="calendar-weekday-container">
          <div v-for="(item) in WEEKDAYS" class="calendar-weekday">
            {{item}}
          </div>
        </div>
      </div>

      <div class="calendar-empty">
        <div class="calendar-event-container" ref="droppable-area">
          <CalendarEvent v-bind:cell_width="CELL_WIDTH" v-bind:cell_height="CELL_HEIGHT" v-for="(item) in events" v-bind:event="item"/>
          <div
               ref="ghost"
               :style="
                  {left: ghost_data.x * CELL_WIDTH + 'px',
                  top: ghost_data.y * CELL_HEIGHT + 'px',
                  height: ghost_data.time * (CELL_HEIGHT) + 'px'}"
               class="calendar-event calendar-ghost"
               :class="{'calendar-hidden' : ghost_data.hidden, 'calendar-error' : ghost_data.error}"
               >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

.calendar-container{
  height: v-bind("height + 'px'");
  overflow-y: scroll;
  overflow-x: hidden;
}

.outer-div{
  min-width: v-bind("width + 'px'");

  height: 930px;
  flex-grow: 1;
}

.calendar-empty{
  position: relative;
  width: v-bind("width + 'px'");
}

.calendar-timeslot-line-container{
  position: absolute;
  width: 1000px;
  height: 100%;
}

.calendar-event-container{
  position: absolute;
  top: v-bind('CELL_HEIGHT + "px"');
  left: v-bind('CELL_WIDTH + "px"');
}

.calendar-timeslot-container{
  position: absolute;
  width: v-bind('CELL_WIDTH + "px"');
}

.calendar-timeslot{
  width: 100%;
  height: v-bind('CELL_HEIGHT + "px"');

  background-color: #41b883;
  border: 1px solid #181818;
  z-index: 1;
}

.calendar-weekday-container{
  position: absolute;
  height: v-bind('CELL_HEIGHT + "px"');
  left: v-bind('CELL_WIDTH + "px"');
  display: flex;
}

.calendar-weekday{
  width: v-bind('CELL_WIDTH + "px"');
  height: 100%;
  display: inline-block;
  float: left;

  background-color: #41b883;
  border: 1px solid #181818;
}

.calendar-timeslot-line{
  width: 1000px;
  height: v-bind("CELL_HEIGHT + "px"");
  border-bottom: 1px dashed #181818;
  z-index: 1;
}

.calendar-front{
  z-index: 2;
}

.calendar-ghost{
  background-color: black;
  z-index: -1;
}

.calendar-error{
  background-color: red;
}

.calendar-hidden{
  display: none;
}
</style>