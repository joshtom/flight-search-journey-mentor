<script setup lang="ts">
import { uiClasses } from '@/styles/ui.classes'

defineOptions({
  name: 'UiHero',
})

defineProps<{
  eyebrow?: string
  title: string
  subtitle: string
}>()
</script>

<template>
  <section :class="uiClasses.hero.base">
    <p v-if="eyebrow" :class="uiClasses.page.eyebrow">{{ eyebrow }}</p>
    <h1 :class="uiClasses.hero.title">{{ title }}</h1>
    <p :class="uiClasses.hero.subtitle">{{ subtitle }}</p>
  </section>
</template>
