'use client'

interface Props {
  description: string
  kcal: number
  protein_g: number
  carbs_g: number
  fat_g: number
  meal_type: string | null
  timestamp: string
}

const mealTypeLabel: Record<string, string> = {
  BREAKFAST: 'Ontbijt',
  LUNCH: 'Lunch',
  DINNER: 'Diner',
  SNACK: 'Snack',
}

export function MealCard({ description, kcal, protein_g, carbs_g, fat_g, meal_type, timestamp }: Props) {
  const time = new Date(timestamp).toLocaleTimeString('nl-BE', { hour: '2-digit', minute: '2-digit' })

  return (
    <div className="rounded-xl p-4 mb-2" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
      <div className="flex justify-between items-start mb-2">
        <div className="flex-1 mr-2">
          {meal_type && (
            <span className="text-xs font-medium px-2 py-0.5 rounded-full mr-2" style={{ background: 'var(--primary-light)', color: 'var(--primary)' }}>
              {mealTypeLabel[meal_type] ?? meal_type}
            </span>
          )}
          <p className="text-sm mt-1" style={{ color: 'var(--text)' }}>{description}</p>
        </div>
        <div className="text-right shrink-0">
          <div className="font-semibold text-sm" style={{ color: 'var(--primary)' }}>{kcal} kcal</div>
          <div className="text-xs" style={{ color: 'var(--text-disabled)' }}>{time}</div>
        </div>
      </div>
      <div className="flex gap-3 text-xs" style={{ color: 'var(--text-secondary)' }}>
        <span style={{ color: 'var(--protein)' }}>{Math.round(protein_g)}g eiwit</span>
        <span style={{ color: 'var(--carbs)' }}>{Math.round(carbs_g)}g koolh.</span>
        <span style={{ color: 'var(--fat)' }}>{Math.round(fat_g)}g vet</span>
      </div>
    </div>
  )
}
