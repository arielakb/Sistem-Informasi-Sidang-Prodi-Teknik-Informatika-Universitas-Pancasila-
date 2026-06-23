import { TrendingUp, TrendingDown } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: {
    value: number;
    isPositive: boolean;
    label: string;
  };
  variant?: 'blue' | 'green' | 'yellow' | 'red' | 'purple';
}

const variantStyles = {
  blue: 'bg-blue-50 border-blue-100 text-blue-900',
  green: 'bg-green-50 border-green-100 text-green-900',
  yellow: 'bg-yellow-50 border-yellow-100 text-yellow-900',
  red: 'bg-red-50 border-red-100 text-red-900',
  purple: 'bg-purple-50 border-purple-100 text-purple-900',
};

const trendColorMap = {
  blue: 'text-blue-600',
  green: 'text-green-600',
  yellow: 'text-yellow-600',
  red: 'text-red-600',
  purple: 'text-purple-600',
};

const trendBgMap = {
  blue: 'bg-blue-100',
  green: 'bg-green-100',
  yellow: 'bg-yellow-100',
  red: 'bg-red-100',
  purple: 'bg-purple-100',
};

export default function MetricCard({
  title,
  value,
  subtitle,
  trend,
  variant = 'blue',
}: MetricCardProps) {
  return (
    <div className={`p-4 rounded-lg border ${variantStyles[variant]}`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium opacity-75">{title}</p>
          <p className="text-3xl font-bold mt-2">{value}</p>
          {subtitle && (
            <p className="text-xs mt-2 opacity-60">{subtitle}</p>
          )}
        </div>
        {trend && (
          <div className={`flex items-center gap-1 px-2 py-1 rounded ${trendBgMap[variant]}`}>
            {trend.isPositive ? (
              <TrendingUp size={14} className={trendColorMap[variant]} />
            ) : (
              <TrendingDown size={14} className={trendColorMap[variant]} />
            )}
            <span className={`text-xs font-semibold ${trendColorMap[variant]}`}>
              {trend.isPositive ? '+' : '-'}{trend.value}%
            </span>
          </div>
        )}
      </div>
      {trend && (
        <p className="text-xs text-gray-600 mt-2">{trend.label}</p>
      )}
    </div>
  );
}
