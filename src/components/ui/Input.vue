<script setup lang="ts">
import { uiClasses } from '@/styles/ui.classes'

defineOptions({
  name: 'UiInput',
  inheritAttrs: false,
})

withDefaults(
  defineProps<{
    label: string
    hint?: string
    type?: string
  }>(),
  {
    hint: undefined,
    type: 'text',
  },
)

const model = defineModel<string | number>()
</script>

<template>
  <label :class="uiClasses.input.group">
    <span :class="uiClasses.input.label">{{ label }}</span>
    <input v-model="model" :class="uiClasses.input.field" :type="type" v-bind="$attrs" />
    <span v-if="hint" :class="uiClasses.input.hint">{{ hint }}</span>
  </label>
</template>
