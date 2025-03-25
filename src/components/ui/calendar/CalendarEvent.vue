<script setup lang="ts">
const { cell_width, cell_height, event } = defineProps(['cell_width', 'cell_height', 'event']);

</script>

<template>
  <div draggable="true"
       :style="
          {left: event.x * cell_width + 'px',
          top: event.y * cell_height + 'px',
          height: event.time * (cell_height) + 'px'}"
       :id="event.id"
       class="calendar-event">
    <p>{{event.classroom}}</p>
    <p>{{event.teacher}}</p>
  </div>
</template>

<style scoped>

.calendar-event{
  display: flex;
  flex-direction: column;
  background-color: darkslategray;
  border: 3px double #41b883;
  position: absolute;
  left: v-bind('cell_width + "px"');
  top: v-bind('cell_height * 3 + "px"');
  width: v-bind('cell_width + "px"');
  height: v-bind('cell_height * 3 + "px"');
}

.calendar-event > p {
}

</style>