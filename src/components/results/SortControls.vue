<script setup lang="ts">
import FilterChip from '@/components/ui/FilterChip.vue'
import type { TSortOption } from '@/types/flight'

defineOptions({
  name: 'SortControls',
})

defineProps<{
  activeSort: TSortOption
}>()

const sortOptions: { label: string; value: TSortOption }[] = [
  { label: 'Price', value: 'price' },
  { label: 'Duration', value: 'duration' },
  { label: 'Departure', value: 'departure' },
]
</script>

<template>
  <div class="flex flex-col gap-2">
    <!-- <p class="text-xs font-semibold uppercase tracking-[0.14em] text-stone-500">Sort by</p> -->
    <div class="flex flex-wrap gap-2">
      <FilterChip
        v-for="option in sortOptions"
        :key="option.value"
        :active="activeSort === option.value"
      >
        {{ option.label }}
      </FilterChip>
    </div>
  </div>
</template>
