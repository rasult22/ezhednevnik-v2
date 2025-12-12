import { TextareaHTMLAttributes, forwardRef, useEffect, useRef } from 'react';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  autoSize?: boolean;
  maxHeight?: number;
}

/**
 * Textarea Component - Glassmorphism multi-line input with auto-resize
 */
export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      label,
      error,
      helperText,
      autoSize = false,
      maxHeight = 500,
      className = '',
      ...props
    },
    forwardedRef
  ) => {
    const internalRef = useRef<HTMLTextAreaElement>(null);
    const textareaRef = (forwardedRef as React.RefObject<HTMLTextAreaElement>) || internalRef;

    // Auto-resize functionality
    useEffect(() => {
      if (autoSize && textareaRef.current) {
        const textarea = textareaRef.current;
        textarea.style.height = 'auto';
        const newHeight = Math.min(textarea.scrollHeight, maxHeight);
        textarea.style.height = `${newHeight}px`;
      }
    }, [props.value, autoSize, maxHeight, textareaRef]);

    const textareaStyles = `
      w-full px-4 py-3
      bg-dark-200/50 backdrop-blur-glass
      border border-glass-border
      rounded-glass-sm
      text-text-primary
      transition-all duration-200 resize-none
      focus:outline-none focus:border-accent-blue/50 focus:shadow-glow-blue focus:bg-dark-200/60
      disabled:opacity-40 disabled:cursor-not-allowed
      ${error ? 'border-danger/50 focus:border-danger focus:shadow-glow-pink' : ''}
      ${autoSize ? 'overflow-y-hidden' : 'overflow-y-auto custom-scrollbar'}
      ${className}
    `;

    return (
      <div className="w-full">
        {label && (
          <label className="block mb-2 text-sm font-medium text-text-secondary">
            {label}
          </label>
        )}

        <textarea
          ref={textareaRef}
          className={textareaStyles}
          {...props}
        />

        {error && <p className="mt-2 text-sm text-danger">{error}</p>}

        {helperText && !error && (
          <p className="mt-2 text-sm text-text-muted">{helperText}</p>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';
