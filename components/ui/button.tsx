import React from 'react';
import { cn } from '../../lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'ghost' | 'outline';
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, children, variant = 'default', ...props }, ref) => {
    const base = 'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus:outline-none';
    const variants: Record<string, string> = {
      default: 'bg-slate-800 text-white hover:bg-slate-700',
      ghost: 'bg-transparent hover:bg-slate-800/50 text-white',
      outline: 'border border-slate-700 text-white',
    };

    return (
      <button ref={ref} className={cn(base, variants[variant], className)} {...props}>
        {children}
      </button>
    );
  }
);
Button.displayName = 'Button';
export default Button;
