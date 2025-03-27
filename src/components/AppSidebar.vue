<script setup lang="ts">
import { CalendarDays, DoorClosed, GraduationCap, Home, Settings, University, Users } from "lucide-vue-next"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

// Menu items.
const items = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: Home,
  },
  {
    title: "Horários",
    url: "/schedules",
    icon: CalendarDays,
  },
  {
    title: "Salas",
    url: "/rooms",
    icon: DoorClosed,
  },
  {
    title: "Cursos",
    url: "/degrees",
    icon: GraduationCap,
  },
  {
    title: "Professores",
    url: "/teachers",
    icon: University,
  },
  {
    title: "Utilizadores",
    url: "/users",
    icon: Users,
  },
  {
    title: "Definições",
    url: "/settings",
    icon: Settings,
  },  
];
</script>

<template>
  <Sidebar>
    <SidebarContent class="bg-iptGreen">
      <SidebarGroup>
        <SidebarGroupLabel class="mt-10 text-bold text-white text-xl">IPT</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
              <SidebarMenuItem v-for="item in items" :key="item.title">
                <SidebarMenuButton asChild>
                    <a :href="item.url" class="text-white">
                      <component :is="item.icon" />
                      <span>{{item.title}}</span>
                    </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>
  </Sidebar>
</template>