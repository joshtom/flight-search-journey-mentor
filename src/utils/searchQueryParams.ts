import type { TCabinClass, TSearchFormValues } from '@/types/flight'

const cabinClasses: TCabinClass[] = ['economy', 'premium-economy', 'business', 'first']

const isCabinClass = (value: string | null): value is TCabinClass =>
  Boolean(value && cabinClasses.includes(value as TCabinClass))

const getTrimmedParam = (params: URLSearchParams, key: string) => params.get(key)?.trim() ?? ''

const searchQueryParams: { key: keyof TSearchFormValues; param: string }[] = [
  { key: 'origin', param: 'from' },
  { key: 'originLabel', param: 'fromLabel' },
  { key: 'destination', param: 'to' },
  { key: 'destinationLabel', param: 'toLabel' },
  { key: 'departureDate', param: 'departure' },
  { key: 'returnDate', param: 'return' },
  { key: 'passengers', param: 'passengers' },
  { key: 'cabin', param: 'cabin' },
]

export const getSearchValuesFromQueryParams = (
  params = new URLSearchParams(window.location.search),
): TSearchFormValues | null => {
  const origin = getTrimmedParam(params, 'from')
  const destination = getTrimmedParam(params, 'to')
  const departureDate = getTrimmedParam(params, 'departure')
  const returnDate = getTrimmedParam(params, 'return')
  const passengers = Number(getTrimmedParam(params, 'passengers'))
  const cabin = params.get('cabin')

  if (!origin || !destination || !departureDate || !Number.isFinite(passengers) || passengers < 1) {
    return null
  }

  if (origin.toLowerCase() === destination.toLowerCase()) {
    return null
  }

  if (returnDate && returnDate < departureDate) {
    return null
  }

  if (!isCabinClass(cabin)) {
    return null
  }

  return {
    origin,
    originLabel: getTrimmedParam(params, 'fromLabel') || origin,
    destination,
    destinationLabel: getTrimmedParam(params, 'toLabel') || destination,
    departureDate,
    returnDate,
    passengers,
    cabin,
  }
}

export const updateSearchQueryParams = (values: TSearchFormValues) => {
  const url = new URL(window.location.href)

  searchQueryParams.forEach(({ key, param }) => {
    const value = values[key]

    if (value === '' || value === undefined) {
      url.searchParams.delete(param)
      return
    }

    url.searchParams.set(param, String(value))
  })

  window.history.replaceState(window.history.state, '', `${url.pathname}${url.search}${url.hash}`)
}
