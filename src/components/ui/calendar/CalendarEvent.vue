<script setup>
import {inject} from "vue";

const { event } = defineProps(['cell_width', 'cell_height', 'event']);
const cell_width = inject('cell_width');
const cell_height = inject('cell_height');
console.log(event)

const onDrag = inject('calendar_on_drag');
const onDragStart = inject('calendar_on_drag_start');
const onDragEnd = inject('calendar_on_drag_end');

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
       class="calendar-event">
    <div class="calendar-event-data">
      <p class="calendar-event-header">{{event.name}}</p>
      <p class="calendar-event-label">{{event.type}}</p>
      <p class="calendar-event-label">{{event.teacher}}</p>
      <p class="calendar-event-label">{{event.classroom}}</p>
    </div>
  </div>
</template>

<style scoped>
.calendar-event{
  @apply border border-white absolute;
  left: v-bind('cell_width + "px"');
  top: v-bind('cell_height * 3 + "px"');
  width: v-bind('cell_width + "px"');
  height: v-bind('cell_height * 3 + "px"');
}

.calendar-event-data{
  @apply h-full w-full bg-white drop-shadow flex flex-col justify-between pb-1;
}

.calendar-event-header{
  @apply w-full border border-white;
}

.calendar-event-label{
  @apply text-xs;
}
</style>