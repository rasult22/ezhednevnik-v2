# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Ежедневник Триллионера (Trillionaire's Daily Planner) - A client-only React productivity app based on the 80/20 principle. Russian language interface only. Desktop-only (no mobile responsiveness). All data stored in LocalStorage (no backend).

## Commands

```bash
npm run dev          # Start dev server (http://localhost:5173)
npm run build        # TypeScript check + production build
npm run preview      # Preview production build (http://localhost:4173)
npm run lint         # ESLint check
```

## Architecture

### State Management (Zustand + LocalStorage)

Five stores in `src/stores/`:
- **useAppStore** - User profile, onboarding status, settings
- **useGoalsStore** - 10yr/5yr/1yr goals CRUD
- **usePlansStore** - 90-day plans lifecycle, project management
- **useDailyStore** - Daily pages (most complex: date access control, task management, completion detection)
- **useReviewsStore** - Weekly reviews with eligibility checks

All stores auto-persist to LocalStorage using `storageService`. Critical data (task toggles) saves immediately; text inputs use 300ms debounce.

### Routing

React Router v6 with lazy loading for all screens. Key routes:
- `/daily` or `/daily/:date` - Main daily page
- `/goals/10-years`, `/goals/5-years`, `/goals/1-year` - Goals management
- `/plans`, `/plans/new`, `/plans/:id` - 90-day plans
- `/reviews`, `/reviews/new` - Weekly reviews
- `/settings` - Data export/import/reset
- `/onboarding` - 8-step onboarding flow

### Key Business Rules

1. **Daily Page**: Past dates are read-only, future dates are blocked. Day auto-completes when all 3 main tasks are done.
2. **Monthly Focus**: Can only be edited on the 1st of the month. Mid-month changes require typing "Я ПОНИМАЮ" confirmation.
3. **Weekly Reviews**: Unlocked only after 7 completed daily pages.
4. **90-Day Plans**: Creating a new plan auto-completes the previous one. Uncompleted projects can be transferred.

### Guards

- **OnboardingGuard** (App.tsx) - Redirects to `/onboarding` if onboarding incomplete
- **ErrorBoundary** (main.tsx) - Wraps entire app, provides fallback UI with reset option

### Date Handling

- Internal format: ISO (YYYY-MM-DD)
- Display format: DD.MM.YYYY (Russian locale)
- Use `date-fns` for date operations
- Services in `src/services/`: `date-formatters.ts`, `date-navigation-service.ts`

## Type System

Strict TypeScript with `noUncheckedIndexedAccess`. Core types in `src/types/index.ts`:
- `DailyPage` - Main entity with `mainThree` (3 tasks), `secondaryNine` (9 tasks), `gratitude` (3 items)
- `NinetyDayPlan` with `Project[]` and status (`active`/`completed`/`archived`)
- `Goal` with `tenYear`, `fiveYear`, `oneYear` arrays
- `WeeklyReview` with eligibility tracking

Storage keys prefixed with `trillionaire_*` (defined in `STORAGE_KEYS` const).

## Path Aliases

`@/*` maps to `src/*` (configured in tsconfig.json)
- не запускай дев сервера я сам их запускаю и тестирую твои наработки