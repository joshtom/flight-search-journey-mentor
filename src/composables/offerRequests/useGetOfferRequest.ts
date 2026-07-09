import { ref } from 'vue'

import { offerRequestService } from '@/services/offerRequests/offerRequestService'
import type { TApiError } from '@/composables/useFetch'
import type {
  TDuffelApiResponse,
  TDuffelOfferRequest,
  TDuffelOfferRequestQuery,
} from '@/services/offerRequests/types'

export function useGetOfferRequest(token: string, id: string, params?: TDuffelOfferRequestQuery) {
  const data = ref<TDuffelApiResponse<TDuffelOfferRequest> | null>(null)
  const error = ref<TApiError | null>(null)
  const isPending = ref(false)
  const isSuccess = ref(false)

  async function refetch(nextParams: TDuffelOfferRequestQuery = params ?? {}) {
    isPending.value = true
    error.value = null
    isSuccess.value = false

    try {
      data.value = await offerRequestService.getOfferRequest(token, id, nextParams)
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
    refetch,
  }
}
