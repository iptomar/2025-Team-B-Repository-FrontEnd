<script setup lang="ts">
import {provide, ref} from "vue";

  const { events, width, height, cell_width, cell_height } = defineProps(['events', 'width', 'height', 'cell_width', 'cell_height']);
  provide("cell_width", cell_width);
  provide("cell_height", cell_height);
  provide("events", events);

  function generateEvent(table, weekday, timeslot, time, name, type, classroom, teacher){
    events.push(
        {
          id: events.length.toString(),
          table: table,
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
          teacher : teacher
        });
  }

  function generateMockData(){
    generateEvent(0, 0, 14, 4, "Internet das Coisas", "(TP)", "B255", "Luís M. Oliveira");
    generateEvent(0, 0, 18, 4, "Internet das Coisas", "(PL)", "I153", "Luís M. Oliveira");
    generateEvent(0, 1, 14, 4, "Sist. Inf. nas Org.", "(TP)", "I154", "Vasco Silva");
    generateEvent(0, 1, 18, 4, "Desenv. Operações", "(PL)", "B255", "Renato E. Panda");
    generateEvent(0, 2, 16, 4, "Sist. Inf. nas Org.", "(PL)", "I154", "Vasco Silva");
    generateEvent(0, 3, 14, 4, "Desenv. Operações", "(TP)", "B255", "Luís A. Almeida");
    generateEvent(0, 3, 18, 4, "Gestão de Proj.", "(TP)", "B128", "Paulo A. Santos");
    generateEvent(0, 4, 15, 4, "Gestão de Proj.", "(PL)", "B128", "Paulo A. Santos");
  }

  generateMockData();

function onDrag(e){
    e.dataTransfer.dropEffect = "copy";
  }

  let draggedElement = null;

  function onDragStart(e){
    e.dataTransfer.effectAllowed = "copyMove";
    e.target.classList.add("calendar-front");
    draggedElement = e.target.id;
    e.dataTransfer.setDragImage(new Image(), 0, 0);
  }

  function onDragEnd(e){
    e.target.classList.remove("calendar-front");
    console.log(e);
    let drop_target = null;
    drop_targets.forEach(target => {
      var rect = target.drop_area.value.getBoundingClientRect();

      console.log(rect)
      if(e.clientX > rect.left && e.clientY > rect.top && e.clientX < rect.right && e.clientY < rect.bottom) {
        drop_target = target;
      }
    })
    console.log(drop_target)
    events.forEach(event => {
      if(event.id == e.target.id)
        event.table = drop_target?.table;
    })
  }
  let drop_targets = [];
  function registerDropTarget(object){
    drop_targets.push(object);
  }
  provide('register_drop_target', registerDropTarget)

  provide("calendar_on_drag", onDrag)
  provide("calendar_on_drag_start", onDragStart)
  provide("calendar_on_drag_end", onDragEnd)
</script>

<template>
  <slot></slot>
</template>

<style scoped>

</style>