import { InputHTMLAttributes, TextareaHTMLAttributes, ReactNode, forwardRef } from 'react';

type FieldVariant = 'default' | 'ghost';

interface FieldVariantProps {
  /** 'default': a normal bordered field. 'ghost': borderless until hovered/focused — reads as living content rather than a form. */
  variant?: FieldVariant;
}

const baseFieldClasses =
  'w-full rounded-md text-sm font-ui text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-accent/30 transition-colors';

const variantClasses: Record<FieldVariant, string> = {
  default: 'px-3 py-2.5 bg-surface border border-border focus:border-text-muted',
  ghost: 'px-2.5 py-2 bg-transparent border border-transparent hover:bg-surface/60 focus:bg-surface focus:border-border'
};

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement> & FieldVariantProps>(
  ({ className = '', variant = 'default', ...props }, ref) => {
    return <input ref={ref} className={`${baseFieldClasses} ${variantClasses[variant]} ${className}`} {...props} />;
  }
);
Input.displayName = 'Input';

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement> & FieldVariantProps>(
  ({ className = '', variant = 'default', ...props }, ref) => {
    return (
      <textarea ref={ref} className={`${baseFieldClasses} ${variantClasses[variant]} resize-none ${className}`} {...props} />
    );
  }
);
Textarea.displayName = 'Textarea';

export function FieldLabel({ children }: { children: ReactNode }) {
  return <label className="text-[11px] font-ui font-medium uppercase tracking-wide text-text-muted block mb-2">{children}</label>;
}
