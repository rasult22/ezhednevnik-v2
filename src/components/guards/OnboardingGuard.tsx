import { ReactNode, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppStore } from '../../stores/useAppStore';

interface OnboardingGuardProps {
  children: ReactNode;
}

/**
 * OnboardingGuard - Ensures users complete onboarding before accessing main app
 *
 * Redirects to /onboarding if:
 * - User profile doesn't exist
 * - Onboarding is not completed
 *
 * Allows access to /onboarding and /settings without guard
 */
export function OnboardingGuard({ children }: OnboardingGuardProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const userProfile = useAppStore((state) => state.userProfile);
  const isOnboarded = useAppStore((state) => state.isOnboarded);

  useEffect(() => {
    // Allow access to onboarding page itself
    if (location.pathname === '/onboarding') {
      return;
    }

    // Check if user has completed onboarding
    if (!userProfile || !isOnboarded) {
      navigate('/onboarding', { replace: true });
    }
  }, [userProfile, isOnboarded, location.pathname, navigate]);

  // If not onboarded and not on onboarding page, show nothing (will redirect)
  if (location.pathname !== '/onboarding' && (!userProfile || !isOnboarded)) {
    return null;
  }

  return <>{children}</>;
}
