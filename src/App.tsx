import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Index from "./pages/Index";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import Site1 from "./pages/sites/Site1";
import Site2 from "./pages/sites/Site2";
import Site3 from "./pages/sites/Site3";
import Site4 from "./pages/sites/Site4";
import Site5 from "./pages/sites/Site5";
import Site6 from "./pages/sites/Site6";
import Site7 from "./pages/sites/Site7";
import Site8 from "./pages/sites/Site8";
import Site9 from "./pages/sites/Site9";
import Site10 from "./pages/sites/Site10";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              } 
            />
            {/* Static Site Routes */}
            <Route path="/site1" element={<Site1 />} />
            <Route path="/site2" element={<Site2 />} />
            <Route path="/site3" element={<Site3 />} />
            <Route path="/site4" element={<Site4 />} />
            <Route path="/site5" element={<Site5 />} />
            <Route path="/site6" element={<Site6 />} />
            <Route path="/site7" element={<Site7 />} />
            <Route path="/site8" element={<Site8 />} />
            <Route path="/site9" element={<Site9 />} />
            <Route path="/site10" element={<Site10 />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
