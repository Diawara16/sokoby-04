import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Notification } from "@/types/notifications";
import { useToast } from "@/hooks/use-toast";

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const { toast } = useToast();
  
  // Créer une instance Audio pour le son de notification
  const notificationSound = new Audio("/notification.mp3");

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
          console.log("Nouvelle notification reçue:", payload);
          const newNotification = payload.new as Notification;
          setNotifications((prev) => [newNotification, ...prev]);
          setUnreadCount((prev) => prev + 1);
          
          // Vérifier si c'est une notification de commande
          const isOrderNotification = newNotification.title.toLowerCase().includes('commande');
          console.log("Est-ce une notification de commande ?", isOrderNotification);
          
          if (isOrderNotification) {
            console.log("Tentative de lecture du son de notification...");
            notificationSound.play()
              .then(() => {
                console.log("Son de notification joué avec succès");
              })
              .catch(error => {
                console.error("Erreur lors de la lecture du son:", error);
                console.log("État de l'audio:", {
                  readyState: notificationSound.readyState,
                  paused: notificationSound.paused,
                  src: notificationSound.src,
                  error: notificationSound.error
                });
              });
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

  return {
    notifications,
    unreadCount,
    markAsRead,
  };
}