<script setup lang="ts">
import { computed } from 'vue'

import Badge from '@/components/ui/Badge.vue'
import Button from '@/components/ui/Button.vue'
import { uiClasses } from '@/styles/ui.classes'
import type { TFlightOffer } from '@/types/flight'

defineOptions({
  name: 'ResultCard',
})

const props = defineProps<{
  offer: TFlightOffer
}>()

const emit = defineEmits<{
  select: [id: string]
}>()

const stopLabel = computed(() => (props.offer.stopCount === 0 ? 'Nonstop' : props.offer.stops))
</script>

<template>
  <article
    :class="[uiClasses.resultCard.base, 'flex min-h-full cursor-pointer flex-col']"
    role="button"
    tabindex="0"
    @click="emit('select', offer.id)"
    @keydown.enter="emit('select', offer.id)"
    @keydown.space.prevent="emit('select', offer.id)"
  >
    <div class="flex flex-col gap-4">
      <div>
        <div class="flex flex-wrap gap-2">
          <Badge v-for="badge in offer.badges" :key="badge" variant="accent">{{ badge }}</Badge>
          <Badge variant="neutral">{{ stopLabel }}</Badge>
        </div>
        <p :class="[uiClasses.resultCard.route, 'mt-4']">{{ offer.route }}</p>
        <p :class="uiClasses.resultCard.meta">
          {{ offer.airline }} · {{ offer.duration }} · {{ offer.cabin }}
        </p>
      </div>

      <div>
        <p :class="uiClasses.resultCard.price">{{ offer.price }}</p>
        <p class="text-xs text-stone-500">total fare</p>
      </div>
    </div>

    <div class="mt-5 grid gap-3 border-t border-stone-100 pt-5">
      <div>
        <p class="text-lg font-semibold text-stone-950">{{ offer.departureTime }}</p>
        <p class="text-sm text-stone-500">{{ offer.segments[0]?.origin }}</p>
      </div>
      <div class="flex items-center gap-3 text-sm text-stone-500">
        <span class="h-px flex-1 bg-stone-200"></span>
        <span class="shrink-0">{{ offer.stops }}</span>
        <span class="h-px flex-1 bg-stone-200"></span>
      </div>
      <div>
        <p class="text-lg font-semibold text-stone-950">{{ offer.arrivalTime }}</p>
        <p class="text-sm text-stone-500">
          {{ offer.segments[offer.segments.length - 1]?.destination }}
        </p>
      </div>
    </div>

    <div class="mt-auto flex flex-col gap-3 pt-5">
      <p class="text-sm text-stone-500">{{ offer.fare }} · {{ offer.baggage }}</p>
      <Button class="w-full" variant="secondary" @click.stop="emit('select', offer.id)">
        View details
      </Button>
    </div>
  </article>
</template>
