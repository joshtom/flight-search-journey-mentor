import { useFetch } from '@/composables/useFetch'
import { offerRequest } from '@/services/endpoints'
import type {
  TDuffelApiResponse,
  TDuffelCreateOfferRequestPayload,
  TDuffelCreateOfferRequestQuery,
  TDuffelOfferRequest,
  TDuffelOfferRequestListQuery,
  TDuffelOfferRequestQuery,
  TDuffelPaginatedResponse,
} from '@/services/offerRequests/types'

const duffelHeaders = {
  'Duffel-Version': 'v2',
}

export const offerRequestService = {
  listOfferRequests(token: string, params?: TDuffelOfferRequestListQuery) {
    return useFetch<TDuffelPaginatedResponse<TDuffelOfferRequest>>(offerRequest.offerRequests, {
      token,
      params,
      headers: duffelHeaders,
    })
  },

  createAnOfferRequest(
    token: string,
    payload: TDuffelCreateOfferRequestPayload,
    params?: TDuffelCreateOfferRequestQuery,
  ) {
    return useFetch<TDuffelApiResponse<TDuffelOfferRequest>>(offerRequest.offerRequests, {
      method: 'POST',
      token,
      body: payload,
      params,
      headers: duffelHeaders,
    })
  },

  getOfferRequest(token: string, id: string, params?: TDuffelOfferRequestQuery) {
    return useFetch<TDuffelApiResponse<TDuffelOfferRequest>>(offerRequest.offerRequestById(id), {
      token,
      params,
      headers: duffelHeaders,
    })
  },
}
