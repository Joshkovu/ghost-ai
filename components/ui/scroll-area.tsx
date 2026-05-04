import React from 'react';
import { cn } from '../../lib/utils';

interface ScrollAreaProps extends React.HTMLAttributes<HTMLDivElement> {}

const ScrollArea: React.FC<ScrollAreaProps> = ({ children, className, ...props }) => {
  return (
    <div className={cn('overflow-auto', className)} {...props}>
      {children}
    </div>
  );
};

export default ScrollArea;
