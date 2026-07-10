<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'

import FilterIcon from '@/components/icons/FilterIcon.vue'
import Button from '@/components/ui/Button.vue'
import FilterChip from '@/components/ui/FilterChip.vue'
import Input from '@/components/ui/Input.vue'
import Modal from '@/components/ui/Modal.vue'
import type { TCabinClass, TDepartureWindow, TFlightFilters, TStopFilter } from '@/types/flight'

defineOptions({
  name: 'FlightFilters',
})

const props = defineProps<{
  filters: TFlightFilters
}>()

const emit = defineEmits<{
  'update:filters': [filters: TFlightFilters]
}>()

const isFilterModalOpen = ref(false)

const stopOptions: { label: string; value: TStopFilter }[] = [
  { label: 'Any stops', value: 'any' },
  { label: 'Nonstop', value: 'nonstop' },
  { label: '1 stop', value: 'one-stop' },
  { label: '2+ stops', value: 'two-plus' },
]

const cabinOptions: { label: string; value: TCabinClass | 'any' }[] = [
  { label: 'Any cabin', value: 'any' },
  { label: 'Economy', value: 'economy' },
  { label: 'Premium economy', value: 'premium-economy' },
  { label: 'Business', value: 'business' },
  { label: 'First', value: 'first' },
]

const defaultFilters: TFlightFilters = {
  stop: 'any',
  minPrice: '',
  maxPrice: '',
  checkedBagOnly: false,
  departureWindow: 'any',
  cabin: 'any',
}

const draftFilters = reactive<TFlightFilters>({ ...defaultFilters })

const activeFilterCount = computed(() => {
  const activeFilters = [
    props.filters.stop !== defaultFilters.stop,
    props.filters.minPrice !== defaultFilters.minPrice,
    props.filters.maxPrice !== defaultFilters.maxPrice,
    props.filters.checkedBagOnly !== defaultFilters.checkedBagOnly,
    props.filters.departureWindow !== defaultFilters.departureWindow,
    props.filters.cabin !== defaultFilters.cabin,
  ]

  return activeFilters.filter(Boolean).length
})

const syncDraftFilters = () => {
  Object.assign(draftFilters, props.filters)
}

watch(() => props.filters, syncDraftFilters, { deep: true, immediate: true })

const normalizeFilters = (filters: TFlightFilters): TFlightFilters => ({
  ...filters,
  minPrice: filters.minPrice === '' ? '' : Number(filters.minPrice),
  maxPrice: filters.maxPrice === '' ? '' : Number(filters.maxPrice),
})

const updateFilters = (filters: TFlightFilters) => {
  emit('update:filters', normalizeFilters(filters))
}

const updateDraft = <TKey extends keyof TFlightFilters>(key: TKey, value: TFlightFilters[TKey]) => {
  draftFilters[key] = value
}

const toggleStop = (value: TStopFilter) => {
  updateFilters({
    ...props.filters,
    stop: props.filters.stop === value ? 'any' : value,
  })
}

const toggleMaxPrice = (maxPrice: number) => {
  updateFilters({
    ...props.filters,
    maxPrice: props.filters.maxPrice === maxPrice ? '' : maxPrice,
  })
}

const toggleCheckedBag = () => {
  updateFilters({
    ...props.filters,
    checkedBagOnly: !props.filters.checkedBagOnly,
  })
}

const toggleDepartureWindow = (departureWindow: TDepartureWindow) => {
  updateFilters({
    ...props.filters,
    departureWindow: props.filters.departureWindow === departureWindow ? 'any' : departureWindow,
  })
}

const toggleCabin = (cabin: TCabinClass) => {
  updateFilters({
    ...props.filters,
    cabin: props.filters.cabin === cabin ? 'any' : cabin,
  })
}

const clearFilters = () => {
  updateFilters({ ...defaultFilters })
  isFilterModalOpen.value = false
}

const applyDraftFilters = () => {
  updateFilters({ ...draftFilters })
  isFilterModalOpen.value = false
}
</script>

