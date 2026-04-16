export type CheckInType = 'BREAKFAST' | 'LUNCH' | 'DINNER' | 'WEIGHT' | 'WEEKLY_SUMMARY'

export interface CheckIn {
  id: string
  user_id: string
  type: CheckInType
  scheduled_time: Date
  completed: boolean
  completed_at: Date | null
  message_sid: string | null
}
