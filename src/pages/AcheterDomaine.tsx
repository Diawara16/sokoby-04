import { useState } from "react";
import { Card } from "@/components/ui/card";
import { DomainChecker } from "@/components/store/DomainChecker";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, ExternalLink } from "lucide-react";

const AcheterDomaine = () => {
  const [domainName, setDomainName] = useState("");

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Vérifier la disponibilité d'un domaine</h1>

      <Alert className="mb-6">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          L'achat de domaine se fait via un registrar externe (Namecheap, GoDaddy, Cloudflare).
          Une fois acheté, connectez-le depuis la page <strong>Connecter un domaine</strong>.
        </AlertDescription>
      </Alert>

      <Card className="p-6 mb-6">
        <DomainChecker
          value={domainName}
          onChange={setDomainName}
          onPurchase={() => {}}
        />
      </Card>

      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Comment obtenir un domaine ?</h2>
        <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
          <li>Achetez votre domaine chez un registrar :</li>
        </ol>
        <div className="flex gap-4 mt-3 mb-4 flex-wrap">
          <a href="https://www.namecheap.com/" target="_blank" rel="noopener noreferrer" className="text-primary underline inline-flex items-center gap-1">
            Namecheap <ExternalLink className="h-3 w-3" />
          </a>
          <a href="https://www.godaddy.com/" target="_blank" rel="noopener noreferrer" className="text-primary underline inline-flex items-center gap-1">
            GoDaddy <ExternalLink className="h-3 w-3" />
          </a>
          <a href="https://www.cloudflare.com/products/registrar/" target="_blank" rel="noopener noreferrer" className="text-primary underline inline-flex items-center gap-1">
            Cloudflare <ExternalLink className="h-3 w-3" />
          </a>
        </div>
        <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground" start={2}>
          <li>Configurez l'enregistrement A vers <strong>185.158.133.1</strong></li>
          <li>Revenez sur Sokoby et connectez votre domaine</li>
        </ol>
      </Card>
    </div>
  );
};

export default AcheterDomaine;
