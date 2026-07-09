<script setup lang="ts">
import CloseIcon from '@/components/icons/CloseIcon.vue'
import { uiClasses } from '@/styles/ui.classes'

defineOptions({
  name: 'UiModal',
})

defineProps<{
  open: boolean
  title: string
  wide?: boolean
}>()

const emit = defineEmits<{
  close: []
}>()
</script>

<template>
  <Teleport to="body">
    <div v-if="open" :class="uiClasses.modal.backdrop" role="presentation" @click="emit('close')">
      <section
        aria-modal="true"
        :aria-label="title"
        :class="wide ? uiClasses.modal.widePanel : uiClasses.modal.panel"
        role="dialog"
        @click.stop
      >
        <header :class="[uiClasses.modal.header, 'border-b border-stone-100 p-4 sm:p-5']">
          <h2 :class="uiClasses.modal.title">{{ title }}</h2>
          <button :class="uiClasses.modal.closeButton" type="button" @click="emit('close')">
            <CloseIcon />
            <span class="sr-only">Close</span>
          </button>
        </header>

        <div :class="uiClasses.modal.body">
          <slot />
        </div>

        <footer v-if="$slots.footer" :class="uiClasses.modal.footer">
          <slot name="footer" />
        </footer>
      </section>
    </div>
  </Teleport>
</template>
