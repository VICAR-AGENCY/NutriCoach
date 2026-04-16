import type { WhatsAppWebhookPayload, WhatsAppMessage } from '@nutricoach/shared'
import { normalizePhone } from '@nutricoach/shared'
import { prisma } from '../../config/database'
import { logger } from '../../lib/logger'
import { markMessageRead } from './client'
import { handleOnboarding } from '../conversation/onboarding'
import { handleChat } from '../conversation/chat'

/**
 * Main entry point for all incoming WhatsApp messages.
 * Finds or creates the user, routes to the correct handler.
 */
export async function processIncomingMessage(payload: WhatsAppWebhookPayload): Promise<void> {
  // Extract messages from the Meta payload structure
  const messages: WhatsAppMessage[] = []
  for (const entry of payload.entry ?? []) {
    for (const change of entry.changes ?? []) {
      for (const message of change.value.messages ?? []) {
        messages.push(message)
      }
    }
  }

  for (const message of messages) {
    await processMessage(message)
  }
}

async function processMessage(message: WhatsAppMessage): Promise<void> {
  if (message.type !== 'text' || !message.text?.body) {
    logger.debug({ messageId: message.id, type: message.type }, 'Ignoring non-text message')
    return
  }

  const phone = normalizePhone(message.from)
  const text = message.text.body.trim()

  logger.info({ phone, messageId: message.id }, 'Processing incoming WhatsApp message')

  // Mark as read (show blue ticks)
  await markMessageRead(message.id)

  // Find or create user
  const user = await prisma.user.upsert({
    where: { phone },
    update: { updated_at: new Date() },
    create: { phone },
  })

  try {
    if (!user.onboarding_complete) {
      await handleOnboarding(user, text)
    } else {
      await handleChat(user, text)
    }
  } catch (error) {
    logger.error({ phone, error }, 'Error handling message')
  }
}
