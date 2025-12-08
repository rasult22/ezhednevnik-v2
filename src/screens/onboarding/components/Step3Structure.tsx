import { motion } from 'framer-motion';
import { Button } from '../../../components/ui/Button';

interface StepProps {
  onNext: () => void;
  onBack: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
}

/**
 * Step 3: Structure - Show hierarchy from 10 years to daily actions
 */
export function Step3Structure({ onNext, onBack }: StepProps) {
  const hierarchy = [
    { label: '10 лет', description: 'Глобальное видение жизни', icon: '🌟' },
    { label: '5 лет', description: 'Стратегические ориентиры', icon: '🎯' },
    { label: '1 год', description: 'Конкретные цели года', icon: '📅' },
    { label: '90 дней', description: '6-8 главных проектов', icon: '📊' },
    { label: 'Месяц', description: '3 проекта в фокусе', icon: '🎪' },
    { label: 'День', description: '3 главных шага', icon: '✅' },
  ];

  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-900 mb-4">
        От видения к ежедневным действиям
      </h2>

      <p className="text-gray-600 mb-8">
        Система работает как воронка: от масштабного видения на 10 лет
        до конкретных задач на сегодня.
      </p>

      {/* Hierarchy Visualization */}
      <div className="mb-8 space-y-3">
        {hierarchy.map((level, index) => (
          <motion.div
            key={level.label}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center gap-4 bg-gradient-to-r from-blue-50 to-white p-4 rounded-lg border border-blue-100"
            style={{
              marginLeft: `${index * 20}px`,
              maxWidth: `calc(100% - ${index * 20}px)`,
            }}
          >
            <div className="text-3xl">{level.icon}</div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">{level.label}</h3>
              <p className="text-sm text-gray-600">{level.description}</p>
            </div>
            {index < hierarchy.length - 1 && (
              <div className="text-gray-400">→</div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Key Insight */}
      <div className="bg-yellow-50 border border-yellow-200 p-6 rounded-lg mb-8">
        <p className="text-gray-800">
          <strong>Важно:</strong> Каждый уровень вытекает из предыдущего.
          Ваши ежедневные задачи будут связаны с вашими глобальными целями.
        </p>
      </div>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button variant="secondary" onClick={onBack}>
          Назад
        </Button>
        <Button onClick={onNext}>
          Понял, настроим систему
        </Button>
      </div>
    </div>
  );
}
