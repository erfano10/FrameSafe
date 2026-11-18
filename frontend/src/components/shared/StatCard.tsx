import * as React from 'react';
import { type LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  description?: string;
  trend?: number;
  iconColor?: string;
  className?: string;
}

function StatCard({
  title,
  value,
  icon: Icon,
  description,
  trend,
  iconColor = 'text-blue-600',
  className,
}: StatCardProps) {
  const hasTrend = trend !== undefined;
  const isPositive = hasTrend && trend > 0;
  const isNegative = hasTrend && trend < 0;
  const absPercent = hasTrend ? Math.abs(trend) : 0;

  const iconBgMap: Record<string, string> = {
    'text-blue-600':   'bg-blue-50',
    'text-green-600':  'bg-green-50',
    'text-amber-600':  'bg-amber-50',
    'text-red-600':    'bg-red-50',
    'text-purple-600': 'bg-purple-50',
    'text-slate-600':  'bg-slate-100',
  };
  const iconBg = iconBgMap[iconColor] ?? 'bg-blue-50';

  return (
    <Card className={cn('transition-shadow hover:shadow-md', className)}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-col gap-3 min-w-0 flex-1">
            <p className="text-sm font-medium text-slate-500 truncate">{title}</p>
            <p className="text-3xl font-bold text-slate-900 leading-none">
              {value}
            </p>
            <div className="flex items-center gap-2 flex-wrap">
              {hasTrend && (
                <span
                  className={cn(
                    'inline-flex items-center gap-0.5 text-xs font-semibold',
                    isPositive && 'text-green-600',
                    isNegative && 'text-red-600',
                    !isPositive && !isNegative && 'text-slate-500'
                  )}
                >
                  {isPositive && <TrendingUp className="h-3.5 w-3.5" />}
                  {isNegative && <TrendingDown className="h-3.5 w-3.5" />}
                  {isPositive ? '+' : ''}{trend}%
                </span>
              )}
              {description && (
                <span className="text-xs text-slate-500">{description}</span>
              )}
            </div>
          </div>
          <div
            className={cn(
              'flex items-center justify-center rounded-xl p-3 shrink-0',
              iconBg,
              iconColor
            )}
          >
            <Icon className="h-6 w-6" strokeWidth={1.75} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export { StatCard };
