type TRequestMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

type TRequestOptions = {
  method?: TRequestMethod
  body?: unknown
  token?: string
  headers?: Record<string, string>
  params?: Record<string, string | number | boolean | undefined>
}

type TApiErrorType =
  | 'authentication_error'
  | 'airline_error'
  | 'invalid_state_error'
  | 'rate_limit_error'
  | 'validation_error'
  | 'invalid_request_error'
  | 'api_error'

type TApiErrorSource = {
  field?: string
  pointer?: string
}

type TApiErrorItem = {
  code: string
  documentation_url?: string
  message?: string
  source?: TApiErrorSource
  title?: string
  type: TApiErrorType | string
}

type TApiErrorMeta = {
  request_id?: string
  status?: number
}

type TApiError = {
  error: true
  code: string
  message: string
  errors: TApiErrorItem[]
  meta?: TApiErrorMeta
  primaryError?: TApiErrorItem
  requestId?: string
  status?: number
}

type TErrorResponseBody = {
  errors?: TApiErrorItem[]
  meta?: TApiErrorMeta
  code?: string
  message?: string
  title?: string
}

export type {
  TApiError,
  TApiErrorItem,
  TApiErrorMeta,
  TApiErrorSource,
  TApiErrorType,
  TErrorResponseBody,
  TRequestMethod,
  TRequestOptions,
}
