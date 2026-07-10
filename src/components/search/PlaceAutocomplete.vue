<script setup lang="ts">
import { computed, ref, watch } from 'vue'

import { usePlaceSuggestions } from '@/composables/placeSuggestions/usePlaceSuggestions'
import type { TPlaceSuggestionOption } from '@/services/placeSuggestions/types'
import { uiClasses } from '@/styles/ui.classes'

defineOptions({
  name: 'PlaceAutocomplete',
})

const props = withDefaults(
  defineProps<{
    label: string
    token: string
    error?: string
    placeholder?: string
  }>(),
  {
    error: undefined,
    placeholder: 'Search city or airport',
  },
)

const model = defineModel<string>({ required: true })
const displayValue = defineModel<string>('displayValue', { required: true })
const { clearSuggestions, isPending, searchPlaces, suggestions } = usePlaceSuggestions(props.token)
const isOpen = ref(false)
const debounceTimer = ref<ReturnType<typeof setTimeout> | null>(null)

const fieldClass = computed(() =>
  props.error ? uiClasses.input.invalidField : uiClasses.input.field,
)

const showSuggestions = computed(
  () => isOpen.value && (suggestions.value.length > 0 || isPending.value),
)

const getSuggestionLabel = (suggestion: TPlaceSuggestionOption) =>
  [suggestion.name, suggestion.cityName !== suggestion.name ? suggestion.cityName : null]
    .filter(Boolean)
    .join(', ')

watch(
  () => model.value,
  (value) => {
    if (!displayValue.value && value) {
      displayValue.value = value
    }
  },
)

const queueSearch = (value: string) => {
  if (debounceTimer.value) {
    clearTimeout(debounceTimer.value)
  }

  debounceTimer.value = setTimeout(() => {
    void searchPlaces(value)
  }, 250)
}

const handleInput = () => {
  model.value = ''
  isOpen.value = true
  queueSearch(displayValue.value)
}

const selectSuggestion = (suggestion: TPlaceSuggestionOption) => {
  model.value = suggestion.code
  displayValue.value = getSuggestionLabel(suggestion)
  clearSuggestions()
  isOpen.value = false
}

const closeSuggestions = () => {
  window.setTimeout(() => {
    isOpen.value = false
  }, 120)
}
</script>

<template>
  <label :class="[uiClasses.input.group, 'relative']">
    <span :class="uiClasses.input.label">{{ label }}</span>
    <input
      v-model="displayValue"
      :aria-expanded="showSuggestions"
      :aria-invalid="Boolean(error)"
      autocomplete="off"
      :class="fieldClass"
      :placeholder="placeholder"
      type="text"
      @blur="closeSuggestions"
      @focus="
        () => {
          isOpen = true
          queueSearch(displayValue)
        }
      "
      @input="handleInput"
    />

    <div
      v-if="showSuggestions"
      class="absolute left-0 top-[calc(100%+0.5rem)] z-40 max-h-72 w-[min(92vw,28rem)] overflow-y-auto rounded-2xl border border-stone-200 bg-white shadow-[0_18px_50px_rgba(28,25,23,0.14)]"
    >
      <div v-if="isPending" class="px-4 py-3 text-sm font-medium text-stone-500">
        Searching places...
      </div>

      <button
        v-for="suggestion in suggestions"
        :key="suggestion.id"
        class="flex w-full items-start justify-between gap-4 px-4 py-3 text-left transition hover:bg-stone-50 focus-visible:bg-stone-50 focus-visible:outline-none"
        type="button"
        @mousedown.prevent="selectSuggestion(suggestion)"
      >
        <span>
          <span class="block text-sm font-semibold text-stone-950">{{ suggestion.name }}</span>
          <span class="block text-xs text-stone-500">
            {{ suggestion.cityName }}
            <span v-if="suggestion.countryCode">, {{ suggestion.countryCode }}</span>
          </span>
        </span>
        <span class="rounded-full bg-stone-100 px-3 py-1 text-xs font-semibold text-stone-700">
          {{ suggestion.code }}
        </span>
      </button>
    </div>

    <span v-if="error" :class="uiClasses.input.error">{{ error }}</span>
  </label>
</template>
