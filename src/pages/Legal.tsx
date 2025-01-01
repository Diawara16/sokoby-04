export default function Legal() {
  return (
    <div className="min-h-screen bg-white py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Mentions légales</h1>
        
        <div className="prose prose-red max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">1. Informations légales</h2>
            <p>
              Sokoby est une plateforme de commerce électronique exploitée par la société Sokoby SAS.
              Siège social : [Adresse]
              SIRET : [Numéro SIRET]
              Capital social : [Montant]
              Email : support@sokoby.com
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">2. Hébergement</h2>
            <p>
              Ce site est hébergé par [Nom de l'hébergeur]
              Adresse : [Adresse de l'hébergeur]
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">3. Propriété intellectuelle</h2>
            <p>
              L'ensemble du contenu de ce site est protégé par le droit d'auteur. 
              Toute reproduction sans autorisation préalable est interdite.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}