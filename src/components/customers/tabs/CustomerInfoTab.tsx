import { Card } from "@/components/ui/card";
import { CustomerTagsManager } from "../CustomerTagsManager";

interface CustomerInfoTabProps {
  customer: {
    id: string;
    phone_number: string | null;
    customer_type: string;
    company_name: string | null;
    address: string | null;
    city: string | null;
    postal_code: string | null;
    country: string | null;
  };
}

export const CustomerInfoTab = ({ customer }: CustomerInfoTabProps) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h3 className="font-semibold mb-2">Contact</h3>
          <p>Téléphone: {customer.phone_number || 'Non renseigné'}</p>
          {customer.customer_type === 'business' && (
            <p>Entreprise: {customer.company_name || 'Non renseigné'}</p>
          )}
        </div>
        <div>
          <h3 className="font-semibold mb-2">Adresse</h3>
          <p>{customer.address || 'Non renseignée'}</p>
          <p>
            {customer.city && `${customer.city}, `}
            {customer.postal_code && `${customer.postal_code}`}
          </p>
          <p>{customer.country || ''}</p>
        </div>
      </div>
      
      <div>
        <h3 className="font-semibold mb-2">Tags</h3>
        <CustomerTagsManager customerId={customer.id} />
      </div>
    </div>
  );
};