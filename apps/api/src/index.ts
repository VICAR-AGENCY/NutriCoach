import { buildApp } from './app'
import { config } from './config'
import { logger } from './lib/logger'
import { prisma } from './config/database'
import { startScheduler } from './services/scheduler/scheduler'

async function main() {
  try {
    // Verify DB connection
    await prisma.$connect()
    logger.info('Database connected')

    const app = await buildApp()

    await app.listen({ port: config.PORT, host: '0.0.0.0' })
    logger.info(`NutriCoach API running on port ${config.PORT}`)

    // Start the check-in scheduler
    startScheduler()
    logger.info('Check-in scheduler started')
  } catch (err) {
    logger.error(err, 'Failed to start server')
    await prisma.$disconnect()
    process.exit(1)
  }
}

// Graceful shutdown
async function shutdown(signal: string) {
  logger.info({ signal }, 'Shutting down...')
  await prisma.$disconnect()
  process.exit(0)
}

process.on('SIGINT', () => shutdown('SIGINT'))
process.on('SIGTERM', () => shutdown('SIGTERM'))

main()
