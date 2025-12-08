import { createBrowserRouter, Navigate } from 'react-router-dom';
import { lazy } from 'react';
import App from './App';

// Lazy load screens for better performance
const OnboardingScreen = lazy(() => import('./screens/onboarding'));

/**
 * Application Router Configuration
 *
 * Structure:
 * - /onboarding - First-time user flow (8 steps)
 * - /daily - Main daily page (always opens to current date)
 * - /daily/:date - Specific date (past dates read-only)
 * - /goals/* - Long-term goals (10yr, 5yr, 1yr)
 * - /plans/* - 90-day plans management
 * - /reviews/* - Weekly reviews
 * - /settings - Settings and data export/import
 */

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        index: true,
        element: <Navigate to="/daily" replace />,
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
            element: <div>Daily Page - Current Date (To be implemented)</div>,
          },
          {
            path: ':date',
            element: <div>Daily Page - Specific Date (To be implemented)</div>,
          },
        ],
      },
      {
        path: 'goals',
        children: [
          {
            path: '10-years',
            element: <div>10-Year Goals (To be implemented)</div>,
          },
          {
            path: '5-years',
            element: <div>5-Year Goals (To be implemented)</div>,
          },
          {
            path: '1-year',
            element: <div>1-Year Goals (To be implemented)</div>,
          },
        ],
      },
      {
        path: 'plans',
        children: [
          {
            index: true,
            element: <div>90-Day Plans List (To be implemented)</div>,
          },
          {
            path: 'new',
            element: <div>Create New Plan (To be implemented)</div>,
          },
          {
            path: ':id',
            element: <div>View/Edit Plan (To be implemented)</div>,
          },
        ],
      },
      {
        path: 'reviews',
        children: [
          {
            index: true,
            element: <div>Weekly Reviews Archive (To be implemented)</div>,
          },
          {
            path: 'new',
            element: <div>Create Weekly Review (To be implemented)</div>,
          },
        ],
      },
      {
        path: 'settings',
        element: <div>Settings (To be implemented)</div>,
      },
    ],
  },
]);
