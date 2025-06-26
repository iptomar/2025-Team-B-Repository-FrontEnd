<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'
import { useRouter } from "vue-router";
import { LogOut } from 'lucide-vue-next'
import { SidebarMenuButton } from '@/components/ui/sidebar'

const logout = () => {
  localStorage.removeItem("token");
  router.push("/");
};

const router = useRouter();

const props = defineProps<{
  class?: HTMLAttributes['class']
}>()
</script>

<template>
  <div
    data-sidebar="footer"
    :class="cn('flex flex-col gap-2 p-2', props.class)"
    class="bg-iptGreen border-t border-white"
  >
    <slot />
    <SidebarMenuButton asChild>
      <button 
        @click="logout"
        class="flex items-center gap-2 w-full text-white bg-iptGreen hover:bg-white border-0 hover:text-black p-2 rounded-md justify-start"
      >
        <LogOut class="shrink-0" />
        <span class="truncate">Sair</span>
      </button>
    </SidebarMenuButton>
  </div>
</template>