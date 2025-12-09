import { NavLink } from 'react-router-dom';

/**
 * Navigation Component - Glassmorphism sidebar with gradient accents
 */
export function Navigation() {
  const navItems = [
    { to: '/daily', label: 'Сегодня', icon: '📅', gradient: 'from-accent-blue to-accent-cyan' },
    { to: '/goals/10-years', label: 'Цели: 10 лет', icon: '🎯', gradient: 'from-accent-purple to-accent-pink' },
    { to: '/goals/5-years', label: 'Цели: 5 лет', icon: '🎯', gradient: 'from-accent-purple to-accent-pink' },
    { to: '/goals/1-year', label: 'Цели: 1 год', icon: '🎯', gradient: 'from-accent-purple to-accent-pink' },
    { to: '/plans', label: 'План 90 дней', icon: '📊', gradient: 'from-accent-orange to-accent-pink' },
    { to: '/reviews', label: 'Обзоры недели', icon: '📝', gradient: 'from-accent-emerald to-accent-cyan' },
    { to: '/settings', label: 'Настройки', icon: '⚙️', gradient: 'from-text-muted to-text-secondary' },
  ];

  return (
    <nav className="w-72 bg-dark-200/50 backdrop-blur-glass border-r border-glass-border flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-glass-border">
        <h1 className="text-xl font-bold gradient-text">
          Ежедневник
        </h1>
        <h1 className="text-xl font-bold gradient-text-cool">
          Триллионера
        </h1>
        <p className="mt-2 text-xs text-text-muted">
          Тренажер для мозга
        </p>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 p-4 space-y-2 overflow-y-auto custom-scrollbar">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `
              flex items-center gap-3 px-4 py-3 rounded-glass-sm
              text-sm font-medium
              transition-all duration-200
              group
              ${
                isActive
                  ? `bg-gradient-to-r ${item.gradient} text-white shadow-glass-sm`
                  : 'text-text-secondary hover:bg-glass-light hover:text-text-primary'
              }
            `
            }
          >
            <span className="text-lg group-hover:scale-110 transition-transform">{item.icon}</span>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-glass-border">
        <div className="glass-sm p-4">
          <p className="text-xs text-text-muted mb-1">Версия 2.0</p>
          <p className="text-xs text-text-disabled">Glassmorphism Edition</p>
        </div>
      </div>
    </nav>
  );
}
