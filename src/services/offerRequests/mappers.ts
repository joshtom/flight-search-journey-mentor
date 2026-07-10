import type { TCabinClass, TSearchFormValues } from '@/types/flight'
import type {
  TDuffelCabinClass,
  TDuffelCreateOfferRequestPayload,
  TDuffelCreateOfferRequestSlice,
} from '@/services/offerRequests/types'

const cabinClassMap: Record<TCabinClass, TDuffelCabinClass> = {
  economy: 'economy',
  'premium-economy': 'premium_economy',
  business: 'business',
  first: 'first',
}

const normalizeAirportCode = (value: string) => value.trim().toUpperCase()

const buildSlices = (values: TSearchFormValues): TDuffelCreateOfferRequestSlice[] => {
  const outboundSlice: TDuffelCreateOfferRequestSlice = {
    origin: normalizeAirportCode(values.origin),
    destination: normalizeAirportCode(values.destination),
    departure_date: values.departureDate,
  }

  if (!values.returnDate) {
    return [outboundSlice]
  }

  return [
    outboundSlice,
    {
      origin: normalizeAirportCode(values.destination),
      destination: normalizeAirportCode(values.origin),
      departure_date: values.returnDate,
    },
  ]
}

export const mapSearchFormToOfferRequestPayload = (
  values: TSearchFormValues,
): TDuffelCreateOfferRequestPayload => ({
  data: {
    slices: buildSlices(values),
    passengers: Array.from({ length: Number(values.passengers) }, () => ({ type: 'adult' })),
    ...(values.cabin ? { cabin_class: cabinClassMap[values.cabin] } : {}),
  },
})
