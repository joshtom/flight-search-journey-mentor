<script setup lang="ts">
import { computed } from 'vue'

import { uiClasses } from '@/styles/ui.classes'

type TBadgeVariant = 'neutral' | 'accent' | 'success' | 'warning'

defineOptions({
  name: 'UiBadge',
})

const props = withDefaults(
  defineProps<{
    variant?: TBadgeVariant
  }>(),
  {
    variant: 'neutral',
  },
)

const badgeClass = computed(() => uiClasses.badge[props.variant])
</script>

<template>
  <span :class="badgeClass">
    <slot />
  </span>
</template>
