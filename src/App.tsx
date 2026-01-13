import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { FirebaseAuthProvider } from "@/hooks/useFirebaseAuth";
import CustomCursor from "@/components/CustomCursor";
import Index from "@/pages/Index";
import Messages from "@/pages/Messages";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

function App() {
  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <FirebaseAuthProvider>
          <TooltipProvider>
            <CustomCursor />
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/messages" element={<Messages />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </FirebaseAuthProvider>
      </QueryClientProvider>
    </HelmetProvider>
  );
}

export default App;