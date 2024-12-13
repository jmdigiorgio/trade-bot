import { HTMLAttributes } from 'react';
import { twMerge } from 'tailwind-merge';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  title?: string;
}

export function Card({ children, className, title, ...props }: CardProps) {
  return (
    <div
      className={twMerge(
        'rounded-lg border bg-white p-6 shadow-sm dark:bg-gray-800',
        className
      )}
      {...props}
    >
      {title && (
        <h3 className="mb-4 text-lg font-medium">{title}</h3>
      )}
      {children}
    </div>
  );
} 