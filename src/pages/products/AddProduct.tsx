import { ProductImportForm } from "@/components/products/ProductImportForm";

export default function AddProduct() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold mb-8">Ajouter un produit</h1>
        <ProductImportForm />
      </div>
    </div>
  );
}