<template>
  <section class="p-0">
    <div class="flex gap-2 overflow-x-auto pb-1">
      <Button
        :aria-label="
          activeFilterCount ? `Open filters, ${activeFilterCount} active` : 'Open filters'
        "
        class="shrink-0 gap-2 border-stone-300"
        variant="secondary"
        @click="isFilterModalOpen = true"
      >
        <FilterIcon />
        <span>Filters</span>
        <span
          v-if="activeFilterCount"
          class="grid size-5 place-items-center rounded-full bg-stone-950 text-[11px] font-semibold text-white"
        >
          {{ activeFilterCount }}
        </span>
      </Button>

      <span class="hidden min-h-10 w-px shrink-0 bg-stone-200 sm:block"></span>

      <FilterChip :active="filters.stop === 'nonstop'" @click="toggleStop('nonstop')">
        Nonstop
      </FilterChip>
      <FilterChip :active="filters.maxPrice === 900" @click="toggleMaxPrice(900)">
        Under $900
      </FilterChip>
      <FilterChip :active="filters.checkedBagOnly" @click="toggleCheckedBag">
        1 checked bag
      </FilterChip>
      <FilterChip
        :active="filters.departureWindow === 'evening'"
        @click="toggleDepartureWindow('evening')"
      >
        Evening departure
      </FilterChip>
      <FilterChip :active="filters.cabin === 'economy'" @click="toggleCabin('economy')">
        Economy
      </FilterChip>
    </div>
  </section>

  <Modal :open="isFilterModalOpen" title="Filters" @close="isFilterModalOpen = false">
    <div class="space-y-8">
      <section>
        <h3 class="text-xl font-semibold text-stone-950">Recommended for this route</h3>
        <div class="mt-4 flex flex-wrap gap-2">
          <FilterChip
            :active="draftFilters.stop === 'nonstop'"
            @click="updateDraft('stop', draftFilters.stop === 'nonstop' ? 'any' : 'nonstop')"
          >
            Nonstop
          </FilterChip>
          <FilterChip
            :active="draftFilters.maxPrice === 900"
            @click="updateDraft('maxPrice', draftFilters.maxPrice === 900 ? '' : 900)"
          >
            Under $900
          </FilterChip>
          <FilterChip
            :active="draftFilters.checkedBagOnly"
            @click="updateDraft('checkedBagOnly', !draftFilters.checkedBagOnly)"
          >
            1 checked bag
          </FilterChip>
          <FilterChip
            :active="draftFilters.departureWindow === 'evening'"
            @click="
              updateDraft(
                'departureWindow',
                draftFilters.departureWindow === 'evening' ? 'any' : 'evening',
              )
            "
          >
            Evening departure
          </FilterChip>
        </div>
      </section>

      <section class="border-t border-stone-100 pt-6">
        <h3 class="text-xl font-semibold text-stone-950">Stops</h3>
        <div class="mt-4 flex flex-wrap gap-2">
          <FilterChip
            v-for="option in stopOptions"
            :key="option.value"
            :active="draftFilters.stop === option.value"
            @click="updateDraft('stop', option.value)"
          >
            {{ option.label }}
          </FilterChip>
        </div>
      </section>

      <section class="border-t border-stone-100 pt-6">
        <h3 class="text-xl font-semibold text-stone-950">Price range</h3>
        <div class="mt-4 grid gap-3 sm:grid-cols-2">
          <Input
            v-model="draftFilters.minPrice"
            label="Minimum"
            min="0"
            placeholder="$500"
            type="number"
          />
          <Input
            v-model="draftFilters.maxPrice"
            label="Maximum"
            min="0"
            placeholder="$1,200"
            type="number"
          />
        </div>
      </section>

      <section class="border-t border-stone-100 pt-6">
        <h3 class="text-xl font-semibold text-stone-950">Cabin</h3>
        <div class="mt-4 flex flex-wrap gap-2">
          <FilterChip
            v-for="option in cabinOptions"
            :key="option.value"
            :active="draftFilters.cabin === option.value"
            @click="updateDraft('cabin', option.value)"
          >
            {{ option.label }}
          </FilterChip>
        </div>
      </section>
    </div>

    <template #footer>
      <Button variant="ghost" @click="clearFilters">Clear all</Button>
      <Button @click="applyDraftFilters">Show flights</Button>
    </template>
  </Modal>
</template>
