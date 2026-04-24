'use client'

import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts'

interface Props {
  data: Array<{ date: string; weight_kg: number }>
  target?: number | null
}

export function WeightChart({ data, target }: Props) {
  if (data.length === 0) return (
    <p className="text-sm text-center py-6" style={{ color: 'var(--text-secondary)' }}>
      Nog geen gewicht gelogd. Stuur je gewicht via WhatsApp.
    </p>
  )

  const formatted = data.map(d => ({
    ...d,
    label: new Date(d.date).toLocaleDateString('nl-BE', { day: 'numeric', month: 'short' }),
  }))

  const min = Math.min(...data.map(d => d.weight_kg)) - 1
  const max = Math.max(...data.map(d => d.weight_kg)) + 1

  return (
    <ResponsiveContainer width="100%" height={200}>
      <LineChart data={formatted} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
        <XAxis dataKey="label" tick={{ fontSize: 11, fill: 'var(--text-secondary)' }} tickLine={false} axisLine={false} />
        <YAxis domain={[min, max]} tick={{ fontSize: 11, fill: 'var(--text-secondary)' }} tickLine={false} axisLine={false} />
        <Tooltip
          contentStyle={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, fontSize: 12 }}
          formatter={(v) => [`${v} kg`, 'Gewicht']}
        />
        {target && (
          <ReferenceLine y={target} stroke="var(--secondary)" strokeDasharray="4 4" label={{ value: 'Doel', fontSize: 11, fill: 'var(--secondary)' }} />
        )}
        <Line
          type="monotone"
          dataKey="weight_kg"
          stroke="var(--primary)"
          strokeWidth={2}
          dot={{ r: 3, fill: 'var(--primary)', strokeWidth: 0 }}
          activeDot={{ r: 5 }}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
