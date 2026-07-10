import { defineStore } from 'pinia'

import type { TCabinClass, TSearchFormValues } from '@/types/flight'

const SEARCH_STORAGE_KEY = 'journey-mentor:last-search'

const cabinClasses: TCabinClass[] = ['economy', 'premium-economy', 'business', 'first']

const isCabinClass = (value: unknown): value is TCabinClass =>
  typeof value === 'string' && cabinClasses.includes(value as TCabinClass)

const toSearchValues = (value: unknown): TSearchFormValues | null => {
  if (!value || typeof value !== 'object') {
    return null
  }

  const search = value as Partial<TSearchFormValues>

  return {
    origin: typeof search.origin === 'string' ? search.origin : '',
    destination: typeof search.destination === 'string' ? search.destination : '',
    departureDate: typeof search.departureDate === 'string' ? search.departureDate : '',
    returnDate: typeof search.returnDate === 'string' ? search.returnDate : '',
    passengers: typeof search.passengers === 'number' ? search.passengers : '',
    cabin: isCabinClass(search.cabin) ? search.cabin : '',
  }
}

const readStoredSearch = () => {
  const storedSearch = localStorage.getItem(SEARCH_STORAGE_KEY)

  if (!storedSearch) {
    return null
  }

  try {
    return toSearchValues(JSON.parse(storedSearch))
  } catch {
    return null
  }
}

export const useSearchStore = defineStore('search', {
  state: () => ({
    lastSearch: readStoredSearch(),
  }),
  actions: {
    saveSearch(values: TSearchFormValues) {
      this.lastSearch = { ...values }
      localStorage.setItem(SEARCH_STORAGE_KEY, JSON.stringify(this.lastSearch))
    },
  },
})
