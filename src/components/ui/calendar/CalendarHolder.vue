<script setup lang="ts">

import CalendarEvent from "@/components/ui/calendar/CalendarEvent.vue";
import {inject, useTemplateRef} from "vue";
const { table, slots, cell_height } = defineProps(['table', 'slots', 'cell_height']);
const events = inject("events")
console.log(events)
const cell_width = inject('cell_width', 20)
const drop_area = useTemplateRef('drop_area')
let registerDropTarget = inject("register_drop_target")
registerDropTarget({drop_area, table,  offsetX: 0, offsetY: 0});


</script>

<template>
  <div ref="drop_area" class="calendar-empty" id="calendar-holder">
    <div class="calendar-event-container" id="calendar-event-container" ref="droppable-area">
      <CalendarEvent
          v-bind:cell_width="cell_width"
          v-bind:cell_height="cell_height"
          v-for="(item) in events.filter( item => {
            return item.table == table;
          })"
          v-bind:event="item"
      />
    </div>
  </div>
</template>

<style scoped>
  #calendar-holder{
    height: v-bind('(slots * cell_height) + "px"');
    width: v-bind("cell_width + 'px'");
    flex: 0 0 auto;
    flex-shrink: 0;
  }
</style>