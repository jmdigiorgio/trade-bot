'use client';

import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useState } from 'react';

export type FilterValue = 'today' | 'week' | 'month' | 'ytd' | 'all' | 'custom';

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
  const [startDateObj, setStartDateObj] = useState<Date | null>(startDate ? new Date(startDate) : null);
  const [endDateObj, setEndDateObj] = useState<Date | null>(endDate ? new Date(endDate) : null);

  const calculateDateRange = (filter: FilterValue) => {
    const now = new Date();
    let start: Date | null = null;
    let end: Date | null = now;

    switch (filter) {
      case 'today':
        start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        end = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
        break;
      case 'week':
        const dayOfWeek = now.getDay();
        start = new Date(now.getFullYear(), now.getMonth(), now.getDate() - dayOfWeek);
        end = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
        break;
      case 'month':
        start = new Date(now.getFullYear(), now.getMonth(), 1);
        end = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
        break;
      case 'ytd':
        start = new Date(now.getFullYear(), 0, 1);
        end = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
        break;
      case 'all':
        start = null;
        end = null;
        break;
    }

    return { start, end };
  };

  const handleQuickFilter = (filter: FilterValue) => {
    const { start, end } = calculateDateRange(filter);
    setStartDateObj(start);
    setEndDateObj(end);
    onFilterChange(filter);
    onDateChange(
      start ? start.toISOString().split('T')[0] : '',
      end ? end.toISOString().split('T')[0] : ''
    );
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {/* Quick filters */}
      <button
        onClick={() => handleQuickFilter('today')}
        className={`rounded px-2 py-1 text-xs ${value === 'today' ? 'bg-emerald-400/20 text-emerald-400' : 'text-white/60 hover:text-emerald-400'}`}
      >
        Day
      </button>
      <button
        onClick={() => handleQuickFilter('week')}
        className={`rounded px-2 py-1 text-xs ${value === 'week' ? 'bg-emerald-400/20 text-emerald-400' : 'text-white/60 hover:text-emerald-400'}`}
      >
        Week
      </button>
      <button
        onClick={() => handleQuickFilter('month')}
        className={`rounded px-2 py-1 text-xs ${value === 'month' ? 'bg-emerald-400/20 text-emerald-400' : 'text-white/60 hover:text-emerald-400'}`}
      >
        Month
      </button>
      <button
        onClick={() => handleQuickFilter('ytd')}
        className={`rounded px-2 py-1 text-xs ${value === 'ytd' ? 'bg-emerald-400/20 text-emerald-400' : 'text-white/60 hover:text-emerald-400'}`}
      >
        YTD
      </button>
      {showAllOption && (
        <button
          onClick={() => handleQuickFilter('all')}
          className={`rounded px-2 py-1 text-xs ${value === 'all' ? 'bg-emerald-400/20 text-emerald-400' : 'text-white/60 hover:text-emerald-400'}`}
        >
          All
        </button>
      )}

      {/* Custom date range */}
      <div className="flex items-center gap-2">
        <DatePicker
          selected={startDateObj}
          onChange={(date: Date | null) => {
            setStartDateObj(date);
            if (date) {
              onDateChange(date.toISOString().split('T')[0], endDateObj ? endDateObj.toISOString().split('T')[0] : '');
              if (endDateObj) {
                onFilterChange('custom');
              }
            }
          }}
          selectsStart
          startDate={startDateObj || undefined}
          endDate={endDateObj || undefined}
          placeholderText="mm/dd/yyyy"
          className="w-24 rounded border-0 bg-white/5 px-2 py-1 text-xs text-white/60 focus:outline-none focus:ring-1 focus:ring-emerald-400"
          calendarClassName="bg-zinc-800 border-zinc-700 text-white shadow-xl"
          dayClassName={() => 
            "hover:bg-emerald-400/20 hover:text-emerald-400"
          }
          popperClassName="react-datepicker-popper"
          wrapperClassName="date-picker"
          popperPlacement="bottom-start"
          popperModifiers={[
            {
              name: "preventOverflow",
              options: {
                padding: 10,
                boundary: 'viewport'
              },
              fn: ({ x, y, placement }) => ({ x, y, placement, data: {} })
            }
          ]}
        />
        <span className="text-white/60">to</span>
        <DatePicker
          selected={endDateObj}
          onChange={(date: Date | null) => {
            setEndDateObj(date);
            if (date) {
              onDateChange(startDateObj ? startDateObj.toISOString().split('T')[0] : '', date.toISOString().split('T')[0]);
              if (startDateObj) {
                onFilterChange('custom');
              }
            }
          }}
          selectsEnd
          startDate={startDateObj || undefined}
          endDate={endDateObj || undefined}
          minDate={startDateObj || undefined}
          placeholderText="mm/dd/yyyy"
          className="w-24 rounded border-0 bg-white/5 px-2 py-1 text-xs text-white/60 focus:outline-none focus:ring-1 focus:ring-emerald-400"
          calendarClassName="bg-zinc-800 border-zinc-700 text-white shadow-xl"
          dayClassName={() => 
            "hover:bg-emerald-400/20 hover:text-emerald-400"
          }
          popperClassName="react-datepicker-popper"
          wrapperClassName="date-picker"
          popperPlacement="bottom-end"
          popperModifiers={[
            {
              name: "preventOverflow",
              options: {
                padding: 10,
                boundary: 'viewport'
              },
              fn: ({ x, y, placement }) => ({ x, y, placement, data: {} })
            }
          ]}
        />
      </div>
    </div>
  );
} 