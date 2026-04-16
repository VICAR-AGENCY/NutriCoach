import type { FastifyInstance } from 'fastify'
import { prisma } from '../../config/database'

export async function dashboardRoutes(app: FastifyInstance) {
  // GET /dashboard — aggregated home screen data
  app.get('/', { onRequest: [app.authenticate] }, async (request, reply) => {
    const { userId } = request.user as { userId: string }

    const user = await prisma.user.findUnique({ where: { id: userId } })
    if (!user) return reply.status(404).send({ error: 'Gebruiker niet gevonden' })

    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    // Today's meals
    const todayMeals = await prisma.mealLog.findMany({
      where: { user_id: userId, timestamp: { gte: today, lt: tomorrow } },
    })

    const kcal_consumed = todayMeals.reduce((sum, m) => sum + m.kcal, 0)
    const protein_consumed = todayMeals.reduce((sum, m) => sum + m.protein_g, 0)
    const carbs_consumed = todayMeals.reduce((sum, m) => sum + m.carbs_g, 0)
    const fat_consumed = todayMeals.reduce((sum, m) => sum + m.fat_g, 0)

    // Latest weight
    const latestWeight = await prisma.weightLog.findFirst({
      where: { user_id: userId },
      orderBy: { date: 'desc' },
    })

    // Streak: consecutive days with at least one meal logged
    let streak = 0
    for (let i = 0; i < 365; i++) {
      const day = new Date()
      day.setDate(day.getDate() - i)
      day.setHours(0, 0, 0, 0)
      const nextDay = new Date(day)
      nextDay.setDate(nextDay.getDate() + 1)

      const count = await prisma.mealLog.count({
        where: { user_id: userId, timestamp: { gte: day, lt: nextDay } },
      })

      if (count > 0) streak++
      else break
    }

    const macros = user.macros as Record<string, number> | null
    const goal = user.goal as Record<string, unknown> | null

    return reply.send({
      calorie_budget: user.calorie_budget,
      kcal_consumed,
      macros_budget: macros,
      macros_consumed: {
        protein_g: Math.round(protein_consumed),
        carbs_g: Math.round(carbs_consumed),
        fat_g: Math.round(fat_consumed),
      },
      current_weight_kg: latestWeight?.weight_kg ?? null,
      target_weight_kg: (goal?.target_weight_kg as number) ?? null,
      streak_days: streak,
      today_meals: todayMeals,
    })
  })
}
