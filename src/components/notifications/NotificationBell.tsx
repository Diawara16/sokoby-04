import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { NotificationList } from "./NotificationList";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Notification } from "@/types/notifications";
import { useToast } from "@/hooks/use-toast";

export function NotificationBell() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    const fetchNotifications = async () => {
      const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Erreur lors de la récupération des notifications:", error);
        return;
      }

      setNotifications(data);
      setUnreadCount(data.filter((n: Notification) => !n.read).length);
    };

    fetchNotifications();

    // Écouter les nouvelles notifications en temps réel
    const channel = supabase
      .channel("notifications-channel")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "notifications",
        },
        (payload) => {
          const newNotification = payload.new as Notification;
          setNotifications((prev) => [newNotification, ...prev]);
          setUnreadCount((prev) => prev + 1);
          
          toast({
            title: newNotification.title,
            description: newNotification.content,
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const markAsRead = async (notificationId: string) => {
    const { error } = await supabase
      .from("notifications")
      .update({ read: true })
      .eq("id", notificationId);

    if (error) {
      console.error("Erreur lors du marquage comme lu:", error);
      return;
    }

    setNotifications((prev) =>
      prev.map((n) =>
        n.id === notificationId ? { ...n, read: true } : n
      )
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-600 text-white text-xs flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <NotificationList 
          notifications={notifications}
          onMarkAsRead={markAsRead}
        />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}