<script setup lang="ts">
import Badge from '@/components/ui/Badge.vue'
import type { TFlightOffer } from '@/types/flight'

defineOptions({
  name: 'OfferDetail',
})

defineProps<{
  offer: TFlightOffer
}>()
</script>

<template>
  <div>
    <div class="grid gap-4 md:grid-cols-[1.2fr_0.8fr]">
      <div class="space-y-3">
        <h3 class="text-sm font-semibold text-stone-950">Flight segments</h3>
        <div
          v-for="segment in offer.segments"
          :key="segment.id"
          class="rounded-2xl border border-stone-100 bg-stone-50/70 p-4"
        >
          <div class="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p class="text-sm font-semibold text-stone-950">
                {{ segment.origin }} to {{ segment.destination }}
              </p>
              <p class="text-xs leading-5 text-stone-500">
                {{ segment.airline }} {{ segment.flightNumber }} · {{ segment.aircraft }}
              </p>
            </div>
            <p class="text-sm font-semibold text-stone-700">{{ segment.duration }}</p>
          </div>
          <p class="mt-3 text-sm text-stone-600">
            {{ segment.departureTime }} departure · {{ segment.arrivalTime }} arrival
          </p>
        </div>
      </div>

      <div class="space-y-3">
        <h3 class="text-sm font-semibold text-stone-950">Fare details</h3>
        <div class="rounded-2xl border border-stone-100 bg-white p-4">
          <div class="flex flex-wrap gap-2">
            <Badge variant="neutral">{{ offer.fare }}</Badge>
            <Badge variant="success">{{ offer.baggage }}</Badge>
          </div>

          <div v-if="offer.layovers.length" class="mt-4 space-y-2">
            <p class="text-xs font-semibold uppercase tracking-[0.14em] text-stone-500">Layovers</p>
            <p
              v-for="layover in offer.layovers"
              :key="`${layover.airport}-${layover.duration}`"
              class="text-sm text-stone-600"
            >
              {{ layover.airport }} · {{ layover.duration }}
            </p>
          </div>
          <p v-else class="mt-4 text-sm text-stone-600">Nonstop itinerary.</p>
        </div>
      </div>
    </div>
  </div>
</template>
