import React from 'react';
import { cn } from '../../lib/utils';

interface DialogProps extends React.HTMLAttributes<HTMLDivElement> {
  open?: boolean;
}

const Dialog: React.FC<DialogProps> = ({ children, className, open = true, ...props }) => {
  if (!open) return null;
  return (
    <div className={cn('fixed inset-0 z-50 flex items-center justify-center p-4', className)} {...props}>
      <div className="fixed inset-0 bg-black/50" />
      <div className="relative z-10 w-full max-w-lg">{children}</div>
    </div>
  );
};

export default Dialog;
