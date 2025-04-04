<template>
    <div>
      <h1>Horários</h1>
      <CalendarProvider :events="EVENTS" cell_width="130" cell_height="30">
        <Calendar table="0"/>
        <!--<CalendarHolder table="1" slotsW="2" slotsH="4"/>-->
      </CalendarProvider>
      </div>
</template>

<style>
</style>

<script setup lang="ts">
import Calendar from "@/components/ui/calendar/Calendar.vue";
import CalendarHolder from "@/components/ui/calendar/CalendarHolder.vue";
import CalendarProvider from "@/components/ui/calendar/CalendarProvider.vue";
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
      time: 2,
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
      time: 1,
      name: "LOL",
      type: "PL",
      classroom: "B123",
      teacher : "Ramos"
    });

let EVENTS = ref(events);
</script>