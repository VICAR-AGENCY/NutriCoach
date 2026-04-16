import type { User } from '.prisma/client'
import { prisma } from '../../config/database'
import { sendTextMessage } from '../whatsapp/client'
import { templates } from '../whatsapp/templates'
import { analyzeMeal } from '../claude/meal-analyzer'
import { generateCoachResponse } from '../claude/coach'
import { callClaudeJSON } from '../claude/client'
import { parseWeight } from '@nutricoach/shared'
import { logger } from '../../lib/logger'

type Intent = 'MEAL_LOG' | 'WEIGHT_LOG' | 'QUESTION' | 'UNCLEAR'

interface IntentResult {
  intent: Intent
  confidence: 'high' | 'medium' | 'low'
}

const INTENT_SYSTEM = `Je bent een intent-detector voor een Nederlandse voedingscoach WhatsApp bot.
Classificeer het bericht als exact één van:
- MEAL_LOG: de gebruiker beschrijft iets wat hij/zij gegeten of gedronken heeft
- WEIGHT_LOG: de gebruiker geeft zijn/haar gewicht door (getal in kg)
- QUESTION: de gebruiker stelt een vraag of wil advies
- UNCLEAR: het bericht past niet in een van de categorieën

Antwoord ALLEEN met JSON: {"intent": "MEAL_LOG|WEIGHT_LOG|QUESTION|UNCLEAR", "confidence": "high|medium|low"}`

async function detectIntent(message: string): Promise<IntentResult> {
  try {
    const result = await callClaudeJSON<IntentResult>({
      system: INTENT_SYSTEM,
      messages: [{ role: 'user', content: message }],
      maxTokens: 64,
    })
    return result
  } catch {
    return { intent: 'UNCLEAR', confidence: 'low' }
  }
}

/**
 * Handle post-onboarding chat messages.
 * Detects intent and routes to the appropriate handler.
 */
export async function handleChat(user: User, message: string): Promise<void> {
  const { intent } = await detectIntent(message)

  logger.info({ phone: user.phone, intent }, 'Chat intent detected')

  switch (intent) {
    case 'MEAL_LOG':
      await handleMealLog(user, message)
      break
    case 'WEIGHT_LOG':
      await handleWeightLog(user, message)
      break
    case 'QUESTION':
      await handleQuestion(user, message)
      break
    default:
      await handleQuestion(user, message)
  }
}

async function handleMealLog(user: User, message: string): Promise<void> {
  const analysis = await analyzeMeal(message)

  if (analysis.clarification_needed) {
    await sendTextMessage(user.phone, templates.askClarification(analysis.clarification_needed))
    return
  }

  await prisma.mealLog.create({
    data: {
      user_id: user.id,
      description: analysis.description_normalized,
      meal_type: analysis.meal_type ?? undefined,
      kcal: analysis.kcal,
      protein_g: analysis.protein_g,
      carbs_g: analysis.carbs_g,
      fat_g: analysis.fat_g,
      raw_ai_response: analysis as any,
    },
  })

  // Get today's total to show remaining calories
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)

  const todayMeals = await prisma.mealLog.findMany({
    where: { user_id: user.id, timestamp: { gte: today, lt: tomorrow } },
  })

  const totalKcal = todayMeals.reduce((sum, m) => sum + m.kcal, 0)
  const calorieBudget = user.calorie_budget ?? 2000

  await sendTextMessage(
    user.phone,
    templates.mealLogged({
      kcal: analysis.kcal,
      calorie_budget: calorieBudget,
      protein_g: Math.round(analysis.protein_g),
    }),
  )

  // Check if they've significantly exceeded their budget — send a gentle note
  if (totalKcal > calorieBudget * 1.15) {
    const profile = user.profile as Record<string, unknown> | null
    const name = (profile?.name as string) ?? ''
    const over = totalKcal - calorieBudget
    await sendTextMessage(
      user.phone,
      `Je zit ${over} kcal boven je budget vandaag${name ? `, ${name}` : ''}. Geen zorgen — morgen is een nieuwe dag! 💪`,
    )
  }
}

async function handleWeightLog(user: User, message: string): Promise<void> {
  const weight = parseWeight(message)

  if (!weight) {
    await sendTextMessage(user.phone, 'Ik kon je gewicht niet lezen. Stuur het als een getal, bv: _74.5_')
    return
  }

  await prisma.weightLog.upsert({
    where: {
      user_id_date: {
        user_id: user.id,
        date: new Date(new Date().toDateString()),
      },
    },
    update: { weight_kg: weight },
    create: {
      user_id: user.id,
      date: new Date(new Date().toDateString()),
      weight_kg: weight,
    },
  })

  await sendTextMessage(user.phone, templates.weightLogged(weight))
}

async function handleQuestion(user: User, message: string): Promise<void> {
  const response = await generateCoachResponse(user, message)
  await sendTextMessage(user.phone, response)
}
