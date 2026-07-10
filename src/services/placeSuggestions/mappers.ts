import type {
  TDuffelPlaceSuggestion,
  TPlaceSuggestionOption,
} from '@/services/placeSuggestions/types'

const getSuggestionCode = (suggestion: TDuffelPlaceSuggestion) => {
  if (suggestion.iata_code) {
    return suggestion.iata_code
  }

  if (suggestion.type === 'city' && suggestion.iata_city_code) {
    return suggestion.iata_city_code
  }

  return suggestion.airports?.find((airport) => airport.iata_code)?.iata_code ?? ''
}

export const mapPlaceSuggestionToOption = (
  suggestion: TDuffelPlaceSuggestion,
): TPlaceSuggestionOption | null => {
  const code = getSuggestionCode(suggestion)

  if (!code) {
    return null
  }

  return {
    id: suggestion.id,
    code,
    name: suggestion.name,
    cityName: suggestion.city_name ?? suggestion.city?.name ?? suggestion.name,
    countryCode: suggestion.iata_country_code ?? suggestion.city?.iata_country_code ?? '',
    type: suggestion.type,
  }
}

export const mapPlaceSuggestionsToOptions = (suggestions: TDuffelPlaceSuggestion[] = []) =>
  suggestions
    .map(mapPlaceSuggestionToOption)
    .filter((suggestion): suggestion is TPlaceSuggestionOption => Boolean(suggestion))
