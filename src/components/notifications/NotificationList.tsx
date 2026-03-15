import { ScrollArea } from "@/components/ui/scroll-area";
import { Notification, NotificationType } from "@/types/notifications";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { Info, CheckCircle2, AlertTriangle, XCircle, ShoppingCart, Store, Video } from "lucide-react";

const typeConfig: Record<NotificationType, { icon: React.ElementType; className: string }> = {
  info: { icon: Info, className: "text-blue-500" },
  success: { icon: CheckCircle2, className: "text-green-500" },
  warning: { icon: AlertTriangle, className: "text-yellow-500" },
  error: { icon: XCircle, className: "text-red-500" },
  order: { icon: ShoppingCart, className: "text-primary" },
  store: { icon: Store, className: "text-purple-500" },
  video: { icon: Video, className: "text-indigo-500" },
};

interface NotificationListProps {
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
}

export function NotificationList({ notifications, onMarkAsRead }: NotificationListProps) {
  if (notifications.length === 0) {
    return (
      <div className="p-4 text-center text-sm text-muted-foreground">
        Aucune notification
      </div>
    );
  }

  return (
    <ScrollArea className="h-[300px]">
      <div className="p-2 space-y-1">
        {notifications.map((notification) => {
          const type = (notification.notification_type || 'info') as NotificationType;
          const config = typeConfig[type] || typeConfig.info;
          const Icon = config.icon;

          return (
            <div
              key={notification.id}
              className={`p-3 rounded-lg cursor-pointer transition-colors ${
                notification.read
                  ? "bg-muted/50 hover:bg-muted"
                  : "bg-accent/30 hover:bg-accent/50 border-l-2 border-primary"
              }`}
              onClick={() => !notification.read && onMarkAsRead(notification.id)}
            >
              <div className="flex items-start gap-2.5">
                <Icon className={`h-4 w-4 mt-0.5 shrink-0 ${config.className}`} />
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm">{notification.title}</div>
                  <div className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                    {notification.content}
                  </div>
                  <div className="text-xs text-muted-foreground/70 mt-1.5">
                    {formatDistanceToNow(new Date(notification.created_at), {
                      addSuffix: true,
                      locale: fr,
                    })}
                  </div>
                </div>
                {!notification.read && (
                  <div className="h-2 w-2 rounded-full bg-primary shrink-0 mt-1.5" />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </ScrollArea>
  );
}
