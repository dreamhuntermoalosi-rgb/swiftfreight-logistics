'use client';

import { useAuthStore, useNavStore } from '@/lib/store';
import { useEffect } from 'react';
import { MarketingWebsite } from '@/components/marketing/marketing-website';
import { LoginPage } from '@/components/auth/login-page';
import { RegisterPage } from '@/components/auth/register-page';
import { ForgotPasswordPage } from '@/components/auth/forgot-password-page';
import { DashboardLayout } from '@/components/dashboard/dashboard-layout';

export default function Home() {
  const { currentView, setView, setDashboardTab } = useNavStore();
  const { isAuthenticated, logout } = useAuthStore();

  // Handle browser back/forward
  useEffect(() => {
    const handler = () => {
      // In a real app, sync with URL hash. For demo, no-op.
    };
    window.addEventListener('popstate', handler);
    return () => window.removeEventListener('popstate', handler);
  }, []);

  // After logout, go back to marketing
  useEffect(() => {
    if (!isAuthenticated && (currentView === 'dashboard')) {
      setView('marketing');
    }
  }, [isAuthenticated, currentView, setView]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {currentView === 'marketing' && <MarketingWebsite />}
      {currentView === 'login' && <LoginPage />}
      {currentView === 'register' && <RegisterPage />}
      {currentView === 'forgot-password' && <ForgotPasswordPage />}
      {currentView === 'dashboard' && <DashboardLayout />}
    </div>
  );
}