import { useFetch } from '@/composables/useFetch'
import { placeSuggestion } from '@/services/endpoints'
import type {
  TDuffelPlaceSuggestionsQuery,
  TDuffelPlaceSuggestionsResponse,
} from '@/services/placeSuggestions/types'

export const placeSuggestionService = {
  listPlaceSuggestions(token: string, params: TDuffelPlaceSuggestionsQuery) {
    return useFetch<TDuffelPlaceSuggestionsResponse>(placeSuggestion.suggestions, {
      params,
      token,
    })
  },
}
