import { HTMLAttributes } from 'react';
import { twMerge } from 'tailwind-merge';

type TextSize = 'tiny' | 'body-sm' | 'body' | 'body-lg';
type TextColor = 'default' | 'subtle' | 'muted' | 'primary';

interface TextProps extends HTMLAttributes<HTMLParagraphElement> {
  size?: TextSize;
  color?: TextColor;
  as?: 'p' | 'span' | 'div';
}

const sizeClasses: Record<TextSize, string> = {
  'body-lg': 'text-lg',
  'body': 'text-base',
  'body-sm': 'text-sm',
  'tiny': 'text-xs',
};

const colorClasses: Record<TextColor, string> = {
  default: 'text-white',
  subtle: 'text-white/60',
  muted: 'text-white/40',
  primary: 'text-emerald-400',
};

export function Text({ 
  children, 
  className, 
  size = 'body', 
  color = 'default',
  as: Component = 'p',
  ...props 
}: TextProps) {
  return (
    <Component
      className={twMerge(
        sizeClasses[size],
        colorClasses[color],
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
} 