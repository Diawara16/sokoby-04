import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { BrowserRouter } from "react-router-dom"
import { SidebarProvider } from "@/components/ui/sidebar"
import { Toaster } from "@/components/ui/toaster"
import { LiveChat } from "@/components/chat/LiveChat"
import AppRoutes from "./AppRoutes"
import "./App.css"

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <SidebarProvider>
          <div className="min-h-screen flex w-full">
            <AppRoutes />
            <LiveChat />
            <Toaster />
          </div>
        </SidebarProvider>
      </BrowserRouter>
    </QueryClientProvider>
  )
}

export default App