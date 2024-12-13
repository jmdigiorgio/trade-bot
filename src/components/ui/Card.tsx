import { HTMLAttributes } from 'react';
import { twMerge } from 'tailwind-merge';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  title?: string;
}

export function Card({ children, className, title, ...props }: CardProps) {
  return (
    <div
      role="article"
      className={twMerge(
        'rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 shadow-sm',
        className
      )}
      {...props}
    >
      {title && (
        <h3 className="mb-4 text-lg font-medium text-gray-900 dark:text-white">{title}</h3>
      )}
      {children}
    </div>
  );
} 