import fp from 'fastify-plugin'
import type { FastifyInstance } from 'fastify'
import Redis from 'ioredis'
import { config } from '../config'
import { logger } from '../lib/logger'

declare module 'fastify' {
  interface FastifyInstance {
    redis: Redis
  }
}

export const redisPlugin = fp(async (fastify: FastifyInstance) => {
  const redis = new Redis(config.REDIS_URL, {
    maxRetriesPerRequest: 3,
    lazyConnect: true,
  })

  redis.on('error', (err) => {
    logger.error({ err }, 'Redis connection error')
  })

  redis.on('connect', () => {
    logger.info('Redis connected')
  })

  await redis.connect()

  fastify.decorate('redis', redis)

  fastify.addHook('onClose', async () => {
    await redis.quit()
  })
})
