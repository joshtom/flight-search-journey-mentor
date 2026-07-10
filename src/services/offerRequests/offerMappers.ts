import type { TDuffelOffer, TDuffelOfferSlice, TDuffelSegment } from '@/services/offerRequests/types'
import type { TFlightOffer, TFlightSegment, TLayover } from '@/types/flight'

const getPlaceCode = (segmentPlace: TDuffelSegment['origin']) =>
  segmentPlace.iata_code ?? segmentPlace.iata_city_code ?? segmentPlace.name

const getPlaceName = (segmentPlace: TDuffelSegment['origin']) =>
  segmentPlace.city_name ?? segmentPlace.city?.name ?? segmentPlace.name

const getSegments = (offer: TDuffelOffer) =>
  offer.slices.flatMap((slice) => slice.segments ?? [])

const getFirstSegment = (offer: TDuffelOffer) => getSegments(offer)[0]

const getLastSegment = (offer: TDuffelOffer) => {
  const segments = getSegments(offer)

  return segments[segments.length - 1]
}

const formatTime = (value?: string) => {
  if (!value) {
    return 'TBC'
  }

  return new Intl.DateTimeFormat('en', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(new Date(value))
}

const formatCurrency = (amount: string, currency: string) =>
  new Intl.NumberFormat('en', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(Number(amount))

const parseIsoDurationToMinutes = (value?: string) => {
  if (!value) {
    return 0
  }

  const match = value.match(/PT(?:(\d+)H)?(?:(\d+)M)?/)

  if (!match) {
    return 0
  }

  return Number(match[1] ?? 0) * 60 + Number(match[2] ?? 0)
}

const formatMinutes = (minutes: number) => {
  if (!minutes) {
    return 'TBC'
  }

  const hours = Math.floor(minutes / 60)
  const remainingMinutes = minutes % 60

  if (!hours) {
    return `${remainingMinutes}m`
  }

  if (!remainingMinutes) {
    return `${hours}h`
  }

  return `${hours}h ${remainingMinutes}m`
}

const getOfferDurationMinutes = (offer: TDuffelOffer) =>
  offer.slices.reduce((total, slice) => total + parseIsoDurationToMinutes(slice.duration), 0)

const getStopCount = (offer: TDuffelOffer) =>
  offer.slices.reduce((total, slice) => total + Math.max((slice.segments?.length ?? 1) - 1, 0), 0)

const getStopsLabel = (stopCount: number) => {
  if (stopCount === 0) {
    return 'Nonstop'
  }

  if (stopCount === 1) {
    return '1 stop'
  }

  return `${stopCount} stops`
}

const mapSegments = (offer: TDuffelOffer): TFlightSegment[] =>
  getSegments(offer).map((segment) => ({
    id: segment.id,
    airline: segment.marketing_carrier.name,
    flightNumber: [
      segment.marketing_carrier.iata_code,
      segment.marketing_carrier_flight_number,
    ]
      .filter(Boolean)
      .join(' '),
    aircraft: segment.aircraft?.name ?? 'Aircraft TBC',
    origin: getPlaceCode(segment.origin),
    destination: getPlaceCode(segment.destination),
    departureTime: formatTime(segment.departing_at),
    arrivalTime: formatTime(segment.arriving_at),
    duration: formatMinutes(parseIsoDurationToMinutes(segment.duration)),
  }))

const getLayoversForSlice = (slice: TDuffelOfferSlice): TLayover[] =>
  (slice.segments ?? []).slice(0, -1).map((segment, index) => {
    const nextSegment = slice.segments?.[index + 1]
    const layoverMinutes =
      nextSegment && segment.arriving_at
        ? Math.max(
            Math.round(
              (new Date(nextSegment.departing_at).getTime() -
                new Date(segment.arriving_at).getTime()) /
                60000,
            ),
            0,
          )
        : 0

    return {
      airport: getPlaceName(segment.destination),
      duration: formatMinutes(layoverMinutes),
    }
  })

const mapLayovers = (offer: TDuffelOffer) => offer.slices.flatMap(getLayoversForSlice)

const getBaggageSummary = (offer: TDuffelOffer) => {
  const baggages = getFirstSegment(offer)?.passengers?.[0]?.baggages ?? []
  const checkedBag = baggages.find((baggage) => baggage.type === 'checked')
  const carryOnBag = baggages.find((baggage) => baggage.type === 'carry_on')
  const summaries = [
    checkedBag ? `${checkedBag.quantity} checked bag` : undefined,
    carryOnBag ? `${carryOnBag.quantity} carry-on` : undefined,
  ].filter(Boolean)

  return summaries.length ? `${summaries.join(', ')} included` : 'Baggage details unavailable'
}

const getCabin = (offer: TDuffelOffer) =>
  getFirstSegment(offer)?.passengers?.[0]?.cabin_class_marketing_name ??
  offer.passengers?.[0]?.type ??
  'Cabin TBC'

const getFare = (offer: TDuffelOffer) => offer.slices[0]?.fare_brand_name ?? 'Standard fare'

const getBadges = (offer: TDuffelOffer, stopCount: number) =>
  [stopCount === 0 ? 'Direct' : undefined, offer.total_emissions_kg ? 'Emissions shown' : undefined].filter(
    (badge): badge is string => Boolean(badge),
  )

export const mapDuffelOfferToFlightOffer = (offer: TDuffelOffer): TFlightOffer => {
  const firstSegment = getFirstSegment(offer)
  const lastSegment = getLastSegment(offer)
  const stopCount = getStopCount(offer)
  const durationMinutes = getOfferDurationMinutes(offer)

  return {
    id: offer.id,
    airline: offer.owner?.name ?? firstSegment?.marketing_carrier.name ?? 'Airline TBC',
    route:
      firstSegment && lastSegment
        ? `${getPlaceName(firstSegment.origin)} to ${getPlaceName(lastSegment.destination)}`
        : 'Route TBC',
    departureTime: formatTime(firstSegment?.departing_at),
    arrivalTime: formatTime(lastSegment?.arriving_at),
    duration: formatMinutes(durationMinutes),
    stops: getStopsLabel(stopCount),
    stopCount,
    price: formatCurrency(offer.total_amount, offer.total_currency),
    cabin: getCabin(offer),
    badges: getBadges(offer, stopCount),
    segments: mapSegments(offer),
    layovers: mapLayovers(offer),
    fare: getFare(offer),
    baggage: getBaggageSummary(offer),
  }
}

export const mapDuffelOffersToFlightOffers = (offers: TDuffelOffer[] = []) =>
  offers.map(mapDuffelOfferToFlightOffer)
