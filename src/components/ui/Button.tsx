import { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'gradient';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

/**
 * Button Component - Glassmorphism button with gradient variants
 */
export function Button({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  className = '',
  disabled,
  type = 'button',
  ...props
}: ButtonProps) {
  const baseStyles = `
    inline-flex items-center justify-center font-semibold
    rounded-glass-sm
    transition-all duration-200
    focus:outline-none focus:ring-2 focus:ring-accent-blue/50 focus:ring-offset-2 focus:ring-offset-dark-300
    disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none
    active:scale-[0.98]
  `;

  const variantStyles = {
    primary: `
      bg-gradient-to-r from-accent-blue to-accent-purple
      text-white
      shadow-glow-blue
      hover:shadow-glow-purple hover:from-accent-purple hover:to-accent-pink
    `,
    secondary: `
      bg-dark-200/50 backdrop-blur-glass
      border border-glass-border
      text-text-primary
      hover:bg-dark-200/60 hover:border-glass-border
    `,
    danger: `
      bg-gradient-to-r from-danger to-accent-pink
      text-white
      shadow-glow-pink
      hover:from-accent-pink hover:to-danger
    `,
    ghost: `
      bg-transparent
      text-text-secondary
      hover:bg-dark-200/50 hover:text-text-primary
    `,
    gradient: `
      bg-gradient-to-r from-accent-cyan via-accent-blue to-accent-purple
      text-white
      shadow-glass
      hover:shadow-glow-purple
      bg-[length:200%_auto]
      hover:bg-right
    `,
  };

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-5 py-2.5 text-base',
    lg: 'px-7 py-3.5 text-lg',
  };

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      disabled={disabled || isLoading}
      type={type}
      {...props}
    >
      {isLoading ? (
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          <span>Загрузка...</span>
        </div>
      ) : (
        children
      )}
    </button>
  );
}
