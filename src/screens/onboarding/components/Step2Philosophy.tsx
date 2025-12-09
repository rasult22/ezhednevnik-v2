import { Button } from '../../../components/ui/Button';

interface StepProps {
  onNext: () => void;
  onBack: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
}

/**
 * Step 2: Philosophy - Explain the 20/80 principle
 */
export function Step2Philosophy({ onNext, onBack }: StepProps) {
  return (
    <div>
      <h2 className="text-3xl font-bold text-text-primary mb-6">
        Главные 20%
      </h2>

      <div className="space-y-6 mb-8">
        {/* Principle Explanation */}
        <div className="bg-accent-blue/10 border-l-4 border-accent-blue p-6 rounded-glass-sm">
          <p className="text-lg text-text-primary font-medium mb-2">
            Принцип Парето (80/20)
          </p>
          <p className="text-text-secondary">
            20% усилий приносят 80% результата.<br />
            80% усилий приносят только 20% результата.
          </p>
        </div>

        {/* Visual Representation */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-success/10 p-6 rounded-glass-sm border-2 border-success/30">
            <div className="text-4xl mb-2">✨</div>
            <h3 className="font-semibold text-success mb-2">Главные 20%</h3>
            <p className="text-sm text-success">
              Сложные, важные дела, которые действительно двигают вас к целям
            </p>
          </div>

          <div className="bg-glass-light p-6 rounded-glass-sm border-2 border-glass-border">
            <div className="text-4xl mb-2">📋</div>
            <h3 className="font-semibold text-text-secondary mb-2">Второстепенные 80%</h3>
            <p className="text-sm text-text-secondary">
              Легкие дела, создающие иллюзию занятости, но не дающие реальных результатов
            </p>
          </div>
        </div>

        {/* Key Point */}
        <div className="bg-accent-orange/10 p-6 rounded-glass-sm">
          <p className="text-text-primary text-lg">
            <strong>Задача этого приложения:</strong> научить ваш мозг находить эти главные 20%,
            концентрироваться на них и доводить до завершения.
          </p>
        </div>

        {/* Quote */}
        <blockquote className="border-l-4 border-glass-border pl-6 italic text-text-secondary">
          "Мы отвлекаемся, возникают другие идеи, пропадает желание...
          теряемся в бурлящем потоке жизни. Ежедневник — это ваша дорожная карта."
        </blockquote>
      </div>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button variant="secondary" onClick={onBack}>
          Назад
        </Button>
        <Button onClick={onNext}>
          Понятно, продолжим
        </Button>
      </div>
    </div>
  );
}
