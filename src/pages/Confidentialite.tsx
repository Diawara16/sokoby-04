const Confidentialite = () => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">Politique de Confidentialité</h1>
      
      <div className="space-y-6 text-gray-700">
        <section>
          <h2 className="text-2xl font-semibold mb-4">1. Collecte des informations</h2>
          <p>
            Nous collectons les informations suivantes :
          </p>
          <ul className="list-disc ml-6 mt-2">
            <li>Nom et prénom</li>
            <li>Adresse email</li>
            <li>Informations de connexion et d'utilisation</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">2. Utilisation des informations</h2>
          <p>
            Les informations que nous collectons sont utilisées pour :
          </p>
          <ul className="list-disc ml-6 mt-2">
            <li>Personnaliser votre expérience</li>
            <li>Améliorer notre service</li>
            <li>Communiquer avec vous concernant votre compte</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">3. Protection des informations</h2>
          <p>
            Nous mettons en œuvre une variété de mesures de sécurité pour préserver 
            la sécurité de vos informations personnelles. Nous utilisons un 
            chiffrement à la pointe de la technologie pour protéger les informations 
            sensibles transmises en ligne.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">4. Cookies</h2>
          <p>
            Notre site utilise des cookies pour améliorer l'expérience utilisateur. 
            Un cookie est un petit fichier texte qui est stocké sur votre ordinateur 
            pour une durée limitée.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">5. Divulgation à des tiers</h2>
          <p>
            Nous ne vendons, n'échangeons et ne transférons pas vos informations 
            personnelles identifiables à des tiers. Cela ne comprend pas les tierces 
            parties de confiance qui nous aident à exploiter notre site Web ou à mener 
            nos affaires, tant que ces parties conviennent de garder ces informations 
            confidentielles.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">6. Consentement</h2>
          <p>
            En utilisant notre site, vous consentez à notre politique de confidentialité.
          </p>
        </section>
      </div>
    </div>
  );
};

export default Confidentialite;