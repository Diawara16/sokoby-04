import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import {
  Search, Check, X, Loader2, ShoppingCart, ExternalLink, Globe, Copy, Info, Rocket, Link2, CreditCard,
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
  const [reservedDomain, setReservedDomain] = useState<string | null>(null);
  const [reservedDomainId, setReservedDomainId] = useState<string | null>(null);
  const [completing, setCompleting] = useState(false);
  const [purchaseCompleted, setPurchaseCompleted] = useState(false);
  const [purchaseError, setPurchaseError] = useState<string | null>(null);

  const { reserveDomain, completePurchase } = useDomainPurchases();
  const { toast } = useToast();

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

  const handleSearch = async () => {
    const clean = cleanDomainName(searchTerm);
    if (!clean) return;

    setIsSearching(true);
    setHasSearched(true);
    setReservedDomain(null);
    setReservedDomainId(null);
    setPurchaseCompleted(false);
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
    try {
      const { success, id } = await reserveDomain(domain, { provider: "namecheap" });
      if (success && id) {
        setReservedDomainId(id);
        setReservedDomain(domain);
        onDomainPurchased?.();
      }
    } finally {
      setPurchasingDomain(null);
    }
  };

  const handleCompletePurchase = async () => {
    if (!reservedDomainId) return;
    setCompleting(true);
    setPurchaseError(null);
    const { success, error } = await completePurchase(reservedDomainId, 1);
    if (success) {
      setPurchaseCompleted(true);
      toast({ title: "Domaine acheté", description: `${reservedDomain} a été acheté avec succès.` });
      onDomainPurchased?.();
    } else {
      const msg = error || "L'achat a échoué. Veuillez réessayer.";
      setPurchaseError(msg);
      toast({ title: "Échec de l'achat", description: msg, variant: "destructive" });
    }
    setCompleting(false);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Copié !", description: text });
  };

  return (
    <div className="space-y-6">
      {/* Coming soon badge + MVP notice */}
      <Alert className="bg-amber-50 border-amber-200">
        <Info className="h-4 w-4 text-amber-600" />
        <AlertDescription className="text-amber-800 text-sm">
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-300 text-xs">
              <Rocket className="h-3 w-3 mr-1" />
              Bientôt disponible
            </Badge>
            <span className="font-semibold">Achat direct de domaines dans Sokoby</span>
          </div>
          <strong>Mode MVP :</strong> La vérification de disponibilité est estimée (basée sur le DNS) et ne reflète pas la disponibilité réelle chez un registrar. L'achat crée un enregistrement « en attente » — aucun achat réel n'est effectué.
        </AlertDescription>
      </Alert>

      {/* "I already own a domain" shortcut */}
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
                      {result.available ? "Disponible (estimation)" : "Indisponible"}
                    </Badge>
                  )}
                </div>
                <div>
                  {!result.checking && result.available && (
                    <Button
                      size="sm"
                      className="gap-2"
                      onClick={() => handlePurchase(result.domain)}
                      disabled={purchasingDomain === result.domain || reservedDomain === result.domain}
                    >
                      {purchasingDomain === result.domain ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : reservedDomain === result.domain ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <ShoppingCart className="h-4 w-4" />
                      )}
                      {reservedDomain === result.domain ? "Réservé" : "Réserver"}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Complete Purchase step (after reservation) */}
      {reservedDomain && !purchaseCompleted && (
        <Alert className="bg-amber-50 border-amber-200">
          <Info className="h-4 w-4 text-amber-600" />
          <AlertDescription className="text-amber-900 space-y-3">
            <p className="font-semibold">
              « {reservedDomain} » réservé. Finalisez l'achat pour l'enregistrer auprès du registrar.
            </p>
            <p className="text-sm">
              L'achat est exécuté de manière sécurisée côté serveur via Namecheap. Aucun frais n'est prélevé en mode sandbox.
            </p>
            {purchaseError && <p className="text-sm text-destructive">Erreur : {purchaseError}</p>}
            <Button
              size="sm"
              className="gap-2"
              onClick={handleCompletePurchase}
              disabled={completing || !reservedDomainId}
            >
              {completing ? <Loader2 className="h-4 w-4 animate-spin" /> : <CreditCard className="h-4 w-4" />}
              {completing ? "Achat en cours..." : purchaseError ? "Réessayer l'achat" : "Finaliser l'achat"}
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Post-purchase success + DNS instructions */}
      {purchaseCompleted && reservedDomain && (
        <Alert className="bg-green-50 border-green-200">
          <Check className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-900 space-y-3">
            <p className="font-semibold">✅ Domaine « {reservedDomain} » acheté avec succès.</p>
            <p className="text-sm">
              Pour l'activer sur votre boutique, connectez-le via l'onglet « Connecter » et configurez les enregistrements DNS suivants :
            </p>
            <div className="grid gap-3 md:grid-cols-2 mt-2">
              <div className="bg-background p-3 rounded-md border text-sm space-y-1">
                <p className="font-semibold text-xs uppercase tracking-wider text-muted-foreground">Enregistrement A</p>
                <p>Type : <span className="font-mono">A</span></p>
                <p>Nom : <span className="font-mono">@</span></p>
                <p className="flex items-center gap-1">
                  Valeur : <span className="font-mono">185.158.133.1</span>
                  <Button variant="ghost" size="sm" className="h-5 w-5 p-0" onClick={() => copyToClipboard("185.158.133.1")}>
                    <Copy className="h-3 w-3" />
                  </Button>
                </p>
              </div>
              <div className="bg-background p-3 rounded-md border text-sm space-y-1">
                <p className="font-semibold text-xs uppercase tracking-wider text-muted-foreground">Enregistrement www</p>
                <p>Type : <span className="font-mono">A</span></p>
                <p>Nom : <span className="font-mono">www</span></p>
                <p className="flex items-center gap-1">
                  Valeur : <span className="font-mono">185.158.133.1</span>
                  <Button variant="ghost" size="sm" className="h-5 w-5 p-0" onClick={() => copyToClipboard("185.158.133.1")}>
                    <Copy className="h-3 w-3" />
                  </Button>
                </p>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={() => onSwitchToConnect?.()} className="gap-2">
              <Globe className="h-4 w-4" />
              Connecter ce domaine
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Registrar links */}
      {hasSearched && !reservedDomain && (
        <Alert>
          <AlertDescription className="text-sm text-muted-foreground">
            L'achat direct de domaine sera bientôt disponible. En attendant, achetez votre domaine chez un registrar :
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
