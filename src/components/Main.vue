<script setup lang="ts">
import { computed, ref } from 'vue'

import FlightFilters from './filters/FlightFilters.vue'
import ResultsPanel from './results/ResultsPanel.vue'
import SearchForm from './search/SearchForm.vue'
import Hero from './ui/Hero.vue'
import { useFlightSearch } from '@/composables/offerRequests/useFlightSearch'
import { mapDuffelOffersToFlightOffers } from '@/services/offerRequests/offerMappers'
import { uiClasses } from '@/styles/ui.classes'
import type { TSearchFormValues, TStopFilter } from '@/types/flight'

defineOptions({
  name: 'MainView',
})

const activeStop = ref<TStopFilter>('nonstop')
const hasSearched = ref(false)
const routeLabel = ref('')
const duffelAccessToken = import.meta.env.VITE_API_FLIGHT_SEARCH ?? ''
const {
  data: offerRequestResponse,
  error: offerRequestError,
  isPending,
  searchFlights,
} = useFlightSearch(duffelAccessToken)

const flightOffers = computed(() =>
  mapDuffelOffersToFlightOffers(offerRequestResponse.value?.data.offers ?? []),
)

const resultErrorMessage = computed(() => {
  if (!hasSearched.value) {
    return null
  }

  if (!duffelAccessToken) {
    return 'Add VITE_API_FLIGHT_SEARCH to your environment to search live offers.'
  }

  return offerRequestError.value?.message ?? null
})

const handleSearch = async (values: TSearchFormValues) => {
  hasSearched.value = true
  routeLabel.value = `${values.origin.toString().toUpperCase()} to ${values.destination
    .toString()
    .toUpperCase()}`

  if (!duffelAccessToken) {
    return
  }

  try {
    await searchFlights(values)
  } catch {
    return
  }
}
</script>

<template>
  <div :class="uiClasses.page.shell">
    <main :class="uiClasses.page.container">
      <Hero
        subtitle="Compare routes, cabin options, and fares in one clear place before your next trip."
        title="Find the right flight with less noise."
      />

      <section class="mx-auto w-full max-w-6xl" aria-label="Flight search">
        <SearchForm :is-searching="isPending" @search="handleSearch" />
      </section>

      <section class="mx-auto w-full max-w-6xl" aria-label="Flight filters">
        <FlightFilters :active-stop="activeStop" />
      </section>

      <ResultsPanel
        :error-message="resultErrorMessage"
        :has-searched="hasSearched"
        :is-loading="isPending"
        :offers="flightOffers"
        :route-label="routeLabel"
      />
    </main>
  </div>
</template>
