<script setup lang="ts">
import Button from '@/components/ui/Button.vue'
import type { TDateWindowDay } from '@/types/flight'

defineOptions({
  name: 'DateWindow',
})

defineProps<{
  days: TDateWindowDay[]
}>()
</script>

<template>
  <div class="flex flex-col gap-3 rounded-3xl border border-stone-200 bg-white p-4 shadow-sm">
    <div class="flex items-center justify-between gap-3">
      <div>
        <h2 class="text-sm font-semibold text-stone-950">Nearby dates</h2>
        <p class="text-xs text-stone-500">Shift the departure date window.</p>
      </div>
      <div class="flex gap-2">
        <Button variant="ghost" aria-label="Previous dates">Prev</Button>
        <Button variant="ghost" aria-label="Next dates">Next</Button>
      </div>
    </div>

    <div class="grid grid-cols-2 gap-2 sm:grid-cols-4">
      <button
        v-for="day in days"
        :key="day.date"
        class="rounded-2xl border p-3 text-left transition duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-900 focus-visible:ring-offset-2"
        :class="
          day.active
            ? 'border-stone-950 bg-stone-950 text-white shadow-sm'
            : 'border-stone-200 bg-stone-50 text-stone-700 hover:border-stone-300 hover:bg-white'
        "
        type="button"
      >
        <span class="block text-xs font-semibold uppercase tracking-[0.14em]">{{ day.label }}</span>
        <span class="mt-1 block text-sm">{{ day.date }}</span>
        <span class="mt-2 block text-sm font-semibold">{{ day.price }}</span>
      </button>
    </div>
  </div>
</template>
