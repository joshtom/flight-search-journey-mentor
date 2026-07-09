<script setup lang="ts">
import { uiClasses } from '@/styles/ui.classes'

type TSelectOption = {
  label: string
  value: string
}

defineOptions({
  name: 'UiSelect',
  inheritAttrs: false,
})

defineProps<{
  label: string
  error?: string
  hint?: string
  options: TSelectOption[]
}>()

const model = defineModel<string>()
</script>

<template>
  <label :class="uiClasses.input.group">
    <span :class="uiClasses.input.label">{{ label }}</span>
    <select
      v-model="model"
      :aria-invalid="Boolean(error)"
      :class="error ? uiClasses.input.invalidSelect : uiClasses.input.select"
      v-bind="$attrs"
    >
      <option v-for="option in options" :key="option.value" :value="option.value">
        {{ option.label }}
      </option>
    </select>
    <span v-if="error" :class="uiClasses.input.error">{{ error }}</span>
    <span v-else-if="hint" :class="uiClasses.input.hint">{{ hint }}</span>
  </label>
</template>
