<script setup lang="ts">
import { computed, reactive, ref } from 'vue'

import Button from '@/components/ui/Button.vue'
import Card from '@/components/ui/Card.vue'
import Input from '@/components/ui/Input.vue'
import Select from '@/components/ui/Select.vue'
import type { TCabinClass, TSearchFormErrors, TSearchFormValues } from '@/types/flight'

defineOptions({
  name: 'SearchForm',
})

const cabinOptions: { label: string; value: TCabinClass }[] = [
  { label: 'Economy', value: 'economy' },
  { label: 'Premium economy', value: 'premium-economy' },
  { label: 'Business', value: 'business' },
  { label: 'First', value: 'first' },
]

const values = reactive<TSearchFormValues>({
  origin: 'Lagos',
  destination: 'London',
  departureDate: '2026-08-14',
  returnDate: '',
  passengers: 1,
  cabin: 'economy',
})

const hasSubmitted = ref(false)

const validationErrors = computed<TSearchFormErrors>(() => {
  const errors: TSearchFormErrors = {}

  if (!values.origin.trim()) {
    errors.origin = 'Enter an origin city or airport.'
  }

  if (!values.destination.trim()) {
    errors.destination = 'Enter a destination city or airport.'
  }

  if (values.origin.trim() && values.destination.trim() && values.origin === values.destination) {
    errors.destination = 'Choose a different destination.'
  }

  if (!values.departureDate) {
    errors.departureDate = 'Choose a departure date.'
  }

  if (values.returnDate && values.departureDate && values.returnDate < values.departureDate) {
    errors.returnDate = 'Return date must be after departure.'
  }

  if (!values.passengers || values.passengers < 1) {
    errors.passengers = 'Add at least one passenger.'
  }

  return errors
})

const visibleErrors = computed<TSearchFormErrors>(() =>
  hasSubmitted.value ? validationErrors.value : {},
)

const hasErrors = computed(() => Object.keys(validationErrors.value).length > 0)

const submitSearch = () => {
  hasSubmitted.value = true
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
          placeholder="Lagos"
        />

        <Input
          v-model="values.destination"
          :error="visibleErrors.destination"
          label="To"
          placeholder="London"
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

        <Select v-model="values.cabin" label="Cabin" :options="cabinOptions" />

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
