
import { Button } from "@/components/ui/button";

interface CartFooterProps {
  total: number;
  onCheckout: () => void;
}

export const CartFooter = ({ total, onCheckout }: CartFooterProps) => {
  return (
    <div className="border-t border-gray-200 p-4 bg-white">
      <div className="space-y-4">
        <div className="flex justify-between">
          <span className="font-medium">Sous-total</span>
          <span className="font-medium">${total.toFixed(2)}</span>
        </div>
        <Button className="w-full" onClick={onCheckout}>
          Passer à la caisse
        </Button>
      </div>
    </div>
  );
};
