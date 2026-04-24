'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { api } from '@/lib/api'

export default function LoginPage() {
  const router = useRouter()
  const [phone, setPhone] = useState('')
  const [otp, setOtp] = useState('')
  const [step, setStep] = useState<'phone' | 'otp'>('phone')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleRequestOtp(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await api.requestOtp(phone)
      setStep('otp')
    } catch {
      setError('Kon OTP niet versturen. Controleer je nummer.')
    } finally {
      setLoading(false)
    }
  }

  async function handleVerifyOtp(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const { token } = await api.verifyOtp(phone, otp)
      localStorage.setItem('jwt_token', token)
      router.push('/')
    } catch {
      setError('Verkeerde code. Probeer opnieuw.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'var(--bg)' }}>
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold mb-1" style={{ color: 'var(--text)' }}>NutriCoach</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Inloggen met je WhatsApp nummer</p>
        </div>

        <div className="rounded-2xl p-6 shadow-sm" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
          {step === 'phone' ? (
            <form onSubmit={handleRequestOtp} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text)' }}>
                  Telefoonnummer
                </label>
                <input
                  type="tel"
                  placeholder="+32 468 29 93 81"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-xl text-sm outline-none"
                  style={{ border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text)' }}
                />
              </div>
              {error && <p className="text-sm" style={{ color: 'var(--error)' }}>{error}</p>}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl text-sm font-semibold text-white transition-opacity disabled:opacity-60"
                style={{ background: 'var(--primary)' }}
              >
                {loading ? 'Versturen...' : 'Stuur code via WhatsApp'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text)' }}>
                  Code uit WhatsApp
                </label>
                <input
                  type="text"
                  placeholder="123456"
                  value={otp}
                  onChange={e => setOtp(e.target.value)}
                  required
                  autoFocus
                  className="w-full px-4 py-3 rounded-xl text-sm outline-none text-center tracking-widest text-lg"
                  style={{ border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text)' }}
                />
              </div>
              {error && <p className="text-sm" style={{ color: 'var(--error)' }}>{error}</p>}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl text-sm font-semibold text-white transition-opacity disabled:opacity-60"
                style={{ background: 'var(--primary)' }}
              >
                {loading ? 'Controleren...' : 'Inloggen'}
              </button>
              <button
                type="button"
                onClick={() => setStep('phone')}
                className="w-full text-sm"
                style={{ color: 'var(--text-secondary)' }}
              >
                Ander nummer gebruiken
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
