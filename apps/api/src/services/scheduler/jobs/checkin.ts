import { prisma } from '../../../config/database'
import { sendTextMessage } from '../../whatsapp/client'
import { templates } from '../../whatsapp/templates'
import { logger } from '../../../lib/logger'
import type { CheckInJobData } from '../queue'

const MEAL_TYPE_LABELS = {
  BREAKFAST: 'ontbijt',
  LUNCH: 'lunch',
  DINNER: 'diner',
} as const

/**
 * Process a scheduled check-in job.
 * Sends a WhatsApp message to the user and marks the check-in as sent.
 */
export async function processCheckInJob(data: CheckInJobData): Promise<void> {
  const { userId, phone, type, checkInId } = data

  // Verify the check-in hasn't already been completed
  const checkIn = await prisma.checkIn.findUnique({ where: { id: checkInId } })
  if (!checkIn || checkIn.completed) {
    logger.debug({ checkInId, type }, 'Check-in already completed, skipping')
    return
  }

  const user = await prisma.user.findUnique({ where: { id: userId } })
  if (!user || !user.onboarding_complete) {
    logger.debug({ userId, type }, 'User not found or not onboarded, skipping check-in')
    return
  }

  const profile = user.profile as Record<string, unknown> | null
  const name = (profile?.name as string) ?? ''

  let message: string

  switch (type) {
    case 'BREAKFAST':
    case 'LUNCH':
    case 'DINNER': {
      const label = MEAL_TYPE_LABELS[type]
      message = templates.mealCheckin(label, name)
      break
    }
    case 'WEIGHT':
      message = templates.weightCheckin(name)
      break
    case 'WEEKLY_SUMMARY': {
      const weekSummary = await getWeekSummary(userId, user.calorie_budget ?? 2000)
      message = templates.weeklyOverview({
        name,
        avg_kcal: weekSummary.avg_kcal,
        calorie_budget: user.calorie_budget ?? 2000,
        weight_change: weekSummary.weight_change,
      })
      break
    }
    default:
      logger.warn({ type }, 'Unknown check-in type')
      return
  }

  await sendTextMessage(phone, message)

  logger.info({ userId, type, phone }, 'Check-in sent')
}

async function getWeekSummary(
  userId: string,
  calorieBudget: number,
): Promise<{ avg_kcal: number; weight_change: number }> {
  const sevenDaysAgo = new Date()
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

  const meals = await prisma.mealLog.findMany({
    where: { user_id: userId, timestamp: { gte: sevenDaysAgo } },
  })

  const totalKcal = meals.reduce((sum, m) => sum + m.kcal, 0)
  const avg_kcal = meals.length > 0 ? Math.round(totalKcal / 7) : 0

  // Weight change: last weight vs weight 7 days ago
  const weights = await prisma.weightLog.findMany({
    where: { user_id: userId, date: { gte: sevenDaysAgo } },
    orderBy: { date: 'asc' },
  })

  const weight_change =
    weights.length >= 2
      ? weights[weights.length - 1].weight_kg - weights[0].weight_kg
      : 0

  return { avg_kcal, weight_change }
}
