import { z } from 'zod'
import { callClaudeJSON } from './client'
import { logger } from '../../lib/logger'

const MealAnalysisSchema = z.object({
  description_normalized: z.string(),
  kcal: z.number().int().positive(),
  protein_g: z.number().nonnegative(),
  carbs_g: z.number().nonnegative(),
  fat_g: z.number().nonnegative(),
  confidence: z.enum(['high', 'medium', 'low']),
  meal_type: z.enum(['BREAKFAST', 'LUNCH', 'DINNER', 'SNACK']).nullable(),
  clarification_needed: z.string().nullable(),
})

export type MealAnalysis = z.infer<typeof MealAnalysisSchema>

const MEAL_ANALYZER_SYSTEM = `Je bent een nauwkeurige voedingsanalyse assistent voor een Nederlandse app.
Analyseer een maaltijdomschrijving en retourneer ALLEEN geldige JSON.

Regels:
- Gebruik standaard Nederlandse portiegroottes
- Bij twijfel: geef een gemiddelde schatting met "confidence": "low"
- Weiger NOOIT te schatten — geef altijd een best guess
- Macros moeten consistent zijn: (protein_g * 4 + carbs_g * 4 + fat_g * 9) ≈ kcal
- meal_type: bepaal op basis van het soort voedsel (niet tijdstip)
- clarification_needed: alleen invullen als de omschrijving te vaag is voor een redelijke schatting

Antwoord met JSON:
{
  "description_normalized": "gestandaardiseerde omschrijving",
  "kcal": 0,
  "protein_g": 0.0,
  "carbs_g": 0.0,
  "fat_g": 0.0,
  "confidence": "high|medium|low",
  "meal_type": "BREAKFAST|LUNCH|DINNER|SNACK|null",
  "clarification_needed": null
}`

export async function analyzeMeal(description: string): Promise<MealAnalysis> {
  const raw = await callClaudeJSON<unknown>({
    system: MEAL_ANALYZER_SYSTEM,
    messages: [{ role: 'user', content: `Analyseer deze maaltijd: "${description}"` }],
    maxTokens: 512,
  })

  const parsed = MealAnalysisSchema.safeParse(raw)
  if (!parsed.success) {
    logger.error({ raw, errors: parsed.error.issues }, 'Invalid meal analysis response from Claude')
    // Return a safe fallback rather than throwing
    return {
      description_normalized: description,
      kcal: 400,
      protein_g: 20,
      carbs_g: 40,
      fat_g: 15,
      confidence: 'low',
      meal_type: null,
      clarification_needed: 'Kun je iets meer beschrijven wat je gegeten hebt? Dan kan ik het beter inschatten.',
    }
  }

  return parsed.data
}
