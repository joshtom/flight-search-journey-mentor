<script setup lang="ts">
import { computed } from 'vue'

import { uiClasses } from '@/styles/ui.classes'

defineOptions({
  name: 'UiFilterChip',
})

const props = withDefaults(
  defineProps<{
    active?: boolean
  }>(),
  {
    active: false,
  },
)

const chipClass = computed(() => [
  uiClasses.filterChip.base,
  props.active ? uiClasses.filterChip.active : uiClasses.filterChip.inactive,
])
</script>

<template>
  <button :class="chipClass" type="button">
    <slot />
  </button>
</template>
