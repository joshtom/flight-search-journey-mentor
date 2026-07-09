<script setup lang="ts">
import { computed, ref } from 'vue'

import DateWindow from '@/components/results/DateWindow.vue'
import OfferDetailModal from '@/components/results/OfferDetailModal.vue'
import ResultCard from '@/components/results/ResultCard.vue'
import SortControls from '@/components/results/SortControls.vue'
import Card from '@/components/ui/Card.vue'
import type { TDateWindowDay, TFlightOffer, TSortOption } from '@/types/flight'

defineOptions({
  name: 'ResultsPanel',
})

const activeSort = ref<TSortOption>('price')
const selectedOfferId = ref<string | null>(null)

const dateWindowDays: TDateWindowDay[] = [
  { label: 'Wed', date: 'Aug 12', price: '$815' },
  { label: 'Thu', date: 'Aug 13', price: '$768' },
  { label: 'Fri', date: 'Aug 14', price: '$742', active: true },
  { label: 'Sat', date: 'Aug 15', price: '$790' },
]

const offers: TFlightOffer[] = [
  {
    id: 'offer-1',
    airline: 'Virgin Atlantic',
    route: 'Lagos to London',
    departureTime: '22:10',
    arrivalTime: '05:55',
    duration: '6h 45m',
    stops: 'Nonstop',
    stopCount: 0,
    price: '$742',
    cabin: 'Economy',
    badges: ['Best value'],
    segments: [
      {
        id: 'seg-1',
        airline: 'Virgin Atlantic',
        flightNumber: 'VS412',
        aircraft: 'Airbus A350',
        origin: 'LOS',
        destination: 'LHR',
        departureTime: '22:10',
        arrivalTime: '05:55',
        duration: '6h 45m',
      },
    ],
    layovers: [],
    fare: 'Standard fare',
    baggage: '1 checked bag included',
  },
  {
    id: 'offer-2',
    airline: 'British Airways',
    route: 'Lagos to London',
    departureTime: '11:40',
    arrivalTime: '21:15',
    duration: '9h 35m',
    stops: '1 stop',
    stopCount: 1,
    price: '$689',
    cabin: 'Economy',
    badges: ['Lowest fare'],
    segments: [
      {
        id: 'seg-2a',
        airline: 'British Airways',
        flightNumber: 'BA74',
        aircraft: 'Boeing 777',
        origin: 'LOS',
        destination: 'DOH',
        departureTime: '11:40',
        arrivalTime: '18:05',
        duration: '6h 25m',
      },
      {
        id: 'seg-2b',
        airline: 'British Airways',
        flightNumber: 'BA122',
        aircraft: 'Airbus A320',
        origin: 'DOH',
        destination: 'LHR',
        departureTime: '19:25',
        arrivalTime: '21:15',
        duration: '1h 50m',
      },
    ],
    layovers: [{ airport: 'Doha', duration: '1h 20m' }],
    fare: 'Saver fare',
    baggage: 'Carry-on included',
  },
  {
    id: 'offer-3',
    airline: 'Qatar Airways',
    route: 'Lagos to London',
    departureTime: '14:35',
    arrivalTime: '06:25',
    duration: '15h 50m',
    stops: '1 stop',
    stopCount: 1,
    price: '$824',
    cabin: 'Economy',
    badges: ['Flexible'],
    segments: [
      {
        id: 'seg-3a',
        airline: 'Qatar Airways',
        flightNumber: 'QR1406',
        aircraft: 'Boeing 787',
        origin: 'LOS',
        destination: 'DOH',
        departureTime: '14:35',
        arrivalTime: '00:10',
        duration: '7h 35m',
      },
      {
        id: 'seg-3b',
        airline: 'Qatar Airways',
        flightNumber: 'QR11',
        aircraft: 'Airbus A380',
        origin: 'DOH',
        destination: 'LHR',
        departureTime: '02:20',
        arrivalTime: '06:25',
        duration: '7h 05m',
      },
    ],
    layovers: [{ airport: 'Doha', duration: '2h 10m' }],
    fare: 'Flex fare',
    baggage: '2 checked bags included',
  },
  {
    id: 'offer-4',
    airline: 'KLM',
    route: 'Lagos to London',
    departureTime: '23:55',
    arrivalTime: '09:40',
    duration: '9h 45m',
    stops: '1 stop',
    stopCount: 1,
    price: '$756',
    cabin: 'Economy',
    badges: ['Late departure'],
    segments: [
      {
        id: 'seg-4a',
        airline: 'KLM',
        flightNumber: 'KL588',
        aircraft: 'Airbus A330',
        origin: 'LOS',
        destination: 'AMS',
        departureTime: '23:55',
        arrivalTime: '06:35',
        duration: '6h 40m',
      },
      {
        id: 'seg-4b',
        airline: 'KLM',
        flightNumber: 'KL1001',
        aircraft: 'Boeing 737',
        origin: 'AMS',
        destination: 'LHR',
        departureTime: '08:25',
        arrivalTime: '09:40',
        duration: '1h 15m',
      },
    ],
    layovers: [{ airport: 'Amsterdam', duration: '1h 50m' }],
    fare: 'Standard fare',
    baggage: '1 checked bag included',
  },
]

const selectedOffer = computed(
  () => offers.find((offer) => offer.id === selectedOfferId.value) ?? null,
)

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
      <DateWindow :days="dateWindowDays" />

      <Card>
        <div class="space-y-5 p-4 sm:p-6">
          <div class="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <h2 class="text-xl font-semibold text-stone-950">Recommended flights</h2>
              <p class="mt-1 text-sm text-stone-500">
                {{ offers.length }} offers for Lagos to London
              </p>
            </div>
            <SortControls :active-sort="activeSort" />
          </div>

          <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <ResultCard
              v-for="offer in offers"
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
