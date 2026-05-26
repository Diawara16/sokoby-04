import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Search, Check, X, Loader2, Globe, Link2, CreditCard, AlertCircle, Sparkles,
} from "lucide-react";
import { useDomainPurchases } from "@/hooks/useDomainPurchases";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const EXTENSIONS = [".com", ".net", ".store", ".shop", ".online"];
const MARKUP_USD = 5; // must match DOMAIN_MARKUP_USD on the server

interface DomainResult {
  domain: string;
  available: boolean | null;
  checking: boolean;
  /** Registrar wholesale price in USD (null = unknown / quote failed) */
  price: number | null;
  currency: string;
  premium: boolean;
  quoteError?: string;
  /** True when the registrar lookup itself failed (network/API/auth). */
  lookupFailed?: boolean;
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
  const [premiumConfirm, setPremiumConfirm] = useState<DomainResult | null>(null);

  const { reserveDomain, completePurchase, startDomainCheckout, refetch } = useDomainPurchases();
  const { toast } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();
  const handledCallback = useRef(false);

  const cleanDomainName = (input: string) =>
    input.toLowerCase().replace(/[^a-z0-9-]/g, "").replace(/^-+|-+$/g, "");

  /** Single call: availability + real registrar pricing from Namecheap. */
  const quoteDomain = async (domain: string): Promise<{
    available: boolean;
    premium: boolean;
    price: number | null;
    currency: string;
    error?: string;
  }> => {
    try {
      const { data, error } = await supabase.functions.invoke("namecheap-domain-check", {
        body: { domain },
      });
      if (error) return { available: false, premium: false, price: null, currency: "USD", error: error.message };
      if (data?.error) return { available: false, premium: false, price: null, currency: "USD", error: String(data.error) };
      return {
        available: !!data?.available,
        premium: !!data?.premium,
        price: typeof data?.price === "number" ? data.price : null,
        currency: data?.currency || "USD",
      };
    } catch (e) {
      return {
        available: false, premium: false, price: null, currency: "USD",
        error: e instanceof Error ? e.message : "Network error",
      };
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
            description: "Votre domaine a été acheté et enregistré avec succès.",
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
      price: null,
      currency: "USD",
      premium: false,
    }));
    setResults(initialResults);

    const updated = await Promise.all(
      initialResults.map(async (r) => {
        const q = await quoteDomain(r.domain);
        return {
          ...r,
          checking: false,
          available: q.available,
          premium: q.premium,
          price: q.price,
          currency: q.currency,
          quoteError: q.error,
        };
      }),
    );
    setResults(updated);
    setIsSearching(false);
  };

  const displayTotal = (r: DomainResult): string | null => {
    if (r.price == null || r.price <= 0) return null;
    return `${(r.price + MARKUP_USD).toFixed(2)} ${r.currency}/an`;
  };

  const beginPurchase = async (r: DomainResult) => {
    if (!r.available || r.price == null || r.price <= 0) {
      const msg = r.quoteError
        ? `Impossible d'obtenir le prix du registrar (${r.quoteError}).`
        : "Aucun prix registrar disponible pour ce domaine.";
      setPurchaseError(msg);
      toast({ title: "Prix indisponible", description: msg, variant: "destructive" });
      return;
    }
    if (r.premium) {
      setPremiumConfirm(r);
      return;
    }
    await runPurchase(r);
  };

  const runPurchase = async (r: DomainResult) => {
    setPurchasingDomain(r.domain);
    setPurchaseError(null);
    try {
      const { success, id } = await reserveDomain(r.domain, {
        provider: "namecheap",
        price: r.price ?? undefined,
        currency: r.currency,
      });
      if (!success || !id) return;

      const { success: ok, url, error } = await startDomainCheckout(id, 1);
      if (!ok || !url) {
        const msg = error || "Impossible d'ouvrir le paiement Stripe.";
        setPurchaseError(msg);
        toast({ title: "Erreur de paiement", description: msg, variant: "destructive" });
        return;
      }
      window.location.href = url;
    } finally {
      setPurchasingDomain(null);
    }
  };

  return (
    <div className="space-y-6">
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
            ✅ Votre domaine a été acheté et enregistré avec succès.
          </AlertDescription>
        </Alert>
      )}
      {!finalizing && purchaseError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{purchaseError}</AlertDescription>
        </Alert>
      )}

      <Card className="border-dashed border-primary/30 bg-primary/5">
        <CardContent className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link2 className="h-5 w-5 text-primary" />
            <div>
              <p className="font-medium text-sm">Vous possédez déjà un domaine ?</p>
              <p className="text-xs text-muted-foreground">
                Connectez un domaine acheté chez un registrar externe.
              </p>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={() => onSwitchToConnect?.()} className="shrink-0">
            <Globe className="h-4 w-4 mr-2" />
            Connecter mon domaine
          </Button>
        </CardContent>
      </Card>

      <Separator />

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
          <p className="text-muted-foreground">Entrez un nom pour vérifier la disponibilité et le prix.</p>
          <div className="flex justify-center gap-2 mt-3">
            {EXTENSIONS.map((ext) => (
              <Badge key={ext} variant="outline" className="text-xs">{ext}</Badge>
            ))}
          </div>
        </div>
      )}

      {hasSearched && (
        <div className="grid gap-3">
          {results.map((result) => {
            const total = displayTotal(result);
            const canBuy = result.available && result.price != null && result.price > 0;
            return (
              <Card key={result.domain} className="overflow-hidden">
                <CardContent className="p-4 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 min-w-0">
                    {result.checking ? (
                      <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                    ) : result.available ? (
                      <Check className="h-5 w-5 text-green-600" />
                    ) : (
                      <X className="h-5 w-5 text-red-500" />
                    )}
                    <span className="font-mono font-medium truncate">{result.domain}</span>
                    {!result.checking && (
                      <Badge
                        variant={result.available ? "default" : "secondary"}
                        className={result.available ? "bg-green-100 text-green-800 hover:bg-green-100" : ""}
                      >
                        {result.available ? "Disponible" : "Indisponible"}
                      </Badge>
                    )}
                    {result.premium && (
                      <Badge className="bg-amber-100 text-amber-900 hover:bg-amber-100 gap-1">
                        <Sparkles className="h-3 w-3" /> Premium
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    {!result.checking && result.available && (
                      <div className="text-right">
                        {total ? (
                          <p className="font-semibold text-sm">{total}</p>
                        ) : (
                          <p className="text-xs text-destructive">Prix indisponible</p>
                        )}
                      </div>
                    )}
                    {!result.checking && result.available && (
                      <Button
                        size="sm"
                        className="gap-2"
                        onClick={() => beginPurchase(result)}
                        disabled={purchasingDomain !== null || !canBuy}
                      >
                        {purchasingDomain === result.domain ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <CreditCard className="h-4 w-4" />
                        )}
                        {purchasingDomain === result.domain ? "Redirection…" : "Acheter"}
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <AlertDialog open={!!premiumConfirm} onOpenChange={(o) => !o && setPremiumConfirm(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-amber-500" />
              Domaine premium
            </AlertDialogTitle>
            <AlertDialogDescription>
              <strong>{premiumConfirm?.domain}</strong> est un domaine premium dont le tarif est fixé par le registrar.
              Le prix total facturé sera de{" "}
              <strong>
                {premiumConfirm
                  ? `${((premiumConfirm.price ?? 0) + MARKUP_USD).toFixed(2)} ${premiumConfirm.currency}`
                  : ""}
              </strong>{" "}
              pour la première année. Les années suivantes peuvent être facturées au prix standard du TLD.
              Confirmez-vous l'achat ?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                const r = premiumConfirm;
                setPremiumConfirm(null);
                if (r) void runPurchase(r);
              }}
            >
              Acheter au prix premium
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
