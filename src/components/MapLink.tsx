import { MapPin } from 'lucide-react'

export function MapLink({ url, label }: { url?: string; label?: string }) {
  if (!url) return null
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1 text-xs text-forest-600 hover:text-forest-700 hover:underline"
    >
      <MapPin size={12} />
      {label ?? 'Map'}
    </a>
  )
}
