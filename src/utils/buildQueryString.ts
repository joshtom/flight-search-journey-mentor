import type { TRequestOptions } from '@/types/fetch'

const buildQueryString = (params?: TRequestOptions['params']) => {
  if (!params) {
    return ''
  }

  const queryParams = Object.entries(params)
    .filter(([, value]) => value !== undefined)
    .map(([key, value]) => [key, String(value)])

  if (!queryParams.length) {
    return ''
  }

  return `?${new URLSearchParams(queryParams)}`
}

export default buildQueryString
