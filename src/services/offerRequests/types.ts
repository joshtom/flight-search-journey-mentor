type TDuffelCabinClass = 'first' | 'business' | 'premium_economy' | 'economy'

type TDuffelView = 'offers' | 'itineraries'

type TDuffelPassengerType = 'adult' | 'child' | 'infant_without_seat'

type TDuffelPlaceType = 'airport' | 'city'

type TDuffelFareType =
  | 'contract_bulk_child'
  | 'contract_bulk_adult'
  | 'contract_bulk_infant'
  | 'student'
  | 'marine'
  | 'humanitarian'
  | 'labor'

type TDuffelMoney = {
  amount: string
  currency: string
}

type TDuffelApiResponse<TData> = {
  data: TData
}

type TDuffelPaginatedMeta = {
  limit: number
  after?: string
  before?: string
}

type TDuffelPaginatedResponse<TData> = {
  data: TData[]
  meta: TDuffelPaginatedMeta
}

type TDuffelOfferRequestListQuery = {
  after?: string
  before?: string
  limit?: number
}

type TDuffelOfferRequestQuery = {
  view?: TDuffelView
}

type TDuffelCreateOfferRequestQuery = TDuffelOfferRequestQuery & {
  return_offers?: boolean
  supplier_timeout?: number
}

type TDuffelTimeWindow = {
  from?: string
  to?: string
}

type TDuffelCreateOfferRequestSlice = {
  origin: string
  destination: string
  departure_date: string
  departure_time?: TDuffelTimeWindow
  arrival_time?: TDuffelTimeWindow
}

type TDuffelLoyaltyProgrammeAccount = {
  account_number: string
  airline_iata_code: string
}

type TDuffelCreateOfferRequestPassenger = {
  type?: TDuffelPassengerType
  age?: number
  fare_type?: TDuffelFareType | string
  given_name?: string
  family_name?: string
  loyalty_programme_accounts?: TDuffelLoyaltyProgrammeAccount[]
}

type TDuffelPrivateFare = {
  corporate_code?: string
  tour_code?: string
  tracking_reference?: string
}

type TDuffelPrivateFares = Record<string, TDuffelPrivateFare[]>

type TDuffelCreateOfferRequestData = {
  slices: TDuffelCreateOfferRequestSlice[]
  passengers: TDuffelCreateOfferRequestPassenger[]
  cabin_class?: TDuffelCabinClass
  max_connections?: number
  private_fares?: TDuffelPrivateFares
  include_split_ticket?: boolean
  airline_credit_ids?: string[]
}

type TDuffelCreateOfferRequestPayload = {
  data: TDuffelCreateOfferRequestData
}

type TDuffelAirport = {
  id: string
  name: string
  time_zone: string
  longitude: number
  latitude: number
  icao_code?: string
  iata_country_code: string
  iata_code: string
  iata_city_code?: string
  city_name?: string
  city?: TDuffelCity | null
}

type TDuffelCity = {
  id: string
  name: string
  iata_country_code: string
  iata_code: string
  airports: TDuffelAirport[]
}

type TDuffelPlace = {
  id: string
  type: TDuffelPlaceType
  name: string
  time_zone?: string
  longitude?: number
  latitude?: number
  icao_code?: string
  iata_country_code?: string
  iata_code?: string
  iata_city_code?: string
  city_name?: string
  city?: TDuffelCity | null
  airports?: TDuffelAirport[]
}

type TDuffelCarrier = {
  id: string
  name: string
  iata_code?: string
}

type TDuffelAircraft = {
  id?: string
  name?: string
  iata_code?: string
}

type TDuffelBaggage = {
  quantity: number
  type: 'checked' | 'carry_on' | string
}

type TDuffelSegmentPassenger = {
  passenger_id: string
  cabin_class?: TDuffelCabinClass
  cabin_class_marketing_name?: string
  fare_basis_code?: string
  baggages?: TDuffelBaggage[]
}

