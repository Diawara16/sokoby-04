export type NotificationType = 'info' | 'success' | 'warning' | 'error' | 'order' | 'store' | 'video';

export interface Notification {
  id: string;
  title: string;
  content: string;
  read: boolean;
  created_at: string;
  user_id: string;
  notification_type: NotificationType;
  store_id: string | null;
}
