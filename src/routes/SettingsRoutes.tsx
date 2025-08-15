
import { Route } from "react-router-dom";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import Settings from "@/pages/Settings";
import StoreSettings from "@/pages/settings/StoreSettings";
import UserSettings from "@/pages/settings/UserSettings";
import PaymentSettings from "@/pages/settings/PaymentSettings";
import BillingSettings from "@/pages/settings/BillingSettings";
import LocationSettings from "@/pages/settings/LocationSettings";
import SecuritySettings from "@/pages/settings/SecuritySettings";
import DnsSettings from "@/pages/settings/DnsSettings";
import ShippingSettings from "@/pages/settings/ShippingSettings";

export const SettingsRoutes = () => {
  return (
    <Route path="/parametres" element={<ProtectedRoute><Settings /></ProtectedRoute>}>
      <Route index element={<StoreSettings />} />
      <Route path="domaine" element={<StoreSettings showDomainOnly />} />
      <Route path="dns" element={<DnsSettings />} />
      <Route path="utilisateurs" element={<UserSettings />} />
      <Route path="paiements" element={<PaymentSettings />} />
      <Route path="facturation" element={<BillingSettings />} />
      <Route path="expedition" element={<ShippingSettings />} />
      <Route path="geolocalisation" element={<LocationSettings />} />
      <Route path="securite" element={<SecuritySettings />} />
    </Route>
  );
};
