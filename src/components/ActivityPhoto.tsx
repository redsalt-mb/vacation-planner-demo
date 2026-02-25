import { useState } from 'react'
import { ImageOff } from 'lucide-react'

interface ActivityPhotoProps {
  photoUrl?: string
  fallbackEmoji: string
  alt: string
  className?: string
}

export function ActivityPhoto({ photoUrl, fallbackEmoji, alt, className = '' }: ActivityPhotoProps) {
  const [status, setStatus] = useState<'loading' | 'loaded' | 'error'>('loading')

  if (!photoUrl) {
    return (
      <div className={`flex items-center justify-center bg-alpine-100 ${className}`}>
        <span className="text-3xl">{fallbackEmoji}</span>
      </div>
    )
  }

  return (
    <div className={`relative overflow-hidden bg-alpine-100 ${className}`}>
      {status === 'loading' && (
        <div className="absolute inset-0 flex items-center justify-center animate-pulse">
          <span className="text-3xl">{fallbackEmoji}</span>
        </div>
      )}
      {status === 'error' && (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-alpine-400">
          <ImageOff size={20} className="mb-1" />
          <span className="text-2xl">{fallbackEmoji}</span>
        </div>
      )}
      <img
        src={photoUrl}
        alt={alt}
        loading="lazy"
        onLoad={() => setStatus('loaded')}
        onError={() => setStatus('error')}
        className={`w-full h-full object-cover transition-opacity duration-300 ${
          status === 'loaded' ? 'opacity-100' : 'opacity-0'
        }`}
      />
    </div>
  )
}
