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

const AppRoutes = () => {
  const { handleSubscribe } = useSubscriptionHandler();

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