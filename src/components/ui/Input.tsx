import { InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

/**
 * Input Component - Text input with label and error states
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, className = '', ...props }, ref) => {
    const inputStyles = `
      w-full px-3 py-2 border rounded-md
      transition-colors
      focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
      disabled:bg-gray-100 disabled:cursor-not-allowed
      ${error ? 'border-danger' : 'border-gray-300'}
      ${className}
    `;

    return (
      <div className="w-full">
        {label && (
          <label className="block mb-1 text-sm font-medium text-gray-700">
            {label}
          </label>
        )}

        <input ref={ref} className={inputStyles} {...props} />

        {error && (
          <p className="mt-1 text-sm text-danger">{error}</p>
        )}

        {helperText && !error && (
          <p className="mt-1 text-sm text-gray-500">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
