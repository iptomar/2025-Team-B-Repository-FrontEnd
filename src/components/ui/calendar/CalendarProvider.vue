<script setup>
import {getCurrentInstance, inject, provide, ref, useTemplateRef} from "vue";
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
provide("cell_width", CELL_WIDTH);
provide("cell_height", cell_height);
const onDragEndEvent = inject("calendar_on_drag_end_event")

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
  moveToPos(e)
  clampPos(e)
  validatePos(e)
  for (var i = 0; i < events.value.length; i++) {
    if (events.value[i].id == draggedElement && validation) {
      onDragEndEvent(i, events.value[i].aulaId);
      break;
    }
  }
  draggedElement = null;
}

var validation = false;

function validatePos(e) {
  validation = true;
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
    validation = false;
  }

  events.value.forEach(event => {
    if (event.id != ev.id && event.table == ev.table) {
      if (event.x == ev.x && ev.y < event.y + event.time && ev.y + ev.time > event.y) {
        ev.y = ev.tempY;
        ev.x = ev.tempX;
        ev.table = ev.oldTable;
        validation = false;
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
