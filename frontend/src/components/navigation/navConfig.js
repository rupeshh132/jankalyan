import { LayoutDashboard, AlertCircle, FileText, Settings, User, Activity, PlusCircle } from 'lucide-react';

export const getNavItems = (role) => {
  if (role === 'ADMIN') {
    return [
      { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
      { name: 'Complaints', path: '/admin/complaints', icon: FileText },
      { name: 'Alerts', path: '/notifications', icon: AlertCircle },
    ];
  }
  return [
    { name: 'Feed', path: '/dashboard', icon: LayoutDashboard },
    { name: 'My Posts', path: '/dashboard/complaints', icon: FileText },
    { name: 'Report', path: '/dashboard/report', icon: PlusCircle, isMain: true },
    { name: 'Track', path: '/dashboard/track', icon: Activity },
    { name: 'Profile', path: '/dashboard/profile', icon: User },
    { name: 'Settings', path: '/dashboard/settings', icon: Settings, hideOnMobile: true },
  ];
};
