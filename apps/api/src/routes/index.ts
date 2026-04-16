import type { FastifyInstance } from 'fastify'
import { whatsappRoutes } from './webhooks/whatsapp'
import { authRoutes } from './auth'
import { usersRoutes } from './users'
import { mealsRoutes } from './meals'
import { weightRoutes } from './weight'
import { dashboardRoutes } from './dashboard'

export async function registerRoutes(app: FastifyInstance) {
  await app.register(whatsappRoutes, { prefix: '/webhooks' })
  await app.register(authRoutes, { prefix: '/auth' })
  await app.register(usersRoutes, { prefix: '/users' })
  await app.register(mealsRoutes, { prefix: '/meals' })
  await app.register(weightRoutes, { prefix: '/weight' })
  await app.register(dashboardRoutes, { prefix: '/dashboard' })
}
