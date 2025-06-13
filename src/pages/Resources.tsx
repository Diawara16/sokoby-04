import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export default function Resources() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">Ressources</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Ajoutez ici les cartes de ressources */}
        </div>
      </main>
      <Footer />
    </div>
  );
}
