import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Video } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useCallback, useEffect, useState } from "react";

interface StoreVideoPlayerProps {
  storeId: string;
  storeName?: string | null;
}

export function StoreVideoPlayer({ storeId, storeName }: StoreVideoPlayerProps) {
  const [videoReady, setVideoReady] = useState(false);
  const queryClient = useQueryClient();

  // Realtime subscription: invalidate query when a new "ready" video arrives
  useEffect(() => {
    if (!storeId) return;

    const channel = supabase
      .channel(`store-video-${storeId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "store_videos",
          filter: `store_id=eq.${storeId}`,
        },
        (payload) => {
          console.log("Realtime store_videos update:", payload);
          const newRecord = payload.new as Record<string, unknown> | undefined;
          if (newRecord?.status === "ready") {
            setVideoReady(false);
            queryClient.invalidateQueries({ queryKey: ["store-video", storeId] });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [storeId, queryClient]);

  const { data: latestVideo, isLoading } = useQuery({
    queryKey: ["store-video", storeId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("store_videos")
        .select("*")
        .eq("store_id", storeId)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) throw error;
      return data as { video_url: string; thumbnail_url: string | null; status: string } | null;
    },
    enabled: !!storeId,
  });

  const video = latestVideo?.status === "ready" ? latestVideo : null;
  const isProcessing = latestVideo && latestVideo.status !== "ready" && latestVideo.status !== "failed";

  const handleCanPlay = useCallback(() => setVideoReady(true), []);

  if (isLoading) {
    return (
      <div className="relative w-full h-[60vh]">
        <Skeleton className="absolute inset-0 w-full h-full rounded-none" />
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
          <Skeleton className="h-10 w-64 rounded-lg" />
          <Skeleton className="h-5 w-48 rounded-lg" />
          <Skeleton className="h-12 w-36 rounded-lg mt-4" />
        </div>
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
    <div className="relative w-full h-[60vh] overflow-hidden bg-muted">
      {/* Thumbnail shown immediately */}
      {video.thumbnail_url && (
        <img
          src={video.thumbnail_url}
          alt={storeName || "Store"}
          className="absolute inset-0 w-full h-full object-cover"
        />
      )}

      {/* Video fades in over thumbnail when ready */}
      <video
        autoPlay
        muted
        loop
        playsInline
        onCanPlay={handleCanPlay}
        className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-in-out"
        style={{ opacity: videoReady ? 1 : 0 }}
        preload="auto"
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
