import React from 'react';
import { cn } from '../../lib/utils';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {}

const Card: React.FC<CardProps> = ({ children, className, ...props }) => {
  return (
    <div className={cn('rounded-lg bg-slate-900 p-4 shadow-sm', className)} {...props}>
      {children}
    </div>
  );
};

export default Card;
