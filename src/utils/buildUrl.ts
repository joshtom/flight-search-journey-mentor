import { type TRequestOptions } from '@/types/fetch'
import buildQueryString from './buildQueryString'
import { BASE_URL } from '@/services/endpoints'

const buildUrl = (endpoint: string, params?: TRequestOptions['params']) => {
  const baseUrl = BASE_URL.endsWith('/') ? BASE_URL.slice(0, -1) : BASE_URL
  const normalizedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`

  return `${baseUrl}${normalizedEndpoint}${buildQueryString(params)}`
}

export default buildUrl
