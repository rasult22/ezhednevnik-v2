import { createHashRouter } from 'react-router-dom';
import { lazy } from 'react';
import App from './App';

// Lazy load screens for better performance
const DashboardScreen = lazy(() => import('./screens/dashboard'));
const OnboardingScreen = lazy(() => import('./screens/onboarding'));
const DailyScreen = lazy(() => import('./screens/daily'));
const Goals10YearsScreen = lazy(() => import('./screens/goals/10-years'));
const Goals5YearsScreen = lazy(() => import('./screens/goals/5-years'));
const Goals1YearScreen = lazy(() => import('./screens/goals/1-year'));
const PlansListScreen = lazy(() => import('./screens/plans'));
const NewPlanScreen = lazy(() => import('./screens/plans/new'));
const PlanViewScreen = lazy(() => import('./screens/plans/[id]'));
const ReviewsArchiveScreen = lazy(() => import('./screens/reviews'));
const NewReviewScreen = lazy(() => import('./screens/reviews/new'));
const SettingsScreen = lazy(() => import('./screens/settings'));

/**
 * Application Router Configuration
 *
 * Uses HashRouter for Chrome extension compatibility
 *
 * Structure:
 * - / - Dashboard with widgets (main home page)
 * - /onboarding - First-time user flow (8 steps)
 * - /daily - Main daily page (always opens to current date)
 * - /daily/:date - Specific date (editable)
 * - /goals/* - Long-term goals (10yr, 5yr, 1yr)
 * - /plans/* - 90-day plans management
 * - /reviews/* - Weekly reviews
 * - /settings - Settings and data export/import
 */

export const router = createHashRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        index: true,
        element: <DashboardScreen />,
      },
      {
        path: 'onboarding',
        element: <OnboardingScreen />,
      },
      {
        path: 'daily',
        children: [
          {
            index: true,
            element: <DailyScreen />,
          },
          {
            path: ':date',
            element: <DailyScreen />,
          },
        ],
      },
      {
        path: 'goals',
        children: [
          {
            path: '10-years',
            element: <Goals10YearsScreen />,
          },
          {
            path: '5-years',
            element: <Goals5YearsScreen />,
          },
          {
            path: '1-year',
            element: <Goals1YearScreen />,
          },
        ],
      },
      {
        path: 'plans',
        children: [
          {
            index: true,
            element: <PlansListScreen />,
          },
          {
            path: 'new',
            element: <NewPlanScreen />,
          },
          {
            path: ':id',
            element: <PlanViewScreen />,
          },
        ],
      },
      {
        path: 'reviews',
        children: [
          {
            index: true,
            element: <ReviewsArchiveScreen />,
          },
          {
            path: 'new',
            element: <NewReviewScreen />,
          },
        ],
      },
      {
        path: 'settings',
        element: <SettingsScreen />,
      },
    ],
  },
]);
