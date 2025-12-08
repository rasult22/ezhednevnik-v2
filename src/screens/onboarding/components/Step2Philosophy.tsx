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
      <h2 className="text-3xl font-bold text-gray-900 mb-6">
        Главные 20%
      </h2>

      <div className="space-y-6 mb-8">
        {/* Principle Explanation */}
        <div className="bg-blue-50 border-l-4 border-primary p-6 rounded-r-lg">
          <p className="text-lg text-gray-800 font-medium mb-2">
            Принцип Парето (80/20)
          </p>
          <p className="text-gray-700">
            20% усилий приносят 80% результата.<br />
            80% усилий приносят только 20% результата.
          </p>
        </div>

        {/* Visual Representation */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-green-50 p-6 rounded-lg border-2 border-green-500">
            <div className="text-4xl mb-2">✨</div>
            <h3 className="font-semibold text-green-900 mb-2">Главные 20%</h3>
            <p className="text-sm text-green-800">
              Сложные, важные дела, которые действительно двигают вас к целям
            </p>
          </div>

          <div className="bg-gray-50 p-6 rounded-lg border-2 border-gray-300">
            <div className="text-4xl mb-2">📋</div>
            <h3 className="font-semibold text-gray-700 mb-2">Второстепенные 80%</h3>
            <p className="text-sm text-gray-600">
              Легкие дела, создающие иллюзию занятости, но не дающие реальных результатов
            </p>
          </div>
        </div>

        {/* Key Point */}
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-6 rounded-lg">
          <p className="text-gray-800 text-lg">
            <strong>Задача этого приложения:</strong> научить ваш мозг находить эти главные 20%,
            концентрироваться на них и доводить до завершения.
          </p>
        </div>

        {/* Quote */}
        <blockquote className="border-l-4 border-gray-300 pl-6 italic text-gray-600">
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
