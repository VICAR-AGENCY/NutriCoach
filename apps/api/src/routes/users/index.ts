import type { FastifyInstance } from 'fastify'
import { prisma } from '../../config/database'

export async function usersRoutes(app: FastifyInstance) {
  // GET /users/me
  app.get('/me', { onRequest: [app.authenticate] }, async (request, reply) => {
    const { userId } = request.user as { userId: string }
    const user = await prisma.user.findUnique({ where: { id: userId } })
    if (!user) return reply.status(404).send({ error: 'Gebruiker niet gevonden' })
    return reply.send(user)
  })

  // PUT /users/me/fcm-token
  app.put<{ Body: { fcm_token: string } }>(
    '/me/fcm-token',
    { onRequest: [app.authenticate] },
    async (request, reply) => {
      const { userId } = request.user as { userId: string }
      await prisma.user.update({
        where: { id: userId },
        data: { fcm_token: request.body.fcm_token },
      })
      return reply.send({ ok: true })
    },
  )
}
