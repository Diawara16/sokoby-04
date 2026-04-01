import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Video } from "lucide-react";

interface StoreVideoPlayerProps {
  storeId: string;
}

export function StoreVideoPlayer({ storeId }: StoreVideoPlayerProps) {
  const { data: video, isLoading } = useQuery({
    queryKey: ["store-video", storeId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("store_videos")
        .select("*")
        .eq("store_id", storeId)
        .eq("status", "ready")
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      console.log("STORE ID:", storeId);
      console.log("VIDEO RESULT:", data);
      if (error) throw error;
      return data as { video_url: string; thumbnail_url: string | null } | null;
    },
    enabled: !!storeId,
  });

  if (isLoading) {
    return (
      <div className="w-full flex items-center justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!video) {
    return (
      <div className="w-full flex flex-col items-center justify-center py-12 text-muted-foreground gap-3">
        <Video className="h-10 w-10 animate-pulse" />
        <p className="text-sm font-medium">Génération de la vidéo en cours...</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-3xl mx-auto my-8">
      <video
        controls
        autoPlay
        muted
        loop
        playsInline
        poster={video.thumbnail_url || undefined}
        className="w-full rounded-lg shadow-lg aspect-video bg-muted"
        preload="metadata"
      >
        <source src={video.video_url} type="video/mp4" />
        Votre navigateur ne supporte pas la lecture vidéo.
      </video>
    </div>
  );
}
