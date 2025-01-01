import { Routes, Route } from "react-router-dom";
import { OrderRoutes } from "@/routes/OrderRoutes";
import PrivateRoute from "@/components/PrivateRoute";
import Checkout from "@/pages/Checkout";
import AbandonedCheckouts from "@/pages/AbandonedCheckouts";
import DraftOrders from "@/pages/DraftOrders";
import Orders from "@/pages/Orders";
import ShippingLabels from "@/pages/ShippingLabels";

export default function AppRoutes() {
  return (
    <Routes>
      <OrderRoutes />
      <Route
        path="/checkout"
        element={
          <PrivateRoute>
            <Checkout />
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
      <Route
        path="/commandes/provisoires"
        element={
          <PrivateRoute>
            <DraftOrders />
          </PrivateRoute>
        }
      />
      <Route
        path="/commandes"
        element={
          <PrivateRoute>
            <Orders />
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
    </Routes>
  );
}
