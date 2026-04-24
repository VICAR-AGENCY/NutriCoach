'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { api } from '@/lib/api'
import { CalorieRing } from '@/components/CalorieRing'
import { MacroBars } from '@/components/MacroBars'
import { WeightChart } from '@/components/WeightChart'
import { MealCard } from '@/components/MealCard'

type Dashboard = Awaited<ReturnType<typeof api.dashboard>>
type WeightHistory = Awaited<ReturnType<typeof api.weightHistory>>

function greeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Goedemorgen'
  if (h < 18) return 'Goedemiddag'
  return 'Goedenavond'
}

export default function Home() {
  const router = useRouter()
  const [data, setData] = useState<Dashboard | null>(null)
  const [weights, setWeights] = useState<WeightHistory>([])
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState<'vandaag' | 'gewicht'>('vandaag')

  useEffect(() => {
    const token = localStorage.getItem('jwt_token')
    if (!token) { router.push('/login'); return }

    Promise.all([api.dashboard(), api.weightHistory(30), api.me()])
      .then(([dash, w, me]) => {
        setData(dash)
        setWeights(w)
        const profile = me.profile as Record<string, string> | null
        setName(profile?.name ?? '')
      })
      .catch(() => router.push('/login'))
      .finally(() => setLoading(false))
  }, [router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg)' }}>
        <div className="w-8 h-8 rounded-full border-2 animate-spin" style={{ borderColor: 'var(--primary)', borderTopColor: 'transparent' }} />
      </div>
    )
  }

  if (!data) return null

  const target = data.target_weight_kg

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)' }}>
      <div className="max-w-md mx-auto px-4 pb-10">
        {/* Header */}
        <div className="flex justify-between items-center pt-8 pb-4">
          <div>
            <h1 className="text-xl font-semibold" style={{ color: 'var(--text)' }}>
              {greeting()}{name ? `, ${name}` : ''}
            </h1>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Jouw voortgang van vandaag</p>
          </div>
          <div className="px-3 py-1 rounded-full text-sm font-semibold" style={{ background: 'var(--secondary-light)', color: 'var(--secondary)' }}>
            {data.streak_days} {data.streak_days === 1 ? 'dag' : 'dagen'}
          </div>
        </div>

        {/* Calorie ring */}
        <div className="rounded-2xl p-6 mb-4 flex items-center gap-6" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
          <CalorieRing consumed={data.kcal_consumed} budget={data.calorie_budget} size={140} />
          <div className="flex-1">
            <div className="mb-3">
              <div className="text-2xl font-semibold" style={{ color: 'var(--text)' }}>{data.kcal_consumed}</div>
              <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>van {data.calorie_budget} kcal gegeten</div>
            </div>
            {data.current_weight_kg && target && (
              <div className="flex items-center gap-2 text-sm">
                <span style={{ color: 'var(--text)' }}>{data.current_weight_kg} kg</span>
                <span style={{ color: 'var(--text-disabled)' }}>→</span>
                <span style={{ color: 'var(--primary)' }}>{target} kg</span>
              </div>
            )}
          </div>
        </div>

        {/* Macros */}
        {data.macros_budget && data.macros_consumed && (
          <div className="rounded-2xl p-5 mb-4" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
            <h2 className="text-sm font-semibold mb-4" style={{ color: 'var(--text)' }}>Macro&apos;s vandaag</h2>
            <MacroBars consumed={data.macros_consumed} budget={data.macros_budget} />
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-2 mb-4">
          {(['vandaag', 'gewicht'] as const).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className="px-4 py-2 rounded-full text-sm font-medium transition-colors"
              style={{
                background: tab === t ? 'var(--primary)' : 'var(--surface)',
                color: tab === t ? '#fff' : 'var(--text-secondary)',
                border: '1px solid var(--border)',
              }}
            >
              {t === 'vandaag' ? 'Vandaag gegeten' : 'Gewicht'}
            </button>
          ))}
        </div>

        {tab === 'vandaag' && (
          <div>
            {data.today_meals.length === 0 ? (
              <div className="rounded-2xl p-8 text-center" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  Nog niets gelogd vandaag. Stuur een WhatsApp bericht naar NutriCoach om je maaltijd te loggen.
                </p>
              </div>
            ) : (
              data.today_meals.map(meal => <MealCard key={meal.id} {...meal} />)
            )}
          </div>
        )}

        {tab === 'gewicht' && (
          <div className="rounded-2xl p-5" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
            <h2 className="text-sm font-semibold mb-4" style={{ color: 'var(--text)' }}>Gewicht (30 dagen)</h2>
            <WeightChart data={weights} target={target} />
            {data.current_weight_kg && (
              <div className="mt-4 flex justify-between text-sm">
                <div>
                  <div className="font-semibold" style={{ color: 'var(--text)' }}>{data.current_weight_kg} kg</div>
                  <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>Huidig</div>
                </div>
                {target && (
                  <div className="text-right">
                    <div className="font-semibold" style={{ color: 'var(--primary)' }}>{target} kg</div>
                    <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>Doel</div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Logout */}
        <button
          onClick={() => { localStorage.removeItem('jwt_token'); router.push('/login') }}
          className="mt-8 w-full text-sm"
          style={{ color: 'var(--text-disabled)' }}
        >
          Uitloggen
        </button>
      </div>
    </div>
  )
}
