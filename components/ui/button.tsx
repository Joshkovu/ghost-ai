import React from "react";
import { cn } from "../../lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "ghost" | "outline" | "destructive" | "brand";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, children, variant = "default", ...props }, ref) => {
    const base =
      "inline-flex items-center justify-center gap-2 rounded-xl text-sm font-medium transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand/60 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]";

    const variants: Record<string, string> = {
      default:
        "bg-subtle text-copy-primary border border-surface-border hover:bg-subtle/80 hover:border-surface-border-subtle shadow-sm",
      brand:
        "bg-brand/12 text-copy-primary border border-brand/30 hover:bg-brand/18 hover:border-brand/60 shadow-[0_0_20px_rgba(0,200,212,0.1)]",
      ghost: "bg-transparent hover:bg-subtle text-copy-secondary hover:text-copy-primary",
      outline:
        "border border-surface-border bg-transparent hover:bg-subtle text-copy-primary",
      destructive:
        "bg-state-error/12 text-state-error border border-state-error/30 hover:bg-state-error/20 hover:border-state-error/60",
    };

    return (
      <button
        ref={ref}
        className={cn(base, variants[variant], className)}
        {...props}
      >
        {children}
      </button>
    );
  },
);
Button.displayName = "Button";
export default Button;

