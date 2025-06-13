
export default function Support() {
  return (
    <div className="min-h-screen bg-white py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Support</h1>
        
        <div className="prose prose-red max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Comment nous contacter</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-3">Email</h3>
                <p className="text-gray-600 mb-2">
                  Pour toute question ou assistance technique :
                </p>
                <a href="mailto:support@sokoby.com" className="text-red-600 hover:text-red-800">
                  support@sokoby.com
                </a>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-3">Chat en ligne</h3>
                <p className="text-gray-600 mb-2">
                  Disponible 24h/7j pour vous aider
                </p>
                <button className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">
                  Démarrer le chat
                </button>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">FAQ</h2>
            <div className="space-y-4">
              <div className="border-b pb-4">
                <h3 className="text-lg font-medium mb-2">Comment créer ma première boutique ?</h3>
                <p className="text-gray-600">
                  Cliquez sur "Créer ma boutique gratuitement" et suivez notre assistant IA 
                  qui vous guidera étape par étape.
                </p>
              </div>
              
              <div className="border-b pb-4">
                <h3 className="text-lg font-medium mb-2">Puis-je changer de plan à tout moment ?</h3>
                <p className="text-gray-600">
                  Oui, vous pouvez mettre à niveau ou rétrograder votre plan à tout moment 
                  depuis vos paramètres de compte.
                </p>
              </div>
              
              <div className="border-b pb-4">
                <h3 className="text-lg font-medium mb-2">Comment migrer depuis Shopify ?</h3>
                <p className="text-gray-600">
                  Notre équipe vous accompagne gratuitement dans la migration de votre 
                  boutique Shopify vers Sokoby.
                </p>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Ressources utiles</h2>
            <ul className="space-y-2">
              <li>
                <a href="/guides" className="text-red-600 hover:text-red-800">
                  📚 Guides et tutoriels
                </a>
              </li>
              <li>
                <a href="/blog" className="text-red-600 hover:text-red-800">
                  📝 Blog et actualités
                </a>
              </li>
              <li>
                <a href="/about" className="text-red-600 hover:text-red-800">
                  ℹ️ À propos de Sokoby
                </a>
              </li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
