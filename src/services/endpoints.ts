const offerRequest = {
  offerRequests: '/air/offer_requests',
  offerRequestById: (id: string) => `/air/offer_requests/${id}`,
}

const configuredBaseUrl = import.meta.env.VITE_API_BASE_URL

const BASE_URL = configuredBaseUrl?.includes('api.duffel.com') ? '/api' : configuredBaseUrl || '/api'

export { offerRequest, BASE_URL }
