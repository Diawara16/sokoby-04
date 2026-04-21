import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Check, X, Loader2, ShoppingCart, ExternalLink, Info, ArrowRight } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { useCurrentStoreId } from "@/hooks/useCurrentStoreId";

const EXTENSIONS = [".com", ".net", ".store", ".shop"];

interface DomainResult {
  domain: string;
  tld: string;
  available: boolean | null;
  checking: boolean;
  reserving?: boolean;
  reserved?: boolean;
}

export const BuyDomainTab = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState<DomainResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [lastReserved, setLastReserved] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { storeId } = useCurrentStoreId();

  const cleanDomainName = (input: string) => {
    return input.toLowerCase().replace(/[^a-z0-9-]/g, "").replace(/^-+|-+$/g, "");
  };

  const checkDomain = async (domain: string): Promise<boolean> => {
    try {
      const response = await fetch(`https://dns.google/resolve?name=${domain}`);
      const data = await response.json();
      return !data.Answer;
    } catch {
      return false;
    }
  };

  const handleSearch = async () => {
    const clean = cleanDomainName(searchTerm);
    if (!clean) return;

    setIsSearching(true);
    setHasSearched(true);

    const initialResults: DomainResult[] = EXTENSIONS.map((ext) => ({
      domain: `${clean}${ext}`,
      tld: ext.replace(".", ""),
      available: null,
      checking: true,
    }));
    setResults(initialResults);

    const updatedResults = await Promise.all(
      initialResults.map(async (result) => {
        const available = await checkDomain(result.domain);
        return { ...result, available, checking: false };
      })
    );
    setResults(updatedResults);
    setIsSearching(false);
  };

  const handleReserve = async (result: DomainResult) => {
    setResults((prev) => prev.map((r) => (r.domain === result.domain ? { ...r, reserving: true } : r)));

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({ title: "Connexion requise", description: "Connectez-vous pour réserver un domaine.", variant: "destructive" });
        return;
      }

      const { error } = await supabase.from("domain_purchases").insert({
        user_id: user.id,
        store_id: storeId ?? null,
        domain_name: result.domain,
        tld: result.tld,
        status: "pending",
        provider: "none",
        price_estimate: null,
      });

      if (error) throw error;

      setResults((prev) => prev.map((r) => (r.domain === result.domain ? { ...r, reserving: false, reserved: true } : r)));
      setLastReserved(result.domain);
      toast({
        title: "Domaine réservé",
        description: `${result.domain} a été réservé. Pour l'utiliser, connectez-le dans « Connecter un domaine ».`,
      });
    } catch (e: any) {
      console.error("Reserve domain error:", e);
      toast({ title: "Erreur", description: e.message || "Impossible de réserver ce domaine.", variant: "destructive" });
      setResults((prev) => prev.map((r) => (r.domain === result.domain ? { ...r, reserving: false } : r)));
    }
  };

  return (
    <div className="space-y-6">
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription className="text-sm">
          <strong>Mode MVP :</strong> la disponibilité est estimée via DNS et ne reflète pas la disponibilité réelle chez un registrar. La réservation crée un enregistrement « en attente » — aucun achat n'est effectué.
        </AlertDescription>
      </Alert>

      <div className="flex gap-3 max-w-lg">
        <Input
          placeholder="Rechercher un nom de domaine..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          className="flex-1"
        />
        <Button onClick={handleSearch} disabled={isSearching || !searchTerm.trim()}>
          {isSearching ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Search className="mr-2 h-4 w-4" />}
          Rechercher
        </Button>
      </div>

      {!hasSearched && (
        <div className="text-center py-8 space-y-2">
          <Search className="h-10 w-10 mx-auto text-muted-foreground/40" />
          <p className="text-muted-foreground">Entrez un nom pour vérifier la disponibilité du domaine.</p>
          <div className="flex justify-center gap-2 mt-3">
            {EXTENSIONS.map((ext) => (
              <Badge key={ext} variant="outline" className="text-xs">{ext}</Badge>
            ))}
          </div>
        </div>
      )}

      {lastReserved && (
        <Alert>
          <Check className="h-4 w-4" />
          <AlertDescription className="flex items-center justify-between gap-3">
            <span className="text-sm">
              <strong>{lastReserved}</strong> réservé. Pour l'utiliser, connectez-le dans la section « Connecter un domaine ».
            </span>
            <Button size="sm" variant="outline" onClick={() => navigate("/parametres/domaine")} className="gap-1 shrink-0">
              Connecter <ArrowRight className="h-3 w-3" />
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {hasSearched && (
        <div className="grid gap-3">
          {results.map((result) => (
            <Card key={result.domain} className="overflow-hidden">
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {result.checking ? (
                    <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                  ) : result.available ? (
                    <Check className="h-5 w-5 text-green-600" />
                  ) : (
                    <X className="h-5 w-5 text-red-500" />
                  )}
                  <span className="font-mono font-medium">{result.domain}</span>
                  {!result.checking && (
                    <Badge variant={result.available ? "default" : "secondary"} className={result.available ? "bg-green-100 text-green-800 hover:bg-green-100" : ""}>
                      {result.available ? "Disponible" : "Indisponible"}
                    </Badge>
                  )}
                </div>
                <div>
                  {!result.checking && result.available && (
                    <Button
                      size="sm"
                      onClick={() => handleReserve(result)}
                      disabled={result.reserving || result.reserved}
                      className="gap-2"
                    >
                      {result.reserving ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : result.reserved ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <ShoppingCart className="h-4 w-4" />
                      )}
                      {result.reserved ? "Réservé" : result.reserving ? "..." : "Réserver"}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {hasSearched && (
        <Alert>
          <AlertDescription className="text-sm text-muted-foreground">
            Vous pouvez aussi acheter votre domaine chez un registrar externe puis le connecter :
            <div className="flex gap-3 mt-2">
              <a href="https://www.namecheap.com/" target="_blank" rel="noopener noreferrer" className="text-primary underline inline-flex items-center gap-1 text-xs">
                Namecheap <ExternalLink className="h-3 w-3" />
              </a>
              <a href="https://www.godaddy.com/" target="_blank" rel="noopener noreferrer" className="text-primary underline inline-flex items-center gap-1 text-xs">
                GoDaddy <ExternalLink className="h-3 w-3" />
              </a>
              <a href="https://www.cloudflare.com/products/registrar/" target="_blank" rel="noopener noreferrer" className="text-primary underline inline-flex items-center gap-1 text-xs">
                Cloudflare <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};
