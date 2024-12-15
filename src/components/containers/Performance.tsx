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
  const [selectedTimeFrame, setSelectedTimeFrame] = useState<FilterValue>('24h');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  return (
    <div className="space-y-4 border-t border-white/5 pt-6">
      <div className="mb-4 flex items-center justify-between">
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

      <div className="grid gap-4 md:grid-cols-4">
        {/* Today's P&L */}
        {selectedTimeFrame !== 'all' && (
          <div
            className={`rounded-lg p-4 transition-colors ${selectedTimeFrame === '24h' ? 'bg-emerald-400/20' : 'bg-white/5'}`}
          >
            <button
              onClick={() => setSelectedTimeFrame('24h')}
              className="block w-full text-left"
            >
              <Text size="tiny" color="muted">
                24h
              </Text>
              <div className="space-y-3">
                <Number value={profitAndLoss.today.value} format="currency" size="lg" />
                <div className="opacity-60">
                  <Number
                    value={profitAndLoss.today.percentage}
                    format="percent"
                    size="default"
                  />
                </div>
              </div>
            </button>
          </div>
        )}

        {/* Weekly P&L */}
        {selectedTimeFrame !== 'all' && (
          <div
            className={`rounded-lg p-4 transition-colors ${selectedTimeFrame === '7d' ? 'bg-emerald-400/20' : 'bg-white/5'}`}
          >
            <button
              onClick={() => setSelectedTimeFrame('7d')}
              className="block w-full text-left"
            >
              <Text size="tiny" color="muted">
                7d
              </Text>
              <div className="space-y-3">
                <Number value={profitAndLoss.week.value} format="currency" size="lg" />
                <div className="opacity-60">
                  <Number
                    value={profitAndLoss.week.percentage}
                    format="percent"
                    size="default"
                  />
                </div>
              </div>
            </button>
          </div>
        )}

        {/* Monthly P&L */}
        {selectedTimeFrame !== 'all' && (
          <div
            className={`rounded-lg p-4 transition-colors ${selectedTimeFrame === '30d' ? 'bg-emerald-400/20' : 'bg-white/5'}`}
          >
            <button
              onClick={() => setSelectedTimeFrame('30d')}
              className="block w-full text-left"
            >
              <Text size="tiny" color="muted">
                30d
              </Text>
              <div className="space-y-3">
                <Number value={profitAndLoss.month.value} format="currency" size="lg" />
                <div className="opacity-60">
                  <Number
                    value={profitAndLoss.month.percentage}
                    format="percent"
                    size="default"
                  />
                </div>
              </div>
            </button>
          </div>
        )}

        {/* All Time P&L */}
        <div
          className={`rounded-lg p-4 transition-colors ${selectedTimeFrame === 'all' ? 'bg-emerald-400/20 md:col-span-4' : 'bg-white/5'}`}
        >
          <button
            onClick={() => setSelectedTimeFrame('all')}
            className="block w-full text-left"
          >
            <Text size="tiny" color="muted">
              All Time
            </Text>
            <div className="space-y-3">
              <Number value={profitAndLoss.allTime.value} format="currency" size="lg" />
              <div className="opacity-60">
                <Number
                  value={profitAndLoss.allTime.percentage}
                  format="percent"
                  size="default"
                />
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* Performance Chart */}
      <div className="mt-6 h-64">
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
  );
} 