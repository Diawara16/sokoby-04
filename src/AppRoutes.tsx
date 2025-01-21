import { useSubscriptionHandler } from "@/hooks/useSubscriptionHandler";
import { DomainRouter } from "@/components/landing/DomainRouter";
import { isPlatformDomain } from "@/config/domains";
import { PlatformRoutes } from "@/routes/PlatformRoutes";
import { BrowserRouter } from "react-router-dom";

export function AppRoutes() {
  const { handleSubscribe } = useSubscriptionHandler();
  const hostname = window.location.hostname;
  
  console.log('AppRoutes - Hostname détecté:', hostname);
  console.log('AppRoutes - Est-ce un domaine de la plateforme ?', isPlatformDomain(hostname));

  return (
    <BrowserRouter>
      {!isPlatformDomain(hostname) ? (
        <DomainRouter />
      ) : (
        <PlatformRoutes handleSubscribe={handleSubscribe} />
      )}
    </BrowserRouter>
  );
};