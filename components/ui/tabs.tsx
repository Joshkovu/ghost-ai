import React from 'react';
import { cn } from '../../lib/utils';

interface TabsProps extends React.HTMLAttributes<HTMLDivElement> {}

const Tabs: React.FC<TabsProps> = ({ children, className, ...props }) => {
  return (
    <div className={cn('flex flex-col', className)} {...props}>
      {children}
    </div>
  );
};

export default Tabs;
