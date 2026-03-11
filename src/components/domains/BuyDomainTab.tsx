import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Check, X, Loader2, ShoppingCart, ExternalLink } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

const EXTENSIONS = [".com", ".net", ".store", ".shop"];

interface DomainResult {
  domain: string;
  available: boolean | null;
  checking: boolean;
}

export const BuyDomainTab = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState<DomainResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

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

  return (
    <div className="space-y-6">
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
                    <Button size="sm" disabled className="gap-2">
                      <ShoppingCart className="h-4 w-4" />
                      Acheter
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
            L'achat de domaine n'est pas encore disponible. En attendant, vous pouvez acheter votre domaine chez un registrar externe puis le connecter :
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
