import { HTMLAttributes } from 'react';
import { twMerge } from 'tailwind-merge';

type NumberSize = 'default' | 'lg' | 'stat';
type NumberColor = 'default' | 'subtle' | 'muted' | 'primary' | 'success' | 'error';
type NumberFormat = 'number' | 'currency' | 'percent';

interface NumberProps extends HTMLAttributes<HTMLSpanElement> {
  value: number;
  size?: NumberSize;
  color?: NumberColor;
  format?: NumberFormat;
  maximumFractionDigits?: number;
}

const sizeClasses: Record<NumberSize, string> = {
  default: 'text-2xl',
  lg: 'text-3xl',
  stat: 'text-4xl font-semibold',
};

const colorClasses: Record<NumberColor, string> = {
  default: 'text-white',
  subtle: 'text-white/60',
  muted: 'text-white/40',
  primary: 'text-emerald-400',
  success: 'text-emerald-400',
  error: 'text-red-500',
};

const formatters: Record<NumberFormat, (value: number, maximumFractionDigits?: number) => string> = {
  number: (value, maximumFractionDigits = 2) => 
    new Intl.NumberFormat('en-US', { 
      maximumFractionDigits 
    }).format(value),
  currency: (value, maximumFractionDigits = 2) => 
    new Intl.NumberFormat('en-US', { 
      style: 'currency', 
      currency: 'USD',
      maximumFractionDigits 
    }).format(value),
  percent: (value, maximumFractionDigits = 1) => 
    new Intl.NumberFormat('en-US', { 
      style: 'percent',
      maximumFractionDigits 
    }).format(value),
};

export function Number({
  value,
  size = 'default',
  color = 'default',
  format = 'number',
  maximumFractionDigits,
  className,
  ...props
}: NumberProps) {
  // For percentage and currency values, automatically set colors based on value
  const effectiveColor = format === 'percent' || format === 'currency'
    ? value > 0 ? 'success' : value < 0 ? 'error' : color
    : color;

  return (
    <span
      className={twMerge(
        'tabular-nums',
        sizeClasses[size],
        colorClasses[effectiveColor],
        className
      )}
      {...props}
    >
      {formatters[format](value, maximumFractionDigits)}
    </span>
  );
} 