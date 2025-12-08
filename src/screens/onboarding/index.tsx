import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '../../stores/useAppStore';

// Import onboarding steps
import { Step1Welcome } from './components/Step1Welcome';
import { Step2Philosophy } from './components/Step2Philosophy';
import { Step3Structure } from './components/Step3Structure';
import { Step4Goals10Years } from './components/Step4Goals10Years';
import { Step5Goals5Years } from './components/Step5Goals5Years';
import { Step6Goals1Year } from './components/Step6Goals1Year';
import { Step7Plan90Days } from './components/Step7Plan90Days';
import { Step8MonthlyFocus } from './components/Step8MonthlyFocus';

const TOTAL_STEPS = 8;

/**
 * Onboarding Screen - 8-step guided setup for new users
 *
 * Flow:
 * 1. Welcome
 * 2. Philosophy (20/80 principle)
 * 3. Structure hierarchy
 * 4. 10-year goals
 * 5. 5-year goals
 * 6. 1-year goals
 * 7. 90-day plan creation
 * 8. Monthly focus selection → Complete onboarding
 */
export default function OnboardingScreen() {
  const [currentStep, setCurrentStep] = useState(1);
  const navigate = useNavigate();
  const completeOnboarding = useAppStore((state) => state.completeOnboarding);

  const handleNext = () => {
    if (currentStep < TOTAL_STEPS) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    completeOnboarding();
    navigate('/daily');
  };

  const steps = [
    { component: Step1Welcome, key: 'welcome' },
    { component: Step2Philosophy, key: 'philosophy' },
    { component: Step3Structure, key: 'structure' },
    { component: Step4Goals10Years, key: 'goals-10' },
    { component: Step5Goals5Years, key: 'goals-5' },
    { component: Step6Goals1Year, key: 'goals-1' },
    { component: Step7Plan90Days, key: 'plan-90' },
    { component: Step8MonthlyFocus, key: 'monthly' },
  ];

  const CurrentStepComponent = steps[currentStep - 1]?.component;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-4">
      <div className="w-full max-w-3xl">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">
              Шаг {currentStep} из {TOTAL_STEPS}
            </span>
            <span className="text-sm text-gray-500">
              {Math.round((currentStep / TOTAL_STEPS) * 100)}%
            </span>
          </div>
          <div className="h-2 bg-white rounded-full overflow-hidden shadow-inner">
            <motion.div
              className="h-full bg-primary"
              initial={{ width: 0 }}
              animate={{ width: `${(currentStep / TOTAL_STEPS) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {/* Step Content */}
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {CurrentStepComponent && (
                <CurrentStepComponent
                  onNext={handleNext}
                  onBack={handleBack}
                  onComplete={handleComplete}
                  isFirstStep={currentStep === 1}
                  isLastStep={currentStep === TOTAL_STEPS}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Footer Note */}
        <p className="text-center mt-6 text-sm text-gray-500">
          Вы можете вернуться к настройкам в любое время
        </p>
      </div>
    </div>
  );
}
