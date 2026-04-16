export const ONBOARDING_STEPS = {
  WELCOME: 0,
  BASIC_INFO: 1,
  BODY_STATS: 2,
  GOAL: 3,
  LIFESTYLE: 4,
  FOOD_PREFS: 5,
  CHECKIN_PREFS: 6,
  COMPLETE: 7,
} as const

export type OnboardingStep = typeof ONBOARDING_STEPS[keyof typeof ONBOARDING_STEPS]

export const ONBOARDING_STEP_LABELS: Record<OnboardingStep, string> = {
  0: 'Welkom & Toestemming',
  1: 'Basisgegevens',
  2: 'Lichaamsgegevens',
  3: 'Doelstelling',
  4: 'Levensstijl',
  5: 'Voedingsvoorkeuren',
  6: 'Check-in Voorkeuren',
  7: 'Voltooid',
}
