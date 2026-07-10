import { computed, ref } from 'vue'

import type { TApiError } from '@/composables/useFetch'
import { mapPlaceSuggestionsToOptions } from '@/services/placeSuggestions/mappers'
import { placeSuggestionService } from '@/services/placeSuggestions/placeSuggestionService'
import type { TPlaceSuggestionOption } from '@/services/placeSuggestions/types'

export function usePlaceSuggestions(token: string) {
  const suggestions = ref<TPlaceSuggestionOption[]>([])
  const error = ref<TApiError | null>(null)
  const isPending = ref(false)
  const activeRequestId = ref(0)

  const hasSuggestions = computed(() => suggestions.value.length > 0)

  async function searchPlaces(query: string) {
    const trimmedQuery = query.trim()
    const requestId = activeRequestId.value + 1
    activeRequestId.value = requestId

    if (trimmedQuery.length < 2 || !token) {
      suggestions.value = []
      error.value = null
      isPending.value = false
      return []
    }

    isPending.value = true
    error.value = null

    try {
      const response = await placeSuggestionService.listPlaceSuggestions(token, {
        query: trimmedQuery,
      })
      const options = mapPlaceSuggestionsToOptions(response.data)

      if (requestId === activeRequestId.value) {
        suggestions.value = options
      }

      return options
    } catch (err) {
      if (requestId === activeRequestId.value) {
        suggestions.value = []
        error.value = err as TApiError
      }

      return []
    } finally {
      if (requestId === activeRequestId.value) {
        isPending.value = false
      }
    }
  }

  function clearSuggestions() {
    suggestions.value = []
    error.value = null
  }

  return {
    clearSuggestions,
    error,
    hasSuggestions,
    isPending,
    searchPlaces,
    suggestions,
  }
}
