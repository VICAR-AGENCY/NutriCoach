'use client'

interface Macros {
  protein_g: number
  carbs_g: number
  fat_g: number
}

interface Props {
  consumed: Macros
  budget: Macros
}

function Bar({ label, consumed, budget, color }: { label: string; consumed: number; budget: number; color: string }) {
  const pct = Math.min((consumed / budget) * 100, 100)
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs">
        <span style={{ color: 'var(--text-secondary)' }}>{label}</span>
        <span style={{ color: 'var(--text)' }}>{Math.round(consumed)}g / {Math.round(budget)}g</span>
      </div>
      <div className="h-2 rounded-full" style={{ background: 'var(--border)' }}>
        <div
          className="h-2 rounded-full transition-all duration-500"
          style={{ width: `${pct}%`, background: color }}
        />
      </div>
    </div>
  )
}

export function MacroBars({ consumed, budget }: Props) {
  return (
    <div className="space-y-3">
      <Bar label="Eiwit" consumed={consumed.protein_g} budget={budget.protein_g} color="var(--protein)" />
      <Bar label="Koolhydraten" consumed={consumed.carbs_g} budget={budget.carbs_g} color="var(--carbs)" />
      <Bar label="Vet" consumed={consumed.fat_g} budget={budget.fat_g} color="var(--fat)" />
    </div>
  )
}
