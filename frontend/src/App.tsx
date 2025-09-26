import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import UserLogin from "./pages/UserLogin";
import UserSignup from "./pages/UserSignup";
import CaptainLogin from "./pages/CaptainLogin";
import CaptainSignup from "./pages/CaptainSignup";
import CaptainHome from "./pages/CaptainHome";
import NotFound from "./pages/NotFound";
import UserContext from "./service/context/UserContext";
import CaptainContext from "./service/context/CaptainContext";
import UserProtectedWrapper from "./pages/UserProtectedWrapper";
import CaptainProtectedWrapper from "./pages/CaptainProtectedWrapper";
import Home from "./pages/Home";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <UserContext>
          <CaptainContext>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/home" element={
                <UserProtectedWrapper>
                  <Home />
                </UserProtectedWrapper>
              } />
              <Route path="/captain-home" element={
                <CaptainProtectedWrapper>
                  <CaptainHome />
                </CaptainProtectedWrapper>
              } />
              <Route path="/user/login" element={<UserLogin />} />
              <Route path="/user/signup" element={<UserSignup />} />
              <Route path="/captain/login" element={<CaptainLogin />} />
              <Route path="/captain/signup" element={<CaptainSignup />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </CaptainContext>
        </UserContext>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
