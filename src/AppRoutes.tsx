import { Routes, Route } from "react-router-dom"
import Home from "./pages/Home"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Dashboard from "./pages/Dashboard"
import Profile from "./pages/Profile"
import QuiSommesNous from "./pages/QuiSommesNous"
import Orders from "./pages/Orders"
import OrderDetails from "./pages/OrderDetails"
import Fidelite from "./pages/Fidelite"
import BlogManager from "./pages/BlogManager"
import Blog from "./pages/Blog"
import BlogPost from "./pages/BlogPost"
import CustomReports from "./pages/analytics/CustomReports"
import { DynamicLanding } from "./components/landing/DynamicLanding"

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/tableau-de-bord" element={<Dashboard />} />
      <Route path="/profil" element={<Profile />} />
      <Route path="/qui-sommes-nous" element={<QuiSommesNous />} />
      <Route path="/suivi-commande" element={<Orders />} />
      <Route path="/commande/:id" element={<OrderDetails />} />
      <Route path="/fidelite" element={<Fidelite />} />
      <Route path="/blog-manager" element={<BlogManager />} />
      <Route path="/blog" element={<Blog />} />
      <Route path="/blog/:slug" element={<BlogPost />} />
      <Route path="/rapports-personnalises" element={<CustomReports />} />
      <Route path="/:slug" element={<DynamicLanding />} />
    </Routes>
  )
}