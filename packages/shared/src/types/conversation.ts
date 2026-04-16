export type ConversationStatus = 'ACTIVE' | 'ONBOARDING' | 'COMPLETED'
export type MessageRole = 'user' | 'assistant'

export interface ConversationMessage {
  role: MessageRole
  content: string
  timestamp: string // ISO string
}

export interface Conversation {
  id: string
  user_id: string
  messages: ConversationMessage[]
  status: ConversationStatus
  context: Record<string, unknown> | null
  created_at: Date
  updated_at: Date
}
