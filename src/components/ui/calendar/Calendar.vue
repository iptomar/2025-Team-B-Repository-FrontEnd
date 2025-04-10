<script setup>
import {inject, ref, useTemplateRef} from "vue";
import CalendarEvent from "@/components/ui/calendar/CalendarEvent.vue";
import {getTimeFrames, weekdays, shortened_weekdays} from "@/utils/date-utils.js"
const {table,height } = defineProps(['table', 'height']);
const cell_width = inject("cell_width");
const cell_height = inject("cell_height");

var events = inject("events")
const drop_area = useTemplateRef('drop_area')
let registerDropTarget = inject("register_drop_target")
registerDropTarget({drop_area, table, offsetX: cell_width, offsetY: cell_height * 2});

/* PROPS:
*
* width: determines the maximum width of the widget
* height: determines the minimum height of the widget
*         (it will not stretch over the maximum size of the schedule)
* cell_width: is calculated by the width of the widget unless otherwise set
* cell_height: is 40px by default unless otherwise set
* events: declares events consumed by the component in the format:
* {
        id: '0',
        x: 0, //0 = MONDAY, 1 = TUESDAY, 2 = WEDNESDAY, 3 = THURSDAY; 4 = FRIDAY; 5 = SATURDAY
        y: 1, //time set in 30minute increments starting from 9:00am. 4 = 10:30,
        tempX: 0, //variable used to store the event position before a drag occurs
        tempY: 0, //variable used to store the event position before a drag occurs
        offsetX: 0, //variable used to store the mouse position relative to the dragged object
        offsetY: 0, //variable used to store the mouse position relative to the dragged object
        time: 4, //length of time for the given event in 30 minute increments (4 = 2 hours / 30 * 4 mins)
        name: 'Internet das Coisas', //name of the event
        type: type, //extra data about the event like '(TP)' or '(PL)'
        classroom: 'B255', //place where the event takes place
        teacher : 'Luís M. Oliveira' //Responsible for the event
      }
* * These events should also be constructed by some sort of function which is TODO.
* */

let CELL_HEIGHT = cell_height;
let CELL_WIDTH = cell_width;
if(cell_height === undefined)
  CELL_HEIGHT = 40
if(cell_width === undefined)
  CELL_WIDTH = width/(weekdays.length+1)


const width = CELL_WIDTH * 7;


//Use of shortened names like "Seg" instead of "Segunda-feira" for short screens.
//Usage is currently defined as when cells are smaller than 150px in size.
const use_shortened_names = CELL_WIDTH < 100;
const WEEKDAYS = use_shortened_names ? shortened_weekdays : weekdays

const time_frames = getTimeFrames();

/*
* Events can be generated through this function.
* If no data is given then mock data will be provided using this same function.
 */
const EVENTS = events;
/*
* Data for the ghost that shows while dragging an event over.
* This can be used to indicate where exactly an event is going to be dropped,
* or to indicate that an event is conflicting with another.
 */
const ghost_data = ref({
  x: 4,
  y: 11,
  time: 4,
  error: false,
  hidden : true
})

/* * * * * * * * * * * *
* DRAG EVENTS
 * * * * * * * * * * * */

function isSpaceClear(id, x, y, time){
  for(var j = 0; j < EVENTS.value.length; j++) {
    if(EVENTS.value[j].x !== x)
      continue;

    if(EVENTS.value[j].id === id)
      continue;

    let result = !(y < EVENTS.value[j].y + EVENTS.value[j].time && y + time > EVENTS.value[j].y);
    if(result)
      continue;
    return false;
  }
  return true;
}


function validatePos(id){
  var x = EVENTS.value[id].x;
  var y = EVENTS.value[id].y;
  x = Math.max(Math.min(x,weekdays.length-1),0)
  y = Math.max(Math.min(y,time_frames.length - EVENTS.value[id].time),0)
  EVENTS.value[id].x = x;
  EVENTS.value[id].y = y;

  if(!isSpaceClear(id, x, y, EVENTS.value[id].time)){
    EVENTS.value[id].x = EVENTS.value[id].tempX;
    EVENTS.value[id].y = EVENTS.value[id].tempY;
  }
}

