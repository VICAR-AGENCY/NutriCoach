import Fastify from 'fastify'
import helmet from '@fastify/helmet'
import cors from '@fastify/cors'
import sensible from '@fastify/sensible'
import jwt from '@fastify/jwt'
import rateLimit from '@fastify/rate-limit'
import { redisPlugin } from './plugins/redis'
import { authPlugin } from './plugins/auth'
import { registerRoutes } from './routes'
import { config } from './config'
import { logger } from './lib/logger'

export async function buildApp() {
  const app = Fastify({
    logger: false, // We use our own pino instance
    trustProxy: true,
  })

  // Security headers
  await app.register(helmet, {
    contentSecurityPolicy: false, // API only, no HTML
  })

  // CORS — restrict in production
  await app.register(cors, {
    origin: config.NODE_ENV === 'production' ? [config.API_URL] : true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  })

  // Sensible defaults (better error serialization, etc.)
  await app.register(sensible)

  // JWT authentication
  await app.register(jwt, {
    secret: config.JWT_SECRET,
    sign: { expiresIn: config.JWT_EXPIRY },
  })

  // Rate limiting
  await app.register(rateLimit, {
    max: config.RATE_LIMIT_MAX,
    timeWindow: config.RATE_LIMIT_WINDOW_MS,
errorResponseBuilder: () => ({
      statusCode: 429,
      error: 'Too Many Requests',
      message: 'Te veel verzoeken. Probeer het straks opnieuw.',
    }),
  })

  // Redis
  await app.register(redisPlugin)

  // Auth decorator (authenticate hook for protected routes)
  await app.register(authPlugin)

  // Routes
  await app.register(registerRoutes, { prefix: '/api/v1' })

  // Health check (outside versioned prefix)
  app.get('/health', async () => ({ status: 'ok', timestamp: new Date().toISOString() }))

  // Global error handler
  app.setErrorHandler((error, request, reply) => {
    logger.error({ err: error, url: request.url }, 'Unhandled error')

    const statusCode = error.statusCode ?? 500
    reply.status(statusCode).send({
      statusCode,
      error: error.name ?? 'Internal Server Error',
      message: config.NODE_ENV === 'production' && statusCode === 500
        ? 'Er is een interne fout opgetreden'
        : error.message,
    })
  })

  return app
}
