import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { CVProvider } from "@/contexts/CVContext";
import { ApplicationProvider } from "@/contexts/ApplicationContext";
import Layout from "@/components/layout/Layout";
import HomePage from "@/pages/HomePage";
import JobsPage from "@/pages/JobsPage";
import JobDetailPage from "@/pages/JobDetailPage";
import CVBuilderPage from "@/pages/CVBuilderPage";
import CVCheckerPage from "@/pages/CVCheckerPage";
import ProfilePage from "@/pages/ProfilePage";
import ApplicationTipsPage from "@/pages/ApplicationTipsPage";
import RecommendedJobsPage from "@/pages/RecommendedJobsPage";
import MyApplicationsPage from "@/pages/MyApplicationsPage";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <CVProvider>
        <ApplicationProvider>
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
                  <Route path="/check-cv" element={<CVCheckerPage />} />
                  <Route path="/profile" element={<ProfilePage />} />
                  <Route path="/tips-melamar" element={<ApplicationTipsPage />} />
                  <Route path="/rekomendasi" element={<RecommendedJobsPage />} />
                  <Route path="/lamaran-saya" element={<MyApplicationsPage />} />
                </Route>
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </ApplicationProvider>
      </CVProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
