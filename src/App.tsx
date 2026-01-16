import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { CVProvider } from "@/contexts/CVContext";
import Layout from "@/components/layout/Layout";
import HomePage from "@/pages/HomePage";
import JobsPage from "@/pages/JobsPage";
import JobDetailPage from "@/pages/JobDetailPage";
import CVBuilderPage from "@/pages/CVBuilderPage";
import ProfilePage from "@/pages/ProfilePage";
import ApplicationTipsPage from "@/pages/ApplicationTipsPage";
import RecommendedJobsPage from "@/pages/RecommendedJobsPage";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <CVProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route element={<Layout />}>
                <Route path="/" element={<HomePage />} />
                <Route path="/lowongan" element={<JobsPage />} />
                <Route path="/lowongan/:id" element={<JobDetailPage />} />
                <Route path="/buat-cv" element={<CVBuilderPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/tips-melamar" element={<ApplicationTipsPage />} />
                <Route path="/rekomendasi" element={<RecommendedJobsPage />} />
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </CVProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
