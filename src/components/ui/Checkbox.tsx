import { InputHTMLAttributes } from 'react';
import { motion } from 'framer-motion';

interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
}

/**
 * Checkbox Component - Glassmorphism animated checkbox with glow
 */
export function Checkbox({ label, className = '', ...props }: CheckboxProps) {
  return (
    <label className="inline-flex items-center cursor-pointer group">
      <div className="relative">
        <input
          type="checkbox"
          className="sr-only peer"
          {...props}
        />

        {/* Custom checkbox */}
        <motion.div
          className={`
            w-6 h-6
            rounded-lg
            border-2
            transition-all duration-200
            ${props.checked
              ? 'bg-gradient-to-br from-accent-emerald to-accent-cyan border-accent-emerald shadow-glow-success'
              : 'bg-glass-light border-glass-border hover:border-accent-blue/50'
            }
            peer-focus:ring-2 peer-focus:ring-accent-blue/50 peer-focus:ring-offset-2 peer-focus:ring-offset-dark-300
            peer-disabled:opacity-40 peer-disabled:cursor-not-allowed
            ${className}
          `}
          whileTap={{ scale: props.disabled ? 1 : 0.9 }}
        >
          {/* Checkmark */}
          {props.checked && (
            <motion.svg
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              className="w-full h-full text-white p-0.5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </motion.svg>
          )}
        </motion.div>
      </div>

      {label && (
        <span className="ml-3 text-sm text-text-secondary group-hover:text-text-primary transition-colors">
          {label}
        </span>
      )}
    </label>
  );
}
