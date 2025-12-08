import { TextareaHTMLAttributes, forwardRef, useEffect, useRef } from 'react';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  autoSize?: boolean;
  maxHeight?: number;
}

/**
 * Textarea Component - Multi-line text input with auto-resize option
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
      w-full px-3 py-2 border rounded-md
      transition-colors resize-none
      focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
      disabled:bg-gray-100 disabled:cursor-not-allowed
      ${error ? 'border-danger' : 'border-gray-300'}
      ${autoSize ? 'overflow-y-hidden' : 'overflow-y-auto'}
      ${className}
    `;

    return (
      <div className="w-full">
        {label && (
          <label className="block mb-1 text-sm font-medium text-gray-700">
            {label}
          </label>
        )}

        <textarea
          ref={textareaRef}
          className={textareaStyles}
          {...props}
        />

        {error && <p className="mt-1 text-sm text-danger">{error}</p>}

        {helperText && !error && (
          <p className="mt-1 text-sm text-gray-500">{helperText}</p>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';
