import { Utensils, Mountain, Baby, Landmark } from 'lucide-react'
import type { Category } from '../types'

const config: Record<Category, { label: string; icon: typeof Utensils; classes: string }> = {
  food: { label: 'Food', icon: Utensils, classes: 'bg-sunset-400/20 text-sunset-600' },
  outdoors: { label: 'Outdoors', icon: Mountain, classes: 'bg-forest-500/20 text-forest-700' },
  kids: { label: 'Kids', icon: Baby, classes: 'bg-sky-400/20 text-sky-600' },
  culture: { label: 'Culture', icon: Landmark, classes: 'bg-alpine-300/30 text-alpine-700' },
}

export function CategoryBadge({ category }: { category: Category }) {
  const { label, icon: Icon, classes } = config[category]
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${classes}`}>
      <Icon size={12} />
      {label}
    </span>
  )
}
