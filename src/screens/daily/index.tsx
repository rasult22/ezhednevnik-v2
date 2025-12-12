import { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDailyStore } from '../../stores/useDailyStore';
import { usePlansStore } from '../../stores/usePlansStore';
import { dateNavigationService } from '../../services/date-navigation-service';
import { getCurrentDateISO, subtractDays } from '../../utils/date-formatters';
import { DateHeader } from './components/DateHeader';
import { MainForMonthBlock } from './components/MainForMonthBlock';
import { MainThreeBlock } from './components/MainThreeBlock';
import { SecondaryNineBlock } from './components/SecondaryNineBlock';
import { GratitudeBlock } from './components/GratitudeBlock';
import { FinancialAffirmationBlock } from './components/FinancialAffirmationBlock';
import { SkippedDaysModal } from './components/SkippedDaysModal';
import { TransferTasksModal } from './components/TransferTasksModal';

/**
 * Daily Page - Main screen with grid layout for wide screens
 *
 * Layout on wide screens (xl+):
 * - Left column: Main Three + Secondary Nine
 * - Right column: Monthly Focus + Gratitude + Affirmation
 */
export default function DailyScreen() {
  const { date: paramDate } = useParams<{ date?: string }>();
  const navigate = useNavigate();

  const dailyPages = useDailyStore((state) => state.dailyPages);
  const getDailyPage = useDailyStore((state) => state.getDailyPage);
  const createOrGetDailyPage = useDailyStore((state) => state.createOrGetDailyPage);
  const transferTasks = useDailyStore((state) => state.transferTasks);
  const activePlan = usePlansStore((state) => state.activePlan);

  const [currentDate, setCurrentDate] = useState<string>(paramDate || getCurrentDateISO());
  const [isPastDate, setIsPastDate] = useState(false);
  const [showSkippedModal, setShowSkippedModal] = useState(false);
  const [skippedDates, setSkippedDates] = useState<string[]>([]);
  const [showTransferModal, setShowTransferModal] = useState(false);

  useEffect(() => {
    const targetDate = paramDate || getCurrentDateISO();

    // Check date access
    const accessResult = dateNavigationService.canAccessDate(targetDate, dailyPages);

    if (!accessResult.allowed) {
      if (accessResult.reason === 'future') {
        // Redirect to current date if trying to access future
        navigate('/daily', { replace: true });
        return;
      }

      if (accessResult.reason === 'skipped_days' && accessResult.skippedDates) {
        // Show skipped days modal
        setSkippedDates(accessResult.skippedDates);
        setShowSkippedModal(true);
        return;
      }
    }

    // Mark if this is a past date (for UI indication, but still editable)
    setIsPastDate(accessResult.reason === 'past');

    setCurrentDate(targetDate);

    // Create daily page if it doesn't exist for current date
    if (!getDailyPage(targetDate) && accessResult.allowed) {
      createOrGetDailyPage(targetDate);
    }
  }, [paramDate, dailyPages, getDailyPage, createOrGetDailyPage, navigate]);

  const dailyPage = getDailyPage(currentDate);

  // Check if we can transfer tasks from previous day
  const previousDayDate = useMemo(() => subtractDays(currentDate, 1), [currentDate]);
  const previousDayPage = getDailyPage(previousDayDate);

  const canTransferTasks = useMemo(() => {
    // Only show transfer button if:
    // 1. We're viewing today's date
    // 2. Previous day exists
    // 3. Previous day has incomplete tasks with content
    const today = getCurrentDateISO();
    if (currentDate !== today || !previousDayPage) {
      return false;
    }

    const hasIncompleteTasks =
      previousDayPage.mainThree.some((task) => !task.completed && task.content.trim() !== '') ||
      previousDayPage.secondaryNine.some((task) => !task.completed && task.content.trim() !== '');

    return hasIncompleteTasks;
  }, [currentDate, previousDayPage]);

  const handleDateChange = (newDate: string) => {
    navigate(`/daily/${newDate}`);
  };

  const handleTransferTasks = (taskIds: string[]) => {
    transferTasks(previousDayDate, currentDate, taskIds);
  };

  const handleSkippedModalClose = () => {
    setShowSkippedModal(false);
    // Reload the page to re-check access
    window.location.reload();
  };

  // Loading state
  if (!dailyPage) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-accent-blue border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-text-secondary">Загрузка страницы...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-6 space-y-6">
      {/* Date Header with Navigation - Full width */}
      <DateHeader
        currentDate={currentDate}
        isPastDate={isPastDate}
        onDateChange={handleDateChange}
        hasSkippedDays={skippedDates.length > 0}
        canTransferTasks={canTransferTasks}
        onTransferClick={() => setShowTransferModal(true)}
      />

      {/* Grid Layout for wide screens */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* Left Column - Main Tasks (wider) */}
        <div className="xl:col-span-7 space-y-6">
          {/* Main Three - 3 Daily Tasks */}
          <MainThreeBlock
            date={currentDate}
            tasks={dailyPage.mainThree}
            isCompleted={dailyPage.status === 'completed'}
            isReadOnly={false}
          />

          {/* Secondary Nine - 9 Secondary Tasks */}
          <SecondaryNineBlock
            date={currentDate}
            tasks={dailyPage.secondaryNine}
            isReadOnly={false}
          />
        </div>

        {/* Right Column - Context & Mindset */}
        <div className="xl:col-span-5 space-y-6">
          {/* Main for Month - 3 Monthly Projects */}
          <MainForMonthBlock
            date={currentDate}
            projects={dailyPage.mainForMonth}
            isReadOnly={false}
            activePlan={activePlan}
          />

          {/* Gratitude - 3 Entries */}
          <GratitudeBlock
            date={currentDate}
            gratitude={dailyPage.gratitude}
            isReadOnly={false}
          />

          {/* Financial Affirmation */}
          <FinancialAffirmationBlock
            date={currentDate}
            affirmation={dailyPage.financialAffirmation}
            confirmed={dailyPage.financialAffirmationConfirmed}
            isReadOnly={false}
          />
        </div>
      </div>

      {/* Skipped Days Modal */}
      {showSkippedModal && (
        <SkippedDaysModal
          skippedDates={skippedDates}
          onClose={handleSkippedModalClose}
        />
      )}

      {/* Transfer Tasks Modal */}
      {showTransferModal && previousDayPage && (
        <TransferTasksModal
          isOpen={showTransferModal}
          onClose={() => setShowTransferModal(false)}
          previousDayTasks={{
            mainThree: previousDayPage.mainThree,
            secondaryNine: previousDayPage.secondaryNine,
          }}
          onTransfer={handleTransferTasks}
        />
      )}
    </div>
  );
}
