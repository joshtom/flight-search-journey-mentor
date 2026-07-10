<script setup lang="ts">
import { computed, ref } from 'vue'

import DateWindow from '@/components/results/DateWindow.vue'
import OfferDetailModal from '@/components/results/OfferDetailModal.vue'
import ResultCard from '@/components/results/ResultCard.vue'
import SortControls from '@/components/results/SortControls.vue'
import Card from '@/components/ui/Card.vue'
import StateMessage from '@/components/ui/StateMessage.vue'
import type { TDateWindowDay, TFlightFilters, TFlightOffer, TSortOption } from '@/types/flight'

defineOptions({
  name: 'ResultsPanel',
})

const props = withDefaults(
  defineProps<{
    offers: TFlightOffer[]
    filters: TFlightFilters
    isLoading?: boolean
    errorMessage?: string | null
    hasSearched?: boolean
    routeLabel?: string
  }>(),
  {
    isLoading: false,
    errorMessage: null,
    hasSearched: false,
    routeLabel: '',
  },
)

const activeSort = ref<TSortOption>('price')
const selectedOfferId = ref<string | null>(null)

const dateWindowDays: TDateWindowDay[] = [
  { label: 'Wed', date: 'Aug 12', price: '$815' },
  { label: 'Thu', date: 'Aug 13', price: '$768' },
  { label: 'Fri', date: 'Aug 14', price: '$742', active: true },
  { label: 'Sat', date: 'Aug 15', price: '$790' },
]

const getPriceValue = (offer: TFlightOffer) => Number(offer.price.replace(/[^\d.]/g, ''))

const getDurationValue = (offer: TFlightOffer) => {
  const hours = offer.duration.match(/(\d+)h/)?.[1] ?? 0
  const minutes = offer.duration.match(/(\d+)m/)?.[1] ?? 0

  return Number(hours) * 60 + Number(minutes)
}

const getDepartureHour = (offer: TFlightOffer) => {
  const [hour = '0'] = offer.departureTime.split(':')

  return Number(hour)
}

const matchesStopFilter = (offer: TFlightOffer) => {
  if (props.filters.stop === 'nonstop') {
    return offer.stopCount === 0
  }

  if (props.filters.stop === 'one-stop') {
    return offer.stopCount === 1
  }

  if (props.filters.stop === 'two-plus') {
    return offer.stopCount >= 2
  }

  return true
}

const matchesCabinFilter = (offer: TFlightOffer) => {
  if (props.filters.cabin === 'any') {
    return true
  }

  const offerCabin = offer.cabin.toLowerCase()
  const filterCabin = props.filters.cabin.replace('-', ' ')

  return offerCabin.includes(filterCabin)
}

const matchesPriceFilter = (offer: TFlightOffer) => {
  const price = getPriceValue(offer)
  const minPrice = props.filters.minPrice === '' ? null : Number(props.filters.minPrice)
  const maxPrice = props.filters.maxPrice === '' ? null : Number(props.filters.maxPrice)

  if (minPrice !== null && price < minPrice) {
    return false
  }

  if (maxPrice !== null && price > maxPrice) {
    return false
  }

  return true
}

const filteredOffers = computed(() =>
  props.offers.filter((offer) => {
    if (!matchesStopFilter(offer)) {
      return false
    }

    if (!matchesPriceFilter(offer)) {
      return false
    }

    if (props.filters.checkedBagOnly && !offer.baggage.toLowerCase().includes('checked')) {
      return false
    }

    if (props.filters.departureWindow === 'evening') {
      const departureHour = getDepartureHour(offer)

      if (!Number.isFinite(departureHour) || departureHour < 18) {
        return false
      }
    }

    return matchesCabinFilter(offer)
  }),
)

const sortedOffers = computed(() => {
  const offers = [...filteredOffers.value]

  if (activeSort.value === 'duration') {
    return offers.sort((first, second) => getDurationValue(first) - getDurationValue(second))
  }

  if (activeSort.value === 'departure') {
    return offers.sort((first, second) => first.departureTime.localeCompare(second.departureTime))
  }

  return offers.sort((first, second) => getPriceValue(first) - getPriceValue(second))
})

const selectedOffer = computed(
  () => props.offers.find((offer) => offer.id === selectedOfferId.value) ?? null,
)

const resultSummary = computed(() => {
  if (!props.hasSearched) {
    return 'Enter destination to see live offers.'
  }

  if (props.isLoading) {
    return 'Searching live offers.'
  }

  if (props.errorMessage) {
    return 'Unable to load offers.'
  }

  return `${filteredOffers.value.length} offers${props.routeLabel ? ` for ${props.routeLabel}` : ''}`
})

const openOfferDetails = (offerId: string) => {
  selectedOfferId.value = offerId
}

const closeOfferDetails = () => {
  selectedOfferId.value = null
}
</script>

<template>
  <section aria-label="Flight results">
    <div class="flex flex-col gap-4">
      <DateWindow v-if="hasSearched && offers.length" :days="dateWindowDays" />

      <Card>
        <div class="space-y-5 p-4 sm:p-6">
          <div class="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <h2 class="text-xl font-semibold text-stone-950">Recommended flights</h2>
              <p class="mt-1 text-sm text-stone-500">
                {{ resultSummary }}
              </p>
            </div>
            <SortControls v-if="sortedOffers.length" v-model:active-sort="activeSort" />
          </div>

          <StateMessage v-if="isLoading" variant="loading">
            Searching for matching flight offers.
          </StateMessage>

          <StateMessage v-else-if="errorMessage" variant="error">
            {{ errorMessage }}
          </StateMessage>

          <StateMessage v-else-if="!hasSearched" variant="empty">
            Search with your destination to load live offers.
          </StateMessage>

          <StateMessage v-else-if="!sortedOffers.length" variant="empty">
            No offers matched this search. Try another filter, route, date, or cabin.
          </StateMessage>

          <div v-else class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <ResultCard
              v-for="offer in sortedOffers"
              :key="offer.id"
              :offer="offer"
              @select="openOfferDetails"
            />
          </div>
        </div>
      </Card>

    </div>

    <OfferDetailModal
      :offer="selectedOffer"
      :open="Boolean(selectedOffer)"
      @close="closeOfferDetails"
    />
  </section>
</template>