type TDuffelSegment = {
  id: string
  aircraft?: TDuffelAircraft | null
  arriving_at: string
  departing_at: string
  destination: TDuffelPlace
  origin: TDuffelPlace
  marketing_carrier: TDuffelCarrier
  operating_carrier: TDuffelCarrier
  marketing_carrier_flight_number?: string
  operating_carrier_flight_number?: string
  duration?: string
  distance?: string
  stops?: TDuffelPlace[]
  passengers?: TDuffelSegmentPassenger[]
}

type TDuffelOfferSlice = {
  id: string
  origin: TDuffelPlace
  destination: TDuffelPlace
  departure_date?: string
  fare_brand_name?: string
  segments?: TDuffelSegment[]
  duration?: string
}

type TDuffelOfferPassenger = {
  id: string
  type?: TDuffelPassengerType
  age?: number
  given_name?: string
  family_name?: string
  fare_type?: TDuffelFareType | string
}

type TDuffelPaymentRequirements = {
  price_guarantee_expires_at?: string
  payment_required_by?: string
  requires_instant_payment?: boolean
}

type TDuffelOffer = {
  id: string
  live_mode?: boolean
  created_at?: string
  updated_at?: string
  expires_at?: string
  total_amount: string
  total_currency: string
  base_amount?: string
  base_currency?: string
  tax_amount?: string
  tax_currency?: string
  slices: TDuffelOfferSlice[]
  passengers?: TDuffelOfferPassenger[]
  owner?: TDuffelCarrier
  payment_requirements?: TDuffelPaymentRequirements
  available_services?: unknown[] | null
  supported_passenger_identity_document_types?: string[]
  total_emissions_kg?: string
  conditions?: unknown
  fees?: TDuffelMoney[]
}

type TDuffelOfferRequestSlice = {
  origin_type?: TDuffelPlaceType
  origin: TDuffelPlace
  destination_type?: TDuffelPlaceType
  destination: TDuffelPlace
  departure_date: string
}

type TDuffelOfferRequestPassenger = {
  id?: string
  type?: TDuffelPassengerType
  age?: number
  fare_type?: TDuffelFareType | string
  given_name?: string
  family_name?: string
  loyalty_programme_accounts?: TDuffelLoyaltyProgrammeAccount[]
}

type TDuffelOfferRequest = {
  id: string
  live_mode: boolean
  created_at: string
  client_key?: string
  cabin_class?: TDuffelCabinClass | null
  passengers?: TDuffelOfferRequestPassenger[]
  slices: TDuffelOfferRequestSlice[]
  offers?: TDuffelOffer[]
}

export type {
  TDuffelAircraft,
  TDuffelAirport,
  TDuffelApiResponse,
  TDuffelBaggage,
  TDuffelCabinClass,
  TDuffelCarrier,
  TDuffelCity,
  TDuffelCreateOfferRequestData,
  TDuffelCreateOfferRequestPassenger,
  TDuffelCreateOfferRequestPayload,
  TDuffelCreateOfferRequestQuery,
  TDuffelCreateOfferRequestSlice,
  TDuffelFareType,
  TDuffelLoyaltyProgrammeAccount,
  TDuffelMoney,
  TDuffelOffer,
  TDuffelOfferPassenger,
  TDuffelOfferRequest,
  TDuffelOfferRequestListQuery,
  TDuffelOfferRequestPassenger,
  TDuffelOfferRequestQuery,
  TDuffelOfferRequestSlice,
  TDuffelOfferSlice,
  TDuffelPaginatedMeta,
  TDuffelPaginatedResponse,
  TDuffelPassengerType,
  TDuffelPaymentRequirements,
  TDuffelPlace,
  TDuffelPlaceType,
  TDuffelPrivateFare,
  TDuffelPrivateFares,
  TDuffelSegment,
  TDuffelSegmentPassenger,
  TDuffelTimeWindow,
  TDuffelView,
}
