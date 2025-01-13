import { Routes, Route } from "react-router-dom";
import Login from "@/pages/Login";
import Home from "@/pages/Home";
import PlanTarifaire from "@/pages/PlanTarifaire";
import Onboarding from "@/pages/Onboarding";
import PrivateRoute from "@/components/PrivateRoute";
import UpdatePassword from "@/pages/UpdatePassword";
import ResetPassword from "@/pages/ResetPassword";
import Register from "@/pages/Register";
import SubscriptionDetails from "@/components/profile/SubscriptionDetails";
import { AuthenticatedPricingContent } from "@/components/pricing/AuthenticatedPricingContent";
import { UnauthenticatedPricingContent } from "@/components/pricing/UnauthenticatedPricingContent";
import { useSubscriptionHandler } from "@/hooks/useSubscriptionHandler";
import { DomainRouter } from "@/components/landing/DomainRouter";

const AppRoutes = () => {
  const { handleSubscribe } = useSubscriptionHandler();
  const hostname = window.location.hostname;
  
  console.log('AppRoutes - Hostname détecté:', hostname);

  // Liste des domaines principaux de la plateforme
  const platformDomains = [
    'localhost', 
    'sokoby.com', 
    'www.sokoby.com', 
    'preview--sokoby-04.lovable.app',
    'sokoby-04.lovableproject.com'
  ];
  const isPlatformDomain = platformDomains.includes(hostname);

  console.log('AppRoutes - Est-ce un domaine de la plateforme ?', isPlatformDomain);

  // Si ce n'est pas un domaine de la plateforme, utiliser le DomainRouter pour les boutiques
  if (!isPlatformDomain) {
    return <DomainRouter />;
  }

  // Routes de la plateforme principale
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/connexion" element={<Login />} />
      <Route path="/plan-tarifaire" element={<PlanTarifaire />} />
      <Route 
        path="/onboarding" 
        element={
          <PrivateRoute>
            <Onboarding />
          </PrivateRoute>
        } 
      />
      <Route 
        path="/update-password" 
        element={
          <PrivateRoute>
            <UpdatePassword />
          </PrivateRoute>
        } 
      />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route 
        path="/register" 
        element={
          <PrivateRoute>
            <Register />
          </PrivateRoute>
        } 
      />
      <Route 
        path="/subscription-details" 
        element={
          <PrivateRoute>
            <SubscriptionDetails />
          </PrivateRoute>
        } 
      />
      <Route 
        path="/authenticated-pricing" 
        element={
          <PrivateRoute>
            <AuthenticatedPricingContent 
              hasProfile={true}
              onSubscribe={handleSubscribe}
            />
          </PrivateRoute>
        } 
      />
      <Route 
        path="/unauthenticated-pricing" 
        element={
          <UnauthenticatedPricingContent 
            onSubscribe={handleSubscribe}
          />
        } 
      />
    </Routes>
  );
};

export default AppRoutes;