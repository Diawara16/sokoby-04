import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useActiveStore } from "@/components/store/hooks/useActiveStore";
import { Store, ExternalLink } from "lucide-react";

export const ActiveStoreCard = () => {
  const { store, isLoading } = useActiveStore();

  return (
    <Card className="border-muted">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex items-center gap-2">
          <Store className="h-5 w-5 text-muted-foreground" />
          <CardTitle className="text-base">Boutique active</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="h-16 animate-pulse rounded-md bg-muted" />
        ) : store ? (
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold">{store.store_name}</h3>
              <CardDescription>
                {store.domain_name ? (
                  <a
                    href={`https://${store.domain_name}`}
                    target="_blank"
                    rel="noreferrer"
                    className="underline underline-offset-2"
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
            <div className="flex gap-2">
              <Button asChild>
                <Link to="/boutique">
                  Accéder à la boutique
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link to="/parametres">
                  Paramètres
                </Link>
              </Button>
              {store.domain_name && (
                <Button variant="secondary" asChild>
                  <a href={`https://${store.domain_name}`} target="_blank" rel="noreferrer">
                    Ouvrir le site <ExternalLink className="ml-1 h-4 w-4" />
                  </a>
                </Button>
              )}
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Aucune boutique trouvée</h3>
              <CardDescription>
                Créez votre boutique pour commencer à vendre.
              </CardDescription>
            </div>
            <Button asChild>
              <Link to="/boutique-ia">Créer ma boutique</Link>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
