<script setup lang="ts">
import { ref } from 'vue'

import FilterIcon from '@/components/icons/FilterIcon.vue'
import Button from '@/components/ui/Button.vue'
import FilterChip from '@/components/ui/FilterChip.vue'
import Input from '@/components/ui/Input.vue'
import Modal from '@/components/ui/Modal.vue'
import type { TStopFilter } from '@/types/flight'

defineOptions({
  name: 'FlightFilters',
})

defineProps<{
  activeStop: TStopFilter
}>()

const isFilterModalOpen = ref(false)

const stopOptions: { label: string; value: TStopFilter }[] = [
  { label: 'Nonstop', value: 'nonstop' },
  { label: '1 stop', value: 'one-stop' },
  { label: '2+ stops', value: 'two-plus' },
]

const quickFilters = ['Nonstop', 'Under $900', '1 checked bag', 'Evening departure', 'Economy']
</script>

<template>
  <section class="p-0">
    <div class="flex gap-2 overflow-x-auto pb-1">
      <Button
        aria-label="Open filters"
        class="shrink-0 gap-2 border-stone-300"
        variant="secondary"
        @click="isFilterModalOpen = true"
      >
        <FilterIcon />
        <span>Filters</span>
      </Button>

      <span class="hidden min-h-10 w-px shrink-0 bg-stone-200 sm:block"></span>

      <FilterChip v-for="filter in quickFilters" :key="filter">
        {{ filter }}
      </FilterChip>
    </div>
  </section>

  <Modal :open="isFilterModalOpen" title="Filters" @close="isFilterModalOpen = false">
    <div class="space-y-8">
      <section>
        <h3 class="text-xl font-semibold text-stone-950">Recommended for this route</h3>
        <div class="mt-4 flex flex-wrap gap-2">
          <FilterChip v-for="filter in quickFilters.slice(0, 4)" :key="filter">
            {{ filter }}
          </FilterChip>
        </div>
      </section>

      <section class="border-t border-stone-100 pt-6">
        <h3 class="text-xl font-semibold text-stone-950">Stops</h3>
        <div class="mt-4 flex flex-wrap gap-2">
          <FilterChip
            v-for="option in stopOptions"
            :key="option.value"
            :active="activeStop === option.value"
          >
            {{ option.label }}
          </FilterChip>
        </div>
      </section>

      <section class="border-t border-stone-100 pt-6">
        <h3 class="text-xl font-semibold text-stone-950">Price range</h3>
        <div class="mt-4 grid gap-3 sm:grid-cols-2">
          <Input label="Minimum" placeholder="$500" type="text" />
          <Input label="Maximum" placeholder="$1,200" type="text" />
        </div>
      </section>

      <section class="border-t border-stone-100 pt-6">
        <h3 class="text-xl font-semibold text-stone-950">Airline</h3>
        <div class="mt-4 flex flex-wrap gap-2">
          <FilterChip active>All airlines</FilterChip>
          <FilterChip>Virgin Atlantic</FilterChip>
          <FilterChip>British Airways</FilterChip>
        </div>
      </section>
    </div>

    <template #footer>
      <Button variant="ghost" @click="isFilterModalOpen = false">Clear all</Button>
      <Button @click="isFilterModalOpen = false">Show flights</Button>
    </template>
  </Modal>
</template>
