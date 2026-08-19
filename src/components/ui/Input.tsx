import { InputHTMLAttributes, TextareaHTMLAttributes, ReactNode, forwardRef } from 'react';

const fieldClasses =
  'w-full px-3 py-2.5 bg-surface border border-border rounded-md text-sm font-ui text-text-primary placeholder:text-text-muted focus:outline-none focus:border-text-muted transition-colors';

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ className = '', ...props }, ref) => {
    return <input ref={ref} className={`${fieldClasses} ${className}`} {...props} />;
  }
);
Input.displayName = 'Input';

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className = '', ...props }, ref) => {
    return <textarea ref={ref} className={`${fieldClasses} resize-none ${className}`} {...props} />;
  }
);
Textarea.displayName = 'Textarea';

export function FieldLabel({ children }: { children: ReactNode }) {
  return <label className="text-[11px] font-ui font-medium uppercase tracking-wide text-text-muted block mb-2">{children}</label>;
}
