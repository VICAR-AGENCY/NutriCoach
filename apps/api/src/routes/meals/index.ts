import type { FastifyInstance } from 'fastify'
import { prisma } from '../../config/database'

export async function mealsRoutes(app: FastifyInstance) {
  // GET /meals?date=YYYY-MM-DD
  app.get<{ Querystring: { date?: string } }>(
    '/',
    { onRequest: [app.authenticate] },
    async (request, reply) => {
      const { userId } = request.user as { userId: string }
      const date = request.query.date ? new Date(request.query.date) : new Date()
      const start = new Date(date)
      start.setHours(0, 0, 0, 0)
      const end = new Date(start)
      end.setDate(end.getDate() + 1)

      const meals = await prisma.mealLog.findMany({
        where: { user_id: userId, timestamp: { gte: start, lt: end } },
        orderBy: { timestamp: 'asc' },
      })

      return reply.send(meals)
    },
  )

  // POST /meals (manual log from app)
  app.post<{
    Body: { description: string; kcal: number; protein_g: number; carbs_g: number; fat_g: number; meal_type?: string }
  }>(
    '/',
    { onRequest: [app.authenticate] },
    async (request, reply) => {
      const { userId } = request.user as { userId: string }
      const meal = await prisma.mealLog.create({
        data: {
          user_id: userId,
          ...request.body,
        } as Parameters<typeof prisma.mealLog.create>[0]['data'],
      })
      return reply.status(201).send(meal)
    },
  )
}
