import { BrowserRouter } from 'react-router-dom'
import { Toaster } from '@/components/ui/toaster'
import { LiveChat } from '@/components/chat/LiveChat'
import AppRoutes from './AppRoutes'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
      <LiveChat />
      <Toaster />
    </BrowserRouter>
  )
}

export default App