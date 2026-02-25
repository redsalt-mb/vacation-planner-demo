import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { ActivityPhoto } from './ActivityPhoto'

interface PhotoCarouselProps {
  photos: string[]
  fallbackEmoji: string
  alt: string
  attributions?: { authorName?: string; authorUrl?: string }[]
}

export function PhotoCarousel({ photos, fallbackEmoji, alt, attributions = [] }: PhotoCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  if (photos.length === 0) {
    return (
      <div className="w-full h-48 flex items-center justify-center bg-alpine-100 rounded-xl">
        <span className="text-6xl">{fallbackEmoji}</span>
      </div>
    )
  }

  const hasPrev = currentIndex > 0
  const hasNext = currentIndex < photos.length - 1

  return (
    <div className="relative">
      <ActivityPhoto
        photoUrl={photos[currentIndex]}
        fallbackEmoji={fallbackEmoji}
        alt={`${alt} — photo ${currentIndex + 1}`}
        className="w-full h-48 rounded-xl"
      />

      {/* Navigation arrows */}
      {photos.length > 1 && (
        <>
          {hasPrev && (
            <button
              onClick={(e) => { e.stopPropagation(); setCurrentIndex(i => i - 1) }}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 text-white flex items-center justify-center hover:bg-black/60 transition-colors"
            >
              <ChevronLeft size={18} />
            </button>
          )}
          {hasNext && (
            <button
              onClick={(e) => { e.stopPropagation(); setCurrentIndex(i => i + 1) }}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 text-white flex items-center justify-center hover:bg-black/60 transition-colors"
            >
              <ChevronRight size={18} />
            </button>
          )}

          {/* Dots indicator */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
            {photos.map((_, i) => (
              <button
                key={i}
                onClick={(e) => { e.stopPropagation(); setCurrentIndex(i) }}
                className={`w-1.5 h-1.5 rounded-full transition-all ${
                  i === currentIndex ? 'bg-white w-3' : 'bg-white/50'
                }`}
              />
            ))}
          </div>
        </>
      )}

      {/* Attribution */}
      {attributions[currentIndex]?.authorName && (
        <div className="absolute top-2 right-2 bg-black/40 text-white/80 text-[10px] px-1.5 py-0.5 rounded">
          📷 {attributions[currentIndex].authorUrl ? (
            <a
              href={attributions[currentIndex].authorUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white"
              onClick={(e) => e.stopPropagation()}
            >
              {attributions[currentIndex].authorName}
            </a>
          ) : (
            attributions[currentIndex].authorName
          )}
        </div>
      )}
    </div>
  )
}
