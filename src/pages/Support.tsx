export default function Support() {
  return (
    <div className="min-h-screen bg-white py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Support</h1>
        
        <div className="grid gap-8 md:grid-cols-2">
          <div className="bg-red-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Centre d'aide</h2>
            <p className="text-gray-600 mb-4">
              Consultez notre base de connaissances pour trouver des réponses à vos questions.
            </p>
            <a 
              href="#" 
              className="text-red-600 hover:text-red-700 font-medium"
            >
              Accéder au centre d'aide →
            </a>
          </div>

          <div className="bg-red-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Contact support</h2>
            <p className="text-gray-600 mb-4">
              Notre équipe est disponible 24/7 pour vous aider.
            </p>
            <a 
              href="mailto:support@sokoby.com" 
              className="text-red-600 hover:text-red-700 font-medium"
            >
              Contacter le support →
            </a>
          </div>

          <div className="bg-red-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">FAQ</h2>
            <p className="text-gray-600 mb-4">
              Trouvez rapidement des réponses aux questions fréquentes.
            </p>
            <a 
              href="/faq" 
              className="text-red-600 hover:text-red-700 font-medium"
            >
              Consulter la FAQ →
            </a>
          </div>

          <div className="bg-red-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Guides et tutoriels</h2>
            <p className="text-gray-600 mb-4">
              Apprenez à utiliser toutes les fonctionnalités de Sokoby.
            </p>
            <a 
              href="/guides" 
              className="text-red-600 hover:text-red-700 font-medium"
            >
              Voir les guides →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}