import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Notification } from "@/types/notifications";
import { useToast } from "@/hooks/use-toast";

interface UseNotificationsOptions {
  storeId?: string;
}

export function useNotifications(options?: UseNotificationsOptions) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const notificationSound = new Audio("/notification.mp3");

  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    let query = supabase
      .from("notifications")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50);

    if (options?.storeId) {
      query = query.eq("store_id", options.storeId);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Erreur lors de la récupération des notifications:", error);
      setLoading(false);
      return;
    }

    const mapped = (data || []) as unknown as Notification[];
    setNotifications(mapped);
    setUnreadCount(mapped.filter((n) => !n.read).length);
    setLoading(false);
  }, [options?.storeId]);

  useEffect(() => {
    fetchNotifications();

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
          const newNotification = payload.new as unknown as Notification;

          // If filtering by store, skip notifications for other stores
          if (options?.storeId && newNotification.store_id !== options.storeId) {
            return;
          }

          setNotifications((prev) => [newNotification, ...prev]);
          setUnreadCount((prev) => prev + 1);

          const isOrderNotification = newNotification.title.toLowerCase().includes('commande');
          if (isOrderNotification) {
            notificationSound.play().catch(() => {});
          }

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
  }, [fetchNotifications]);

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

  const markAllAsRead = async () => {
    const unreadIds = notifications.filter((n) => !n.read).map((n) => n.id);
    if (unreadIds.length === 0) return;

    const { error } = await supabase
      .from("notifications")
      .update({ read: true })
      .in("id", unreadIds);

    if (error) {
      console.error("Erreur lors du marquage comme lu:", error);
      return;
    }

    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    setUnreadCount(0);
  };

  return {
    notifications,
    unreadCount,
    loading,
    markAsRead,
    markAllAsRead,
    refetch: fetchNotifications,
  };
}
