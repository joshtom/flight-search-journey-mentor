<script setup lang="ts">
import { uiClasses } from '@/styles/ui.classes'

defineOptions({
  name: 'UiInput',
  inheritAttrs: false,
})

withDefaults(
  defineProps<{
    label: string
    error?: string
    hint?: string
    type?: string
  }>(),
  {
    error: undefined,
    hint: undefined,
    type: 'text',
  },
)

const model = defineModel<string | number>()
</script>

<template>
  <label :class="uiClasses.input.group">
    <span :class="uiClasses.input.label">{{ label }}</span>
    <input
      v-model="model"
      :aria-invalid="Boolean(error)"
      :class="error ? uiClasses.input.invalidField : uiClasses.input.field"
      :type="type"
      v-bind="$attrs"
    />
    <span v-if="error" :class="uiClasses.input.error">{{ error }}</span>
    <span v-else-if="hint" :class="uiClasses.input.hint">{{ hint }}</span>
  </label>
</template>
