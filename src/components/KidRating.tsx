import { Baby } from 'lucide-react'
import type { KidFriendliness } from '../types'

export function KidRating({ rating }: { rating: KidFriendliness }) {
  return (
    <span className="inline-flex gap-0.5" title={`Kid-friendliness: ${rating}/5`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Baby key={i} size={14} className={i <= rating ? 'text-sunset-500' : 'text-alpine-200'} />
      ))}
    </span>
  )
}
