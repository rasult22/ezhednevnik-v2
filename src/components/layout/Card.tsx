import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

/**
 * Card Component - Content container with shadow and border
 */
export function Card({
  children,
  title,
  subtitle,
  className = '',
  padding = 'md',
}: CardProps) {
  const paddingStyles = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 ${className}`}>
      {(title || subtitle) && (
        <div className={`border-b border-gray-200 ${paddingStyles[padding]}`}>
          {title && (
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          )}
          {subtitle && (
            <p className="mt-1 text-sm text-gray-500">{subtitle}</p>
          )}
        </div>
      )}

      <div className={paddingStyles[padding]}>
        {children}
      </div>
    </div>
  );
}
