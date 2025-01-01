import { Route } from "react-router-dom";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import Customers from "@/pages/Customers";
import CustomerDetailsPage from "@/pages/customers/CustomerDetails";
import CustomerOverview from "@/pages/customers/CustomerOverview";
import CustomerGroups from "@/pages/customers/CustomerGroups";
import CustomerLoyalty from "@/pages/customers/CustomerLoyalty";

export const CustomerRoutes = () => {
  return (
    <>
      <Route
        path="/clientele"
        element={
          <ProtectedRoute>
            <Customers />
          </ProtectedRoute>
        }
      />
      <Route
        path="/clientele/:id"
        element={
          <ProtectedRoute>
            <CustomerDetailsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/clientele/apercu"
        element={
          <ProtectedRoute>
            <CustomerOverview />
          </ProtectedRoute>
        }
      />
      <Route
        path="/clientele/groupes"
        element={
          <ProtectedRoute>
            <CustomerGroups />
          </ProtectedRoute>
        }
      />
      <Route
        path="/clientele/fidelisation"
        element={
          <ProtectedRoute>
            <CustomerLoyalty />
          </ProtectedRoute>
        }
      />
    </>
  );
};
