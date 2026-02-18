import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Globe, ShoppingBag, Link2, AlertCircle, CheckCircle2, Loader2, ExternalLink } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { DomainChecker } from "@/components/store/DomainChecker";
import { ConnectExistingDomain } from "@/components/domain/ConnectExistingDomain";
import { Helmet } from "react-helmet";

interface CurrentDomain {
  domain_name: string | null;
  is_custom_domain: boolean;
  store_name: string;
}

export default function Domains() {
  const [currentDomain, setCurrentDomain] = useState<CurrentDomain | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [subdomainValue, setSubdomainValue] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCurrentDomain = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          setIsLoading(false);
          return;
        }

        const { data, error } = await supabase
          .from("store_settings")
          .select("domain_name, is_custom_domain, store_name")
          .eq("user_id", user.id)
          .maybeSingle();

        if (error) throw error;
        setCurrentDomain(data);
      } catch (error) {
        console.error("Erreur lors du chargement du domaine:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCurrentDomain();
  }, []);

  const handleSubdomainPurchase = async (domain: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Erreur",
          description: "Vous devez être connecté",
          variant: "destructive",
        });
        return;
      }

      const { data: existing } = await supabase
        .from("store_settings")
        .select("domain_name")
        .eq("domain_name", domain)
        .maybeSingle();

      if (existing) {
        toast({
          title: "Domaine non disponible",
          description: "Ce domaine est déjà utilisé",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase
        .from("store_settings")
        .update({ domain_name: domain, is_custom_domain: false })
        .eq("user_id", user.id);

      if (error) throw error;

      setCurrentDomain(prev => prev ? { ...prev, domain_name: domain, is_custom_domain: false } : null);
      toast({
        title: "Succès",
        description: `Le sous-domaine ${domain} a été configuré pour votre boutique`,
      });
    } catch (error) {
      console.error("Erreur:", error);
      toast({
        title: "Erreur",
        description: "Impossible de configurer le sous-domaine",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Gestion des domaines - Sokoby</title>
        <meta name="description" content="Gérez le nom de domaine de votre boutique Sokoby" />
      </Helmet>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex items-center gap-3 mb-8">
          <Globe className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">Domaines</h1>
            <p className="text-muted-foreground">Gérez le nom de domaine de votre boutique en ligne</p>
          </div>
        </div>

        {/* Current domain status */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Link2 className="h-5 w-5" />
              Domaine actuel
            </CardTitle>
          </CardHeader>
          <CardContent>
            {currentDomain?.domain_name ? (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium text-lg">{currentDomain.domain_name}</p>
                    <p className="text-sm text-muted-foreground">
                      {currentDomain.is_custom_domain ? "Domaine personnalisé" : "Sous-domaine Sokoby"}
                    </p>
                  </div>
                  <Badge variant={currentDomain.is_custom_domain ? "default" : "secondary"}>
                    {currentDomain.is_custom_domain ? "Custom" : "Sokoby"}
                  </Badge>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <a href={`https://${currentDomain.domain_name}`} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Visiter
                  </a>
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <AlertCircle className="h-5 w-5 text-destructive" />
                <p className="text-muted-foreground">Aucun domaine configuré. Choisissez une option ci-dessous.</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Domain configuration tabs */}
        <Tabs defaultValue="subdomain" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="subdomain" className="flex items-center gap-2">
              <ShoppingBag className="h-4 w-4" />
              Sous-domaine Sokoby
            </TabsTrigger>
            <TabsTrigger value="custom" className="flex items-center gap-2">
              <Globe className="h-4 w-4" />
              Domaine personnalisé
            </TabsTrigger>
          </TabsList>

          <TabsContent value="subdomain">
            <Card>
              <CardHeader>
                <CardTitle>Choisir un sous-domaine Sokoby</CardTitle>
                <CardDescription>
                  Obtenez un sous-domaine gratuit de type maboutique.sokoby.com
                </CardDescription>
              </CardHeader>
              <CardContent>
                <DomainChecker
                  value={subdomainValue}
                  onChange={setSubdomainValue}
                  onPurchase={handleSubdomainPurchase}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="custom">
            <Card>
              <CardHeader>
                <CardTitle>Connecter un domaine existant</CardTitle>
                <CardDescription>
                  Utilisez votre propre nom de domaine (ex: maboutique.com)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ConnectExistingDomain />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
