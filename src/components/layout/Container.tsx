import { ReactNode } from 'react';

interface ContainerProps {
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  className?: string;
}

/**
 * Container Component - Centered layout with max-width constraints
 */
export function Container({
  children,
  size = 'lg',
  className = '',
}: ContainerProps) {
  const sizeStyles = {
    sm: 'max-w-2xl',   // 672px
    md: 'max-w-3xl',   // 768px
    lg: 'max-w-4xl',   // 896px
    xl: 'max-w-6xl',   // 1152px
    full: 'max-w-full',
  };

  return (
    <div className={`mx-auto px-4 sm:px-6 lg:px-8 ${sizeStyles[size]} ${className}`}>
      {children}
    </div>
  );
}
