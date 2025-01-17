import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
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

const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen">
    <LoadingSpinner size={32} />
  </div>
);

export const PlatformRoutes = ({ handleSubscribe }: PlatformRoutesProps) => {
  return (
    <Suspense fallback={<LoadingFallback />}>
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
    </Suspense>
  );
};