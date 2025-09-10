import { ProductImportForm } from "@/components/products/ProductImportForm";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { AppSidebar } from "@/components/AppSidebar";

export default function ImportProducts() {
  const navigate = useNavigate();
  
  console.log('ImportProducts component rendering');

  const handleSuccess = () => {
    navigate('/boutique-editeur?tab=products');
  };

  return (
    <div className="flex min-h-screen w-full">
      <AppSidebar />
      <main className="flex-1 overflow-y-auto bg-background">
        <div className="container mx-auto py-8 px-4">
          <div className="max-w-5xl mx-auto">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/boutique-editeur')}
              className="mb-6"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour à l'éditeur
            </Button>
            
            <h1 className="text-2xl font-bold mb-8">Importer des produits</h1>
            
            {/* Debugging info */}
            <div className="mb-4 p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">
                Page d'importation des produits chargée avec succès
              </p>
            </div>
            
            <ProductImportForm onSuccess={handleSuccess} />
          </div>
        </div>
      </main>
    </div>
  );
}