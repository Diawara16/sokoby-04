import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { useAuthAndProfile } from "@/hooks/useAuthAndProfile";

export default function Features() {
  const { isAuthenticated } = useAuthAndProfile();

  return (
    <div className="min-h-screen flex flex-col">
      <Header isAuthenticated={isAuthenticated} />
      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">Nos fonctionnalités</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Ajoutez ici les cartes de fonctionnalités */}
        </div>
      </main>
      <Footer />
    </div>
  );
}