<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'

import PlaceAutocomplete from '@/components/search/PlaceAutocomplete.vue'
import Button from '@/components/ui/Button.vue'
import Card from '@/components/ui/Card.vue'
import Input from '@/components/ui/Input.vue'
import Select from '@/components/ui/Select.vue'
import { useSearchStore } from '@/stores/searchStore'
import type { TCabinClass, TSearchFormErrors, TSearchFormValues } from '@/types/flight'
import { getSearchValuesFromQueryParams, updateSearchQueryParams } from '@/utils/searchQueryParams'

defineOptions({
  name: 'SearchForm',
})

const props = withDefaults(
  defineProps<{
    isSearching?: boolean
    searchValues?: TSearchFormValues | null
    suggestionToken: string
  }>(),
  {
    isSearching: false,
    searchValues: null,
    suggestionToken: '',
  },
)

const emit = defineEmits<{
  search: [values: TSearchFormValues]
}>()

const cabinOptions: { label: string; value: TCabinClass | '' }[] = [
  { label: 'Select cabin', value: '' },
  { label: 'Economy', value: 'economy' },
  { label: 'Premium economy', value: 'premium-economy' },
  { label: 'Business', value: 'business' },
  { label: 'First', value: 'first' },
]

const emptySearchValues: TSearchFormValues = {
  origin: '',
  originLabel: '',
  destination: '',
  destinationLabel: '',
  departureDate: '',
  returnDate: '',
  passengers: '',
  cabin: '',
}

const searchStore = useSearchStore()
const initialSearchValues = props.searchValues ?? getSearchValuesFromQueryParams() ?? searchStore.lastSearch

const values = reactive<TSearchFormValues>({
  ...emptySearchValues,
  ...initialSearchValues,
})

const hasSubmitted = ref(false)

const validationErrors = computed<TSearchFormErrors>(() => {
  const errors: TSearchFormErrors = {}

  if (!values.origin.trim()) {
    errors.origin = 'Required'
  }

  if (!values.destination.trim()) {
    errors.destination = 'Required'
  }

  if (
    values.origin.trim() &&
    values.destination.trim() &&
    values.origin.trim().toLowerCase() === values.destination.trim().toLowerCase()
  ) {
    errors.destination = 'Choose a different destination.'
  }

  if (!values.departureDate) {
    errors.departureDate = 'Required'
  }

  if (values.returnDate && values.departureDate && values.returnDate < values.departureDate) {
    errors.returnDate = 'Return date must be after departure.'
  }

  if (!values.passengers || Number(values.passengers) < 1) {
    errors.passengers = 'Required'
  }

  if (!values.cabin) {
    errors.cabin = 'Required'
  }

  return errors
})

const visibleErrors = computed<TSearchFormErrors>(() =>
  hasSubmitted.value ? validationErrors.value : {},
)

const hasErrors = computed(() => Object.keys(validationErrors.value).length > 0)

const normalizeSearchValues = (): TSearchFormValues => ({
  ...values,
  passengers: Number(values.passengers),
})

const applySearchValues = (searchValues: TSearchFormValues) => {
  values.origin = searchValues.origin
  values.originLabel = searchValues.originLabel || searchValues.origin
  values.destination = searchValues.destination
  values.destinationLabel = searchValues.destinationLabel || searchValues.destination
  values.departureDate = searchValues.departureDate
  values.returnDate = searchValues.returnDate
  values.passengers = searchValues.passengers
  values.cabin = searchValues.cabin
}

watch(
  () => props.searchValues,
  (searchValues) => {
    if (searchValues) {
      applySearchValues(searchValues)
    }
  },
)

const submitSearch = () => {
  hasSubmitted.value = true

  if (hasErrors.value) {
    return
  }

  const searchValues = normalizeSearchValues()

  updateSearchQueryParams(searchValues)
  emit('search', searchValues)
}
</script>

<template>
  <Card variant="elevated">
    <form class="space-y-4 p-4 sm:p-5" novalidate @submit.prevent="submitSearch">
      <div>
        <h2 class="text-base font-semibold text-stone-950">
          Search by route, date, passengers, and cabin.
        </h2>
      </div>

      <div
        class="grid gap-3 md:grid-cols-2 lg:grid-cols-[minmax(112px,1fr)_minmax(112px,1fr)_minmax(136px,0.9fr)_minmax(136px,0.9fr)_minmax(104px,0.7fr)_minmax(148px,0.9fr)_auto] lg:items-start"
      >
        <PlaceAutocomplete
          v-model="values.origin"
          v-model:display-value="values.originLabel"
          :error="visibleErrors.origin"
          label="From"
          placeholder="Search origin"
          :token="suggestionToken"
        />

        <PlaceAutocomplete
          v-model="values.destination"
          v-model:display-value="values.destinationLabel"
          :error="visibleErrors.destination"
          label="To"
          placeholder="Search destination"
          :token="suggestionToken"
        />

        <Input
          v-model="values.departureDate"
          :error="visibleErrors.departureDate"
          label="Departure"
          type="date"
        />

        <Input
          v-model="values.returnDate"
          :error="visibleErrors.returnDate"
          hint="Optional"
          label="Return"
          type="date"
        />

        <Input
          v-model="values.passengers"
          :error="visibleErrors.passengers"
          label="Passengers"
          min="1"
          type="number"
        />

        <Select
          v-model="values.cabin"
          :error="visibleErrors.cabin"
          label="Cabin"
          :options="cabinOptions"
        />

        <div class="flex lg:pt-6">
          <Button
            class="w-full whitespace-nowrap lg:w-auto"
            :disabled="isSearching || (hasSubmitted && hasErrors)"
            type="submit"
          >
            {{ isSearching ? 'Searching...' : 'Search flights' }}
          </Button>
        </div>
      </div>
    </form>
  </Card>
</template>
