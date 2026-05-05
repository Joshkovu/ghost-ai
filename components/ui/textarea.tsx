import React from 'react';
import { cn } from '../../lib/utils';

export type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(({ className, ...props }, ref) => {
  return (
    <textarea
      ref={ref}
      className={cn('w-full rounded-md border border-slate-700 bg-transparent px-3 py-2 text-sm text-white placeholder:text-slate-400 focus:outline-none', className)}
      {...props}
    />
  );
});
Textarea.displayName = 'Textarea';
export default Textarea;
