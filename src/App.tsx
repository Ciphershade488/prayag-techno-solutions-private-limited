import React from 'react';
import { Route, Routes, BrowserRouter as Router, Navigate, Outlet } from 'react-router-dom';
import ScrollToTop from './components/ScrollToTop';
import SiteHeader from './components/SiteHeader';
import SiteFooter from './components/SiteFooter';
import CookieConsent from './components/CookieConsent';
import { AuthProvider } from './contexts/AuthContext';
import { CompanyProvider } from './contexts/CompanyContext';
import ProtectedRoute from './components/ProtectedRoute';

// Public pages
import HomePage from './pages/HomePage';
import BookOnlinePage from './pages/BookOnlinePage';
import JobsPage from './pages/JobsPage';
import BlankPage from './pages/BlankPage';

// Admin pages
import AdminLayout from './pages/admin/AdminLayout';
import AdminLoginPage from './pages/admin/AdminLoginPage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminJobsPage from './pages/admin/AdminJobsPage';
import AdminJobFormPage from './pages/admin/AdminJobFormPage';
import AdminCompanyPage from './pages/admin/AdminCompanyPage';
import AdminBookingsPage from './pages/admin/AdminBookingsPage';
import AdminApplicationsPage from './pages/admin/AdminApplicationsPage';

const PublicLayout: React.FC = () => (
  <div className="flex min-h-[100dvh] flex-col">
    <SiteHeader />
    <main className="flex-1 pt-16">
      <Outlet />
    </main>
    <SiteFooter />
  </div>
);

function App() {
  return (
    <Router>
      <CompanyProvider>
        <AuthProvider>
          <ScrollToTop />
          <Routes>
            {/* Public Website Routes */}
            <Route element={<PublicLayout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/book-online" element={<BookOnlinePage />} />
              <Route path="/jobs" element={<JobsPage />} />
              <Route path="/blank-page" element={<BlankPage />} />
              <Route path="/about" element={<BlankPage />} />
            </Route>

            {/* Admin Login Routes */}
            <Route path="/admin/login" element={<AdminLoginPage />} />
            <Route path="/login" element={<Navigate to="/admin/login" replace />} />

            {/* Admin Protected Routes */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute redirectTo="/admin/login">
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="dashboard" element={<AdminDashboardPage />} />
              <Route path="jobs" element={<AdminJobsPage />} />
              <Route path="jobs/add" element={<AdminJobFormPage />} />
              <Route path="jobs/edit/:id" element={<AdminJobFormPage />} />
              <Route path="company" element={<AdminCompanyPage />} />
              <Route path="bookings" element={<AdminBookingsPage />} />
              <Route path="applications" element={<AdminApplicationsPage />} />
            </Route>

            {/* Fallback to Home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          <CookieConsent />
        </AuthProvider>
      </CompanyProvider>
    </Router>
  );
}

export default App;
