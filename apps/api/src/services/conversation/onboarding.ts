import type { User } from '.prisma/client'
import { prisma } from '../../config/database'
import { sendTextMessage } from '../whatsapp/client'
import { templates } from '../whatsapp/templates'
import { callClaudeJSON } from '../claude/client'
import {
  ONBOARDING_SYSTEM_PROMPT,
  extractBasicInfoPrompt,
  extractBodyStatsPrompt,
  extractGoalPrompt,
  extractLifestylePrompt,
  extractFoodPrefsPrompt,
  extractCheckinPrefsPrompt,
} from '../claude/prompts/onboarding'
import {
  calculateCalorieBudget,
  calculateMacros,
  ageFromDob,
  ONBOARDING_STEPS,
} from '@nutricoach/shared'
import { logger } from '../../lib/logger'
import { persistMessages, persistSystemMessage } from './history'

/**
 * Route the user through the 7-step onboarding flow.
 * State is stored in User.onboarding_step (0–7).
 */
export async function handleOnboarding(user: User, message: string): Promise<void> {
  const step = user.onboarding_step

  logger.info({ phone: user.phone, step }, 'Onboarding step')

  switch (step) {
    case ONBOARDING_STEPS.WELCOME:
      await handleWelcome(user, message)
      break
    case ONBOARDING_STEPS.BASIC_INFO:
      await handleBasicInfo(user, message)
      break
    case ONBOARDING_STEPS.BODY_STATS:
      await handleBodyStats(user, message)
      break
    case ONBOARDING_STEPS.GOAL:
      await handleGoal(user, message)
      break
    case ONBOARDING_STEPS.LIFESTYLE:
      await handleLifestyle(user, message)
      break
    case ONBOARDING_STEPS.FOOD_PREFS:
      await handleFoodPrefs(user, message)
      break
    case ONBOARDING_STEPS.CHECKIN_PREFS:
      await handleCheckinPrefs(user, message)
      break
    default:
      await sendTextMessage(user.phone, templates.welcome())
      await prisma.user.update({ where: { id: user.id }, data: { onboarding_step: 0 } })
  }
}

async function handleWelcome(user: User, message: string): Promise<void> {
  const normalized = message.toLowerCase().trim()

  if (normalized === 'ja' || normalized === 'yes' || normalized === 'ok' || normalized === 'oke') {
    await prisma.user.update({ where: { id: user.id }, data: { onboarding_step: 1 } })
    const q = templates.askBasicInfo()
    await sendTextMessage(user.phone, q)
    await persistMessages(user.id, message, q)
  } else if (normalized === 'stop' || normalized === 'nee' || normalized === 'no') {
    await sendTextMessage(user.phone, templates.gdprDeclined())
  } else {
    // First message from any user — send the welcome
    const welcome = templates.welcome()
    await sendTextMessage(user.phone, welcome)
    await persistSystemMessage(user.id, welcome)
  }
}

async function handleBasicInfo(user: User, message: string): Promise<void> {
  const result = await callClaudeJSON<{
    valid: boolean
    name?: string
    dob?: string
    gender?: string
    error_message?: string | null
  }>({
    system: ONBOARDING_SYSTEM_PROMPT,
    messages: [
      { role: 'user', content: `${extractBasicInfoPrompt}\n\nBericht: "${message}"` },
    ],
  })

  if (!result.valid || !result.name || !result.dob || !result.gender) {
    await sendTextMessage(
      user.phone,
      result.error_message ?? 'Ik begrijp je antwoord niet helemaal. Kun je je naam, geboortedatum en geslacht nog eens sturen? Bv: _Lisa, 15-03-1990, vrouw_',
    )
    return
  }

  const currentProfile = (user.profile as Record<string, unknown>) ?? {}
  await prisma.user.update({
    where: { id: user.id },
    data: {
      onboarding_step: 2,
      profile: {
        ...currentProfile,
        name: result.name,
        dob: result.dob,
        gender: result.gender,
      },
    },
  })

  const q1 = templates.askBodyStats(result.name)
  await sendTextMessage(user.phone, q1)
  await persistMessages(user.id, message, q1)
}

async function handleBodyStats(user: User, message: string): Promise<void> {
  const result = await callClaudeJSON<{
    valid: boolean
    weight_kg?: number
    height_cm?: number
    error_message?: string | null
  }>({
    system: ONBOARDING_SYSTEM_PROMPT,
    messages: [{ role: 'user', content: `${extractBodyStatsPrompt}\n\nBericht: "${message}"` }],
  })

  if (!result.valid || !result.weight_kg || !result.height_cm) {
    await sendTextMessage(
      user.phone,
      result.error_message ?? 'Kun je je gewicht en lengte nog eens sturen? Bv: _72 kg, 168 cm_',
    )
    return
  }

  const currentProfile = (user.profile as Record<string, unknown>) ?? {}
  await prisma.user.update({
    where: { id: user.id },
    data: {
      onboarding_step: 3,
      profile: { ...currentProfile, weight_kg: result.weight_kg, height_cm: result.height_cm },
    },
  })

  const q2 = templates.askGoal()
  await sendTextMessage(user.phone, q2)
  await persistMessages(user.id, message, q2)
}

