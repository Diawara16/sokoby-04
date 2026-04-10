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

  useEffect(() => {
    if (!storeId) return;
    const channel = supabase
      .channel(`store-video-${storeId}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "store_videos", filter: `store_id=eq.${storeId}` },
        (payload) => {
          const newRecord = payload.new as Record<string, unknown> | undefined;
          if (newRecord?.status === "ready") setVideoReady(false);
          queryClient.invalidateQueries({ queryKey: ["store-video", storeId] });
        }
      )
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [storeId, queryClient]);

  const { data: latestVideo, isLoading } = useQuery({
    queryKey: ["store-video", storeId],
    queryFn: async () => {
      const { data: readyVideo, error } = await supabase
        .from("store_videos")
        .select("*")
        .eq("store_id", storeId)
        .eq("status", "ready")
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      if (error) throw error;
      if (readyVideo) return readyVideo;

      const { data: latestAny } = await supabase
        .from("store_videos")
        .select("status")
        .eq("store_id", storeId)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      if (latestAny && latestAny.status !== "failed") {
        return { video_url: "", thumbnail_url: null, status: latestAny.status } as any;
      }
      return null;
    },
    enabled: !!storeId,
  });

  const video = latestVideo?.status === "ready" ? latestVideo : null;
  const isProcessing = latestVideo && latestVideo.status !== "ready" && latestVideo.status !== "failed";
  const handleCanPlay = useCallback(() => setVideoReady(true), []);

  if (isLoading) {
    return (
      <div className="relative w-full h-[90vh]">
        <Skeleton className="absolute inset-0 w-full h-full rounded-none" />
      </div>
    );
  }

  if (!video) {
    return (
      <div className="relative w-full h-[90vh] flex flex-col items-center justify-center bg-black gap-3 text-white/50">
        <Video className="h-12 w-12 animate-pulse" />
        <p className="text-sm font-medium">
          {isProcessing ? "Generating video…" : "No video available"}
        </p>
      </div>
    );
  }

  return (
    <div className="relative w-full h-[90vh] overflow-hidden bg-black">
      {/* Thumbnail fallback */}
      {video.thumbnail_url && (
        <img
          src={video.thumbnail_url}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
        />
      )}

      {/* Background video */}
      <video
        autoPlay muted loop playsInline
        onCanPlay={handleCanPlay}
        className="absolute inset-0 w-full h-full object-cover"
        style={{ opacity: videoReady ? 1 : 0, transition: "opacity 1s ease-out" }}
        preload="auto"
      >
        <source src={video.video_url} type="video/mp4" />
      </video>

      {/* Cinematic overlay */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Hero Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 z-10">
        <h1
          className="text-[clamp(2.5rem,5vw,4rem)] font-bold text-white mb-5 tracking-[1px] leading-tight"
          style={{ animationDelay: "0.2s", animationFillMode: "both" }}
        >
          {storeName || "Ma Boutique"}
        </h1>
        <p
          className="text-[clamp(0.875rem,1.5vw,1.125rem)] text-[#e5e5e5] mb-10 max-w-xl leading-relaxed animate-fade-in"
          style={{ animationDelay: "0.4s", animationFillMode: "both" }}
        >
          Discover premium products crafted for modern lifestyle
        </p>
        <a
          href="#featured-products"
          className="inline-flex items-center justify-center bg-white text-black font-semibold text-sm px-8 py-3.5 rounded-full transition-all duration-300 hover:scale-[1.06] hover:shadow-[0_8px_30px_rgba(255,255,255,0.2)] animate-fade-in"
          style={{ animationDelay: "0.6s", animationFillMode: "both" }}
        >
          Shop Now
        </a>
      </div>
    </div>
  );
}
