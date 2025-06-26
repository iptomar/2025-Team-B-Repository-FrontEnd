<script setup lang="ts">
import { useRoute } from 'vue-router';
import AppSidebar from '@/components/AppSidebar.vue';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { RouterView } from 'vue-router';

const route = useRoute();
</script>

<template>
  <SidebarProvider>
    <AppSidebar v-if="route.path !== '/'" />
    <main>
      <RouterView />
    </main>
  </SidebarProvider>
</template>
