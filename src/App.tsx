import { useEffect } from "react"
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom"

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0) }, [pathname]);
  return null;
}

function GuestRoute({ children }: { children: React.ReactNode }) {
  const token = localStorage.getItem("token");
  const adminToken = localStorage.getItem("adminToken");
  if (adminToken) return <Navigate to="/admin/dashboard" replace />;
  if (token) return <Navigate to="/patient/dashboard" replace />;
  return <>{children}</>;
}
import { Header } from "@/components/layout/Header"
import { Footer } from "@/components/layout/Footer"
import { HomePage } from "@/pages/HomePage"
import { AboutPage } from "@/pages/AboutPage"
import { AppointmentPage } from "@/pages/AppointmentPage"
import { BlogPage } from "@/pages/BlogPage"
import { BlogDetailPage } from "@/pages/BlogDetailPage"
import { FAQPage } from "@/pages/FAQPage"
import { ContactPage } from "@/pages/ContactPage"
import { EmergencyPage } from "@/pages/EmergencyPage"
import { PatientLoginPage } from "@/pages/PatientLoginPage"
import { PatientDashboardPage } from "@/pages/PatientDashboardPage"
import { AdminDashboardPage } from "@/pages/AdminDashboardPage"
import { AdminLoginPage } from "@/pages/AdminLoginPage"
import { AppointmentDetailPage } from "@/pages/AppointmentDetailPage"
import { EmailVerificationPage } from "@/pages/EmailVerificationPage"
import { ForgotPasswordPage } from "@/pages/ForgotPasswordPage"
import { ResetPasswordPage } from "@/pages/ResetPasswordPage"
import { PrivacyPolicyPage } from "@/pages/PrivacyPolicyPage"
import { TermsPage } from "@/pages/TermsPage"

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-white font-sans antialiased">
        <ScrollToTop />
        <Routes>
          {/* Public pages with Header and Footer */}
          <Route path="/" element={<GuestRoute><><Header /><main><HomePage /></main><Footer /></></GuestRoute>} />
          <Route path="/about" element={<GuestRoute><><Header /><main><AboutPage /></main><Footer /></></GuestRoute>} />
          <Route path="/appointment" element={<><Header /><main><AppointmentPage /></main><Footer /></>} />
          <Route path="/blog" element={<GuestRoute><><Header /><main><BlogPage /></main><Footer /></></GuestRoute>} />
          <Route path="/blog/:id" element={<GuestRoute><><Header /><main><BlogDetailPage /></main><Footer /></></GuestRoute>} />
          <Route path="/faq" element={<GuestRoute><><Header /><main><FAQPage /></main><Footer /></></GuestRoute>} />
          <Route path="/contact" element={<GuestRoute><><Header /><main><ContactPage /></main><Footer /></></GuestRoute>} />
          <Route path="/emergency" element={<GuestRoute><><Header /><main><EmergencyPage /></main><Footer /></></GuestRoute>} />

          {/* Legal pages */}
          <Route path="/privacy" element={<GuestRoute><><Header /><main><PrivacyPolicyPage /></main><Footer /></></GuestRoute>} />
          <Route path="/terms" element={<GuestRoute><><Header /><main><TermsPage /></main><Footer /></></GuestRoute>} />

         


        

          {/* Patient Portal - No Header/Footer */}
          <Route path="/patient/login" element={<GuestRoute><PatientLoginPage /></GuestRoute>} />
          <Route path="/patient/dashboard" element={<PatientDashboardPage />} />
          <Route path="/patient/appointment/:id" element={<AppointmentDetailPage />} />
          <Route path="/verify-email" element={<EmailVerificationPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />

          {/* Admin Login - now at /admin */}
          <Route path="/admin" element={<AdminLoginPage />} />
          <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
          <Route path="/admin/appointments" element={<AdminDashboardPage />} />
          <Route path="/admin/patients" element={<AdminDashboardPage />} />
          <Route path="/admin/blog" element={<AdminDashboardPage />} />
          <Route path="/admin/settings" element={<AdminDashboardPage />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
