import { Route } from "react-router-dom";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import Settings from "@/pages/Settings";
import StoreSettings from "@/pages/settings/StoreSettings";
import UserSettings from "@/pages/settings/UserSettings";
import PaymentSettings from "@/pages/settings/PaymentSettings";
import LocationSettings from "@/pages/settings/LocationSettings";
import SecuritySettings from "@/pages/settings/SecuritySettings";

export const SettingsRoutes = () => {
  return (
    <Route path="/parametres" element={<ProtectedRoute><Settings /></ProtectedRoute>}>
      <Route index element={<StoreSettings />} />
      <Route path="domaine" element={<StoreSettings showDomainOnly />} />
      <Route path="utilisateurs" element={<UserSettings />} />
      <Route path="paiements" element={<PaymentSettings />} />
      <Route path="geolocalisation" element={<LocationSettings />} />
      <Route path="securite" element={<SecuritySettings />} />
    </Route>
  );
};