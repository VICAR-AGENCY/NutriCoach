import { callClaude } from './client'
import { buildCoachSystemPrompt } from './prompts/system'
import type { User } from '.prisma/client'
import { prisma } from '../../config/database'

interface DailyContext {
  kcal_consumed: number
  calorie_budget: number
  protein_g: number
  streak_days: number
}

async function getDailyContext(userId: string, calorieBudget: number): Promise<DailyContext> {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)

  const meals = await prisma.mealLog.findMany({
    where: { user_id: userId, timestamp: { gte: today, lt: tomorrow } },
  })

  const kcal_consumed = meals.reduce((sum, m) => sum + m.kcal, 0)
  const protein_g = Math.round(meals.reduce((sum, m) => sum + m.protein_g, 0))

  // Calculate streak: count consecutive days with at least 1 meal logged
  const recentLogs = await prisma.mealLog.findMany({
    where: { user_id: userId },
    orderBy: { timestamp: 'desc' },
    take: 100,
    distinct: ['user_id'],
  })

  // Simple streak: how many of the last N days had a meal logged
  let streak_days = 0
  for (let i = 0; i < 30; i++) {
    const day = new Date()
    day.setDate(day.getDate() - i)
    day.setHours(0, 0, 0, 0)
    const nextDay = new Date(day)
    nextDay.setDate(nextDay.getDate() + 1)

    const count = await prisma.mealLog.count({
      where: { user_id: userId, timestamp: { gte: day, lt: nextDay } },
    })
    if (count > 0) {
      streak_days++
    } else {
      break
    }
  }

  return { kcal_consumed, calorie_budget: calorieBudget, protein_g, streak_days }
}

/**
 * Generate a coaching response for a free-form user message.
 */
export async function generateCoachResponse(user: User, message: string): Promise<string> {
  const profile = user.profile as Record<string, unknown> | null
  const calorieBudget = user.calorie_budget ?? 2000

  const context = await getDailyContext(user.id, calorieBudget)

  const contextNote = `
Huidige dagvoortgang:
- Gegeten: ${context.kcal_consumed} / ${context.calorie_budget} kcal
- Eiwitten vandaag: ${context.protein_g}g
- Streak: ${context.streak_days} dagen
- Toon voorkeur: ${(profile?.tone as string) ?? 'motiverend'}`

  const system = buildCoachSystemPrompt(user) + contextNote

  return callClaude({
    system,
    messages: [{ role: 'user', content: message }],
    maxTokens: 300,
  })
}
