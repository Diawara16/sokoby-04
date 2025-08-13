import { ProductImportForm } from "@/components/products/ProductImportForm";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function AddProduct() {
  const navigate = useNavigate();

  const handleSuccess = () => {
    navigate('/boutique-editeur?tab=products');
  };

  return (
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
        
        <h1 className="text-2xl font-bold mb-8">Ajouter un produit</h1>
        <ProductImportForm onSuccess={handleSuccess} />
      </div>
    </div>
  );
}