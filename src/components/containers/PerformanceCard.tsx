'use client';

import { Text } from '@/components/ui/typography/Text';
import { Number } from '@/components/ui/typography/Number';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useState } from 'react';

interface TimeFrameData {
  value: number;
  percentage: number;
}

interface ProfitAndLoss {
  today: TimeFrameData;
  week: TimeFrameData;
  month: TimeFrameData;
  quarter: TimeFrameData;
  year: TimeFrameData;
  allTime: TimeFrameData;
}

interface ChartDataPoint {
  date: string;
  value: number;
}

interface PerformanceCardProps {
  profitAndLoss: ProfitAndLoss;
  chartData: ChartDataPoint[];
}

interface TooltipProps {
  active?: boolean;
  payload?: Array<{
    payload: {
      date: string;
      value: number;
    };
    value: number;
  }>;
}

const timeFrames = [
  { label: 'Today', value: 'today' },
  { label: 'This Week', value: 'week' },
  { label: 'This Month', value: 'month' },
  { label: 'This Quarter', value: 'quarter' },
  { label: 'This Year', value: 'year' },
  { label: 'All Time', value: 'allTime' },
] as const;

type TimeFrame = (typeof timeFrames)[number]['value'];

export function PerformanceCard({ profitAndLoss, chartData }: PerformanceCardProps) {
  const [selectedTimeFrame, setSelectedTimeFrame] = useState<TimeFrame>('today');

  const CustomTooltip = ({ active, payload }: TooltipProps) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-lg border border-white/10 bg-zinc-800 p-3 shadow-lg">
          <Text size="tiny" color="muted">
            {payload[0].payload.date}
          </Text>
          <Number value={payload[0].value} format="currency" size="default" />
        </div>
      );
    }
    return null;
  };

  return (
    <div className="border-t border-white/5 pt-6">
      <div className="space-y-4">
        <Text size="tiny" color="muted" className="uppercase">
          Profit & Loss
        </Text>
        <div
          className={`grid grid-cols-1 ${selectedTimeFrame === 'allTime' ? '' : 'md:grid-cols-2'} gap-6`}
        >
          {/* Selected Time Period P&L */}
          <div>
            <div className="mb-1 flex items-center gap-2">
              <select
                value={selectedTimeFrame}
                onChange={(e) => setSelectedTimeFrame(e.target.value as TimeFrame)}
                className="rounded border-0 bg-white/5 px-2 py-1 text-xs text-white/60 focus:outline-none focus:ring-1 focus:ring-emerald-400 [&>option]:bg-zinc-900"
              >
                {timeFrames.map(({ label, value }) => (
                  <option key={value} value={value} className="bg-zinc-900">
                    {label}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-3">
              <Number value={profitAndLoss[selectedTimeFrame].value} format="currency" size="lg" />
              <div className="opacity-60">
                <Number
                  value={profitAndLoss[selectedTimeFrame].percentage}
                  format="percent"
                  size="default"
                />
              </div>
            </div>
          </div>

          {/* All Time P&L */}
          {selectedTimeFrame !== 'allTime' && (
            <div className="rounded-lg bg-white/5 p-4">
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
            </div>
          )}
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
