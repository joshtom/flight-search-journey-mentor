import type { TApiError, TErrorResponseBody, TRequestOptions } from '@/types/fetch'
import buildUrl from '@/utils/buildUrl'
import parseError from '@/utils/parseError'

export async function useFetch<T>(endpoint: string, options: TRequestOptions = {}): Promise<T> {
  const { method = 'GET', body, token, headers = {}, params } = options

  const response = await fetch(buildUrl(endpoint, params), {
    method,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'Duffel-Version': 'v2',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
  })

  const data = (await response.json().catch(() => null)) as T | TErrorResponseBody | null

  if (!response.ok) {
    throw parseError(data as TErrorResponseBody | null)
  }

  return data as T
}

export type { TApiError, TRequestOptions }
