<script setup lang="ts">
import type { ListboxGroupProps } from 'reka-ui'
import { reactiveOmit } from '@vueuse/core'
import { ListboxGroup, ListboxGroupLabel, useId } from 'reka-ui'
import { computed, type HTMLAttributes, onMounted, onUnmounted } from 'vue'
import { cn } from '@/lib/utils'
import { provideCommandGroupContext, useCommand } from '.'

const props = defineProps<ListboxGroupProps & {
  class?: HTMLAttributes['class']
  heading?: string
}>()

const delegatedProps = reactiveOmit(props, 'class')

const { allGroups, filterState } = useCommand()
const id = useId()

const isRender = computed(() => !filterState.search ? true : filterState.filtered.groups.has(id))

provideCommandGroupContext({ id })
onMounted(() => {
  if (!allGroups.value.has(id))
    allGroups.value.set(id, new Set())
})
onUnmounted(() => {
  allGroups.value.delete(id)
})
</script>

<template>
  <ListboxGroup
    v-bind="delegatedProps"
    :id="id"
    :class="cn('overflow-hidden p-1 text-zinc-950 [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-zinc-500 dark:text-zinc-50 dark:[&_[cmdk-group-heading]]:text-zinc-400', props.class)"
    :hidden="isRender ? undefined : true"
  >
    <ListboxGroupLabel v-if="heading" class="px-2 py-1.5 text-xs font-medium text-zinc-500 dark:text-zinc-400">
      {{ heading }}
    </ListboxGroupLabel>
    <slot />
  </ListboxGroup>
</template>
