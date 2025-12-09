import { Button } from '../../../components/ui/Button';

interface StepProps {
  onNext: () => void;
  onBack: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
}

/**
 * Step 1: Welcome Screen - Glassmorphism
 */
export function Step1Welcome({ onNext }: StepProps) {
  return (
    <div className="text-center">
      {/* Logo/Icon */}
      <div className="mb-8">
        <div className="w-24 h-24 mx-auto bg-gradient-to-br from-accent-blue via-accent-purple to-accent-pink rounded-full flex items-center justify-center text-5xl shadow-glow-purple">
          💎
        </div>
      </div>

      {/* Title */}
      <h1 className="text-4xl font-bold mb-4">
        <span className="gradient-text">Добро пожаловать в</span><br />
        <span className="gradient-text-cool">Ежедневник Триллионера</span>
      </h1>

      {/* Subtitle */}
      <p className="text-xl text-text-secondary mb-8">
        Ваш личный тренажер для мозга
      </p>

      {/* Description */}
      <div className="max-w-xl mx-auto mb-12 text-left space-y-4 text-text-secondary">
        <p>
          Это приложение поможет вам сфокусироваться на главном — тех самых 20% дел,
          которые приносят 80% результата.
        </p>
        <p>
          За несколько минут мы настроим вашу систему целей и планов,
          чтобы каждый день вы точно знали, что делать.
        </p>
      </div>

      {/* CTA Button */}
      <Button size="lg" onClick={onNext} className="px-12">
        Начать путь
      </Button>

      {/* Additional Info */}
      <p className="mt-8 text-sm text-text-muted">
        Это займет примерно 5-10 минут
      </p>
    </div>
  );
}
