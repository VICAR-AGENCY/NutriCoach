'use client'

interface Props {
  consumed: number
  budget: number
  size?: number
}

export function CalorieRing({ consumed, budget, size = 160 }: Props) {
  const pct = Math.min(consumed / budget, 1)
  const r = (size - 20) / 2
  const circ = 2 * Math.PI * r
  const offset = circ * (1 - pct)
  const remaining = Math.max(budget - consumed, 0)
  const over = consumed > budget

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--border)" strokeWidth={12} />
        <circle
          cx={size / 2} cy={size / 2} r={r}
          fill="none"
          stroke={over ? 'var(--error)' : 'var(--primary)'}
          strokeWidth={12}
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 0.6s ease' }}
        />
      </svg>
      <div className="absolute text-center">
        <div className="text-3xl font-semibold" style={{ color: over ? 'var(--error)' : 'var(--primary)' }}>
          {remaining}
        </div>
        <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>kcal over</div>
      </div>
    </div>
  )
}
