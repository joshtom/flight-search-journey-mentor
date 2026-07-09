const offerRequest = {
  offerRequests: '/air/offer_requests',
  offerRequestById: (id: string) => `/air/offer_requests/${id}`,
}

const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api'

export { offerRequest, BASE_URL }
