<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { reactiveOmit } from '@vueuse/core'
import { ToastViewport, type ToastViewportProps } from 'reka-ui'
import { cn } from '@/lib/utils'

const props = defineProps<ToastViewportProps & { class?: HTMLAttributes['class'] }>()

const delegatedProps = reactiveOmit(props, 'class')
</script>

<template>
  <ToastViewport
    v-bind="delegatedProps"
    :class="cn(
      'fixed top-4 right-4 z-50 flex flex-col gap-2',
      props.class
    )"
  />
</template>