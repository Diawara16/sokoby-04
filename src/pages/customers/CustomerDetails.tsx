import { CustomerDetails } from "@/components/customers/CustomerDetails";

export default function CustomerDetailsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Détails du Client</h1>
      <CustomerDetails />
    </div>
  );
}