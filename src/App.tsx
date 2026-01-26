import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext.new";
import { CVProvider } from "@/contexts/CVContext.new";
import { ApplicationProvider } from "@/contexts/ApplicationContext.new";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Layout from "@/components/layout/Layout";
import HomePage from "@/pages/HomePage";
import JobsPage from "@/pages/JobsPage";
import JobDetailPage from "@/pages/JobDetailPage";
import CompanyDetailPage from "@/pages/CompanyDetailPage";
import CVBuilderPage from "@/pages/CVBuilderPage";
import CVCheckerPage from "@/pages/CVCheckerPage";
import CVPage from "@/pages/CVPage";
import ProfilePage from "@/pages/ProfilePage";
import ApplicationTipsPage from "@/pages/ApplicationTipsPage";
import RecommendedJobsPage from "@/pages/RecommendedJobsPage";
import MyApplicationsPage from "@/pages/MyApplicationsPage";
import PrivacyPolicyPage from "@/pages/PrivacyPolicyPage";
import FAQPage from "@/pages/FAQPage";
import TermsAndConditionsPage from "@/pages/TermsAndConditionsPage";
import BugReportingPage from "@/pages/BugReportingPage";
import SupportTicketingPage from "@/pages/SupportTicketingPage";
import ForgotPasswordPage from "@/pages/ForgotPasswordPage";
import ResetPasswordPage from "@/pages/ResetPasswordPage";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 30 * 60 * 1000, // 30 minutes
      retry: (failureCount, error) => {
        // Don't retry on 401/403/404 errors
        if (error instanceof Error && 'status' in error) {
          const status = (error as { status?: number }).status;
          if (status === 401 || status === 403 || status === 404) {
            return false;
          }
        }
        return failureCount < 3;
      },
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: false,
    },
  },
});

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
                  <Route path="/perusahaan/:id" element={<CompanyDetailPage />} />
                  <Route path="/buat-cv" element={
                    <ProtectedRoute requiredRole="job_seeker">
                      <CVBuilderPage />
                    </ProtectedRoute>
                  } />
                  <Route path="/cv" element={
                    <ProtectedRoute requiredRole="job_seeker">
                      <CVPage />
                    </ProtectedRoute>
                  } />
                  <Route path="/check-cv" element={
                    <ProtectedRoute requiredRole="job_seeker">
                      <CVCheckerPage />
                    </ProtectedRoute>
                  } />
                  <Route path="/profile" element={
                    <ProtectedRoute requiredRole="job_seeker">
                      <ProfilePage />
                    </ProtectedRoute>
                  } />
                  <Route path="/tips-melamar" element={<ApplicationTipsPage />} />
                  <Route path="/rekomendasi" element={
                    <ProtectedRoute requiredRole="job_seeker">
                      <RecommendedJobsPage />
                    </ProtectedRoute>
                  } />
                  <Route path="/lamaran-saya" element={
                    <ProtectedRoute requiredRole="job_seeker">
                      <MyApplicationsPage />
                    </ProtectedRoute>
                  } />
                  <Route path="/kebijakan-privasi" element={<PrivacyPolicyPage />} />
                  <Route path="/faq" element={<FAQPage />} />
                  <Route path="/syarat-ketentuan" element={<TermsAndConditionsPage />} />
                  <Route path="/laporkan-bug" element={<BugReportingPage />} />
                  <Route path="/dukungan" element={<SupportTicketingPage />} />
                  <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                  <Route path="/reset-password" element={<ResetPasswordPage />} />
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
