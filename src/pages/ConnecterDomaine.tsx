import { ConnectExistingDomain } from "@/components/domain/ConnectExistingDomain";
import { Card } from "@/components/ui/card";

export default function ConnecterDomaine() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Connecter votre domaine existant</h1>

      <Card className="p-6 max-w-2xl">
        <ConnectExistingDomain />
      </Card>

      <Card className="p-6 mt-8 max-w-2xl">
        <h3 className="text-lg font-semibold mb-4">Besoin d'aide ?</h3>
        <p className="text-muted-foreground">
          Si vous rencontrez des difficultés pour connecter votre domaine,
          assurez-vous que les enregistrements DNS ont bien été propagés (jusqu'à 48h).
          Vous pouvez utiliser le bouton « Revérifier le DNS » ci-dessus.
        </p>
      </Card>
    </div>
  );
}
