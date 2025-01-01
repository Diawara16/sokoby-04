import { Routes, Route } from "react-router-dom";
import PrivateRoute from "@/components/PrivateRoute";
import Orders from "@/pages/Orders";
import DraftOrders from "@/pages/DraftOrders";
import ShippingLabels from "@/pages/ShippingLabels";
import AbandonedCheckouts from "@/pages/AbandonedCheckouts";

export const OrderRoutes = () => {
  return (
    <Routes>
      <Route
        path="/commandes"
        element={
          <PrivateRoute>
            <Orders />
          </PrivateRoute>
        }
      />
      <Route
        path="/commandes/provisoires"
        element={
          <PrivateRoute>
            <DraftOrders />
          </PrivateRoute>
        }
      />
      <Route
        path="/commandes/expeditions"
        element={
          <PrivateRoute>
            <ShippingLabels />
          </PrivateRoute>
        }
      />
      <Route
        path="/commandes/abandonnes"
        element={
          <PrivateRoute>
            <AbandonedCheckouts />
          </PrivateRoute>
        }
      />
    </Routes>
  );
};