import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Navigation } from './components/layout/Navigation';
import { OnboardingGuard } from './components/guards/OnboardingGuard';
import { useAppStore } from './stores/useAppStore';
import { useGoalsStore } from './stores/useGoalsStore';
import { usePlansStore } from './stores/usePlansStore';
import { useDailyStore } from './stores/useDailyStore';
import { useReviewsStore } from './stores/useReviewsStore';
import { useSketchesStore } from './stores/useSketchesStore';

/**
 * Root Application Component
 */
function App() {
  const initializeApp = useAppStore((state) => state.initializeApp);
  const settings = useAppStore((state) => state.settings);
  const loadGoals = useGoalsStore((state) => state.loadGoals);
  const loadPlans = usePlansStore((state) => state.loadPlans);
  const loadDailyPages = useDailyStore((state) => state.loadDailyPages);
  const loadReviews = useReviewsStore((state) => state.loadReviews);
  const loadSketches = useSketchesStore((state) => state.loadSketches);

  const appLoading = useAppStore((state) => state.isLoading);
  const goalsLoading = useGoalsStore((state) => state.isLoading);
  const plansLoading = usePlansStore((state) => state.isLoading);
  const dailyLoading = useDailyStore((state) => state.isLoading);
  const reviewsLoading = useReviewsStore((state) => state.isLoading);
  const sketchesLoading = useSketchesStore((state) => state.isLoading);

  const isLoading =
    appLoading || goalsLoading || plansLoading || dailyLoading || reviewsLoading || sketchesLoading;

  // Initialize all stores on mount
  useEffect(() => {
    initializeApp();
    loadGoals();
    loadPlans();
    loadDailyPages();
    loadReviews();
    loadSketches();
  }, [initializeApp, loadGoals, loadPlans, loadDailyPages, loadReviews, loadSketches]);

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center bg-dark-300">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-accent-blue border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-text-secondary">Загрузка...</p>
        </div>
      </div>
    );
  }

  // Get background image from settings (with fallback)
  const backgroundImage = settings.backgroundImage || '/bg-images/background.jpg';

  return (
    <OnboardingGuard>
      <div
        className="h-full flex bg-dark-300 bg-no-repeat bg-cover"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      >
        {/* Sidebar Navigation */}
        <Navigation />

        {/* Main content area */}
        <main className="flex-1 overflow-y-auto custom-scrollbar">
          <Outlet />
        </main>
      </div>
    </OnboardingGuard>
  );
}

export default App;
