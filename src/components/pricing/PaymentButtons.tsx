import { Button } from "@/components/ui/button";
import { CreditCard, Wallet } from "lucide-react";
import { InteracPaymentForm } from "@/components/payments/InteracPaymentForm";

interface PaymentButtonsProps {
  planType: 'starter' | 'pro' | 'enterprise';
  couponCode?: string;
  onSubscribe: (
    planType: 'starter' | 'pro' | 'enterprise',
    paymentMethod: 'card' | 'apple_pay' | 'google_pay' | 'interac',
    couponCode?: string
  ) => void;
}

export const PaymentButtons = ({ planType, couponCode, onSubscribe }: PaymentButtonsProps) => {
  return (
    <div className="space-y-3">
      <Button
        className="w-full bg-red-600 hover:bg-red-700 text-white"
        onClick={() => onSubscribe(planType, 'card', couponCode)}
      >
        <CreditCard className="mr-2 h-4 w-4" />
        Commencer l'essai gratuit
      </Button>

      <Button
        variant="outline"
        className="w-full border-2 hover:bg-gray-50 bg-black text-white"
        onClick={() => onSubscribe(planType, 'apple_pay', couponCode)}
      >
        <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.0425 10.8116C16.9938 8.61901 18.8557 7.36403 18.9519 7.30007C17.8038 5.58071 15.9906 5.33516 15.3562 5.31541C13.8506 5.15519 12.3931 6.22342 11.6274 6.22342C10.8453 6.22342 9.63347 5.33516 8.37849 5.36478C6.73569 5.39441 5.20781 6.34631 4.37818 7.83282C2.65882 10.8711 3.91381 15.3772 5.5566 17.8238C6.38623 19.0195 7.36788 20.3729 8.67149 20.3235C9.94622 20.2741 10.4325 19.4939 11.9677 19.4939C13.4862 19.4939 13.9428 20.3235 15.2761 20.2938C16.6487 20.2741 17.4981 19.0788 18.2981 17.8732C19.2501 16.4908 19.6375 15.1374 19.6572 15.0682C19.6177 15.0583 17.0918 14.0766 17.0425 10.8116Z"/>
          <path d="M14.5725 3.67261C15.2464 2.84298 15.6929 1.71337 15.5722 0.583771C14.5923 0.623397 13.4034 1.23747 12.7 2.04735C12.0757 2.75847 11.5401 3.90783 11.6805 5.01781C12.7692 5.09164 13.8792 4.48269 14.5725 3.67261Z"/>
        </svg>
        Payer avec Apple Pay
      </Button>

      <Button
        variant="outline"
        className="w-full border-2 hover:bg-gray-50"
        onClick={() => onSubscribe(planType, 'google_pay', couponCode)}
      >
        <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 24C18.6274 24 24 18.6274 24 12C24 5.37258 18.6274 0 12 0C5.37258 0 0 5.37258 0 12C0 18.6274 5.37258 24 12 24Z" fill="#4285F4"/>
          <path d="M12 4.8C13.7647 4.8 15.2941 5.41176 16.4706 6.47059L19.2941 3.64706C17.2941 1.88235 14.8235 0.705883 12 0.705883C7.76471 0.705883 4.11765 3.17647 2.35294 6.70588L5.52941 9.17647C6.35294 6.70588 8.94118 4.8 12 4.8Z" fill="#EA4335"/>
          <path d="M23.2941 12.2353C23.2941 11.4118 23.1765 10.8235 23.0588 10.1176H12V14.4706H18.3529C18.1176 15.7647 17.4118 16.8235 16.4706 17.5294L19.6471 20C21.7647 18.1176 23.2941 15.4118 23.2941 12.2353Z" fill="#4285F4"/>
          <path d="M5.52941 14.8235C5.29412 14.1176 5.17647 13.2941 5.17647 12.4706C5.17647 11.6471 5.29412 10.8235 5.52941 10.1176L2.35294 7.64706C1.41176 9.17647 0.705883 10.9412 0.705883 12.4706C0.705883 14 1.41176 15.7647 2.35294 17.2941L5.52941 14.8235Z" fill="#FBBC05"/>
          <path d="M12 23.2941C14.8235 23.2941 17.2941 22.3529 19.2941 20.5882L16.1176 18.1176C15.0588 18.8235 13.6471 19.2941 12 19.2941C8.94118 19.2941 6.35294 17.3882 5.52941 14.9176L2.35294 17.3882C4.11765 20.9176 7.76471 23.2941 12 23.2941Z" fill="#34A853"/>
        </svg>
        Payer avec Google Pay
      </Button>

      <Button
        variant="outline"
        className="w-full border-2 hover:bg-gray-50"
        onClick={() => onSubscribe(planType, 'interac', couponCode)}
      >
        <Wallet className="mr-2 h-4 w-4" />
        Payer avec Interac
      </Button>
    </div>
  );
};