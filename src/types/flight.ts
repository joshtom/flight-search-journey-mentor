type TCabinClass = 'economy' | 'premium-economy' | 'business' | 'first'

type TSortOption = 'price' | 'duration' | 'departure'

type TStopFilter = 'any' | 'nonstop' | 'one-stop' | 'two-plus'

type TDepartureWindow = 'any' | 'evening'

type TFlightFilters = {
  stop: TStopFilter
  minPrice: number | ''
  maxPrice: number | ''
  checkedBagOnly: boolean
  departureWindow: TDepartureWindow
  cabin: TCabinClass | 'any'
}

type TSearchFormValues = {
  origin: string
  destination: string
  departureDate: string
  returnDate: string
  passengers: number | ''
  cabin: TCabinClass | ''
}

type TSearchFormErrors = Partial<Record<keyof TSearchFormValues, string>>

type TFlightSegment = {
  id: string
  airline: string
  flightNumber: string
  aircraft: string
  origin: string
  destination: string
  departureTime: string
  arrivalTime: string
  duration: string
}

type TLayover = {
  airport: string
  duration: string
}

type TFlightOffer = {
  id: string
  airline: string
  route: string
  departureTime: string
  arrivalTime: string
  duration: string
  stops: string
  stopCount: number
  price: string
  cabin: string
  badges: string[]
  segments: TFlightSegment[]
  layovers: TLayover[]
  fare: string
  baggage: string
}

type TDateWindowDay = {
  label: string
  date: string
  price: string
  active?: boolean
}

export type {
  TCabinClass,
  TDateWindowDay,
  TDepartureWindow,
  TFlightFilters,
  TFlightOffer,
  TFlightSegment,
  TLayover,
  TSearchFormErrors,
  TSearchFormValues,
  TSortOption,
  TStopFilter,
}
