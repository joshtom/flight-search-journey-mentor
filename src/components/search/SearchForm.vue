<script setup lang="ts">
import { computed, reactive, ref } from 'vue'

import Button from '@/components/ui/Button.vue'
import Card from '@/components/ui/Card.vue'
import Input from '@/components/ui/Input.vue'
import Select from '@/components/ui/Select.vue'
import { useSearchStore } from '@/stores/searchStore'
import type { TCabinClass, TSearchFormErrors, TSearchFormValues } from '@/types/flight'

defineOptions({
  name: 'SearchForm',
})

const cabinOptions: { label: string; value: TCabinClass | '' }[] = [
  { label: 'Select cabin', value: '' },
  { label: 'Economy', value: 'economy' },
  { label: 'Premium economy', value: 'premium-economy' },
  { label: 'Business', value: 'business' },
  { label: 'First', value: 'first' },
]

const searchQueryParams: { key: keyof TSearchFormValues; param: string }[] = [
  { key: 'origin', param: 'from' },
  { key: 'destination', param: 'to' },
  { key: 'departureDate', param: 'departure' },
  { key: 'returnDate', param: 'return' },
  { key: 'passengers', param: 'passengers' },
  { key: 'cabin', param: 'cabin' },
]

const emptySearchValues: TSearchFormValues = {
  origin: '',
  destination: '',
  departureDate: '',
  returnDate: '',
  passengers: '',
  cabin: '',
}

const searchStore = useSearchStore()

const values = reactive<TSearchFormValues>({
  ...emptySearchValues,
  ...searchStore.lastSearch,
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

const updateQueryParams = () => {
  const url = new URL(window.location.href)

  searchQueryParams.forEach(({ key, param }) => {
    const value = values[key]

    if (value === '' || value === undefined) {
      url.searchParams.delete(param)
      return
    }

    url.searchParams.set(param, String(value))
  })

  window.history.replaceState(window.history.state, '', `${url.pathname}${url.search}${url.hash}`)
}

const normalizeSearchValues = (): TSearchFormValues => ({
  ...values,
  passengers: Number(values.passengers),
})

const submitSearch = () => {
  hasSubmitted.value = true

  if (hasErrors.value) {
    return
  }

  searchStore.saveSearch(normalizeSearchValues())
  updateQueryParams()
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
        <Input
          v-model="values.origin"
          :error="visibleErrors.origin"
          label="From"
          placeholder="Origin"
        />

        <Input
          v-model="values.destination"
          :error="visibleErrors.destination"
          label="To"
          placeholder="Destination"
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
            :disabled="hasSubmitted && hasErrors"
            type="submit"
          >
            Search flights
          </Button>
        </div>
      </div>
    </form>
  </Card>
</template>
