import { Routes, Route } from "react-router-dom";
import { OrderRoutes } from "@/routes/OrderRoutes";
import PrivateRoute from "@/components/PrivateRoute";
import Checkout from "@/pages/Checkout";

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
    </Routes>
  );
}