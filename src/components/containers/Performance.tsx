'use client';

import { Text } from '@/components/ui/typography/Text';
import { Number } from '@/components/ui/typography/Number';
import { DateRangeFilter } from '@/components/ui/filters/DateRangeFilter';
import type { FilterValue } from '@/components/ui/filters/DateRangeFilter';
import { useState } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  TooltipProps,
} from 'recharts';

interface ProfitAndLoss {
  today: {
    value: number;
    percentage: number;
  };
  week: {
    value: number;
    percentage: number;
  };
  month: {
    value: number;
    percentage: number;
  };
  year: {
    value: number;
    percentage: number;
  };
  allTime: {
    value: number;
    percentage: number;
  };
}

interface ChartData {
  date: string;
  value: number;
}

interface PerformanceProps {
  profitAndLoss: ProfitAndLoss;
  chartData: ChartData[];
}

interface ChartTooltipProps extends Omit<TooltipProps<number, string>, 'payload'> {
  payload?: { value: number }[];
}

const CustomTooltip = ({ active, payload, label }: ChartTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg bg-zinc-900 p-3 shadow-lg">
        <Text size="tiny" color="muted">
          {label}
        </Text>
        <Number value={payload[0].value} format="currency" size="lg" />
      </div>
    );
  }

  return null;
};

export function Performance({ profitAndLoss, chartData }: PerformanceProps) {
  const [selectedTimeFrame, setSelectedTimeFrame] = useState<FilterValue>('today');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  // Helper function to get current period's data
  const getCurrentPeriodData = () => {
    switch (selectedTimeFrame) {
      case 'today':
        return profitAndLoss.today;
      case 'week':
        return profitAndLoss.week;
      case 'month':
        return profitAndLoss.month;
      case 'ytd':
        return profitAndLoss.year;
      case 'all':
        return profitAndLoss.allTime;
      case 'custom':
        // For custom date ranges, default to today's data
        return profitAndLoss.today;
      default:
        return profitAndLoss.today;
    }
  };

  const currentPeriod = getCurrentPeriodData();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Text size="body-lg" className="font-semibold text-emerald-400">
          Performance
        </Text>
        <DateRangeFilter
          value={selectedTimeFrame}
          onFilterChange={setSelectedTimeFrame}
          onDateChange={(start, end) => {
            setStartDate(start);
            setEndDate(end);
          }}
          startDate={startDate}
          endDate={endDate}
          showAllOption={true}
        />
      </div>

      <div className="border-t border-white/5 pt-6">
        {/* Current Period Stats */}
        <div className="mb-6 rounded-lg bg-emerald-400/20 p-4">
          <Text size="tiny" color="muted">
            Current Period
          </Text>
          <div className="space-y-3">
            <Number value={currentPeriod.value} format="currency" size="lg" />
            <div className="opacity-60">
              <Number
                value={currentPeriod.percentage}
                format="percent"
                size="default"
              />
            </div>
          </div>
        </div>

        {/* Performance Chart */}
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#47F3D0" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#47F3D0" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="date"
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#6B7280', fontSize: 12 }}
                dy={10}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#6B7280', fontSize: 12 }}
                dx={-10}
                tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="value"
                stroke="#47F3D0"
                strokeWidth={2}
                fill="url(#colorValue)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
} 