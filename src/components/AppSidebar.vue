<script setup lang="ts">
import { DoorClosed, GraduationCap, Radio, Home, ShieldUser, Users, LogOut } from "lucide-vue-next";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  SidebarHeader,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { useRoute } from "vue-router";
import { ref } from 'vue'

const route = useRoute();

const isSidebarCollapsed = ref(false)

const items = [
  {
    title: "SignalR",
    url: "/signalR/3",
    icon: Radio,
  },
  {
    title: "Cursos",
    url: "/cursos",
    icon: GraduationCap,
  },
  {
    title: "Salas",
    url: "/salas",
    icon: DoorClosed,
  },
  {
    title: "Espaço Admin",
    url: "/admin",
    icon: ShieldUser,
  },
];
</script>

<template>
  <Sidebar collapsible="icon">
    <SidebarTrigger/>
    <SidebarContent class="bg-iptGreen flex flex-col h-full">
      <aside
    data-sidebar
    :class="[
      'transition-[width] duration-200 ease-in-out bg-gray-800 text-white',
      isSidebarCollapsed ? 'w-[70px]' : 'w-[240px]'
    ]"
  ></aside>
      <SidebarHeader />
      <div>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem v-for="item in items" :key="item.title"
                :class="{ 'active-menu-item': route.path === item.url, 'my-1': true }">
                <SidebarMenuButton asChild>
                  <a :href="item.url" class="text-white flex items-center gap-2">
                    <component :is="item.icon" />
                    <span>{{ item.title }}</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </div>
    </SidebarContent>
    <SidebarFooter />
  </Sidebar>
</template>