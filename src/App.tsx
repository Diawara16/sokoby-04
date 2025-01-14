import { BrowserRouter } from "react-router-dom";
import { AppRoutes } from "./AppRoutes";
import { Toaster } from "@/components/ui/toaster";
import { CookieConsent } from "@/components/CookieConsent";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
      <Toaster />
      <CookieConsent />
    </BrowserRouter>
  );
}

export default App;