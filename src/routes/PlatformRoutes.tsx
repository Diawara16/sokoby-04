import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { LazyComponent } from "@/components/ui/lazy-component";
import PrivateRoute from "@/components/PrivateRoute";

// Lazy loaded components
const Login = lazy(() => import("@/pages/Login"));
const Home = lazy(() => import("@/pages/Home"));
const PlanTarifaire = lazy(() => import("@/pages/PlanTarifaire"));
const Onboarding = lazy(() => import("@/pages/Onboarding"));
const UpdatePassword = lazy(() => import("@/pages/UpdatePassword"));
const ResetPassword = lazy(() => import("@/pages/ResetPassword"));
const Register = lazy(() => import("@/pages/Register"));
const SubscriptionDetails = lazy(() => import("@/components/profile/SubscriptionDetails"));
const AuthenticatedPricingContent = lazy(() => import("@/components/pricing/AuthenticatedPricingContent"));
const UnauthenticatedPricingContent = lazy(() => import("@/components/pricing/UnauthenticatedPricingContent"));

interface PlatformRoutesProps {
  handleSubscribe: (
    planType: 'starter' | 'pro' | 'enterprise',
    paymentMethod: 'card' | 'apple_pay' | 'google_pay',
    couponCode?: string
  ) => Promise<void>;
}

export const PlatformRoutes = ({ handleSubscribe }: PlatformRoutesProps) => {
  return (
    <Routes>
      <Route path="/" element={<LazyComponent><Home /></LazyComponent>} />
      <Route path="/connexion" element={<LazyComponent><Login /></LazyComponent>} />
      <Route path="/plan-tarifaire" element={<LazyComponent><PlanTarifaire /></LazyComponent>} />
      <Route 
        path="/onboarding" 
        element={
          <PrivateRoute>
            <LazyComponent><Onboarding /></LazyComponent>
          </PrivateRoute>
        } 
      />
      <Route 
        path="/update-password" 
        element={
          <PrivateRoute>
            <LazyComponent><UpdatePassword /></LazyComponent>
          </PrivateRoute>
        } 
      />
      <Route path="/reset-password" element={<LazyComponent><ResetPassword /></LazyComponent>} />
      <Route 
        path="/register" 
        element={
          <PrivateRoute>
            <LazyComponent><Register /></LazyComponent>
          </PrivateRoute>
        } 
      />
      <Route 
        path="/subscription-details" 
        element={
          <PrivateRoute>
            <LazyComponent><SubscriptionDetails /></LazyComponent>
          </PrivateRoute>
        } 
      />
      <Route 
        path="/authenticated-pricing" 
        element={
          <PrivateRoute>
            <LazyComponent>
              <AuthenticatedPricingContent 
                hasProfile={true}
                onSubscribe={handleSubscribe}
              />
            </LazyComponent>
          </PrivateRoute>
        } 
      />
      <Route 
        path="/unauthenticated-pricing" 
        element={
          <LazyComponent>
            <UnauthenticatedPricingContent 
              onSubscribe={handleSubscribe}
            />
          </LazyComponent>
        } 
      />
    </Routes>
  );
};