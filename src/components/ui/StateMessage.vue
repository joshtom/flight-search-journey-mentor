<script setup lang="ts">
import { computed } from 'vue'

import { uiClasses } from '@/styles/ui.classes'

type TStateMessageVariant = 'loading' | 'empty' | 'error'

defineOptions({
  name: 'UiStateMessage',
})

const props = withDefaults(
  defineProps<{
    variant?: TStateMessageVariant
  }>(),
  {
    variant: 'empty',
  },
)

const stateClass = computed(() => [uiClasses.state.base, uiClasses.state[props.variant]])
</script>

<template>
  <div :class="stateClass">
    <slot />
  </div>
</template>
