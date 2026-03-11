import { useState, useEffect, useCallback } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Shield, Star, Trash2, RefreshCw, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface Domain {
  id: string;
  domain_name: string | null;
  status: string | null;
  ssl_status: string | null;
  is_primary: boolean | null;
  created_at: string | null;
  domain_type: string | null;
  store_id: string | null;
}

interface MyDomainsTabProps {
  refreshKey?: number;
}

export const MyDomainsTab = ({ refreshKey }: MyDomainsTabProps) => {
  const [domains, setDomains] = useState<Domain[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [verifyingId, setVerifyingId] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchDomains = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("domains")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setDomains(data || []);
    } catch (error) {
      console.error("Error fetching domains:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { fetchDomains(); }, [fetchDomains, refreshKey]);

  const handleVerify = async (domain: Domain) => {
    setVerifyingId(domain.id);
    try {
      // Set status to "verifying" immediately
      await supabase
        .from("domains")
        .update({ status: "verifying", updated_at: new Date().toISOString() })
        .eq("id", domain.id);
      await fetchDomains();

      const response = await fetch(`https://dns.google/resolve?name=${domain.domain_name}&type=A`);
      const data = await response.json();
      const pointsToSokoby = data.Answer?.some(
        (record: any) => record.type === 1 && record.data === "185.158.133.1"
      );

      const newStatus = pointsToSokoby ? "active" : "pending";
      const newSsl = pointsToSokoby ? "active" : "pending";

      await supabase
        .from("domains")
        .update({ status: newStatus, ssl_status: newSsl, updated_at: new Date().toISOString() })
        .eq("id", domain.id);

      toast({
        title: pointsToSokoby ? "Domaine vérifié" : "DNS non configuré",
        description: pointsToSokoby
          ? "Le domaine pointe correctement vers Sokoby."
          : "Le DNS ne pointe pas encore vers Sokoby. Vérifiez vos enregistrements.",
        variant: pointsToSokoby ? "default" : "destructive",
      });
      await fetchDomains();
    } catch {
      toast({ title: "Erreur", description: "Impossible de vérifier le domaine.", variant: "destructive" });
    } finally {
      setVerifyingId(null);
    }
  };

  const handleSetPrimary = async (domain: Domain) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Unset all domains for the same store, then set the selected one
      if (domain.store_id) {
        await supabase.from("domains").update({ is_primary: false }).eq("store_id", domain.store_id);
      } else {
        await supabase.from("domains").update({ is_primary: false }).eq("user_id", user.id);
      }
      await supabase.from("domains").update({ is_primary: true }).eq("id", domain.id);

      toast({ title: "Domaine principal mis à jour" });
      await fetchDomains();
    } catch {
      toast({ title: "Erreur", variant: "destructive" });
    }
  };

  const handleRemove = async (domainId: string) => {
    try {
      const { error } = await supabase.from("domains").delete().eq("id", domainId);
      if (error) throw error;
      toast({ title: "Domaine supprimé" });
      await fetchDomains();
    } catch {
      toast({ title: "Erreur", description: "Impossible de supprimer le domaine.", variant: "destructive" });
    }
  };

  const statusBadge = (status: string | null) => {
    switch (status) {
      case "active": return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Actif</Badge>;
      case "verifying": return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Vérification</Badge>;
      case "pending": return <Badge variant="secondary">En attente</Badge>;
      case "failed": return <Badge variant="destructive">Échoué</Badge>;
      default: return <Badge variant="outline">Inconnu</Badge>;
    }
  };

  const sslBadge = (ssl: string | null) => {
    switch (ssl) {
      case "active": return <span className="flex items-center gap-1 text-green-600 text-sm"><Shield className="h-4 w-4" /> SSL Actif</span>;
      case "pending": return <span className="flex items-center gap-1 text-amber-600 text-sm"><Shield className="h-4 w-4" /> En cours</span>;
      default: return <span className="flex items-center gap-1 text-muted-foreground text-sm"><Shield className="h-4 w-4" /> Inactif</span>;
    }
  };

  if (isLoading) {
    return <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>;
  }

  if (domains.length === 0) {
    return (
      <div className="text-center py-12 space-y-2">
        <p className="text-muted-foreground">Aucun domaine connecté pour le moment.</p>
        <p className="text-sm text-muted-foreground">Utilisez l'onglet « Connecter » pour commencer.</p>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Domaine</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead>SSL</TableHead>
            <TableHead>Principal</TableHead>
            <TableHead>Date d'ajout</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {domains.map((domain) => (
            <TableRow key={domain.id}>
              <TableCell className="font-medium">{domain.domain_name}</TableCell>
              <TableCell>{statusBadge(domain.status)}</TableCell>
              <TableCell>{sslBadge(domain.ssl_status)}</TableCell>
              <TableCell>
                {domain.is_primary ? (
                  <Star className="h-5 w-5 text-amber-500 fill-amber-500" />
                ) : (
                  <span className="text-muted-foreground text-sm">—</span>
                )}
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {domain.created_at ? format(new Date(domain.created_at), "d MMM yyyy", { locale: fr }) : "—"}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleVerify(domain)}
                    disabled={verifyingId === domain.id}
                    title="Vérifier le DNS"
                  >
                    {verifyingId === domain.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
                  </Button>
                  {!domain.is_primary && (
                    <Button variant="outline" size="sm" onClick={() => handleSetPrimary(domain)} title="Définir comme principal">
                      <Star className="h-4 w-4" />
                    </Button>
                  )}
                  <Button variant="outline" size="sm" onClick={() => handleRemove(domain.id)} className="text-destructive hover:text-destructive" title="Supprimer">
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
