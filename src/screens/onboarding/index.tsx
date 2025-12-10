import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '../../stores/useAppStore';

// Import onboarding steps
import { Step0Import } from './components/Step0Import';
import { Step1Welcome } from './components/Step1Welcome';
import { Step2Philosophy } from './components/Step2Philosophy';
import { Step3Structure } from './components/Step3Structure';
import { Step4Goals10Years } from './components/Step4Goals10Years';
import { Step5Goals5Years } from './components/Step5Goals5Years';
import { Step6Goals1Year } from './components/Step6Goals1Year';
import { Step7Plan90Days } from './components/Step7Plan90Days';
import { Step8MonthlyFocus } from './components/Step8MonthlyFocus';

const TOTAL_STEPS = 9;

/**
 * Onboarding Screen - Glassmorphism dark theme
 */
export default function OnboardingScreen() {
  const [currentStep, setCurrentStep] = useState(0);
  const navigate = useNavigate();
  const completeOnboarding = useAppStore((state) => state.completeOnboarding);

  const handleNext = () => {
    if (currentStep < TOTAL_STEPS - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    completeOnboarding();
    navigate('/daily');
  };

  const handleSkipToEnd = () => {
    completeOnboarding();
    navigate('/daily');
  };

  const steps = [
    { component: Step0Import, key: 'import' },
    { component: Step1Welcome, key: 'welcome' },
    { component: Step2Philosophy, key: 'philosophy' },
    { component: Step3Structure, key: 'structure' },
    { component: Step4Goals10Years, key: 'goals-10' },
    { component: Step5Goals5Years, key: 'goals-5' },
    { component: Step6Goals1Year, key: 'goals-1' },
    { component: Step7Plan90Days, key: 'plan-90' },
    { component: Step8MonthlyFocus, key: 'monthly' },
  ];

  const CurrentStepComponent = steps[currentStep]?.component;

  return (
    <div className="min-h-screen bg-dark-300 flex items-center justify-center p-4">
      {/* Background decorative gradients */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-accent-blue/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent-purple/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-0 w-64 h-64 bg-accent-emerald/5 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-3xl">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-text-secondary">
              Шаг {currentStep + 1} из {TOTAL_STEPS}
            </span>
            <span className="text-sm text-text-muted">
              {Math.round(((currentStep + 1) / TOTAL_STEPS) * 100)}%
            </span>
          </div>
          <div className="h-2 bg-glass-light rounded-full overflow-hidden border border-glass-border">
            <motion.div
              className="h-full bg-gradient-to-r from-accent-blue via-accent-purple to-accent-pink"
              initial={{ width: 0 }}
              animate={{ width: `${((currentStep + 1) / TOTAL_STEPS) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {/* Step Content */}
        <div className="glass p-8 md:p-12">
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
                  onSkipToEnd={handleSkipToEnd}
                  isFirstStep={currentStep === 0}
                  isLastStep={currentStep === TOTAL_STEPS - 1}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Footer Note */}
        <p className="text-center mt-6 text-sm text-text-muted">
          Вы можете вернуться к настройкам в любое время
        </p>
      </div>
    </div>
  );
}
