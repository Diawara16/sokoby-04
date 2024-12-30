import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { useAuthAndProfile } from "@/hooks/useAuthAndProfile"
import Home from "./pages/Home"
import Dashboard from "./pages/Dashboard"
import Applications from "./pages/Applications"
import Parametres from "./pages/Parametres"
import CreerBoutiqueIA from "./pages/CreerBoutiqueIA"

function App() {
  const { isAuthenticated } = useAuthAndProfile()

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home isAuthenticated={isAuthenticated} />} />
        <Route path="/tableau-de-bord" element={<Dashboard />} />
        <Route path="/applications" element={<Applications />} />
        <Route path="/parametres" element={<Parametres />} />
        <Route path="/creer-boutique-ia" element={<CreerBoutiqueIA />} />
      </Routes>
    </Router>
  )
}

export default App