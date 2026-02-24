import type { Activity } from '../types'

export interface TravelInfo {
  emoji: string
  label: string
  distanceKm: number
}

function haversineDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLng = ((lng2 - lng1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) ** 2
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

export function getTravelInfo(from: Activity, to: Activity): TravelInfo | null {
  if (
    from.location.lat == null ||
    from.location.lng == null ||
    to.location.lat == null ||
    to.location.lng == null
  ) {
    return null
  }

  const dist = haversineDistance(
    from.location.lat,
    from.location.lng,
    to.location.lat,
    to.location.lng,
  )

  if (dist < 0.5) {
    const minutes = Math.max(1, Math.round((dist / 4) * 60))
    return { emoji: '🚶', label: `~${minutes} min walk`, distanceKm: dist }
  } else if (dist <= 3) {
    const minutes = Math.max(1, Math.round((dist / 30) * 60))
    return { emoji: '🚗', label: `~${minutes} min drive`, distanceKm: dist }
  } else {
    const minutes = Math.max(1, Math.round((dist / 50) * 60))
    return { emoji: '🚗', label: `~${minutes} min drive`, distanceKm: dist }
  }
}
