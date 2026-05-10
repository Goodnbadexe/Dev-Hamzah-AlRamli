'use client'

type Category = 'offense' | 'defense' | 'automation' | 'cloud'

interface SkillBadgeProps {
  name: string
  level: 1 | 2 | 3 | 4 | 5
  category: Category
}

const CATEGORY_STYLES: Record<Category, { border: string; dot: string; label: string }> = {
  offense:    { border: 'border-l-red-500',    dot: 'bg-red-500',    label: 'OFF' },
  defense:    { border: 'border-l-blue-500',   dot: 'bg-blue-500',   label: 'DEF' },
  automation: { border: 'border-l-emerald-500',dot: 'bg-emerald-500',label: 'AUT' },
  cloud:      { border: 'border-l-purple-500', dot: 'bg-purple-500', label: 'CLD' },
}

export function SkillBadge({ name, level, category }: SkillBadgeProps) {
  const s = CATEGORY_STYLES[category]
  return (
    <div
      className={`flex items-center justify-between gap-3 bg-zinc-900/60 border border-zinc-800 border-l-2 ${s.border} rounded px-3 py-2 font-mono text-xs group hover:bg-zinc-800/60 transition-colors relative overflow-hidden`}
    >
      {/* shimmer on hover */}
      <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out bg-gradient-to-r from-transparent via-white/5 to-transparent pointer-events-none" />

      <div className="flex items-center gap-2 min-w-0">
        <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${s.dot}`} />
        <span className="text-zinc-200 truncate">{name}</span>
      </div>

      <div className="flex items-center gap-1.5 shrink-0">
        <span className="text-zinc-600 text-[9px] tracking-widest mr-1">{s.label}</span>
        {Array.from({ length: 5 }, (_, i) => (
          <span
            key={i}
            className={`w-2 h-2 rounded-full border transition-colors ${
              i < level
                ? `${s.dot} border-transparent`
                : 'bg-transparent border-zinc-700'
            }`}
          />
        ))}
      </div>
    </div>
  )
}
