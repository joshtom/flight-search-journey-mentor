import { useCreateAnOfferRequest } from '@/composables/offerRequests/useCreateAnOfferRequest'
import { mapSearchFormToOfferRequestPayload } from '@/services/offerRequests/mappers'
import type { TSearchFormValues } from '@/types/flight'

export function useFlightSearch(token: string) {
  const createOfferRequest = useCreateAnOfferRequest(token)

  async function searchFlights(values: TSearchFormValues) {
    return createOfferRequest.mutate(mapSearchFormToOfferRequestPayload(values), {
      return_offers: true,
    })
  }

  return {
    ...createOfferRequest,
    searchFlights,
  }
}
