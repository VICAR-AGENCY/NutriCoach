// Meta WhatsApp Business API payload types

export interface WhatsAppWebhookPayload {
  object: string
  entry: WhatsAppEntry[]
}

export interface WhatsAppEntry {
  id: string
  changes: WhatsAppChange[]
}

export interface WhatsAppChange {
  value: WhatsAppValue
  field: string
}

export interface WhatsAppValue {
  messaging_product: string
  metadata: {
    display_phone_number: string
    phone_number_id: string
  }
  contacts?: WhatsAppContact[]
  messages?: WhatsAppMessage[]
  statuses?: WhatsAppStatus[]
}

export interface WhatsAppContact {
  profile: { name: string }
  wa_id: string
}

export interface WhatsAppMessage {
  from: string // phone number with country code, no +
  id: string
  timestamp: string
  type: 'text' | 'image' | 'audio' | 'document' | 'location' | 'interactive'
  text?: { body: string }
}

export interface WhatsAppStatus {
  id: string
  status: 'sent' | 'delivered' | 'read' | 'failed'
  timestamp: string
  recipient_id: string
}

export interface SendTextMessagePayload {
  messaging_product: 'whatsapp'
  recipient_type: 'individual'
  to: string
  type: 'text'
  text: { body: string; preview_url?: boolean }
}
