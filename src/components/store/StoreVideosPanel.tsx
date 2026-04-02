import { useState, useEffect, useCallback, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Video, Download, Loader2, RefreshCw, AlertTriangle, Clock, CheckCircle2, Sparkles } from "lucide-react";
import { toast } from "sonner";

interface StoreVideo {
  id: string;
  store_id: string;
  video_type: string;
  video_url: string;
  thumbnail_url: string | null;
  status: string;
  created_at: string;
}

interface StoreVideosPanelProps {
  storeId: string;
}

const statusConfig: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline"; icon: React.ElementType }> = {
  pending: { label: "En attente", variant: "secondary", icon: Clock },
  processing: { label: "En cours", variant: "outline", icon: Loader2 },
  ready: { label: "Prête", variant: "default", icon: CheckCircle2 },
  failed: { label: "Échouée", variant: "destructive", icon: AlertTriangle },
};

export function StoreVideosPanel({ storeId }: StoreVideosPanelProps) {
  const [videos, setVideos] = useState<StoreVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [newReadyIds, setNewReadyIds] = useState<Set<string>>(new Set());
  const previousStatusRef = useRef<Map<string, string>>(new Map());

  const fetchVideos = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("store_videos")
      .select("*")
      .eq("store_id", storeId)
      .order("created_at", { ascending: false });

    if (!error && data) {
      const typed = data as unknown as StoreVideo[];

      // Detect videos that just became "ready"
      typed.forEach((v) => {
        const prev = previousStatusRef.current.get(v.id);
        if (prev && prev !== "ready" && v.status === "ready") {
          toast.success("🎬 Votre vidéo marketing est prête !", {
            description: "Vous pouvez la prévisualiser et la télécharger.",
          });
          setNewReadyIds((s) => new Set(s).add(v.id));
          setTimeout(() => setNewReadyIds((s) => { const n = new Set(s); n.delete(v.id); return n; }), 8000);
        }
      });

      // Update status map
      const map = new Map<string, string>();
      typed.forEach((v) => map.set(v.id, v.status));
      previousStatusRef.current = map;

      setVideos(typed);
    }
    setLoading(false);
  }, [storeId]);

  // Realtime subscription for instant updates
  useEffect(() => {
    if (!storeId) return;
    const channel = supabase
      .channel(`dashboard-videos-${storeId}`)
      .on("postgres_changes", {
        event: "*",
        schema: "public",
        table: "store_videos",
        filter: `store_id=eq.${storeId}`,
      }, () => {
        fetchVideos();
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [storeId, fetchVideos]);

  useEffect(() => {
    fetchVideos();
  }, [fetchVideos]);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Video className="h-5 w-5" />
              Vidéos marketing
            </CardTitle>
            <CardDescription className="mt-1.5">
              Vidéos promotionnelles générées automatiquement pour votre boutique
            </CardDescription>
          </div>
          <Button variant="ghost" size="sm" onClick={fetchVideos} disabled={loading}>
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {loading && videos.length === 0 ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : videos.length === 0 ? (
          <div className="text-center py-12">
            <Video className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-base font-medium mb-1">Aucune vidéo</h3>
            <p className="text-sm text-muted-foreground">
              Les vidéos marketing seront générées automatiquement après la création de votre boutique.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {videos.map((video) => (
              <VideoCard key={video.id} video={video} onRetry={fetchVideos} isNew={newReadyIds.has(video.id)} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function VideoCard({ video, onRetry }: { video: StoreVideo; onRetry: () => void }) {
  const [downloading, setDownloading] = useState(false);
  const config = statusConfig[video.status] || statusConfig.pending;
  const StatusIcon = config.icon;

  const handleDownload = async () => {
    if (!video.video_url) return;
    setDownloading(true);
    try {
      const response = await fetch(video.video_url);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `video-${video.video_type}-${video.id.slice(0, 8)}.mp4`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch {
      window.open(video.video_url, "_blank");
    } finally {
      setDownloading(false);
    }
  };

  if (video.status === "ready") {
    return (
      <div className="rounded-lg border bg-card overflow-hidden">
        <div className="aspect-video bg-muted relative">
          {video.video_url ? (
            <video
              src={video.video_url}
              poster={video.thumbnail_url || undefined}
              controls
              className="w-full h-full object-cover"
              preload="metadata"
            />
          ) : video.thumbnail_url ? (
            <img src={video.thumbnail_url} alt="Vidéo marketing" className="w-full h-full object-cover" />
          ) : (
            <div className="flex items-center justify-center h-full">
              <Video className="h-10 w-10 text-muted-foreground" />
            </div>
          )}
        </div>
        <div className="p-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge variant={config.variant} className="text-xs">
              <StatusIcon className="h-3 w-3 mr-1" />
              {config.label}
            </Badge>
            <span className="text-xs text-muted-foreground capitalize">{video.video_type}</span>
          </div>
          {video.video_url && (
            <Button variant="outline" size="sm" onClick={handleDownload} disabled={downloading}>
              {downloading ? (
                <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />
              ) : (
                <Download className="h-3.5 w-3.5 mr-1.5" />
              )}
              Télécharger
            </Button>
          )}
        </div>
      </div>
    );
  }

  // Pending / Processing / Failed states
  return (
    <div className="rounded-lg border bg-card overflow-hidden">
      <div className="aspect-video bg-muted flex items-center justify-center">
        <div className="text-center space-y-3 p-6">
          {video.status === "failed" ? (
            <>
              <AlertTriangle className="h-10 w-10 text-destructive mx-auto" />
              <p className="text-sm font-medium text-destructive">
                La génération de la vidéo a échoué.
              </p>
              <p className="text-xs text-muted-foreground">Veuillez réessayer ultérieurement.</p>
              <Button variant="outline" size="sm" onClick={onRetry}>
                <RefreshCw className="h-3.5 w-3.5 mr-1.5" />
                Réessayer
              </Button>
            </>
          ) : (
            <>
              <Loader2 className="h-10 w-10 text-muted-foreground mx-auto animate-spin" />
              <p className="text-sm font-medium">Vidéo en cours de préparation...</p>
              <p className="text-xs text-muted-foreground">
                Cela peut prendre quelques minutes. La page se mettra à jour automatiquement.
              </p>
            </>
          )}
        </div>
      </div>
      <div className="p-3">
        <Badge variant={config.variant} className="text-xs">
          <StatusIcon className={`h-3 w-3 mr-1 ${video.status === "processing" ? "animate-spin" : ""}`} />
          {config.label}
        </Badge>
      </div>
    </div>
  );
}
