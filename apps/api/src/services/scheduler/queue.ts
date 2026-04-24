import { Queue, Worker, type Job } from 'bullmq'
import Redis from 'ioredis'
import { config } from '../../config'
import { logger } from '../../lib/logger'
import { processCheckInJob } from './jobs/checkin'

const connection = new Redis(config.REDIS_URL, {
  maxRetriesPerRequest: null, // Required by BullMQ
})

export const checkInQueue = new Queue('check-ins', {
  connection,
  defaultJobOptions: {
    removeOnComplete: true,
    removeOnFail: { count: 10 },
    attempts: 3,
    backoff: { type: 'exponential', delay: 60_000 }, // 1 min, 2 min, 4 min
  },
})

// Start the worker
export function startCheckInWorker(): Worker {
  const worker = new Worker(
    'check-ins',
    async (job: Job) => {
      await processCheckInJob(job.data as CheckInJobData)
    },
    { connection: new Redis(config.REDIS_URL, { maxRetriesPerRequest: null }), concurrency: 10 },
  )

  worker.on('completed', (job) => {
    logger.info({ jobId: job.id, data: job.data }, 'Check-in job completed')
  })

  worker.on('failed', (job, err) => {
    logger.error({ jobId: job?.id, data: job?.data, err }, 'Check-in job failed')
  })

  return worker
}

export interface CheckInJobData {
  userId: string
  phone: string
  type: 'BREAKFAST' | 'LUNCH' | 'DINNER' | 'WEIGHT' | 'WEEKLY_SUMMARY'
  checkInId: string
  scheduledAt: string // ISO string
}

/**
 * Schedule check-in jobs for a user on a given date.
 */
export async function scheduleUserCheckIns(
  userId: string,
  phone: string,
  checkinTimes: { breakfast: string; lunch: string; dinner: string },
  timezone: string,
  date: Date,
): Promise<void> {
  const dateStr = date.toISOString().split('T')[0] // YYYY-MM-DD

  const jobs: Array<{ type: CheckInJobData['type']; time: string }> = [
    { type: 'BREAKFAST', time: checkinTimes.breakfast },
    { type: 'LUNCH', time: checkinTimes.lunch },
    { type: 'DINNER', time: checkinTimes.dinner },
  ]

  // Add weekly summary on Sundays
  if (date.getDay() === 0) {
    jobs.push({ type: 'WEEKLY_SUMMARY', time: '20:00' })
  }

  const { prisma } = await import('../../config/database')

  for (const { type, time } of jobs) {
    const scheduledAt = localTimeToUTC(date, time, timezone)
    const delay = scheduledAt.getTime() - Date.now()

    if (delay <= 0) {
      logger.debug({ userId, type, time }, 'Skipping past check-in')
      continue
    }

    // Create CheckIn record
    const checkIn = await prisma.checkIn.upsert({
      where: {
        // We use a unique job ID to avoid duplicates — upsert by matching fields
        id: `${userId}-${type}-${dateStr}`,
      },
      update: { scheduled_time: scheduledAt },
      create: {
        id: `${userId}-${type}-${dateStr}`,
        user_id: userId,
        type,
        scheduled_time: scheduledAt,
      },
    })

    const jobData: CheckInJobData = {
      userId,
      phone,
      type,
      checkInId: checkIn.id,
      scheduledAt: scheduledAt.toISOString(),
    }

    await checkInQueue.add(`check-in-${type.toLowerCase()}`, jobData, {
      delay,
      jobId: `checkin-${userId}-${type}-${dateStr}`,
    })

    logger.debug({ userId, type, scheduledAt }, 'Check-in job scheduled')
  }
}

/**
 * Convert a local time string (HH:MM) on a given date to UTC Date.
 * Uses a simple offset approach — for production use a proper timezone library (luxon/date-fns-tz).
 */
function localTimeToUTC(date: Date, time: string, timezone: string): Date {
  const [hours, minutes] = time.split(':').map(Number)

  // Build an ISO string for the local date+time, then parse with timezone
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hh = String(hours).padStart(2, '0')
  const mm = String(minutes ?? 0).padStart(2, '0')

  // Use Intl to get the UTC offset for this timezone at this datetime
  const localDateString = `${year}-${month}-${day}T${hh}:${mm}:00`
  const localDate = new Date(localDateString)

  // Get the UTC offset in minutes for the given timezone
  const tzDate = new Date(localDate.toLocaleString('en-US', { timeZone: timezone }))
  const offset = localDate.getTime() - tzDate.getTime()

  return new Date(localDate.getTime() + offset)
}
