<script setup lang="ts">
import {
  DoorClosed,
  GraduationCap,
  ShieldUser,
  User,
  Bell,
} from "lucide-vue-next";
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
  useSidebar,
} from "@/components/ui/sidebar";
import { useRoute } from "vue-router";
import { parseJwt } from "@/utils/user-utils.js";
import { ref } from "vue";
import { getUserName } from "@/utils/user-utils.js";

const route = useRoute();

const isSidebarCollapsed = ref(false);

const { printScheduleBol } = useSidebar();

const userRoles = ref<string[]>([]);

let token = localStorage.getItem("token");
const decodedToken = parseJwt(token);
userRoles.value =
  decodedToken["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];

const username = ref("");
username.value = getUserName();

const items = [
  {
    title: "Cursos",
    url: "/cursos",
    icon: GraduationCap,
    role: null,
  },
  {
    title: "Salas",
    url: "/salas",
    icon: DoorClosed,
    role: null,
  },
  {
    title: "Notificações",
    url: "/notificacoes",
    icon: Bell,
    role: ["Admistrador", "Comissão de Horários", "Diretor/a"],
  },
  {
    title: "Espaço Admin",
    url: "/admin",
    icon: ShieldUser,
    role: "Admistrador", 
  },
].filter((item) => {
  if (!item.role) return true;

  // Garante que role é array
  const requiredRoles = Array.isArray(item.role) ? item.role : [item.role];
  return requiredRoles.some((r) => userRoles.value.includes(r));
});
</script>

<template>
  <Sidebar v-if="printScheduleBol == false" collapsible="icon">
    <SidebarTrigger />
    <SidebarContent class="bg-iptGreen flex flex-col h-full">
      <aside
        data-sidebar
        :class="[
          'transition-[width] duration-200 ease-in-out bg-gray-800 text-white',
          isSidebarCollapsed ? 'w-[70px]' : 'w-[240px]',
        ]"
      ></aside>
      <SidebarHeader />
      <div>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem
                v-for="item in items"
                :key="item.title"
                :class="{
                  'active-menu-item':
                    route.path.includes(
                      item.url.substring(0, item.url.length - 1)
                    ) ||
                    (route.path.includes('/turma') && item.url === 'cursos'),
                  'my-1 mt-3': true,
                }"
              >
                <SidebarMenuButton asChild>
                  <a
                    :href="item.url"
                    class="text-white flex items-center gap-2"
                  >
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

    <div class="flex gap-4 mx-3 my-2 mb-3 items-center">
      <div
        class="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center"
      >
        <User class="w-6 h-6 text-black" />
      </div>
      <p class="text-white font-semibold truncate" v-show="!isSidebarCollapsed">
        {{ username }}
      </p>
    </div>
    <SidebarFooter />
  </Sidebar>
</template>
