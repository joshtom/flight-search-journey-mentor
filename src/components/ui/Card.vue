<script setup lang="ts">
import { computed } from 'vue'

import { uiClasses } from '@/styles/ui.classes'

type TCardVariant = 'base' | 'elevated' | 'compact'

defineOptions({
  name: 'UiCard',
})

const props = withDefaults(
  defineProps<{
    variant?: TCardVariant
  }>(),
  {
    variant: 'base',
  },
)

const cardClass = computed(() => uiClasses.card[props.variant])
</script>

<template>
  <div :class="cardClass">
    <slot />
  </div>
</template>
