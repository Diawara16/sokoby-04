const Conditions = () => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">Conditions d'utilisation</h1>
      
      <div className="space-y-6 text-gray-700">
        <section>
          <h2 className="text-2xl font-semibold mb-4">1. Acceptation des conditions</h2>
          <p>
            En accédant et en utilisant ce site, vous acceptez d'être lié par ces conditions 
            d'utilisation, toutes les lois et réglementations applicables, et acceptez que 
            vous êtes responsable du respect des lois locales applicables.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">2. Licence d'utilisation</h2>
          <p>
            La permission d'utiliser les services est accordée sous réserve des conditions suivantes :
          </p>
          <ul className="list-disc ml-6 mt-2">
            <li>L'utilisation est accordée à titre personnel et non commercial</li>
            <li>Le contenu ne peut être modifié sans notre consentement écrit</li>
            <li>Cette licence peut être résiliée si ces conditions ne sont pas respectées</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">3. Utilisation des services</h2>
          <p>
            Nos services sont fournis "tels quels". Nous ne donnons aucune garantie 
            expresse ou implicite concernant la fiabilité, la disponibilité ou 
            l'adéquation à un usage particulier des services.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">4. Limitation de responsabilité</h2>
          <p>
            En aucun cas, nous ne serons responsables des dommages directs, indirects, 
            spéciaux ou consécutifs résultant de l'utilisation ou de l'impossibilité 
            d'utiliser nos services.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">5. Modifications</h2>
          <p>
            Nous nous réservons le droit de modifier ces conditions d'utilisation à 
            tout moment. Les modifications entrent en vigueur dès leur publication 
            sur ce site.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">6. Période d'essai</h2>
          <p>
            La période d'essai gratuit est limitée à 14 jours. À la fin de cette période, 
            vous devrez choisir un plan payant pour continuer à utiliser nos services.
          </p>
        </section>
      </div>
    </div>
  );
};

export default Conditions;