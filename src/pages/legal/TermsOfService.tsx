import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Button 
          variant="ghost" 
          onClick={() => window.history.back()}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour
        </Button>

        <h1 className="text-3xl font-bold mb-8">Conditions Générales de Vente</h1>

        <div className="space-y-6 text-muted-foreground">
          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">1. Objet</h2>
            <p>
              Les présentes conditions générales de vente régissent les relations contractuelles 
              entre la société et ses clients dans le cadre de la vente de produits en ligne.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">2. Commandes</h2>
            <p>
              Toute commande implique l'acceptation pleine et entière des présentes conditions 
              générales de vente. Les informations contractuelles font l'objet d'une confirmation 
              par voie électronique.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">3. Prix et Paiement</h2>
            <p>
              Les prix sont exprimés en euros, toutes taxes comprises. Le paiement s'effectue 
              lors de la commande par carte bancaire sécurisée via notre prestataire de paiement.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">4. Livraison</h2>
            <p>
              Les délais de livraison sont indicatifs et courent à compter de la validation 
              de la commande. En cas de retard, le client sera informé dans les meilleurs délais.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">5. Droit de Rétractation</h2>
            <p>
              Conformément à l'article L. 221-18 du Code de la consommation, vous disposez d'un 
              délai de quatorze jours pour exercer votre droit de rétractation sans avoir à 
              justifier de motifs ni à payer de pénalités.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">6. Garanties</h2>
            <p>
              Tous nos produits bénéficient de la garantie légale de conformité et de la 
              garantie contre les vices cachés, conformément aux dispositions légales en vigueur.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">7. Protection des Données</h2>
            <p>
              Les informations recueillies font l'objet d'un traitement informatique destiné 
              à la gestion de votre commande. Vous disposez d'un droit d'accès et de rectification 
              aux données vous concernant.
            </p>
          </section>
        </div>

        <div className="mt-8 pt-6 border-t text-center text-sm text-muted-foreground">
          <p>Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}</p>
        </div>
      </div>
    </div>
  );
}