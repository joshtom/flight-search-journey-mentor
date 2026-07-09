<script setup lang="ts">
import Badge from './ui/Badge.vue'
import Button from './ui/Button.vue'
import Card from './ui/Card.vue'
import FilterChip from './ui/FilterChip.vue'
import Hero from './ui/Hero.vue'
import Input from './ui/Input.vue'
import Select from './ui/Select.vue'
import StateMessage from './ui/StateMessage.vue'
import { uiClasses } from '@/styles/ui.classes'

defineOptions({
  name: 'MainView',
})

const cabinOptions = [
  { label: 'Economy', value: 'economy' },
  { label: 'Premium economy', value: 'premium-economy' },
  { label: 'Business', value: 'business' },
]
</script>

<template>
  <div :class="uiClasses.page.shell">
    <main :class="uiClasses.page.container">
      <Hero
        subtitle="Compare routes, cabin options, and fares in one clear place before your next trip."
        title="Find the right flight with less noise."
      />

      <section :class="uiClasses.page.section" aria-label="Flight search preview">
        <Card variant="elevated">
          <form class="grid gap-4 p-4 sm:grid-cols-2 sm:p-6">
            <Input label="From" placeholder="Lagos" />

            <Input label="To" placeholder="London" />

            <Input label="Departure" type="date" />

            <Input label="Passengers" min="1" placeholder="1" type="number" />

            <Select label="Cabin" :options="cabinOptions" />

            <div
              class="flex flex-col gap-3 sm:col-span-2 sm:flex-row sm:items-center sm:justify-between"
            >
              <p :class="uiClasses.input.hint">Search by route, date, passengers, and cabin.</p>
              <Button>Search flights</Button>
            </div>
          </form>
        </Card>

        <Card>
          <aside class="flex flex-col gap-4 p-4 sm:p-6">
            <div class="flex flex-wrap gap-2">
              <Badge variant="accent">Best value</Badge>
              <Badge>1 stop</Badge>
              <Badge variant="success">Flexible fare</Badge>
            </div>

            <article :class="uiClasses.resultCard.base">
              <div :class="uiClasses.resultCard.header">
                <div>
                  <p :class="uiClasses.resultCard.route">LOS to LHR</p>
                  <p :class="uiClasses.resultCard.meta">
                    Virgin Atlantic · 6h 45m · Evening departure
                  </p>
                </div>
                <p :class="uiClasses.resultCard.price">$742</p>
              </div>
            </article>

            <div class="flex flex-wrap gap-2">
              <FilterChip active>Nonstop</FilterChip>
              <FilterChip>1 stop</FilterChip>
              <FilterChip>Under $900</FilterChip>
            </div>

            <StateMessage>
              Results, empty states, loading states, and errors now have reusable styling hooks.
            </StateMessage>
          </aside>
        </Card>
      </section>
    </main>
  </div>
</template>
