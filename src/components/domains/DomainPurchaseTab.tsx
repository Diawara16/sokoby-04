import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import {
  Search, Check, X, Loader2, ShoppingCart, Globe, Link2, CreditCard, AlertCircle,
} from "lucide-react";
import { useDomainPurchases } from "@/hooks/useDomainPurchases";
import { useToast } from "@/hooks/use-toast";

const EXTENSIONS = [".com", ".net", ".store", ".shop", ".online"];

interface DomainResult {
  domain: string;
  available: boolean | null;
  checking: boolean;
}

interface DomainPurchaseTabProps {
  onDomainPurchased?: () => void;
  onSwitchToConnect?: () => void;
}

export const DomainPurchaseTab = ({ onDomainPurchased, onSwitchToConnect }: DomainPurchaseTabProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState<DomainResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [purchasingDomain, setPurchasingDomain] = useState<string | null>(null);
  const [finalizing, setFinalizing] = useState(false);
  const [finalizedDomain, setFinalizedDomain] = useState<string | null>(null);
  const [purchaseError, setPurchaseError] = useState<string | null>(null);

  const { reserveDomain, completePurchase, startDomainCheckout, refetch } = useDomainPurchases();
  const { toast } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();
  const handledCallback = useRef(false);

  const cleanDomainName = (input: string) =>
    input.toLowerCase().replace(/[^a-z0-9-]/g, "").replace(/^-+|-+$/g, "");

  const checkDomain = async (domain: string): Promise<boolean> => {
    try {
      const response = await fetch(`https://dns.google/resolve?name=${domain}`);
      const data = await response.json();
      return !data.Answer;
    } catch {
      return false;
    }
  };

  // Handle Stripe return: ?purchase=success|cancelled&session_id=...&purchaseId=...
  useEffect(() => {
    if (handledCallback.current) return;
    const purchaseStatus = searchParams.get("purchase");
    if (!purchaseStatus) return;
    handledCallback.current = true;

    const sessionId = searchParams.get("session_id") || undefined;
    const purchaseId = searchParams.get("purchaseId") || undefined;

    const clearParams = () => {
      const next = new URLSearchParams(searchParams);
      ["purchase", "session_id", "purchaseId"].forEach((k) => next.delete(k));
      setSearchParams(next, { replace: true });
    };

    if (purchaseStatus === "cancelled") {
      toast({
        title: "Paiement annulé",
        description: "Vous avez annulé le paiement. Aucun domaine n'a été enregistré.",
        variant: "destructive",
      });
      clearParams();
      return;
    }

    if (purchaseStatus === "success") {
      if (!purchaseId || !sessionId) {
        setPurchaseError("Session de paiement invalide. Contactez le support.");
        toast({
          title: "Erreur",
          description: "Session de paiement manquante après retour de Stripe.",
          variant: "destructive",
        });
        clearParams();
        return;
      }

      (async () => {
        setFinalizing(true);
        setPurchaseError(null);
        const { success, error } = await completePurchase(purchaseId, 1, sessionId);
        if (success) {
          setFinalizedDomain(purchaseId);
          toast({
            title: "Domaine enregistré",
            description: "Votre domaine a été acheté et enregistré avec succès auprès du registrar.",
          });
          onDomainPurchased?.();
          await refetch();
        } else {
          const msg = error || "L'enregistrement a échoué après le paiement. Contactez le support.";
          setPurchaseError(msg);
          toast({ title: "Échec de l'enregistrement", description: msg, variant: "destructive" });
        }
        setFinalizing(false);
        clearParams();
      })();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearch = async () => {
    const clean = cleanDomainName(searchTerm);
    if (!clean) return;

    setIsSearching(true);
    setHasSearched(true);
    setPurchaseError(null);

    const initialResults: DomainResult[] = EXTENSIONS.map((ext) => ({
      domain: `${clean}${ext}`,
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

  const handlePurchase = async (domain: string) => {
    setPurchasingDomain(domain);
    setPurchaseError(null);
    try {
      // 1) Reserve
      const { success, id } = await reserveDomain(domain, { provider: "namecheap" });
      if (!success || !id) {
        return;
      }
      // 2) Start Stripe Checkout
      const { success: ok, url, error } = await startDomainCheckout(id, 1);
      if (!ok || !url) {
        const msg = error || "Impossible d'ouvrir le paiement Stripe.";
        setPurchaseError(msg);
        toast({ title: "Erreur de paiement", description: msg, variant: "destructive" });
        return;
      }
      // 3) Redirect to Stripe
      window.location.href = url;
    } finally {
      setPurchasingDomain(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Stripe callback states */}
      {finalizing && (
        <Alert>
          <Loader2 className="h-4 w-4 animate-spin" />
          <AlertDescription>
            Paiement confirmé. Enregistrement du domaine auprès du registrar en cours…
          </AlertDescription>
        </Alert>
      )}
      {!finalizing && finalizedDomain && (
        <Alert className="bg-green-50 border-green-200">
          <Check className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-900">
            ✅ Votre domaine a été acheté et enregistré avec succès. Retrouvez-le dans l'onglet « Achetés ».
          </AlertDescription>
        </Alert>
      )}
      {!finalizing && purchaseError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{purchaseError}</AlertDescription>
        </Alert>
      )}

      {/* Already own a domain shortcut */}
      <Card className="border-dashed border-primary/30 bg-primary/5">
        <CardContent className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link2 className="h-5 w-5 text-primary" />
            <div>
              <p className="font-medium text-sm">Vous possédez déjà un domaine ?</p>
              <p className="text-xs text-muted-foreground">
                Connectez un domaine acheté chez un registrar externe (Namecheap, GoDaddy, Cloudflare…)
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onSwitchToConnect?.()}
            className="shrink-0"
          >
            <Globe className="h-4 w-4 mr-2" />
            Connecter mon domaine
          </Button>
        </CardContent>
      </Card>

      <Separator />

      {/* Search */}
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

      {/* Empty state */}
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

      {/* Results */}
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
                    <Badge
                      variant={result.available ? "default" : "secondary"}
                      className={result.available ? "bg-green-100 text-green-800 hover:bg-green-100" : ""}
                    >
                      {result.available ? "Disponible" : "Indisponible"}
                    </Badge>
                  )}
                </div>
                <div>
                  {!result.checking && result.available && (
                    <Button
                      size="sm"
                      className="gap-2"
                      onClick={() => handlePurchase(result.domain)}
                      disabled={purchasingDomain !== null}
                    >
                      {purchasingDomain === result.domain ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <CreditCard className="h-4 w-4" />
                      )}
                      {purchasingDomain === result.domain ? "Redirection vers Stripe…" : "Acheter"}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
