import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Loader2, RefreshCw, Star, Trash2, CheckCircle2, Clock, XCircle } from "lucide-react";
import { useStoreDomains } from "@/hooks/useStoreDomains";
import { useState } from "react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

export const PurchasedDomainsTab = () => {
  const { domains, isLoading, verifyDomain, removeDomain, setPrimary } = useStoreDomains();
  const [verifyingId, setVerifyingId] = useState<string | null>(null);

  const handleVerify = async (id: string, domain: string) => {
    setVerifyingId(id);
    await verifyDomain(id, domain);
    setVerifyingId(null);
  };

  const statusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100 gap-1"><CheckCircle2 className="h-3 w-3" />Actif</Badge>;
      case "pending":
        return <Badge variant="secondary" className="gap-1"><Clock className="h-3 w-3" />En attente</Badge>;
      case "failed":
        return <Badge variant="destructive" className="gap-1"><XCircle className="h-3 w-3" />Échoué</Badge>;
      case "expired":
        return <Badge variant="outline" className="gap-1">Expiré</Badge>;
      default:
        return <Badge variant="outline">Inconnu</Badge>;
    }
  };

  if (isLoading) {
    return <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>;
  }

  if (domains.length === 0) {
    return (
      <div className="text-center py-12 space-y-2">
        <p className="text-muted-foreground">Aucun domaine acheté pour le moment.</p>
        <p className="text-sm text-muted-foreground">Utilisez l'onglet « Acheter un domaine » pour commencer.</p>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Domaine</TableHead>
            <TableHead>Fournisseur</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead>DNS auto</TableHead>
            <TableHead>Principal</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {domains.map((d) => (
            <TableRow key={d.id}>
              <TableCell className="font-mono font-medium">{d.domain}</TableCell>
              <TableCell>
                <Badge variant="outline" className="capitalize">{d.provider}</Badge>
              </TableCell>
              <TableCell>{statusBadge(d.status)}</TableCell>
              <TableCell>
                {d.dns_auto_configured ? (
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                ) : (
                  <span className="text-xs text-muted-foreground">Manuel</span>
                )}
              </TableCell>
              <TableCell>
                {d.is_primary ? (
                  <Star className="h-5 w-5 text-amber-500 fill-amber-500" />
                ) : (
                  <span className="text-muted-foreground">—</span>
                )}
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {d.updated_at ? format(new Date(d.updated_at), "d MMM yyyy", { locale: fr }) : "—"}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleVerify(d.id, d.domain || "")}
                    disabled={verifyingId === d.id || !d.domain}
                    title="Vérifier DNS"
                  >
                    {verifyingId === d.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
                  </Button>
                  {!d.is_primary && d.status === "active" && (
                    <Button variant="outline" size="sm" onClick={() => setPrimary(d.id)} title="Définir comme principal">
                      <Star className="h-4 w-4" />
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removeDomain(d.id)}
                    className="text-destructive hover:text-destructive"
                    title="Supprimer"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
