import axios from 'axios'
import { config } from '../../config'
import { logger } from '../../lib/logger'
import type { SendTextMessagePayload } from '@nutricoach/shared'

const whatsappApi = axios.create({
  baseURL: `${config.WHATSAPP_API_URL}/${config.WHATSAPP_PHONE_NUMBER_ID}`,
  headers: {
    Authorization: `Bearer ${config.WHATSAPP_ACCESS_TOKEN}`,
    'Content-Type': 'application/json',
  },
})

/**
 * Send a plain text message to a WhatsApp phone number.
 * @param to - Phone number in E.164 without leading + (e.g. "31612345678")
 * @param text - Message body (max 4096 chars)
 */
export async function sendTextMessage(to: string, text: string): Promise<string | null> {
  const payload: SendTextMessagePayload = {
    messaging_product: 'whatsapp',
    recipient_type: 'individual',
    to,
    type: 'text',
    text: { body: text },
  }

  try {
    const response = await whatsappApi.post('/messages', payload)
    const messageId = response.data?.messages?.[0]?.id as string | undefined
    logger.info({ to, messageId }, 'WhatsApp message sent')
    return messageId ?? null
  } catch (error) {
    if (axios.isAxiosError(error)) {
      logger.error(
        { to, status: error.response?.status, data: error.response?.data },
        'Failed to send WhatsApp message',
      )
    } else {
      logger.error({ to, error }, 'Failed to send WhatsApp message')
    }
    return null
  }
}

/**
 * Mark a message as read (shows double blue tick to user).
 */
export async function markMessageRead(messageId: string): Promise<void> {
  try {
    await whatsappApi.post('/messages', {
      messaging_product: 'whatsapp',
      status: 'read',
      message_id: messageId,
    })
  } catch {
    // Non-critical — don't throw
  }
}
