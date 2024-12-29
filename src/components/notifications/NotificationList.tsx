import { ScrollArea } from "@/components/ui/scroll-area";
import { Notification } from "@/types/notifications";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";

interface NotificationListProps {
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
}

export function NotificationList({ notifications, onMarkAsRead }: NotificationListProps) {
  if (notifications.length === 0) {
    return (
      <div className="p-4 text-center text-sm text-gray-500">
        Aucune notification
      </div>
    );
  }

  return (
    <ScrollArea className="h-[300px]">
      <div className="p-2">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={`mb-2 p-3 rounded-lg cursor-pointer transition-colors ${
              notification.read
                ? "bg-gray-50 hover:bg-gray-100"
                : "bg-blue-50 hover:bg-blue-100"
            }`}
            onClick={() => !notification.read && onMarkAsRead(notification.id)}
          >
            <div className="font-medium">{notification.title}</div>
            <div className="text-sm text-gray-600 mt-1">
              {notification.content}
            </div>
            <div className="text-xs text-gray-400 mt-2">
              {formatDistanceToNow(new Date(notification.created_at), {
                addSuffix: true,
                locale: fr,
              })}
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}