import type { TDuffelAirport, TDuffelPlace, TDuffelPlaceType } from '@/services/offerRequests/types'

type TDuffelPlaceSuggestionWarning = {
  type: string
  title: string
  message: string
  code: string
}

type TDuffelPlaceSuggestion = TDuffelPlace & {
  type: TDuffelPlaceType
  airports?: TDuffelAirport[]
}

type TDuffelPlaceSuggestionsQuery = {
  query: string
  rad?: string
  lat?: string
  lng?: string
}

type TDuffelPlaceSuggestionsResponse = {
  data: TDuffelPlaceSuggestion[]
  warnings?: TDuffelPlaceSuggestionWarning[]
}

type TPlaceSuggestionOption = {
  id: string
  code: string
  name: string
  cityName: string
  countryCode: string
  type: TDuffelPlaceType
}

export type {
  TDuffelPlaceSuggestion,
  TDuffelPlaceSuggestionsQuery,
  TDuffelPlaceSuggestionsResponse,
  TDuffelPlaceSuggestionWarning,
  TPlaceSuggestionOption,
}
