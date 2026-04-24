import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'NutriCoach',
  description: 'Jouw persoonlijke voedingscoach',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="nl" className="h-full">
      <body className="min-h-full">{children}</body>
    </html>
  )
}
