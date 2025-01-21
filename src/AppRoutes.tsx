import { useSubscriptionHandler } from "@/hooks/useSubscriptionHandler";
import { DomainRouter } from "@/components/landing/DomainRouter";
import { isPlatformDomain } from "@/config/domains";
import { PlatformRoutes } from "@/routes/PlatformRoutes";

export function AppRoutes() {
  const { handleSubscribe } = useSubscriptionHandler();
  const hostname = window.location.hostname;
  
  console.log('AppRoutes - Hostname détecté:', hostname);
  console.log('AppRoutes - Est-ce un domaine de la plateforme ?', isPlatformDomain(hostname));

  return (
    !isPlatformDomain(hostname) ? (
      <DomainRouter />
    ) : (
      <PlatformRoutes handleSubscribe={handleSubscribe} />
    )
  );
}