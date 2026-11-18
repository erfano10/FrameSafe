import * as React from 'react';
import { type LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

function EmptyState({ icon: Icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center text-center px-6 py-16 gap-4',
        className
      )}
    >
      <div className="flex items-center justify-center h-16 w-16 rounded-2xl bg-slate-100 text-slate-400">
        <Icon className="h-8 w-8" strokeWidth={1.5} />
      </div>
      <div className="flex flex-col gap-1.5 max-w-sm">
        <h3 className="text-base font-semibold text-slate-900">{title}</h3>
        <p className="text-sm text-slate-500 leading-relaxed">{description}</p>
      </div>
      {action && (
        <Button onClick={action.onClick} variant="default" size="default" className="mt-2">
          {action.label}
        </Button>
      )}
    </div>
  );
}

export { EmptyState };
