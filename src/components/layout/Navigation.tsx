import { NavLink } from 'react-router-dom';
import { useState } from 'react';
import { Button } from '../ui/Button';

/**
 * Navigation Component - Glassmorphism sidebar with gradient accents
 * Now with collapsible functionality
 */
export function Navigation() {
  const [isCollapsed, setIsCollapsed] = useState(true);

  const navItems = [
    { to: '/', label: 'Главная', icon: '🏠', gradient: 'from-accent-blue to-accent-cyan' },
    { to: '/daily', label: 'Сегодня', icon: '📅', gradient: 'from-accent-blue to-accent-cyan' },
    { to: '/goals/10-years', label: 'Цели: 10 лет', icon: '🎯', gradient: 'from-accent-purple to-accent-pink' },
    { to: '/goals/5-years', label: 'Цели: 5 лет', icon: '🎯', gradient: 'from-accent-purple to-accent-pink' },
    { to: '/goals/1-year', label: 'Цели: 1 год', icon: '🎯', gradient: 'from-accent-purple to-accent-pink' },
    { to: '/plans', label: 'План 90 дней', icon: '📊', gradient: 'from-accent-orange to-accent-pink' },
    { to: '/reviews', label: 'Обзоры недели', icon: '📝', gradient: 'from-accent-emerald to-accent-cyan' },
    { to: '/sketches', label: 'Эскизы', icon: '✏️', gradient: 'from-accent-pink to-accent-orange' },
    { to: '/ideas', label: 'Идеи', icon: '💡', gradient: 'from-accent-yellow to-accent-orange' },
    { to: '/settings', label: 'Настройки', icon: '⚙️', gradient: 'from-text-muted to-text-secondary' },
  ];

  return (
    <nav  className={`${isCollapsed ? 'w-20' : 'w-72'} bg-dark-200/50 backdrop-blur-glass border-r border-glass-border flex flex-col transition-all duration-300`}>
      {/* Header */}
      <div onClick={() => setIsCollapsed(!isCollapsed)} className="p-6 border-b border-glass-border">
        {!isCollapsed ? (
          <>
            <h1 className="text-xl font-bold gradient-text">Ежедневник</h1>
            <h1 className="text-xl font-bold gradient-text-cool">Триллионера</h1>
            <p className="mt-2 text-xs text-text-muted">Тренажер для мозга</p>
          </>
        ) : (
          <div className="text-center">
            <span className="text-2xl">💎</span>
          </div>
        )}
      </div>

      {/* Navigation Links */}
      <div className="flex-1 p-4 space-y-2 overflow-y-auto custom-scrollbar">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            title={isCollapsed ? item.label : undefined}
            className={({ isActive }) =>
              `
              flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'} px-4 py-3 rounded-glass-sm
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
            {!isCollapsed && <span>{item.label}</span>}
          </NavLink>
        ))}
      </div>

      {/* Toggle Button & Footer */}
      <div className="p-4 border-t border-glass-border space-y-2">
        <Button
          variant="secondary"
          size="sm"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="w-full"
          title={isCollapsed ? 'Развернуть меню' : 'Свернуть меню'}
        >
          {isCollapsed ? '→' : '←'}
        </Button>

        {!isCollapsed && (
          <div className="glass-sm p-4">
            <p className="text-xs text-text-muted mb-1">Версия 2.0</p>
            <p className="text-xs text-text-disabled">Glassmorphism Edition</p>
          </div>
        )}
      </div>
    </nav>
  );
}
