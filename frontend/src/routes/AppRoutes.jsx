import { Routes, Route } from 'react-router-dom';
import AppLayout from '../layouts/AppLayout';
import LoginPage from '../pages/public/LoginPage';
import RegisterPage from '../pages/public/RegisterPage';
import HomePage from '../pages/public/HomePage';
import HowItWorksPage from '../pages/public/HowItWorksPage';
import FeaturesPage from '../pages/public/FeaturesPage';
import AboutPage from '../pages/public/AboutPage';
import ContactPage from '../pages/public/ContactPage';
import HelpCenterPage from '../pages/public/HelpCenterPage';
import PublicComplaintsPage from '../pages/public/PublicComplaintsPage';
import PublicComplaintDetailsPage from '../pages/public/PublicComplaintDetailsPage';
import DashboardPage from '../pages/citizen/DashboardPage';
import MyComplaintsPage from '../pages/citizen/MyComplaintsPage';
import ReportComplaintPage from '../pages/citizen/ReportComplaintPage';
import EditComplaintPage from '../pages/citizen/EditComplaintPage';
import ProfilePage from '../pages/private/ProfilePage';
import SettingsPage from '../pages/private/SettingsPage';
import AdminDashboardPage from '../pages/admin/AdminDashboardPage';
import ComplaintManagementPage from '../pages/admin/ComplaintManagementPage';
import AdminComplaintDetailsPage from '../pages/admin/AdminComplaintDetailsPage';
import NotificationsPage from '../pages/private/NotificationsPage';
import AdminRoute from './AdminRoute';
import ProtectedRoute from './ProtectedRoute';
import GuestRoute from './GuestRoute';

const AppRoutes = () => {
  return (
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
        </Route>

        {/* Citizen Routes */}
        <Route path="dashboard" element={<ProtectedRoute />}>
          <Route index element={<DashboardPage />} />
          <Route path="complaints" element={<MyComplaintsPage />} />
          <Route path="complaints/:id/edit" element={<EditComplaintPage />} />
          <Route path="report" element={<ReportComplaintPage />} />
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
  );
};

export default AppRoutes;
