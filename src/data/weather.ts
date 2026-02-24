export interface SeasonWeather {
  season: string
  months: string
  tempRange: string
  emoji: string
  description: string
  tips: string[]
}

export const weatherBySeasonData: SeasonWeather[] = [
  {
    season: 'Spring',
    months: 'March – May',
    tempRange: '5–18°C',
    emoji: '🌸',
    description: 'Flowers bloom in the valleys, snow melts in the mountains. Variable weather — sunny mornings can turn to rain.',
    tips: [
      'Pack layers — big temperature swings',
      'April can still be rainy; May is usually lovely',
      'Flower Festival is a highlight',
      'Some cable cars may still be closed early spring',
    ],
  },
  {
    season: 'Summer',
    months: 'June – August',
    tempRange: '15–28°C',
    emoji: '☀️',
    description: 'Warm days, cool evenings. Ideal for hiking, swimming, and outdoor dining. Afternoon thunderstorms common in the mountains.',
    tips: [
      'Always pack a rain jacket for mountain excursions',
      'Mornings are best for hiking — storms often come after 2pm',
      'Evenings cool down fast — bring a fleece',
      'Book accommodation early for July and August',
      'The outdoor pool at Balneum opens in June',
    ],
  },
  {
    season: 'Autumn',
    months: 'September – November',
    tempRange: '5–18°C',
    emoji: '🍂',
    description: 'Gorgeous fall colors, harvest season, fewer crowds. Crisp air and stunning golden larch forests on the mountains.',
    tips: [
      'September is still warm enough for outdoor swimming',
      'October brings spectacular fall colors',
      'Local harvest festivals with food and wine',
      'Cable cars typically close mid-October',
    ],
  },
  {
    season: 'Winter',
    months: 'December – February',
    tempRange: '-5–5°C',
    emoji: '❄️',
    description: 'Snow-covered alpine wonderland. Christmas markets, skiing, and the famous 10km toboggan run on Rosskopf.',
    tips: [
      'Christmas Market runs late November to early January',
      'Dress in warm layers — it gets very cold',
      'Rosskopf becomes a family ski area',
      'Indoor activities like Balneum (indoor pool) and museums',
      'Shorter days — plan outdoor activities for midday',
    ],
  },
]
