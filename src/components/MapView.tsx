import { useEffect, useMemo, useRef } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import type { Activity, Category } from '../types'

const VIPITENO_CENTER: [number, number] = [46.8968, 11.4294]
const DEFAULT_ZOOM = 14

const CATEGORY_COLORS: Record<Category, string> = {
  food: '#d4865a',
  outdoors: '#4a7c59',
  kids: '#5a9bc0',
  culture: '#8a7058',
}

function createMarkerIcon(category: Category, emoji: string): L.DivIcon {
  const color = CATEGORY_COLORS[category]
  return L.divIcon({
    className: '',
    html: `<div class="map-marker" style="width:32px;height:32px;background:${color}">${emoji}</div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -18],
  })
}

interface MapViewProps {
  activities: Activity[]
  onSelectActivity: (id: string) => void
}

function MapBoundsUpdater({ activities }: { activities: Activity[] }) {
  const map = useMap()
  const prevCountRef = useRef(activities.length)

  useEffect(() => {
    // Only auto-fit when the filter changes (activity count changes)
    if (activities.length === prevCountRef.current && prevCountRef.current > 0) return
    prevCountRef.current = activities.length

    const coords = activities
      .filter((a) => a.location.lat != null && a.location.lng != null)
      .map((a) => [a.location.lat!, a.location.lng!] as [number, number])

    if (coords.length === 0) return
    if (coords.length === 1) {
      map.setView(coords[0], 15)
    } else {
      map.fitBounds(L.latLngBounds(coords), { padding: [40, 40], maxZoom: 16 })
    }
  }, [activities, map])

  return null
}

export function MapView({ activities, onSelectActivity }: MapViewProps) {
  const mappable = useMemo(
    () => activities.filter((a) => a.location.lat != null && a.location.lng != null),
    [activities],
  )

  const icons = useMemo(() => {
    const cache = new Map<string, L.DivIcon>()
    for (const a of mappable) {
      const key = `${a.category}-${a.imageEmoji}`
      if (!cache.has(key)) {
        cache.set(key, createMarkerIcon(a.category, a.imageEmoji))
      }
    }
    return cache
  }, [mappable])

  return (
    <div className="rounded-xl overflow-hidden border border-alpine-200 shadow-sm" style={{ height: '65vh' }}>
      <MapContainer
        center={VIPITENO_CENTER}
        zoom={DEFAULT_ZOOM}
        className="h-full w-full"
        zoomControl={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapBoundsUpdater activities={mappable} />
        {mappable.map((activity) => (
          <Marker
            key={activity.id}
            position={[activity.location.lat!, activity.location.lng!]}
            icon={icons.get(`${activity.category}-${activity.imageEmoji}`)}
          >
            <Popup>
              <div className="text-center min-w-[160px]">
                <p className="font-bold text-sm leading-tight">{activity.name}</p>
                <p className="text-xs text-gray-500 mt-0.5">{activity.location.area}</p>
                <button
                  onClick={() => onSelectActivity(activity.id)}
                  className="text-xs font-medium mt-2 px-3 py-1 rounded-full"
                  style={{ color: '#3d6b4a', background: '#3d6b4a15' }}
                >
                  View details →
                </button>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  )
}
