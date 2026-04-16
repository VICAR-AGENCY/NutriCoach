import cron from 'node-cron'
import { prisma } from '../../config/database'
import { scheduleUserCheckIns, startCheckInWorker } from './queue'
import { logger } from '../../lib/logger'

export function startScheduler(): void {
  // Start the BullMQ worker
  startCheckInWorker()

  // Daily cron at 00:05 UTC — schedule check-ins for all active users for today
  cron.schedule('5 0 * * *', async () => {
    await scheduleAllUserCheckIns()
  })

  // Also schedule on startup (in case server restarted after midnight)
  void scheduleAllUserCheckIns()

  logger.info('Scheduler initialized')
}

async function scheduleAllUserCheckIns(): Promise<void> {
  const today = new Date()
  logger.info({ date: today.toISOString() }, 'Scheduling check-ins for today')

  // Process users in batches to avoid overwhelming the DB
  const BATCH_SIZE = 100
  let cursor: string | undefined

  let totalScheduled = 0

  while (true) {
    const users = await prisma.user.findMany({
      where: { onboarding_complete: true },
      select: {
        id: true,
        phone: true,
        profile: true,
        timezone: true,
      },
      take: BATCH_SIZE,
      skip: cursor ? 1 : 0,
      cursor: cursor ? { id: cursor } : undefined,
      orderBy: { id: 'asc' },
    })

    if (users.length === 0) break

    for (const user of users) {
      try {
        const profile = user.profile as Record<string, unknown> | null
        const checkinTimes = profile?.checkin_times as
          | { breakfast: string; lunch: string; dinner: string }
          | undefined

        if (!checkinTimes) continue

        await scheduleUserCheckIns(
          user.id,
          user.phone,
          checkinTimes,
          user.timezone,
          today,
        )

        totalScheduled++
      } catch (err) {
        logger.error({ userId: user.id, err }, 'Failed to schedule check-ins for user')
      }
    }

    cursor = users[users.length - 1].id
    if (users.length < BATCH_SIZE) break
  }

  logger.info({ totalScheduled }, 'Daily check-in scheduling complete')
}
