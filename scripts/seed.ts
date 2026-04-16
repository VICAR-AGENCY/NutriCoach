/**
 * Development seed script.
 * Creates a test user with completed onboarding for local testing.
 */
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  // Create a test user with completed onboarding
  const user = await prisma.user.upsert({
    where: { phone: '31612345678' },
    update: {},
    create: {
      phone: '31612345678',
      onboarding_complete: true,
      onboarding_step: 7,
      calorie_budget: 1800,
      macros: { protein_g: 135, carbs_g: 180, fat_g: 60 },
      timezone: 'Europe/Amsterdam',
      profile: {
        name: 'Test Gebruiker',
        dob: '1990-05-15',
        gender: 'vrouw',
        height_cm: 168,
        weight_kg: 72,
        activity_level: 'licht_actief',
        diet_type: 'omnivoor',
        allergies: [],
        disliked_foods: [],
        tone: 'motiverend',
        checkin_times: {
          breakfast: '08:00',
          lunch: '12:30',
          dinner: '18:30',
        },
      },
      goal: {
        type: 'afvallen',
        target_weight_kg: 64,
        timeline_weeks: 16,
        pace_kg_per_week: 0.5,
      },
    },
  })

  // Seed a few meal logs for today
  const today = new Date()
  today.setHours(8, 0, 0, 0)

  await prisma.mealLog.createMany({
    skipDuplicates: true,
    data: [
      {
        user_id: user.id,
        description: '2 volkoren boterhammen met pindakaas en een koffie',
        meal_type: 'BREAKFAST',
        kcal: 420,
        protein_g: 14,
        carbs_g: 58,
        fat_g: 14,
        timestamp: today,
      },
      {
        user_id: user.id,
        description: 'Caesar salade met kip en een glas water',
        meal_type: 'LUNCH',
        kcal: 480,
        protein_g: 38,
        carbs_g: 22,
        fat_g: 26,
        timestamp: new Date(today.getTime() + 4.5 * 3600000),
      },
    ],
  })

  // Seed weight log
  await prisma.weightLog.upsert({
    where: { user_id_date: { user_id: user.id, date: new Date(today.toDateString()) } },
    update: {},
    create: {
      user_id: user.id,
      date: new Date(today.toDateString()),
      weight_kg: 72.0,
    },
  })

  console.log(`Seed complete. Test user phone: ${user.phone}`)
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
