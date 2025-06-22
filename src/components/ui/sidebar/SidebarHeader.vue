<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'

const props = defineProps<{
  class?: HTMLAttributes['class']
}>()

const isCollapsed = ref(false)

onMounted(() => {
  const sidebar = document.querySelector('[data-sidebar]')
  if (!sidebar) return

  const updateState = () => {
    const width = sidebar.clientWidth
    isCollapsed.value = width < 100
  }

  updateState()

  sidebar.addEventListener('transitionend', (e) => {
    const event = e as TransitionEvent
    if (event.propertyName === 'width') {
      updateState()
    }
  })
})
</script>

<template>
  <div
    data-sidebar="header"
    :class="cn('flex justify-center items-center p-2 pt-3 mb-0 pb-0', props.class)"
  >
    <div class="relative flex items-center justify-center w-[215px] h-[80px]">
      <img
        src="/logo_ipt-big.png"
        alt="IPT"
        class="absolute transition-all duration-200 ease-in-out bg-white rounded-sm p-3 w-[215px]"
        :class="isCollapsed ? 'opacity-0 scale-95 pointer-events-none' : 'opacity-100 scale-100'"
      />

      <img
        src="/logo_ipt-small.png"
        alt="IPT"
        class="absolute transition-all duration-200 ease-in-out bg-white rounded-sm p-1 w-[48px]"
        :class="isCollapsed ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'"
      />
    </div>
  </div>
</template>