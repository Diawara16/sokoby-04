import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useActiveStore } from "@/components/store/hooks/useActiveStore";
import { Store, ExternalLink } from "lucide-react";

export const ActiveStoreCard = () => {
  const { store, isLoading } = useActiveStore();

  return (
    <Card className="border-muted">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-4 sm:p-6">
        <div className="flex items-center gap-2">
          <Store className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
          <CardTitle className="text-sm sm:text-base">Boutique active</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="p-4 sm:p-6">
        {isLoading ? (
          <div className="h-16 animate-pulse rounded-md bg-muted" />
        ) : store ? (
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h3 className="text-base sm:text-lg font-semibold">{store.store_name}</h3>
              <CardDescription className="text-xs sm:text-sm">
                {store.domain_name ? (
                  <a
                    href={`https://${store.domain_name}`}
                    target="_blank"
                    rel="noreferrer"
                    className="underline underline-offset-2 break-all"
                  >
                    {store.domain_name}
                  </a>
                ) : (
                  "Aucun domaine configuré"
                )}
                {store.default_currency && (
                  <span className="ml-2 text-muted-foreground">• {store.default_currency}</span>
                )}
              </CardDescription>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <Button asChild className="w-full sm:w-auto text-sm">
                <Link to={`/dashboard/store/${store.id}`}>
                  Gérer la boutique
                </Link>
              </Button>
              <Button variant="outline" asChild className="w-full sm:w-auto text-sm">
                <Link to="/boutique-editeur">
                  Éditeur
                </Link>
              </Button>
              {store.domain_name && (
                <Button variant="secondary" asChild className="w-full sm:w-auto text-sm">
                  <a href={`https://${store.domain_name}`} target="_blank" rel="noreferrer">
                    Ouvrir <ExternalLink className="ml-1 h-3 w-3 sm:h-4 sm:w-4" />
                  </a>
                </Button>
              )}
            </div>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base sm:text-lg font-semibold">Aucune boutique trouvée</h3>
              <CardDescription className="text-xs sm:text-sm">
                Créez votre boutique pour commencer à vendre.
              </CardDescription>
            </div>
            <Button asChild className="w-full sm:w-auto text-sm">
              <Link to="/boutique-ia">Créer ma boutique</Link>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
