import { useSubscriptionHandler } from "@/hooks/useSubscriptionHandler";
import { DomainRouter } from "@/components/landing/DomainRouter";
import { isPlatformDomain } from "@/config/domains";
import { PlatformRoutes } from "@/routes/PlatformRoutes";

const AppRoutes = () => {
  const { handleSubscribe } = useSubscriptionHandler();
  const hostname = window.location.hostname;
  
  console.log('AppRoutes - Hostname détecté:', hostname);
  console.log('AppRoutes - Est-ce un domaine de la plateforme ?', isPlatformDomain(hostname));

  // Si ce n'est pas un domaine de la plateforme, utiliser le DomainRouter pour les boutiques
  if (!isPlatformDomain(hostname)) {
    return <DomainRouter />;
  }

  // Routes de la plateforme principale
  return <PlatformRoutes handleSubscribe={handleSubscribe} />;
};

export default AppRoutes;