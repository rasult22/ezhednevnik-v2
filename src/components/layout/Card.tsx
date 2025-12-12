import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  variant?: 'default' | 'gradient' | 'accent';
  accentColor?: 'blue' | 'purple' | 'pink' | 'cyan' | 'emerald' | 'orange';
}

/**
 * Card Component - Glassmorphism container with optional gradient accent
 */
export function Card({
  children,
  title,
  subtitle,
  className = '',
  padding = 'md',
  variant = 'default',
  accentColor = 'blue',
}: CardProps) {
  const paddingStyles = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  const accentColors = {
    blue: 'from-accent-blue/20 to-transparent',
    purple: 'from-accent-purple/20 to-transparent',
    pink: 'from-accent-pink/20 to-transparent',
    cyan: 'from-accent-cyan/20 to-transparent',
    emerald: 'from-accent-emerald/20 to-transparent',
    orange: 'from-accent-orange/20 to-transparent',
  };

  const accentBorders = {
    blue: 'border-accent-blue/30',
    purple: 'border-accent-purple/30',
    pink: 'border-accent-pink/30',
    cyan: 'border-accent-cyan/30',
    emerald: 'border-accent-emerald/30',
    orange: 'border-accent-orange/30',
  };

  const baseStyles = `
    relative overflow-hidden
    bg-dark-200/50 backdrop-blur-glass
    border border-glass-border
    shadow-glass
    rounded-glass
    transition-all duration-300
    hover:shadow-glass-lg hover:bg-dark-200/60
  `;

  const variantStyles = {
    default: '',
    gradient: `bg-gradient-to-br ${accentColors[accentColor]}`,
    accent: `border-t-2 ${accentBorders[accentColor]}`,
  };

  return (
    <div className={`${baseStyles} ${variantStyles[variant]} ${className}`}>
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />

      {(title || subtitle) && (
        <div className={`relative border-b border-glass-border ${paddingStyles[padding]}`}>
          {title && (
            <h3 className="text-lg font-semibold text-text-primary">{title}</h3>
          )}
          {subtitle && (
            <p className="mt-1 text-sm text-text-muted">{subtitle}</p>
          )}
        </div>
      )}

      <div className={`relative ${paddingStyles[padding]}`}>
        {children}
      </div>
    </div>
  );
}
