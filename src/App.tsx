import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Navigation } from './components/layout/Navigation';
import { Container } from './components/layout/Container';
import { OnboardingGuard } from './components/guards/OnboardingGuard';
import { useAppStore } from './stores/useAppStore';
import { useGoalsStore } from './stores/useGoalsStore';
import { usePlansStore } from './stores/usePlansStore';
import { useDailyStore } from './stores/useDailyStore';
import { useReviewsStore } from './stores/useReviewsStore';

/**
 * Root Application Component
 *
 * Responsibilities:
 * - Initialize all stores on mount
 * - Provide navigation layout
 * - Handle storage quota warnings (future)
 * - Global error boundary (future)
 */
function App() {
  const initializeApp = useAppStore((state) => state.initializeApp);
  const loadGoals = useGoalsStore((state) => state.loadGoals);
  const loadPlans = usePlansStore((state) => state.loadPlans);
  const loadDailyPages = useDailyStore((state) => state.loadDailyPages);
  const loadReviews = useReviewsStore((state) => state.loadReviews);

  const appLoading = useAppStore((state) => state.isLoading);
  const goalsLoading = useGoalsStore((state) => state.isLoading);
  const plansLoading = usePlansStore((state) => state.isLoading);
  const dailyLoading = useDailyStore((state) => state.isLoading);
  const reviewsLoading = useReviewsStore((state) => state.isLoading);

  const isLoading =
    appLoading || goalsLoading || plansLoading || dailyLoading || reviewsLoading;

  // Initialize all stores on mount
  useEffect(() => {
    initializeApp();
    loadGoals();
    loadPlans();
    loadDailyPages();
    loadReviews();
  }, [initializeApp, loadGoals, loadPlans, loadDailyPages, loadReviews]);

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Загрузка...</p>
        </div>
      </div>
    );
  }

  return (
    <OnboardingGuard>
      <div className="h-full flex">
        {/* Sidebar Navigation */}
        <Navigation />

        {/* Main content area */}
        <main className="flex-1 overflow-y-auto bg-gray-50">
          <Container size="lg" className="py-8">
            <Outlet />
          </Container>
        </main>
      </div>
    </OnboardingGuard>
  );
}

export default App;
