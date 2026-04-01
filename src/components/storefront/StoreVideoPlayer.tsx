import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Video } from "lucide-react";

interface StoreVideoPlayerProps {
  storeId: string;
  storeName?: string | null;
}

export function StoreVideoPlayer({ storeId, storeName }: StoreVideoPlayerProps) {
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
      <div className="relative w-full h-[60vh] flex items-center justify-center bg-muted">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!video) {
    return (
      <div className="relative w-full h-[60vh] flex flex-col items-center justify-center bg-muted gap-3 text-muted-foreground">
        <Video className="h-12 w-12 animate-pulse" />
        <p className="text-sm font-medium">Génération de la vidéo en cours...</p>
      </div>
    );
  }

  return (
    <div className="relative w-full h-[60vh] overflow-hidden">
      <video
        autoPlay
        muted
        loop
        playsInline
        poster={video.thumbnail_url || undefined}
        className="absolute inset-0 w-full h-full object-cover"
        preload="metadata"
      >
        <source src={video.video_url} type="video/mp4" />
      </video>

      {/* Gradient overlay */}
      <div
        className="absolute inset-0"
        style={{ background: "linear-gradient(to top, rgba(0,0,0,0.7), rgba(0,0,0,0.2))" }}
      />

      {/* Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 z-10">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4 drop-shadow-lg">
          {storeName || "Ma Boutique"}
        </h1>
        <p className="text-lg sm:text-xl text-white/90 mb-8 max-w-2xl">
          Découvrez notre collection exclusive
        </p>
        <a
          href="#featured-products"
          className="inline-block px-6 py-3 font-bold text-white rounded-lg transition-all duration-200 hover:scale-105 hover:brightness-110"
          style={{ backgroundColor: "#ff4d4f" }}
        >
          Shop Now
        </a>
      </div>
    </div>
  );
}
