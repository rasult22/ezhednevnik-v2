import { ReactNode } from 'react';

interface ContainerProps {
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  className?: string;
}

/**
 * Container Component - Responsive centered layout for wide screens
 */
export function Container({
  children,
  size = 'xl',
  className = '',
}: ContainerProps) {
  const sizeStyles = {
    sm: 'max-w-2xl',     // 672px
    md: 'max-w-4xl',     // 896px
    lg: 'max-w-5xl',     // 1024px
    xl: 'max-w-7xl',     // 1280px - wider for multi-column layouts
    full: 'max-w-full',
  };

  return (
    <div className={`mx-auto px-6 lg:px-8 ${sizeStyles[size]} ${className}`}>
      {children}
    </div>
  );
}
