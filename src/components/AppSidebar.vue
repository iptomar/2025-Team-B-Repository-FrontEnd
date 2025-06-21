<script setup lang="ts">
import { DoorClosed, GraduationCap, Radio, Home, ShieldUser, Users, LogOut } from "lucide-vue-next";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();

const logout = () => {
  localStorage.removeItem("token");
  router.push("/");
};

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
    title: "Utilizadores",
    url: "/utilizadores",
    icon: Users,
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
  <Sidebar>
    <SidebarContent class="bg-iptGreen flex flex-col justify-between h-full">
      <div>
        <SidebarGroup>
          <SidebarGroupLabel class="mt-12 text-bold text-white text-xl mb-4">IPT</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem v-for="item in items" :key="item.title" :class="{ 'active-menu-item': route.path === item.url, 'my-1': true }">
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
      
      <div class="p-4">
        <button 
          class="flex items-center gap-2 w-full text-white bg-iptGreen hover:bg-white border-0 hover:text-black p-2 rounded-md"
          @click="logout"
        >
          <LogOut />
          Sair
        </button>
      </div>
    </SidebarContent>
  </Sidebar>
</template>