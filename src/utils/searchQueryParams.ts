import type { TCabinClass, TSearchFormValues } from '@/types/flight'

const cabinClasses: TCabinClass[] = ['economy', 'premium-economy', 'business', 'first']

const isCabinClass = (value: string | null): value is TCabinClass =>
  Boolean(value && cabinClasses.includes(value as TCabinClass))

const getTrimmedParam = (params: URLSearchParams, key: string) => params.get(key)?.trim() ?? ''

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
    destination,
    departureDate,
    returnDate,
    passengers,
    cabin,
  }
}
