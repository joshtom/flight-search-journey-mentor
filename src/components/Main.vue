<script setup lang="ts">
import { ref } from 'vue'

import FlightFilters from './filters/FlightFilters.vue'
import ResultsPanel from './results/ResultsPanel.vue'
import SearchForm from './search/SearchForm.vue'
import Hero from './ui/Hero.vue'
import { uiClasses } from '@/styles/ui.classes'
import type { TStopFilter } from '@/types/flight'

defineOptions({
  name: 'MainView',
})

const activeStop = ref<TStopFilter>('nonstop')
</script>

<template>
  <div :class="uiClasses.page.shell">
    <main :class="uiClasses.page.container">
      <Hero
        subtitle="Compare routes, cabin options, and fares in one clear place before your next trip."
        title="Find the right flight with less noise."
      />

      <section class="mx-auto w-full max-w-6xl" aria-label="Flight search">
        <SearchForm />
      </section>

      <section class="mx-auto w-full max-w-6xl" aria-label="Flight filters">
        <FlightFilters :active-stop="activeStop" />
      </section>

      <ResultsPanel />
    </main>
  </div>
</template>
