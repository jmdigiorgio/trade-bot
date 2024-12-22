import { ReactNode } from 'react';

interface ContainerProps {
  header?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  /**
   * If true, the container's body content will be arranged in a responsive grid
   * that stacks on mobile and shows in columns on larger screens
   */
  grid?: boolean;
  /**
   * Number of columns to show in grid mode on larger screens
   * @default 3
   */
  columns?: number;
}

export function Container({ header, children, footer, grid = false, columns = 3 }: ContainerProps) {
  return (
    <div className="rounded-lg bg-gradient-to-b from-zinc-800/50 to-zinc-800/30 p-6 shadow-[4px_4px_0_0_rgba(0,0,0,0.3)] overflow-hidden flex flex-col h-full">
      {/* Header Section */}
      {header && (
        <div className="mb-6 flex-none">
          {header}
        </div>
      )}

      {/* Body Section */}
      <div className={`flex-1 ${
        grid 
          ? `grid gap-6 grid-cols-1 ${
              columns === 2 ? 'md:grid-cols-2' : 
              columns === 3 ? 'xl:grid-cols-3' : 
              columns === 4 ? '2xl:grid-cols-4' : ''
            }`
          : ''
      }`}>
        {children}
      </div>

      {/* Footer Section */}
      {footer && (
        <div className="mt-6 border-t border-white/10 pt-4 flex-none">
          {footer}
        </div>
      )}
    </div>
  );
} 