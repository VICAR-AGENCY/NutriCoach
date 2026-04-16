import type { FastifyInstance } from 'fastify'
import { prisma } from '../../config/database'

export async function weightRoutes(app: FastifyInstance) {
  // GET /weight?days=30
  app.get<{ Querystring: { days?: string } }>(
    '/',
    { onRequest: [app.authenticate] },
    async (request, reply) => {
      const { userId } = request.user as { userId: string }
      const days = parseInt(request.query.days ?? '30', 10)
      const since = new Date()
      since.setDate(since.getDate() - days)

      const logs = await prisma.weightLog.findMany({
        where: { user_id: userId, date: { gte: since } },
        orderBy: { date: 'asc' },
      })

      return reply.send(logs)
    },
  )

  // POST /weight
  app.post<{ Body: { weight_kg: number; date?: string } }>(
    '/',
    { onRequest: [app.authenticate] },
    async (request, reply) => {
      const { userId } = request.user as { userId: string }
      const date = request.body.date ? new Date(request.body.date) : new Date()
      date.setHours(0, 0, 0, 0)

      const log = await prisma.weightLog.upsert({
        where: { user_id_date: { user_id: userId, date } },
        update: { weight_kg: request.body.weight_kg },
        create: { user_id: userId, date, weight_kg: request.body.weight_kg },
      })

      return reply.status(201).send(log)
    },
  )
}
