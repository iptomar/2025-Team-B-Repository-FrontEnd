<script setup>
import {inject} from "vue";

const { event } = defineProps(['cell_width', 'cell_height', 'event']);
const cell_width = inject('cell_width');
const cell_height = inject('cell_height');
console.log(event)

const onDrag = inject('calendar_on_drag');
const onDragStart = inject('calendar_on_drag_start');
const onDragEnd = inject('calendar_on_drag_end');
const onDoubleClick = inject('calendar_on_double_click');

</script>

<template>
  <div draggable="true"
       :style="
          {left: event.x * cell_width + 'px',
          top: event.y * cell_height + 'px',
          height: event.time * (cell_height) + 'px'}"
       :id="event.id"
       @drag="onDrag"
       @dragstart="onDragStart"
       @dragend="onDragEnd"
       @dblclick="onDoubleClick(event.id)"
       class="calendar-event">
    <div v-if="event.time > 1" class="calendar-event-data">
      <p class="calendar-event-header overflow-hidden whitespace-nowrap">{{event.name}}</p>
      <p v-if="event.time > 2" class="calendar-event-label">{{event.type}}</p>
      <p class="calendar-event-label">{{event.teacher}}</p>
      <p class="calendar-event-label">{{event.classroom}}</p>
    </div>
    <div v-else class="calendar-event-data">
      <p class="calendar-event-label">{{event.name}} {{event.classroom}}</p>
    </div>
  </div>
</template>

<style scoped>
.calendar-event{
  @apply absolute;
  left: v-bind('cell_width + "px"');
  top: v-bind('cell_height * 3 + "px"');
  width: v-bind('cell_width + "px"');
  height: v-bind('cell_height * 3 + "px"');
}

.calendar-event-data{
  @apply h-full w-full bg-white border border-b-gray-300 flex flex-col justify-between pb-1 overflow-hidden;
}

.calendar-event-header{
  @apply w-full border border-white;
}

.calendar-event-label{
  @apply text-xs m-0;
}
</style>