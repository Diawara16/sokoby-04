import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import CreerBoutiqueIA from "./pages/CreerBoutiqueIA";
import Pricing from "./pages/Pricing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Settings from "./pages/Settings";
import PrivateRoute from "./components/PrivateRoute";
import ResetPassword from "./pages/ResetPassword";
import UpdatePassword from "./pages/UpdatePassword";
import StoreSettings from "./pages/settings/StoreSettings";
import UserSettings from "./pages/settings/UserSettings";
import SecuritySettings from "./pages/settings/SecuritySettings";
import BillingSettings from "./pages/settings/BillingSettings";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/creer-boutique-ia" element={<CreerBoutiqueIA />} />
      <Route path="/tarifs" element={<Pricing />} />
      <Route path="/connexion" element={<Login />} />
      <Route path="/inscription" element={<Register />} />
      <Route path="/reinitialiser-mot-de-passe" element={<ResetPassword />} />
      <Route path="/modifier-mot-de-passe" element={<UpdatePassword />} />
      <Route
        path="/tableau-de-bord/*"
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        }
      />
      <Route
        path="/parametres/*"
        element={
          <PrivateRoute>
            <Settings />
          </PrivateRoute>
        }
      >
        <Route index element={<StoreSettings />} />
        <Route path="utilisateur" element={<UserSettings />} />
        <Route path="securite" element={<SecuritySettings />} />
        <Route path="facturation" element={<BillingSettings />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;