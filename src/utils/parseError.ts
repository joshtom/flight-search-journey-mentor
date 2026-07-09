import type { TApiError, TErrorResponseBody } from '@/types/fetch'

const fallbackError = {
  code: 'unknown_error',
  message: 'An unknown error occurred',
  title: 'Unknown error',
  type: 'api_error',
}

const parseError = (data: TErrorResponseBody | null): TApiError => {
  const errors = data?.errors?.length
    ? data.errors
    : [
        {
          ...fallbackError,
          code: data?.code ?? fallbackError.code,
          message: data?.message ?? fallbackError.message,
          title: data?.title ?? fallbackError.title,
        },
      ]

  const primaryError = errors[0] ?? fallbackError

  return {
    error: true,
    code: primaryError.code,
    message: primaryError.message ?? fallbackError.message,
    errors,
    meta: data?.meta,
    primaryError,
    requestId: data?.meta?.request_id,
    status: data?.meta?.status,
  }
}

export default parseError
