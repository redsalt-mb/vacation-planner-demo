import type { ItineraryDay } from '../types'

export const suggestedDays: ItineraryDay[] = [
  {
    id: 'template-relaxed-town',
    label: 'Relaxed Town Day',
    activityIds: [
      'food-vis-a-vis',
      'outdoors-old-town-walk',
      'food-il-ghiottone',
      'kids-playground-margherita',
      'food-zur-traube',
    ],
  },
  {
    id: 'template-mountain-adventure',
    label: 'Mountain Adventure',
    activityIds: [
      'outdoors-rosskopf',
      'outdoors-rossy-walk',
      'kids-rossy-park',
      'food-prantneralm',
    ],
  },
  {
    id: 'template-valley-excursion',
    label: 'Valley Excursion',
    activityIds: [
      'outdoors-val-ridanna',
      'culture-mining-museum',
      'food-cafe-rose',
      'kids-balneum',
    ],
  },
]
