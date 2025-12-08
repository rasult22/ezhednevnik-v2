import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDailyStore } from '../../stores/useDailyStore';
import { usePlansStore } from '../../stores/usePlansStore';
import { dateNavigationService } from '../../services/date-navigation-service';
import { getCurrentDateISO } from '../../utils/date-formatters';
import { DateHeader } from './components/DateHeader';
import { MainForMonthBlock } from './components/MainForMonthBlock';
import { MainThreeBlock } from './components/MainThreeBlock';
import { SecondaryNineBlock } from './components/SecondaryNineBlock';
import { GratitudeBlock } from './components/GratitudeBlock';
import { FinancialAffirmationBlock } from './components/FinancialAffirmationBlock';
import { SkippedDaysModal } from './components/SkippedDaysModal';

/**
 * Daily Page - Main screen where users interact with their daily tasks
 *
 * Features:
 * - Date navigation with access control (past read-only, future blocked)
 * - Main for Month: 3 monthly projects
 * - Main Three: 3 daily tasks (completion triggers victory)
 * - Secondary Nine: 9 secondary tasks
 * - Gratitude: 3 gratitude entries
 * - Financial Affirmation: Daily affirmation with confirmation
 * - Automatic completion detection
 * - Skipped days handling
 */
export default function DailyScreen() {
  const { date: paramDate } = useParams<{ date?: string }>();
  const navigate = useNavigate();

  const dailyPages = useDailyStore((state) => state.dailyPages);
  const getDailyPage = useDailyStore((state) => state.getDailyPage);
  const createOrGetDailyPage = useDailyStore((state) => state.createOrGetDailyPage);
  const activePlan = usePlansStore((state) => state.activePlan);

  const [currentDate, setCurrentDate] = useState<string>(paramDate || getCurrentDateISO());
  const [isReadOnly, setIsReadOnly] = useState(false);
  const [showSkippedModal, setShowSkippedModal] = useState(false);
  const [skippedDates, setSkippedDates] = useState<string[]>([]);

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

    // Check if date is in the past (read-only mode)
    if (accessResult.reason === 'past_readonly') {
      setIsReadOnly(true);
    } else {
      setIsReadOnly(false);
    }

    setCurrentDate(targetDate);

    // Create daily page if it doesn't exist for current date
    if (!getDailyPage(targetDate) && accessResult.allowed) {
      createOrGetDailyPage(targetDate);
    }
  }, [paramDate, dailyPages, getDailyPage, createOrGetDailyPage, navigate]);

  const dailyPage = getDailyPage(currentDate);

  const handleDateChange = (newDate: string) => {
    navigate(`/daily/${newDate}`);
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
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Загрузка страницы...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Date Header with Navigation */}
      <DateHeader
        currentDate={currentDate}
        isReadOnly={isReadOnly}
        onDateChange={handleDateChange}
        hasSkippedDays={skippedDates.length > 0}
      />

      {/* Main for Month - 3 Monthly Projects */}
      <MainForMonthBlock
        date={currentDate}
        projects={dailyPage.mainForMonth}
        isReadOnly={isReadOnly}
        activePlan={activePlan}
      />

      {/* Main Three - 3 Daily Tasks */}
      <MainThreeBlock
        date={currentDate}
        tasks={dailyPage.mainThree}
        isCompleted={dailyPage.status === 'completed'}
        isReadOnly={isReadOnly}
      />

      {/* Secondary Nine - 9 Secondary Tasks */}
      <SecondaryNineBlock
        date={currentDate}
        tasks={dailyPage.secondaryNine}
        isReadOnly={isReadOnly}
      />

      {/* Gratitude - 3 Entries */}
      <GratitudeBlock
        date={currentDate}
        gratitude={dailyPage.gratitude}
        isReadOnly={isReadOnly}
      />

      {/* Financial Affirmation */}
      <FinancialAffirmationBlock
        date={currentDate}
        affirmation={dailyPage.financialAffirmation}
        confirmed={dailyPage.financialAffirmationConfirmed}
        isReadOnly={isReadOnly}
      />

      {/* Skipped Days Modal */}
      {showSkippedModal && (
        <SkippedDaysModal
          skippedDates={skippedDates}
          onClose={handleSkippedModalClose}
        />
      )}
    </div>
  );
}