function validateGhostPos(id){
  var x = ghost_data.value.x;
  var y = ghost_data.value.y;
  x = Math.max(Math.min(x,weekdays.length-1),0)
  y = Math.max(Math.min(y,time_frames.length - ghost_data.value.time),0)
  ghost_data.value.x = x;
  ghost_data.value.y = y;

  ghost_data.value.error = false;
  if(!isSpaceClear(id, x, y, EVENTS.value[id].time)){
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
  EVENTS.value[e.target.id].x = Math.round(EVENTS.value[e.target.id].x)
  EVENTS.value[e.target.id].y = Math.round(EVENTS.value[e.target.id].y)
}

function clampVisualPos(id){
  var x = EVENTS.value[id].x;
  var y = EVENTS.value[id].y;
  x = Math.max(Math.min(x,weekdays.length-1),0)
  y = Math.max(Math.min(y,time_frames.length - EVENTS.value[id].time),0)
  EVENTS.value[id].x = x;
  EVENTS.value[id].y = y;
}

function moveToPos(id, e){
  var x = e.clientX - EVENTS.value[e.target.id].offsetX;
  var y = e.clientY - EVENTS.value[e.target.id].offsetY;
  var rect = droppableArea.value.getBoundingClientRect();
  x -= rect.left;
  y -= rect.top;

  EVENTS.value[e.target.id].x = (x/CELL_WIDTH)
  EVENTS.value[e.target.id].y = (y/CELL_HEIGHT)

  ghost_data.value.x = Math.round(x/CELL_WIDTH);
  ghost_data.value.y = Math.round(y/CELL_HEIGHT);

}

let draggedElement = null;

function onDragStart(e){
  e.dataTransfer.effectAllowed = "copyMove";
  e.target.classList.add("calendar-front");
  draggedElement = e.target.id;
  EVENTS.value[e.target.id].tempX = EVENTS.value[e.target.id].x;
  EVENTS.value[e.target.id].tempY = EVENTS.value[e.target.id].y;
  EVENTS.value[e.target.id].offsetX = e.offsetX;
  EVENTS.value[e.target.id].offsetY = e.offsetY;


  e.dataTransfer.setDragImage(new Image(), 0, 0);
  ghost_data.value.hidden = false;
}

</script>

<template>
  <div>
    <div class="calendar-weekday-container bg-gray-200 rounded-t-2xl overflow-hidden max-w-screen-lg">
      <div class="calendar-header calendar-weekday"></div>
      <div class="calendar-header calendar-weekday" v-for="(item) in WEEKDAYS">{{item}}</div>
    </div>
    <div class="calendar-container rounded-b-2xl border border-gray-300 max-w-screen-lg ">
      <div class="calendar-outer-div" ref="drop_area">
        <div class="calendar-empty">
          <div class="calendar-timeslot-line-container max-w-screen-lg">
            <div v-for="() in time_frames" class="content-center calendar-timeslot-line"/>
          </div>
        </div>

        <div class="calendar-empty">
          <div class="calendar-timeslot-container">
            <div v-for="(item) in time_frames" class="calendar-label calendar-timeslot">
              {{item}}
            </div>
          </div>
        </div>

        <div class="calendar-empty">
          <div class="calendar-event-container">
            <CalendarEvent
                v-bind:cell_width="CELL_WIDTH"
                v-bind:cell_height="CELL_HEIGHT"
                v-for="(item) in EVENTS.filter( item => {
                  return item.table == table;
                })"
                v-bind:event="item"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style>

.calendar-outer-div{
  min-width: v-bind("width + 'px'");

  height: v-bind('CELL_HEIGHT * time_frames.length + "px"');;
  flex-grow: 1;
}

.calendar-label{
  @apply text-white bg-white text-black border-r border-r-black border-b border-b-gray-300 content-center;
}

.calendar-container{
  height: v-bind("height + 'px'");
  max-height: v-bind("CELL_HEIGHT * (time_frames.length + 2) + 'px'");
  width: v-bind('width + "px"');
  overflow-y: hidden;
  overflow-x: hidden;
}

.calendar-empty{
  position: relative;
  width: v-bind("width + 'px'");
}

.calendar-timeslot-line-container{
  position: absolute;
  height: 100%;
}

.calendar-event-container{
  position: absolute;
  top: v-bind('CELL_HEIGHT * 2 + "px"');
  left: v-bind('CELL_WIDTH + "px"');
}

.calendar-timeslot-container{
  position: absolute;
  width: v-bind('CELL_WIDTH + "px"');
}

.calendar-timeslot{
  width: 100%;
  height: v-bind('CELL_HEIGHT + "px"');

  z-index: 1;
}


.calendar-weekday-container{
  height: v-bind('CELL_HEIGHT * 2 + "px"');
  left: v-bind('CELL_WIDTH + "px"');
  display: flex;
}

.calendar-weekday{
  width: v-bind('CELL_WIDTH + "px"');
  height: 100%;
  display: inline-block;
}

.calendar-timeslot-line{
  @apply border-b border-b-gray-300;
  width: v-bind("width * 2 + 'px'");
  height: v-bind("CELL_HEIGHT + "px"");
  z-index: 1;
}

.calendar-front{
  z-index: 2;
}

.calendar-header{
  @apply text-xl bg-gray-200 content-center border-b border-b-gray-300;
  height: v-bind('CELL_HEIGHT * 2 + "px"');

}

</style>