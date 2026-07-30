import React, { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import AppLayout from '../layouts/AppLayout';
import AdminRoute from './AdminRoute';
import ProtectedRoute from './ProtectedRoute';
import GuestRoute from './GuestRoute';
import { Spinner } from '../components/ui/spinner';

// Lazy loading pages
const LoginPage = React.lazy(() => import('../pages/public/LoginPage'));
const RegisterPage = React.lazy(() => import('../pages/public/RegisterPage'));
const ForgotPasswordPage = React.lazy(() => import('../pages/public/ForgotPasswordPage'));
const HomePage = React.lazy(() => import('../pages/public/HomePage'));
const HowItWorksPage = React.lazy(() => import('../pages/public/HowItWorksPage'));
const FeaturesPage = React.lazy(() => import('../pages/public/FeaturesPage'));
const AboutPage = React.lazy(() => import('../pages/public/AboutPage'));
const ContactPage = React.lazy(() => import('../pages/public/ContactPage'));
const HelpCenterPage = React.lazy(() => import('../pages/public/HelpCenterPage'));
const PublicComplaintsPage = React.lazy(() => import('../pages/public/PublicComplaintsPage'));
const PublicComplaintDetailsPage = React.lazy(() => import('../pages/public/PublicComplaintDetailsPage'));

const DashboardPage = React.lazy(() => import('../pages/citizen/DashboardPage'));
const MyComplaintsPage = React.lazy(() => import('../pages/citizen/MyComplaintsPage'));
const ReportComplaintPage = React.lazy(() => import('../pages/citizen/ReportComplaintPage'));
const EditComplaintPage = React.lazy(() => import('../pages/citizen/EditComplaintPage'));
const TrackComplaintPage = React.lazy(() => import('../pages/citizen/TrackComplaintPage'));

const ProfilePage = React.lazy(() => import('../pages/private/ProfilePage'));
const SettingsPage = React.lazy(() => import('../pages/private/SettingsPage'));
const NotificationsPage = React.lazy(() => import('../pages/private/NotificationsPage'));

const AdminDashboardPage = React.lazy(() => import('../pages/admin/AdminDashboardPage'));
const ComplaintManagementPage = React.lazy(() => import('../pages/admin/ComplaintManagementPage'));
const AdminComplaintDetailsPage = React.lazy(() => import('../pages/admin/AdminComplaintDetailsPage'));

const PageFallback = () => (
  <div className="flex h-[50vh] w-full items-center justify-center">
    <Spinner size="lg" className="text-primary opacity-50" />
  </div>
);

const AppRoutes = () => {
  return (
    <Suspense fallback={<PageFallback />}>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          {/* Public Routes */}
          <Route index element={<HomePage />} />
          <Route path="complaints" element={<PublicComplaintsPage />} />
          <Route path="complaints/:complaintId" element={<PublicComplaintDetailsPage />} />
          <Route path="how-it-works" element={<HowItWorksPage />} />
          <Route path="features" element={<FeaturesPage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="contact" element={<ContactPage />} />
          <Route path="help" element={<HelpCenterPage />} />
          <Route element={<GuestRoute />}>
            <Route path="login" element={<LoginPage />} />
            <Route path="register" element={<RegisterPage />} />
            <Route path="forgot-password" element={<ForgotPasswordPage />} />
          </Route>

          {/* Citizen Routes */}
          <Route path="dashboard" element={<ProtectedRoute />}>
            <Route index element={<DashboardPage />} />
            <Route path="complaints" element={<MyComplaintsPage />} />
            <Route path="complaints/:id/edit" element={<EditComplaintPage />} />
            <Route path="report" element={<ReportComplaintPage />} />
            <Route path="track" element={<TrackComplaintPage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>
          
          {/* Private Global Routes */}
          <Route path="notifications" element={<ProtectedRoute />}>
            <Route index element={<NotificationsPage />} />
          </Route>

          {/* Admin Routes */}
          <Route path="admin" element={<AdminRoute />}>
            <Route index element={<AdminDashboardPage />} />
            <Route path="complaints" element={<ComplaintManagementPage />} />
            <Route path="complaints/:id" element={<AdminComplaintDetailsPage />} />
          </Route>
        </Route>
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
