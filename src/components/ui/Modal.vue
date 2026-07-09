<script setup lang="ts">
import { uiClasses } from '@/styles/ui.classes'

defineOptions({
  name: 'UiModal',
})

defineProps<{
  open: boolean
  title: string
}>()

const emit = defineEmits<{
  close: []
}>()
</script>

<template>
  <Teleport to="body">
    <div v-if="open" :class="uiClasses.modal.backdrop" role="presentation">
      <section aria-modal="true" :aria-label="title" :class="uiClasses.modal.panel" role="dialog">
        <header :class="uiClasses.modal.header">
          <h2 :class="uiClasses.modal.title">{{ title }}</h2>
          <button :class="uiClasses.modal.closeButton" type="button" @click="emit('close')">
            <span aria-hidden="true">x</span>
            <span class="sr-only">Close</span>
          </button>
        </header>

        <div :class="uiClasses.modal.body">
          <slot />
        </div>
      </section>
    </div>
  </Teleport>
</template>
