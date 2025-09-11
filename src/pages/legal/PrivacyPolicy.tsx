import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function PrivacyPolicy() {
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

        <h1 className="text-3xl font-bold mb-8">Politique de Confidentialité</h1>

        <div className="space-y-6 text-muted-foreground">
          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">1. Collecte des Données</h2>
            <p>
              Nous collectons les données personnelles que vous nous fournissez directement 
              lors de la création de votre compte, de vos commandes, ou de vos interactions 
              avec notre service client.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">2. Utilisation des Données</h2>
            <p>
              Vos données personnelles sont utilisées pour traiter vos commandes, améliorer 
              nos services, vous envoyer des communications marketing (avec votre consentement), 
              et respecter nos obligations légales.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">3. Partage des Données</h2>
            <p>
              Nous ne vendons, n'échangeons ni ne louons vos informations personnelles à des 
              tiers. Nous pouvons partager vos données avec nos prestataires de services 
              (paiement, livraison) uniquement dans le cadre nécessaire à l'exécution de nos services.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">4. Sécurité</h2>
            <p>
              Nous mettons en place des mesures techniques et organisationnelles appropriées 
              pour protéger vos données personnelles contre la perte, l'utilisation abusive, 
              l'accès non autorisé, la divulgation, l'altération ou la destruction.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">5. Vos Droits</h2>
            <p>
              Conformément au RGPD, vous disposez des droits d'accès, de rectification, 
              d'effacement, de portabilité, de limitation du traitement et d'opposition. 
              Vous pouvez exercer ces droits en nous contactant.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">6. Cookies</h2>
            <p>
              Notre site utilise des cookies pour améliorer votre expérience de navigation 
              et analyser l'utilisation de notre site. Vous pouvez configurer votre navigateur 
              pour refuser les cookies.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">7. Contact</h2>
            <p>
              Pour toute question concernant cette politique de confidentialité ou pour 
              exercer vos droits, vous pouvez nous contacter à l'adresse email fournie 
              dans nos mentions légales.
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