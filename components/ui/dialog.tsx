import React from "react";

import { cn } from "../../lib/utils";

interface DialogProps extends React.HTMLAttributes<HTMLDivElement> {
  open?: boolean;
  onClose?: () => void;
}

const Dialog = ({
  children,
  className,
  open = true,
  onClose,
  ...props
}: DialogProps) => {
  if (!open) {
    return null;
  }

  return (
    <div
      className={cn(
        "fixed inset-0 z-50 flex items-center justify-center p-4",
        className,
      )}
      {...props}
    >
      <div
        className="absolute inset-0 bg-base/80 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative z-10 w-full max-w-lg">{children}</div>
    </div>
  );
};


type DialogContentProps = React.HTMLAttributes<HTMLDivElement>;

export const DialogContent = ({
  children,
  className,
  ...props
}: DialogContentProps) => {
  return (
    <div
      className={cn(
        "rounded-3xl border border-surface-border bg-elevated text-copy-primary shadow-[0_24px_80px_rgba(0,0,0,0.55)]",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
};

type DialogHeaderProps = React.HTMLAttributes<HTMLDivElement>;

export const DialogHeader = ({
  children,
  className,
  ...props
}: DialogHeaderProps) => {
  return (
    <div
      className={cn("space-y-2 border-b border-surface-border p-6", className)}
      {...props}
    >
      {children}
    </div>
  );
};

type DialogTitleProps = React.HTMLAttributes<HTMLHeadingElement>;

export const DialogTitle = ({
  children,
  className,
  ...props
}: DialogTitleProps) => {
  return (
    <h2
      className={cn("text-lg font-semibold tracking-tight text-copy-primary", className)}
      {...props}
    >
      {children}
    </h2>
  );
};

type DialogDescriptionProps = React.HTMLAttributes<HTMLParagraphElement>;

export const DialogDescription = ({
  children,
  className,
  ...props
}: DialogDescriptionProps) => {
  return (
    <p className={cn("text-sm leading-6 text-copy-secondary", className)} {...props}>
      {children}
    </p>
  );
};

type DialogFooterProps = React.HTMLAttributes<HTMLDivElement>;

export const DialogFooter = ({
  children,
  className,
  ...props
}: DialogFooterProps) => {
  return (
    <div
      className={cn(
        "flex items-center justify-end gap-3 border-t border-surface-border px-6 py-4",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export default Dialog;
