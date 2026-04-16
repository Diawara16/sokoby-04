import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ExternalLink, Share2, Pencil, Video, MessageSquare, Zap, CheckCircle2, Copy } from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { AIStoreData } from "../AIStoreWizard";

interface LaunchStepProps {
  data: AIStoreData;
  productsCreated: number;
  onBack: () => void;
}

export function LaunchStep({ data, productsCreated, onBack }: LaunchStepProps) {
  const { toast } = useToast();
  const [storeId, setStoreId] = useState<string | null>(null);

  useEffect(() => {
    const findStore = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Check store_settings first
      const { data: ss } = await supabase
        .from('store_settings')
        .select('id')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (ss) { setStoreId(ss.id); return; }

      // Fallback to stores table
      const { data: st } = await supabase
        .from('stores')
        .select('id')
        .eq('owner_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (st) setStoreId(st.id);
    };
    findStore();
  }, []);

  const previewPath = storeId ? `/boutique-apercu/${storeId}` : '/boutique';
  const storeUrl = `${window.location.origin}${previewPath}`;

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast({
        title: "Copié !",
        description: `${label} copié dans le presse-papier`,
      });
    });
  };

  const marketingPreviews = [
    {
      platform: "TikTok",
      icon: Video,
      content: `🔥 ${data.storeName} vient d'ouvrir ! Découvrez nos ${productsCreated} produits tendance. Lien en bio 👆 #ecommerce #${data.niche} #shopping`,
    },
    {
      platform: "Facebook",
      icon: MessageSquare,
      content: `✨ Nouveau ! ${data.storeName} — ${data.slogan}. Profitez de notre sélection de ${productsCreated} produits soigneusement choisis. Découvrez maintenant →`,
    },
    {
      platform: "Viral Hook",
      icon: Zap,
      content: `"J'ai créé une boutique en ligne en 5 minutes et voici ce qui s'est passé..." — Utilisez ce hook pour votre première vidéo virale !`,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Success banner */}
      <div className="text-center space-y-4 py-8">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 mx-auto">
          <CheckCircle2 className="h-10 w-10 text-green-600" />
        </div>
        <h2 className="text-3xl font-bold text-foreground">Votre boutique est prête !</h2>
        <p className="text-lg text-muted-foreground max-w-md mx-auto">
          {data.storeName} a été créée avec {productsCreated} produits.
          {productsCreated < data.products.length && (
            <span className="block text-sm mt-1">
              Certains produits peuvent être ajoutés manuellement depuis l'éditeur.
            </span>
          )}
        </p>
      </div>

      {/* Action buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto">
        <Button size="lg" className="w-full font-semibold" asChild>
          <Link to={previewPath}>
            <ExternalLink className="h-4 w-4 mr-2" /> Voir ma boutique
          </Link>
        </Button>
        <Button size="lg" variant="outline" className="w-full" onClick={() => copyToClipboard(storeUrl, "Lien de la boutique")}>
          <Share2 className="h-4 w-4 mr-2" /> Partager
        </Button>
        <Button size="lg" variant="outline" className="w-full" asChild>
          <Link to={storeId ? `/dashboard/store/${storeId}` : '/tableau-de-bord'}>
            <Pencil className="h-4 w-4 mr-2" /> Éditer produits
          </Link>
        </Button>
      </div>

      {/* Marketing previews */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-foreground text-center">📣 Lancez vos premières ventes</h3>
        <div className="grid md:grid-cols-3 gap-4">
          {marketingPreviews.map((mp) => (
            <Card key={mp.platform} className="p-5 space-y-3">
              <div className="flex items-center gap-2">
                <mp.icon className="h-5 w-5 text-primary" />
                <h4 className="font-semibold text-foreground">{mp.platform}</h4>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">{mp.content}</p>
              <Button
                variant="ghost"
                size="sm"
                className="w-full text-xs gap-1"
                onClick={() => copyToClipboard(mp.content, `Texte ${mp.platform}`)}
              >
                <Copy className="h-3 w-3" />
                Copier le texte
              </Button>
            </Card>
          ))}
        </div>
      </div>

      {/* Pricing message */}
      <Card className="p-6 text-center bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
        <p className="text-lg font-semibold text-foreground">
          💰 Commencez gratuitement — payez quand vous vendez
        </p>
        <p className="text-sm text-muted-foreground mt-1">
          Aucun frais tant que vous n'avez pas réalisé votre première vente
        </p>
      </Card>

      <div className="flex justify-start">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" /> Retour
        </Button>
      </div>
    </div>
  );
}
