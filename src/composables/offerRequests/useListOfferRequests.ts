import { ref } from 'vue'

import { offerRequestService } from '@/services/offerRequests/offerRequestService'
import type { TApiError } from '@/composables/useFetch'
import type {
  TDuffelOfferRequest,
  TDuffelOfferRequestListQuery,
  TDuffelPaginatedResponse,
} from '@/services/offerRequests/types'

export function useListOfferRequests(token: string, params?: TDuffelOfferRequestListQuery) {
  const data = ref<TDuffelPaginatedResponse<TDuffelOfferRequest> | null>(null)
  const error = ref<TApiError | null>(null)
  const isPending = ref(false)
  const isSuccess = ref(false)

  async function refetch(nextParams: TDuffelOfferRequestListQuery = params ?? {}) {
    isPending.value = true
    error.value = null
    isSuccess.value = false

    try {
      data.value = await offerRequestService.listOfferRequests(token, nextParams)
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
