<template>
    <div>
      <h1>Horários</h1>
        <CalendarEditor :events="EVENTS" cell_width="100" cell_height="20">
          <div class="flex flex-row gap-10">
            <Calendar table="0"/>
            <div class="card">
              <CalendarHolder table="1" slots="50"/>
            </div>
          </div>
        </CalendarEditor>
      </div>
</template>

<style>
</style>

<script setup lang="ts">
import Calendar from "@/components/ui/calendar/Calendar.vue";
import CalendarHolder from "@/components/ui/calendar/CalendarHolder.vue";
import CalendarEditor from "@/components/ui/calendar/CalendarProvider.vue";
import {ref} from "vue";


let events = [];
events.push(
    {
      id: events.length.toString(),
      table: 1,
      x: 0,
      y: 0,
      tempX: 0,
      tempY: 0,
      offsetX: 0,
      offsetY: 0,
      time: 4,
      name: "LOL",
      type: "PL",
      classroom: "B122",
      teacher : "Ramos"
    });
events.push(
    {
      id: events.length.toString(),
      table: 1,
      x: 0,
      y: 4,
      tempX: 0,
      tempY: 0,
      offsetX: 0,
      offsetY: 0,
      time: 4,
      name: "LOL",
      type: "PL",
      classroom: "B123",
      teacher : "Ramos"
    });

let EVENTS = ref(events);
</script>