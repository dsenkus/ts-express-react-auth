type NotificationVariant = 'none' | 'success' | 'danger' | 'primary' | 'warning'

interface AppNotification {
  id: string
  message: string
  variant: NotificationVariant
  sticky: boolean
}
