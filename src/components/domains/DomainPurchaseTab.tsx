import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Search, Check, X, Loader2, ShoppingCart, ExternalLink, Globe, Copy, Info,
} from "lucide-react";
import { useStoreDomains } from "@/hooks/useStoreDomains";
import { useToast } from "@/hooks/use-toast";

const EXTENSIONS = [".com", ".net", ".store", ".shop", ".online"];

interface DomainResult {
  domain: string;
  available: boolean | null;
  checking: boolean;
}

interface DomainPurchaseTabProps {
  onDomainPurchased?: () => void;
}

export const DomainPurchaseTab = ({ onDomainPurchased }: DomainPurchaseTabProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState<DomainResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [purchasingDomain, setPurchasingDomain] = useState<string | null>(null);
  const [purchasedDomain, setPurchasedDomain] = useState<string | null>(null);

  const { purchaseDomain } = useStoreDomains();
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
    setPurchasedDomain(null);

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
      // Since registrar API is not yet integrated, register in pending state
      const success = await purchaseDomain(domain, "manual");
      if (success) {
        setPurchasedDomain(domain);
        onDomainPurchased?.();
      }
    } finally {
      setPurchasingDomain(null);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Copié !", description: text });
  };

  return (
    <div className="space-y-6">
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
                      disabled={purchasingDomain === result.domain || purchasedDomain === result.domain}
                    >
                      {purchasingDomain === result.domain ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : purchasedDomain === result.domain ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <ShoppingCart className="h-4 w-4" />
                      )}
                      {purchasedDomain === result.domain ? "Enregistré" : "Réserver"}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Post-purchase DNS instructions */}
      {purchasedDomain && (
        <Alert className="bg-blue-50 border-blue-200">
          <Info className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-800 space-y-3">
            <p className="font-semibold">
              Domaine « {purchasedDomain} » enregistré en attente de configuration DNS.
            </p>
            <p className="text-sm">
              L'achat automatique via registrar n'est pas encore disponible. Achetez ce domaine chez un registrar, puis configurez les enregistrements DNS suivants :
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
            <div className="flex gap-3 mt-2 flex-wrap">
              <a href="https://www.namecheap.com/" target="_blank" rel="noopener noreferrer" className="text-xs text-primary underline inline-flex items-center gap-1">
                Namecheap <ExternalLink className="h-3 w-3" />
              </a>
              <a href="https://www.godaddy.com/" target="_blank" rel="noopener noreferrer" className="text-xs text-primary underline inline-flex items-center gap-1">
                GoDaddy <ExternalLink className="h-3 w-3" />
              </a>
              <a href="https://www.cloudflare.com/products/registrar/" target="_blank" rel="noopener noreferrer" className="text-xs text-primary underline inline-flex items-center gap-1">
                Cloudflare <ExternalLink className="h-3 w-3" />
              </a>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Une fois le DNS configuré, vérifiez le domaine dans l'onglet « Mes domaines achetés ».
            </p>
          </AlertDescription>
        </Alert>
      )}

      {/* Registrar links */}
      {hasSearched && !purchasedDomain && (
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
