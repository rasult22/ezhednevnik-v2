import { NavLink } from 'react-router-dom';

/**
 * Navigation Component - Sidebar navigation for desktop
 */
export function Navigation() {
  const navItems = [
    { to: '/daily', label: 'Сегодня', icon: '📅' },
    { to: '/goals/10-years', label: 'Цели: 10 лет', icon: '🎯' },
    { to: '/goals/5-years', label: 'Цели: 5 лет', icon: '🎯' },
    { to: '/goals/1-year', label: 'Цели: 1 год', icon: '🎯' },
    { to: '/plans', label: 'План 90 дней', icon: '📊' },
    { to: '/reviews', label: 'Еженедельные обзоры', icon: '📝' },
    { to: '/settings', label: 'Настройки', icon: '⚙️' },
  ];

  return (
    <nav className="w-64 bg-white border-r border-gray-200 flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-xl font-bold text-gray-900">
          Ежедневник Триллионера
        </h1>
        <p className="mt-1 text-xs text-gray-500">
          Тренажер для мозга
        </p>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `
              flex items-center gap-3 px-3 py-2 rounded-md
              text-sm font-medium transition-colors
              ${
                isActive
                  ? 'bg-primary text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }
            `
            }
          >
            <span className="text-lg">{item.icon}</span>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 text-xs text-gray-500">
        <p>Версия 1.0.0</p>
        <p className="mt-1">
          🤖 Создано с{' '}
          <a
            href="https://claude.com/claude-code"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            Claude Code
          </a>
        </p>
      </div>
    </nav>
  );
}
