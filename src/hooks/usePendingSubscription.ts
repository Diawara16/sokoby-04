import { useEffect } from 'react';
import { useSubscriptionHandler } from './useSubscriptionHandler';
import { useAuthAndProfile } from './useAuthAndProfile';

export const usePendingSubscription = () => {
  const { handleSubscribe } = useSubscriptionHandler();
  const { isAuthenticated } = useAuthAndProfile();

  useEffect(() => {
    if (isAuthenticated) {
      const pendingSubscription = localStorage.getItem('pendingSubscription');
      if (pendingSubscription) {
        try {
          const { planType, paymentMethod, couponCode, billingPeriod } = JSON.parse(pendingSubscription);
          console.log('Resuming pending subscription:', { planType, paymentMethod, couponCode, billingPeriod });
          
          // Nettoyer le localStorage
          localStorage.removeItem('pendingSubscription');
          
          // Reprendre le processus d'abonnement
          handleSubscribe(planType, paymentMethod, couponCode, billingPeriod || 'monthly');
        } catch (error) {
          console.error('Error resuming pending subscription:', error);
          localStorage.removeItem('pendingSubscription');
        }
      }
    }
  }, [isAuthenticated, handleSubscribe]);
};