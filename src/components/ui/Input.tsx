import { InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

/**
 * Input Component - Glassmorphism text input with glow effects
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, className = '', ...props }, ref) => {
    const inputStyles = `
      w-full px-4 py-3
      bg-dark-200/50 backdrop-blur-glass
      border border-glass-border
      rounded-glass-sm
      text-text-primary
      transition-all duration-200
      focus:outline-none focus:border-accent-blue/50 focus:shadow-glow-blue focus:bg-dark-200/60
      disabled:opacity-40 disabled:cursor-not-allowed
      ${error ? 'border-danger/50 focus:border-danger focus:shadow-glow-pink' : ''}
      ${className}
    `;

    return (
      <div className="w-full">
        {label && (
          <label className="block mb-2 text-sm font-medium text-text-secondary">
            {label}
          </label>
        )}

        <input ref={ref} className={inputStyles} {...props} />

        {error && (
          <p className="mt-2 text-sm text-danger">{error}</p>
        )}

        {helperText && !error && (
          <p className="mt-2 text-sm text-text-muted">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
