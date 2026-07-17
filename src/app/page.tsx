'use client';

import { useAuthStore, useNavStore } from '@/lib/store';
import { useEffect } from 'react';
import { MarketingWebsite } from '@/components/marketing/marketing-website';
import { LoginPage } from '@/components/auth/login-page';
import { RegisterPage } from '@/components/auth/register-page';
import { ForgotPasswordPage } from '@/components/auth/forgot-password-page';
import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import { OnboardingPage } from '@/components/onboarding/onboarding-page';
import { KnowledgeBasePage } from '@/components/onboarding/knowledge-base-page';
import { FeatureRequestsPage } from '@/components/onboarding/feature-requests-page';
import { TrainingPage } from '@/components/onboarding/training-page';
import { TermsOfServicePage } from '@/components/legal/terms-of-service';
import { PrivacyPolicyPage } from '@/components/legal/privacy-policy';
import { PlatformDisclaimerPage } from '@/components/legal/platform-disclaimer';
import { LiabilityNoticePage } from '@/components/legal/liability-notice';

export default function Home() {
  const { currentView, setView } = useNavStore();
  const { isAuthenticated } = useAuthStore();

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
    if (!isAuthenticated && (currentView === 'dashboard' || currentView === 'onboarding')) {
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
      {currentView === 'onboarding' && <OnboardingPage />}
      {currentView === 'knowledge-base' && <KnowledgeBasePage />}
      {currentView === 'feature-requests' && <FeatureRequestsPage />}
      {currentView === 'training' && <TrainingPage />}
      {currentView === 'terms' && <TermsOfServicePage />}
      {currentView === 'privacy' && <PrivacyPolicyPage />}
      {currentView === 'disclaimer' && <PlatformDisclaimerPage />}
      {currentView === 'liability' && <LiabilityNoticePage />}
    </div>
  );
}