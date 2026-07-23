import React from 'react';
import { Bell, Lock, Shield, Eye, Smartphone, HelpCircle } from 'lucide-react';

const SettingsPage = () => {
  const settingsSections = [
    {
      id: 'notifications',
      title: 'Notifications',
      description: 'Manage how you receive alerts and updates',
      icon: Bell,
      color: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
    },
    {
      id: 'security',
      title: 'Security & Password',
      description: 'Update your password and secure your account',
      icon: Lock,
      color: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400',
    },
    {
      id: 'privacy',
      title: 'Privacy',
      description: 'Control what information is visible to public',
      icon: Eye,
      color: 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400',
    },
    {
      id: 'devices',
      title: 'Connected Devices',
      description: 'Manage active sessions across devices',
      icon: Smartphone,
      color: 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400',
    },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Settings</h1>
        <p className="text-muted-foreground mt-2">Manage your account preferences and settings.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {settingsSections.map((section) => (
          <div key={section.id} className="bg-card rounded-xl border shadow-sm p-6 hover:shadow-md transition-shadow cursor-pointer flex items-start space-x-4">
            <div className={`p-3 rounded-lg flex-shrink-0 ${section.color}`}>
              <section.icon size={24} />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-foreground mb-1">{section.title}</h3>
              <p className="text-sm text-muted-foreground">{section.description}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-card rounded-xl border shadow-sm p-6 mt-8">
        <div className="flex items-start space-x-4">
          <div className="p-3 rounded-lg flex-shrink-0 bg-destructive/10 text-destructive">
            <Shield size={24} />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-foreground mb-1">Danger Zone</h3>
            <p className="text-sm text-muted-foreground mb-4">Permanently delete your account and all associated data.</p>
            <button className="px-4 py-2 border border-destructive text-destructive rounded-md hover:bg-destructive hover:text-destructive-foreground transition-colors text-sm font-medium">
              Delete Account
            </button>
          </div>
        </div>
      </div>
      
      <div className="text-center pt-8 pb-4">
        <a href="#" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors">
          <HelpCircle size={16} className="mr-2" />
          Need help? Visit our Help Center
        </a>
      </div>
    </div>
  );
};

export default SettingsPage;
