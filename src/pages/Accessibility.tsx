export default function Accessibility() {
  return (
    <div className="min-h-screen bg-white py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Accessibilité</h1>
        
        <div className="prose prose-red max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Notre engagement</h2>
            <p>
              Sokoby s'engage à rendre son site web accessible à tous les utilisateurs, 
              y compris les personnes en situation de handicap.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Fonctionnalités d'accessibilité</h2>
            <ul className="list-disc pl-6">
              <li>Navigation au clavier</li>
              <li>Textes alternatifs pour les images</li>
              <li>Structure sémantique claire</li>
              <li>Contraste de couleurs optimisé</li>
              <li>Taille de texte ajustable</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Nous contacter</h2>
            <p>
              Si vous rencontrez des difficultés d'accessibilité sur notre site, 
              n'hésitez pas à nous contacter à accessibility@sokoby.com
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}