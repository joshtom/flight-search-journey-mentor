<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'

import FlightFilters from './filters/FlightFilters.vue'
import ResultsPanel from './results/ResultsPanel.vue'
import SearchForm from './search/SearchForm.vue'
import Hero from './ui/Hero.vue'
import { useFlightSearch } from '@/composables/offerRequests/useFlightSearch'
import { mapDuffelOffersToFlightOffers } from '@/services/offerRequests/offerMappers'
import { useSearchStore } from '@/stores/searchStore'
import { uiClasses } from '@/styles/ui.classes'
import type { TFlightFilters, TSearchFormValues } from '@/types/flight'
import { getSearchValuesFromQueryParams } from '@/utils/searchQueryParams'

defineOptions({
  name: 'MainView',
})

const filters = ref<TFlightFilters>({
  stop: 'any',
  minPrice: '',
  maxPrice: '',
  checkedBagOnly: false,
  departureWindow: 'any',
  cabin: 'any',
})
const hasSearched = ref(false)
const duffelAccessToken = import.meta.env.VITE_API_FLIGHT_SEARCH ?? ''
const searchStore = useSearchStore()
const initialSearchValues = getSearchValuesFromQueryParams() ?? searchStore.lastSearch
const currentSearchValues = ref<TSearchFormValues | null>(initialSearchValues)
const {
  data: offerRequestResponse,
  error: offerRequestError,
  isPending,
  searchFlights,
} = useFlightSearch(duffelAccessToken)

const flightOffers = computed(() =>
  mapDuffelOffersToFlightOffers(offerRequestResponse.value?.data.offers ?? []),
)

const routeLabel = computed(() => {
  const search = currentSearchValues.value

  if (!search) {
    return ''
  }

  return `${search.origin.toString().toUpperCase()} to ${search.destination
    .toString()
    .toUpperCase()}`
})

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
  currentSearchValues.value = values

  if (!duffelAccessToken) {
    return
  }

  try {
    await searchFlights(values)
    searchStore.saveSuccessfulSearch(values)
  } catch {
    return
  }
}

onMounted(() => {
  if (!initialSearchValues) {
    return
  }

  void handleSearch(initialSearchValues)
})
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
        <FlightFilters v-model:filters="filters" />
      </section>

      <ResultsPanel
        :error-message="resultErrorMessage"
        :has-searched="hasSearched"
        :is-loading="isPending"
        :filters="filters"
        :offers="flightOffers"
        :route-label="routeLabel"
      />
    </main>
  </div>
</template>
