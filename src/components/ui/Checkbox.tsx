import { InputHTMLAttributes } from 'react';
import { motion } from 'framer-motion';

interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
}

/**
 * Checkbox Component - Animated checkbox with optional label
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
            w-5 h-5 border-2 rounded
            transition-colors
            peer-checked:bg-success peer-checked:border-success
            peer-focus:ring-2 peer-focus:ring-success peer-focus:ring-offset-2
            peer-disabled:opacity-50 peer-disabled:cursor-not-allowed
            ${props.checked ? 'bg-success border-success' : 'bg-white border-gray-300'}
            ${className}
          `}
          whileTap={{ scale: props.disabled ? 1 : 0.95 }}
        >
          {/* Checkmark */}
          {props.checked && (
            <motion.svg
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              className="w-full h-full text-white"
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
        <span className="ml-2 text-sm text-gray-700 group-hover:text-gray-900">
          {label}
        </span>
      )}
    </label>
  );
}
