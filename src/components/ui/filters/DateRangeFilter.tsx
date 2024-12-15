'use client';

export type FilterValue = '24h' | '7d' | '30d' | 'all' | 'custom' | 'today' | 'week' | 'month' | 'allTime';

interface DateRangeFilterProps {
  value: FilterValue;
  onFilterChange: (filter: FilterValue) => void;
  onDateChange: (startDate: string, endDate: string) => void;
  startDate: string;
  endDate: string;
  showAllOption?: boolean;
  className?: string;
}

export function DateRangeFilter({
  value,
  onFilterChange,
  onDateChange,
  startDate,
  endDate,
  showAllOption = true,
  className = '',
}: DateRangeFilterProps) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {/* Quick filters */}
      <button
        onClick={() => {
          onFilterChange('24h');
          onDateChange('', '');
        }}
        className={`rounded px-2 py-1 text-xs ${value === '24h' ? 'bg-emerald-400/20 text-emerald-400' : 'text-white/60 hover:text-emerald-400'}`}
      >
        24h
      </button>
      <button
        onClick={() => {
          onFilterChange('7d');
          onDateChange('', '');
        }}
        className={`rounded px-2 py-1 text-xs ${value === '7d' ? 'bg-emerald-400/20 text-emerald-400' : 'text-white/60 hover:text-emerald-400'}`}
      >
        7d
      </button>
      <button
        onClick={() => {
          onFilterChange('30d');
          onDateChange('', '');
        }}
        className={`rounded px-2 py-1 text-xs ${value === '30d' ? 'bg-emerald-400/20 text-emerald-400' : 'text-white/60 hover:text-emerald-400'}`}
      >
        30d
      </button>
      {showAllOption && (
        <button
          onClick={() => {
            onFilterChange('all');
            onDateChange('', '');
          }}
          className={`rounded px-2 py-1 text-xs ${value === 'all' ? 'bg-emerald-400/20 text-emerald-400' : 'text-white/60 hover:text-emerald-400'}`}
        >
          All
        </button>
      )}

      {/* Custom date range */}
      <div className="flex items-center gap-2">
        <input
          type="date"
          value={startDate}
          onChange={(e) => {
            const newStartDate = e.target.value;
            onDateChange(newStartDate, endDate);
            if (newStartDate && endDate) {
              onFilterChange('custom');
            }
          }}
          className="rounded border-0 bg-white/5 px-2 py-1 text-xs text-white/60 focus:outline-none focus:ring-1 focus:ring-emerald-400 [&::-webkit-calendar-picker-indicator]:invert [&::-webkit-calendar-picker-indicator]:opacity-50 [&::-webkit-calendar-picker-indicator]:hover:opacity-75"
        />
        <span className="text-white/60">to</span>
        <input
          type="date"
          value={endDate}
          onChange={(e) => {
            const newEndDate = e.target.value;
            onDateChange(startDate, newEndDate);
            if (startDate && newEndDate) {
              onFilterChange('custom');
            }
          }}
          className="rounded border-0 bg-white/5 px-2 py-1 text-xs text-white/60 focus:outline-none focus:ring-1 focus:ring-emerald-400 [&::-webkit-calendar-picker-indicator]:invert [&::-webkit-calendar-picker-indicator]:opacity-50 [&::-webkit-calendar-picker-indicator]:hover:opacity-75"
        />
      </div>
    </div>
  );
} 