import { formatDateRU } from '../../../utils/date-formatters';

interface ClockWidgetProps {
  currentTime: Date;
}

export function ClockWidget({ currentTime }: ClockWidgetProps) {
  const timeString = currentTime.toLocaleTimeString('ru-RU', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  const dateISO = currentTime.toISOString().split('T')[0]!;

  return (
    <div className="text-center">
      <h1 className="text-7xl font-bold gradient-text mb-2">{timeString}</h1>
      <p className="text-2xl text-text-secondary">{formatDateRU(dateISO)}</p>
    </div>
  );
}
