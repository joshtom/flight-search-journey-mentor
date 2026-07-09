import { ref } from 'vue'

import { offerRequestService } from '@/services/offerRequests/offerRequestService'
import type { TApiError } from '@/composables/useFetch'
import type {
  TDuffelApiResponse,
  TDuffelCreateOfferRequestPayload,
  TDuffelCreateOfferRequestQuery,
  TDuffelOfferRequest,
} from '@/services/offerRequests/types'

export function useCreateAnOfferRequest(token: string) {
  const data = ref<TDuffelApiResponse<TDuffelOfferRequest> | null>(null)
  const error = ref<TApiError | null>(null)
  const isPending = ref(false)
  const isSuccess = ref(false)

  async function mutate(
    payload: TDuffelCreateOfferRequestPayload,
    params?: TDuffelCreateOfferRequestQuery,
  ) {
    isPending.value = true
    error.value = null
    isSuccess.value = false

    try {
      data.value = await offerRequestService.createAnOfferRequest(token, payload, params)
      isSuccess.value = true
      return data.value
    } catch (err) {
      error.value = err as TApiError
      throw err
    } finally {
      isPending.value = false
    }
  }

  return {
    data,
    error,
    isPending,
    isSuccess,
    mutate,
  }
}
