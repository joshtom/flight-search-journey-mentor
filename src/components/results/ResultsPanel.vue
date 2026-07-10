<script setup lang="ts">
import { computed, ref, watch } from 'vue'

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
    departureDate?: string
    routeLabel?: string
  }>(),
  {
    isLoading: false,
    errorMessage: null,
    hasSearched: false,
    departureDate: '',
    routeLabel: '',
  },
)

const emit = defineEmits<{
  selectDepartureDate: [date: string]
}>()

const activeSort = ref<TSortOption>('price')
const dateWindowOffset = ref(0)
const selectedOfferId = ref<string | null>(null)

const dateFormatter = new Intl.DateTimeFormat('en', {
  month: 'short',
  day: 'numeric',
})

const weekdayFormatter = new Intl.DateTimeFormat('en', {
  weekday: 'short',
})

const toIsoDate = (date: Date) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

const getDateFromIsoDate = (value: string) => {
  const [year, month, day] = value.split('-').map(Number)

  if (!year || !month || !day) {
    return null
  }

  return new Date(year, month - 1, day)
}

const getToday = () => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  return today
}

const getWindowStart = () => {
  if (!props.departureDate) {
    return null
  }

  const activeDate = getDateFromIsoDate(props.departureDate)

  if (!activeDate) {
    return null
  }

  const windowStart = new Date(activeDate)
  windowStart.setDate(activeDate.getDate() + dateWindowOffset.value)

  const today = getToday()

  if (windowStart < today) {
    windowStart.setTime(today.getTime())
  }

  return windowStart
}

const dateWindowStart = computed(() => getWindowStart())

const canShowPreviousDates = computed(() => {
  const windowStart = dateWindowStart.value

  return Boolean(windowStart && windowStart > getToday())
})

const dateWindowDays = computed<TDateWindowDay[]>(() => {
  const windowStart = dateWindowStart.value

  if (!windowStart) {
    return []
  }

  return Array.from({ length: 4 }, (_, index) => {
    const date = new Date(windowStart)
    date.setDate(windowStart.getDate() + index)
    const value = toIsoDate(date)

    return {
      label: weekdayFormatter.format(date),
      date: dateFormatter.format(date),
      value,
      active: value === props.departureDate,
    }
  })
})

watch(
  () => props.departureDate,
  () => {
    dateWindowOffset.value = 0
  },
)

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

const selectDepartureDate = (date: string) => {
  if (date === props.departureDate) {
    return
  }

  emit('selectDepartureDate', date)
}

const shiftDateWindow = (direction: 'next' | 'previous') => {
  const activeDate = getDateFromIsoDate(props.departureDate)

  if (!activeDate) {
    return
  }

  const nextOffset = dateWindowOffset.value + (direction === 'next' ? 4 : -4)
  const nextWindowStart = new Date(activeDate)
  nextWindowStart.setDate(activeDate.getDate() + nextOffset)

  if (nextWindowStart < getToday()) {
    const today = getToday()
    const millisecondsPerDay = 24 * 60 * 60 * 1000
    dateWindowOffset.value = Math.ceil(
      (today.getTime() - activeDate.getTime()) / millisecondsPerDay,
    )
    return
  }

  dateWindowOffset.value = nextOffset
}
</script>

<template>
  <section aria-label="Flight results">
    <div class="flex flex-col gap-4">
      <DateWindow
        v-if="hasSearched && offers.length && dateWindowDays.length"
        :days="dateWindowDays"
        :can-show-previous="canShowPreviousDates"
        @next="shiftDateWindow('next')"
        @previous="shiftDateWindow('previous')"
        @select="selectDepartureDate"
      />

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
