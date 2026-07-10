<script setup lang="ts">
import { computed } from 'vue'

import { uiClasses } from '@/styles/ui.classes'

type TButtonVariant = 'primary' | 'secondary' | 'ghost'
type TButtonType = 'button' | 'submit' | 'reset'

defineOptions({
  name: 'UiButton',
})

const props = withDefaults(
  defineProps<{
    variant?: TButtonVariant
    type?: TButtonType
  }>(),
  {
    variant: 'primary',
    type: 'button',
  },
)

const buttonClass = computed(() => uiClasses.button[props.variant])
</script>

<template>
  <button :class="buttonClass" :type="type" v-bind="$attrs">
    <slot />
  </button>
</template>
