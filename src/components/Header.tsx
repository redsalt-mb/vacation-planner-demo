interface HeaderProps {
  stats: { want: number; done: number; total: number }
}

export function Header({ stats }: HeaderProps) {
  return (
    <header className="bg-gradient-to-b from-forest-700 to-forest-600 text-white px-4 pt-8 pb-6">
      <div className="max-w-2xl mx-auto">
        <div className="text-4xl mb-2">🏔️</div>
        <h1 className="font-heading text-2xl font-bold">Vipiteno Vacation Planner</h1>
        <p className="text-forest-400/90 text-sm mt-1">
          Sterzing, South Tyrol — Food, Mountains & Family Fun
        </p>
        {(stats.want > 0 || stats.done > 0) && (
          <div className="flex gap-3 mt-3 text-xs text-white/70">
            {stats.want > 0 && (
              <span className="bg-white/15 px-2 py-0.5 rounded-full">
                {stats.want} want to do
              </span>
            )}
            {stats.done > 0 && (
              <span className="bg-white/15 px-2 py-0.5 rounded-full">
                {stats.done} done
              </span>
            )}
          </div>
        )}
      </div>
    </header>
  )
}
