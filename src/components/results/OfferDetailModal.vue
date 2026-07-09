<script setup lang="ts">
import Badge from '@/components/ui/Badge.vue'
import Button from '@/components/ui/Button.vue'
import Modal from '@/components/ui/Modal.vue'
import OfferDetail from '@/components/results/OfferDetail.vue'
import type { TFlightOffer } from '@/types/flight'

defineOptions({
  name: 'OfferDetailModal',
})

defineProps<{
  offer: TFlightOffer | null
  open: boolean
}>()

const emit = defineEmits<{
  close: []
}>()
</script>

<template>
  <Modal
    :open="open && Boolean(offer)"
    :title="offer ? `${offer.airline} · ${offer.route}` : 'Flight details'"
    wide
    @close="emit('close')"
  >
    <div v-if="offer" class="space-y-5">
      <div class="rounded-3xl border border-stone-100 bg-stone-50/70 p-4">
        <div class="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div class="flex flex-wrap gap-2">
              <Badge v-for="badge in offer.badges" :key="badge" variant="accent">{{ badge }}</Badge>
              <Badge variant="neutral">{{ offer.stops }}</Badge>
              <Badge variant="success">{{ offer.cabin }}</Badge>
            </div>
            <p class="mt-4 text-2xl font-semibold text-stone-950">{{ offer.route }}</p>
            <p class="mt-1 text-sm text-stone-500">
              {{ offer.departureTime }} to {{ offer.arrivalTime }} · {{ offer.duration }}
            </p>
          </div>

          <div class="text-left sm:text-right">
            <p class="text-3xl font-semibold text-stone-950">{{ offer.price }}</p>
            <p class="text-sm text-stone-500">total fare</p>
          </div>
        </div>
      </div>

      <OfferDetail :offer="offer" />
    </div>

    <template #footer>
      <Button variant="ghost" @click="emit('close')">Close</Button>
      <Button @click="emit('close')">Select fare</Button>
    </template>
  </Modal>
</template>
