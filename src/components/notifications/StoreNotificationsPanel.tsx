import { useNotifications } from "@/hooks/useNotifications";
import { NotificationList } from "./NotificationList";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bell, CheckCheck, Loader2, RefreshCw } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface StoreNotificationsPanelProps {
  storeId: string;
}

export function StoreNotificationsPanel({ storeId }: StoreNotificationsPanelProps) {
  const { notifications, unreadCount, loading, markAsRead, markAllAsRead, refetch } =
    useNotifications({ storeId });

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notifications
            </CardTitle>
            {unreadCount > 0 && (
              <Badge variant="destructive" className="text-xs">
                {unreadCount} nouvelle{unreadCount > 1 ? "s" : ""}
              </Badge>
            )}
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" onClick={refetch} disabled={loading}>
              <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            </Button>
            {unreadCount > 0 && (
              <Button variant="outline" size="sm" onClick={markAllAsRead}>
                <CheckCheck className="h-4 w-4 mr-1.5" />
                Tout marquer lu
              </Button>
            )}
          </div>
        </div>
        <CardDescription>
          Dernières mises à jour concernant votre boutique
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <NotificationList notifications={notifications} onMarkAsRead={markAsRead} />
        )}
      </CardContent>
    </Card>
  );
}
