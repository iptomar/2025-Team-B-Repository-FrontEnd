<script setup>
import {getCurrentInstance, inject, provide, ref} from "vue";
import {useElementSize, useResizeObserver} from "@vueuse/core";

const {
  width,
  height,
  cell_width,
  cell_height
} = defineProps(['width', 'height', 'cell_width', 'cell_height']);
const events = inject("events")
const instance = getCurrentInstance()
var max_width = 1024.0;
const size = useElementSize()
var calculated_width = max_width / 7;
var CELL_WIDTH = Math.min(calculated_width, cell_width)
const onDragEndEvent = inject('calendar_on_drag_end_event');
provide("cell_width", CELL_WIDTH);
provide("cell_height", cell_height);



/*function generateMockData() {
  generateEvent(0, 0, 0, 14, 4, "Internet das Coisas", "(TP)", "B255", "Luís M. Oliveira");
  generateEvent(1, 0, 0, 18, 4, "Internet das Coisas", "(PL)", "I153", "Luís M. Oliveira");
  generateEvent(2, 0, 1, 14, 4, "Sist. Inf. nas Org.", "(TP)", "I154", "Vasco Silva");
  generateEvent(3, 0, 1, 18, 4, "Desenv. Operações", "(PL)", "B255", "Renato E. Panda");
  generateEvent(4, 0, 2, 16, 4, "Sist. Inf. nas Org.", "(PL)", "I154", "Vasco Silva");
  generateEvent(5, 0, 3, 14, 4, "Desenv. Operações", "(TP)", "B255", "Luís A. Almeida");
  generateEvent(6, 0, 3, 18, 4, "Gestão de Proj.", "(TP)", "B128", "Paulo A. Santos");
  generateEvent(7, 0, 4, 15, 4, "Gestão de Proj.", "(PL)", "B128", "Paulo A. Santos");
}*/

//generateMockData();

function onDrag(e) {
  e.dataTransfer.dropEffect = "copy";
  moveToPos(e);
  clampPos(e)
}

let draggedElement = null;
let pickedHeight = ref(1);
let ghost = ref({
  x: 0, y: 0
})

function onDragStart(e) {
  console.log("DRAG OPERATION STARTED")
  e.dataTransfer.effectAllowed = "copyMove";
  e.target.classList.add("calendar-front");
  draggedElement = e.target.id;
  events.value.forEach(event => {
    if (event.id === draggedElement) {
      console.log(event.table)
      if(event.table == "1"){
        events.value.push(cloneEvent(event))
      }
      pickedHeight.value = event.time;
      event.tempX = event.x;
      event.tempY = event.y;
    }
  })
  e.dataTransfer.setDragImage(new Image(), 0, 0);
}

function cloneEvent(event){

  var id = 99999
  events.value.forEach(event => {
    if(id.toString() == event.id){
      id -= 1;
    }
  })

  return {
    id: id.toString(),
    aulaId: event.aulaId,
    table: event.table,
    oldTable: event.oldTable,
    x: event.x,
    y: event.y,
    tempX: event.tempX,
    tempY: event.tempY,
    offsetX: event.offsetX,
    offsetY: event.offsetY,
    time: event.time,
    name: event.name,
    type: event.type,
    classroom: event.classroom,
    teacher: event.teacher,
    class_id: event.class_id,
    classroom_id: event.classroom_id
  }
}

function onDragEnd(e) {
  console.log("DRAG OPERATION ENDED")
  moveToPos(e)
  clampPos(e)
  validatePos(e)
  for (var i = 0; i < events.value.length; i++) {
    if (events.value[i].id == draggedElement) {

      onDragEndEvent(i);
      console.log(events.value[i].id, events.value[i].table, events.value[i].x, events.value[i].y)
      break;
    }
  }
  draggedElement = null;
}

function validatePos(e) {
  var ev = null;
  var pos = -1;
  for (var i = 0; i < events.value.length; i++) {
    if (events.value[i].id == draggedElement) {
      ev = events.value[i];
      pos = i;
      break;
    }
  }
  console.log(ev)
  if(ev.table == "1" && pos != -1){
    events.value.splice(pos, 1);
  }

  events.value.forEach(event => {
    if (event.id != ev.id && event.table == ev.table) {
      if (event.x == ev.x && ev.y < event.y + event.time && ev.y + ev.time > event.y) {
        ev.y = ev.tempY;
        ev.x = ev.tempX;
        ev.table = ev.oldTable;
      }
    }
  })

}

function moveToPos(e) {
  e.target.classList.remove("calendar-front");
  let drop_target = null;
  drop_targets.forEach(target => {
    var rect = target.drop_area.value.getBoundingClientRect();
    if (e.clientX > rect.left && e.clientY > rect.top && e.clientX < rect.right && e.clientY < rect.bottom) {
      drop_target = target;
    }
  })
  events.value.forEach(event => {
    if (event.id === draggedElement && drop_target != null) {
      event.table = drop_target?.table;
      var rect = drop_target?.drop_area.value.getBoundingClientRect();
      var y = (e.clientY - (rect.top + parseInt(drop_target.offsetY))) / cell_height;
      var x = (e.clientX - (rect.left + parseInt(drop_target.offsetX))) / CELL_WIDTH;
      //var offset_y_cells = target.offsetY/cell_height
      x = Math.max(x, 0)
      console.log(drop_target)
      var cell_offset_y = drop_target.offsetY / cell_height
      y = Math.max(y, -cell_offset_y)
      y = Math.min(y, drop_target.slotsH - (event.time + cell_offset_y))
      //y = Math.min(y, height)

      event.y = y - 0.5;
      event.x = x;
    }
  })
}

function clampPos(e) {
  events.value.forEach(event => {
    if (event.id == draggedElement) {
      event.x = Math.trunc(event.x)
      event.y = Math.round(event.y)
    }
  })
};

let drop_targets = [];

function registerDropTarget(object) {
  drop_targets.push(object);
}

provide('register_drop_target', registerDropTarget)
provide("calendar_on_drag", onDrag)
provide("calendar_on_drag_start", onDragStart)
provide("calendar_on_drag_end", onDragEnd)
</script>

<template>
  <div class="size-full">

    <slot></slot>
  </div>
</template>

<style scoped>
</style>
