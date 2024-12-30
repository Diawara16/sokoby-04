import { Route } from "react-router-dom";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import Orders from "@/pages/Orders";
import DraftOrders from "@/pages/DraftOrders";
import ShippingLabels from "@/pages/ShippingLabels";
import AbandonedCheckouts from "@/pages/AbandonedCheckouts";

export const OrderRoutes = () => {
  return (
    <>
      <Route
        path="/commandes"
        element={
          <ProtectedRoute>
            <Orders />
          </ProtectedRoute>
        }
      />
      <Route
        path="/commandes/provisoires"
        element={
          <ProtectedRoute>
            <DraftOrders />
          </ProtectedRoute>
        }
      />
      <Route
        path="/commandes/expeditions"
        element={
          <ProtectedRoute>
            <ShippingLabels />
          </ProtectedRoute>
        }
      />
      <Route
        path="/commandes/abandonnes"
        element={
          <ProtectedRoute>
            <AbandonedCheckouts />
          </ProtectedRoute>
        }
      />
    </>
  );
};