async function handleGoal(user: User, message: string): Promise<void> {
  const result = await callClaudeJSON<{
    valid: boolean
    goal_type?: string
    target_weight_kg?: number | null
    timeline_weeks?: number | null
    pace_kg_per_week?: number | null
    error_message?: string | null
  }>({
    system: ONBOARDING_SYSTEM_PROMPT,
    messages: [{ role: 'user', content: `${extractGoalPrompt}\n\nBericht: "${message}"` }],
  })

  if (!result.valid || !result.goal_type) {
    await sendTextMessage(user.phone, result.error_message ?? 'Wat is je doel? Afvallen, gewicht houden, aankomen, of gezonder eten?')
    return
  }

  await prisma.user.update({
    where: { id: user.id },
    data: {
      onboarding_step: 4,
      goal: {
        type: result.goal_type,
        target_weight_kg: result.target_weight_kg ?? null,
        timeline_weeks: result.timeline_weeks ?? null,
        pace_kg_per_week: result.pace_kg_per_week ?? 0.5,
      },
    },
  })

  const q3 = templates.askLifestyle()
  await sendTextMessage(user.phone, q3)
  await persistMessages(user.id, message, q3)
}

async function handleLifestyle(user: User, message: string): Promise<void> {
  const result = await callClaudeJSON<{
    valid: boolean
    activity_level?: string
    error_message?: string | null
  }>({
    system: ONBOARDING_SYSTEM_PROMPT,
    messages: [{ role: 'user', content: `${extractLifestylePrompt}\n\nBericht: "${message}"` }],
  })

  if (!result.valid || !result.activity_level) {
    await sendTextMessage(user.phone, result.error_message ?? 'Hoe actief ben je? Zittend, licht actief, matig actief of zeer actief?')
    return
  }

  const currentProfile = (user.profile as Record<string, unknown>) ?? {}
  await prisma.user.update({
    where: { id: user.id },
    data: {
      onboarding_step: 5,
      profile: { ...currentProfile, activity_level: result.activity_level },
    },
  })

  const q4 = templates.askFoodPrefs()
  await sendTextMessage(user.phone, q4)
  await persistMessages(user.id, message, q4)
}

async function handleFoodPrefs(user: User, message: string): Promise<void> {
  const result = await callClaudeJSON<{
    valid: boolean
    diet_type?: string
    allergies?: string[]
    disliked_foods?: string[]
    error_message?: string | null
  }>({
    system: ONBOARDING_SYSTEM_PROMPT,
    messages: [{ role: 'user', content: `${extractFoodPrefsPrompt}\n\nBericht: "${message}"` }],
  })

  if (!result.valid || !result.diet_type) {
    await sendTextMessage(user.phone, result.error_message ?? 'Wat is je dieetwens? Omnivoor, vegetarisch, veganistisch of pescatarisch?')
    return
  }

  const currentProfile = (user.profile as Record<string, unknown>) ?? {}
  await prisma.user.update({
    where: { id: user.id },
    data: {
      onboarding_step: 6,
      profile: {
        ...currentProfile,
        diet_type: result.diet_type,
        allergies: result.allergies ?? [],
        disliked_foods: result.disliked_foods ?? [],
      },
    },
  })

  const q5 = templates.askCheckinPrefs()
  await sendTextMessage(user.phone, q5)
  await persistMessages(user.id, message, q5)
}

async function handleCheckinPrefs(user: User, message: string): Promise<void> {
  const result = await callClaudeJSON<{
    valid: boolean
    breakfast_time?: string
    lunch_time?: string
    dinner_time?: string
    tone?: string
    error_message?: string | null
  }>({
    system: ONBOARDING_SYSTEM_PROMPT,
    messages: [{ role: 'user', content: `${extractCheckinPrefsPrompt}\n\nBericht: "${message}"` }],
  })

  if (!result.valid || !result.breakfast_time || !result.lunch_time || !result.dinner_time) {
    await sendTextMessage(user.phone, result.error_message ?? 'Kun je je eetijden sturen? Bv: _Ontbijt 7:30, lunch 12:30, diner 18:30_')
    return
  }

  // Get current profile data to calculate TDEE
  const profile = (user.profile as Record<string, unknown>) ?? {}
  const goal = (user.goal as Record<string, unknown>) ?? {}

  const dob = profile.dob as string
  const age = dob ? ageFromDob(dob) : 30

  const calorieBudget = calculateCalorieBudget({
    weight_kg: (profile.weight_kg as number) ?? 70,
    height_cm: (profile.height_cm as number) ?? 170,
    age_years: age,
    gender: (profile.gender as 'man' | 'vrouw' | 'anders') ?? 'vrouw',
    activity_level: (profile.activity_level as 'zittend' | 'licht_actief' | 'matig_actief' | 'zeer_actief') ?? 'licht_actief',
    goal_type: (goal.type as 'afvallen' | 'gewicht_houden' | 'aankomen' | 'gezonder_eten') ?? 'afvallen',
    pace_kg_per_week: (goal.pace_kg_per_week as 0.5 | 0.75 | 1.0) ?? 0.5,
  })

  const macros = calculateMacros(calorieBudget)

  await prisma.user.update({
    where: { id: user.id },
    data: {
      onboarding_step: 7,
      onboarding_complete: true,
      calorie_budget: calorieBudget,
      macros: macros as any,
      profile: {
        ...profile,
        tone: result.tone ?? 'motiverend',
        checkin_times: {
          breakfast: result.breakfast_time,
          lunch: result.lunch_time,
          dinner: result.dinner_time,
        },
      },
    },
  })

  const name = (profile.name as string) ?? 'je'
  const completionMsg = templates.onboardingComplete({
    name,
    calorie_budget: calorieBudget,
    protein_g: macros.protein_g,
    carbs_g: macros.carbs_g,
    fat_g: macros.fat_g,
  })
  await sendTextMessage(user.phone, completionMsg)
  await persistMessages(user.id, message, completionMsg)

  logger.info({ phone: user.phone, calorieBudget }, 'Onboarding completed')
}
