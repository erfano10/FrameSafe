import * as React from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'secondary' | 'destructive' | 'outline' | 'success' | 'warning' | 'info';
  size?: 'sm' | 'md';
}

function Badge({ className, variant = 'default', size = 'md', ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full font-semibold transition-colors',
        size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-0.5 text-xs',
        {
          default: 'bg-slate-100 text-slate-700',
          secondary: 'bg-slate-100 text-slate-700',
          destructive: 'bg-red-100 text-red-700',
          outline: 'border border-slate-300 text-slate-700 bg-transparent',
          success: 'bg-emerald-100 text-emerald-700',
          warning: 'bg-amber-100 text-amber-700',
          info: 'bg-blue-100 text-blue-700',
        }[variant],
        className
      )}
      {...props}
    />
  );
}

export { Badge };
