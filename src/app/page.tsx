'use client';

import { Text } from '@/components/ui/typography/Text';
import { Number } from '@/components/ui/typography/Number';
import { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

type SortField = 'symbol' | 'shares' | 'entryPrice' | 'currentPrice' | 'pnl' | 'holdingSince';
type SortDirection = 'asc' | 'desc';

// Mock data for holdings
const holdings = [
  {
    symbol: 'AAPL',
    shares: 100,
    entryPrice: 175.23,
    currentPrice: 178.90,
    targetPrice: 185.00,
    stopLoss: 172.50,
    holdingSince: '2024-03-11T14:30:00Z',
  },
  {
    symbol: 'MSFT',
    shares: 50,
    entryPrice: 405.12,
    currentPrice: 401.78,
    targetPrice: 420.00,
    stopLoss: 395.00,
    holdingSince: '2024-03-12T10:15:00Z',
  },
  {
    symbol: 'NVDA',
    shares: 25,
    entryPrice: 890.45,
    currentPrice: 919.13,
    targetPrice: 950.00,
    stopLoss: 875.00,
    holdingSince: '2024-03-12T15:45:00Z',
  },
];

// Helper function to calculate PnL for a holding
const calculatePnL = (holding: typeof holdings[0]) => {
  return (holding.currentPrice - holding.entryPrice) * holding.shares;
};

// Mock data for the performance chart
const chartData = [
  { date: '2024-03-07', value: 82450 },
  { date: '2024-03-08', value: 84320 },
  { date: '2024-03-09', value: 83150 },
  { date: '2024-03-10', value: 85600 },
  { date: '2024-03-11', value: 84900 },
  { date: '2024-03-12', value: 86377 },
  { date: '2024-03-13', value: 86377 },
].map(item => ({
  ...item,
  date: new Date(item.date).toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric' 
  })
}));

function getHoldingDuration(since: string): string {
  const holdingSince = new Date(since);
  const now = new Date();
  const hours = Math.floor((now.getTime() - holdingSince.getTime()) / (1000 * 60 * 60));
  
  if (hours < 24) {
    return `${hours}h`;
  }
  const days = Math.floor(hours / 24);
  const remainingHours = hours % 24;
  return `${days}d ${remainingHours}h`;
}

export default function Home() {
  const [sortField, setSortField] = useState<SortField>('holdingSince');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  // Calculate total invested capital
  const investedCapital = holdings.reduce((total, holding) => {
    return total + (holding.shares * holding.currentPrice);
  }, 0);

  // Mock P&L data for different time periods
  const profitAndLoss = {
    today: { value: 1234.56, percentage: 0.0234 },
    week: { value: -3456.78, percentage: -0.0456 },
    month: { value: 12345.67, percentage: 0.1234 },
    quarter: { value: 45678.90, percentage: 0.2345 },
    year: { value: 123456.78, percentage: 0.3456 },
    allTime: { value: 567890.12, percentage: 1.2345 }
  };

  const timeFrames = [
    { label: 'Today', value: 'today' },
    { label: 'This Week', value: 'week' },
    { label: 'This Month', value: 'month' },
    { label: 'This Quarter', value: 'quarter' },
    { label: 'This Year', value: 'year' },
    { label: 'All Time', value: 'allTime' },
  ] as const;

  type TimeFrame = typeof timeFrames[number]['value'];
  const [selectedTimeFrame, setSelectedTimeFrame] = useState<TimeFrame>('today');

  const sortedHoldings = [...holdings].sort((a, b) => {
    let aValue: string | number;
    let bValue: string | number;

    if (sortField === 'pnl') {
      aValue = calculatePnL(a);
      bValue = calculatePnL(b);
    } else {
      aValue = a[sortField];
      bValue = b[sortField];
    }

    if (sortDirection === 'desc') {
      [aValue, bValue] = [bValue, aValue];
    }

    if (typeof aValue === 'string') {
      return aValue.localeCompare(bValue as string);
    }

    return (aValue as number) - (bValue as number);
  });

  const handleSort = (field: SortField) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (field !== sortField) return null;
    return (
      <svg
        className="w-4 h-4 inline-block ml-1"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        {sortDirection === 'asc' ? (
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 7l4-4m0 0l4 4m-4-4v18" />
        ) : (
          <path strokeLinecap="round" strokeLinejoin="round" d="M16 17l-4 4m0 0l-4-4m4 4V3" />
        )}
      </svg>
    );
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-zinc-800 border border-white/10 rounded-lg p-3 shadow-lg">
          <Text size="tiny" color="muted">{payload[0].payload.date}</Text>
          <Number 
            value={payload[0].value} 
            format="currency" 
            size="default"
          />
        </div>
      );
    }
    return null;
  };

  return (
    <main className="min-h-screen bg-black p-8">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Bot Performance Section */}
        <section className="space-y-6">
          <div className="flex items-center gap-2">
            <svg
              viewBox="0 0 24 24"
              className="w-6 h-6 text-emerald-400"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8.25 3v1.5M4.5 8.25H3m18 0h-1.5M4.5 12H3m18 0h-1.5m-15 3.75H3m18 0h-1.5M8.25 19.5V21M12 3v1.5m0 15V21m3.75-18v1.5m0 15V21m-9-1.5h10.5a2.25 2.25 0 002.25-2.25V6.75a2.25 2.25 0 00-2.25-2.25H6.75A2.25 2.25 0 004.5 6.75v10.5a2.25 2.25 0 002.25 2.25zm.75-12h9v9h-9v-9z"
              />
            </svg>
            <Text size="body-lg" className="font-semibold text-emerald-400 font-mono tracking-[.25em] uppercase">Warren</Text>
          </div>
          
          <div className="space-y-6 bg-zinc-900 p-6 rounded-xl">
            <div className="grid gap-6 md:grid-cols-2">
              {/* Available Cash */}
              <div className="space-y-2">
                <Text size="tiny" color="muted" className="uppercase">Available</Text>
                <Number value={25420.69} format="currency" size="stat" />
                <Text size="tiny" color="subtle">Ready to deploy</Text>
              </div>

              {/* Invested Capital */}
              <div className="space-y-2">
                <Text size="tiny" color="muted" className="uppercase">Held</Text>
                <Number value={investedCapital} format="currency" size="stat" />
                <Text size="tiny" color="subtle">Held across {holdings.length} positions</Text>
              </div>
            </div>

            {/* P&L Time Series */}
            <div className="border-t border-white/5 pt-6">
              <div className="space-y-4">
                <Text size="tiny" color="muted" className="uppercase">Profit & Loss</Text>
                <div className={`grid grid-cols-1 ${selectedTimeFrame === 'allTime' ? '' : 'md:grid-cols-2'} gap-6`}>
                  {/* Selected Time Period P&L */}
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <select
                        value={selectedTimeFrame}
                        onChange={(e) => setSelectedTimeFrame(e.target.value as TimeFrame)}
                        className="bg-white/5 border-0 rounded text-xs text-white/60 py-1 px-2 focus:ring-1 focus:ring-emerald-400 focus:outline-none"
                      >
                        {timeFrames.map(({ label, value }) => (
                          <option key={value} value={value} className="bg-zinc-900">
                            {label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-3">
                      <Number 
                        value={profitAndLoss[selectedTimeFrame].value} 
                        format="currency" 
                        size="lg"
                      />
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
                    <div className="bg-white/5 rounded-lg p-4">
                      <Text size="tiny" color="muted">All Time</Text>
                      <div className="space-y-3">
                        <Number 
                          value={profitAndLoss.allTime.value} 
                          format="currency" 
                          size="lg"
                        />
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
            </div>

            {/* Performance Chart */}
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={chartData}
                  margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#47F3D0" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#47F3D0" stopOpacity={0}/>
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
                    tickFormatter={(value) => `$${(value/1000).toFixed(0)}k`}
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
        </section>

        {/* Holdings Section */}
        <section className="space-y-6">
          <Text size="body-lg" className="font-semibold text-emerald-400">Current Holdings</Text>
          
          <div className="bg-zinc-900 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="py-3 px-4 text-left">
                      <button 
                        onClick={() => handleSort('symbol')}
                        className="flex items-center hover:text-emerald-400 transition-colors"
                      >
                        <Text size="tiny" color="muted" className="uppercase font-semibold">Symbol</Text>
                        <SortIcon field="symbol" />
                      </button>
                    </th>
                    <th className="py-3 px-4 text-left">
                      <button 
                        onClick={() => handleSort('shares')}
                        className="flex items-center hover:text-emerald-400 transition-colors"
                      >
                        <Text size="tiny" color="muted" className="uppercase font-semibold">Position</Text>
                        <SortIcon field="shares" />
                      </button>
                    </th>
                    <th className="py-3 px-4 text-right">
                      <button 
                        onClick={() => handleSort('entryPrice')}
                        className="flex items-center justify-end hover:text-emerald-400 transition-colors ml-auto"
                      >
                        <Text size="tiny" color="muted" className="uppercase font-semibold">Entry</Text>
                        <SortIcon field="entryPrice" />
                      </button>
                    </th>
                    <th className="py-3 px-4 text-right">
                      <button 
                        onClick={() => handleSort('currentPrice')}
                        className="flex items-center justify-end hover:text-emerald-400 transition-colors ml-auto"
                      >
                        <Text size="tiny" color="muted" className="uppercase font-semibold">Current</Text>
                        <SortIcon field="currentPrice" />
                      </button>
                    </th>
                    <th className="py-3 px-4 text-right">
                      <Text size="tiny" color="muted" className="uppercase font-semibold">Target</Text>
                    </th>
                    <th className="py-3 px-4 text-right">
                      <Text size="tiny" color="muted" className="uppercase font-semibold">Stop</Text>
                    </th>
                    <th className="py-3 px-4 text-right">
                      <button 
                        onClick={() => handleSort('pnl')}
                        className="flex items-center justify-end hover:text-emerald-400 transition-colors ml-auto"
                      >
                        <Text size="tiny" color="muted" className="uppercase font-semibold">P&L</Text>
                        <SortIcon field="pnl" />
                      </button>
                    </th>
                    <th className="py-3 px-4 text-right">
                      <button 
                        onClick={() => handleSort('holdingSince')}
                        className="flex items-center justify-end hover:text-emerald-400 transition-colors ml-auto"
                      >
                        <Text size="tiny" color="muted" className="uppercase font-semibold">Held For</Text>
                        <SortIcon field="holdingSince" />
                      </button>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {sortedHoldings.map((holding) => {
                    const pnl = (holding.currentPrice - holding.entryPrice) * holding.shares;
                    const pnlPercent = (holding.currentPrice - holding.entryPrice) / holding.entryPrice;
                    
                    return (
                      <tr 
                        key={holding.symbol} 
                        className="border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors"
                      >
                        <td className="py-3 px-4">
                          <Text className="font-mono">{holding.symbol}</Text>
                        </td>
                        <td className="py-3 px-4">
                          <Text>{holding.shares} shares</Text>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <Number value={holding.entryPrice} format="currency" />
                        </td>
                        <td className="py-3 px-4 text-right">
                          <Number value={holding.currentPrice} format="currency" />
                        </td>
                        <td className="py-3 px-4 text-right">
                          <Number value={holding.targetPrice} format="currency" color="primary" />
                        </td>
                        <td className="py-3 px-4 text-right">
                          <Number value={holding.stopLoss} format="currency" color="error" />
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="space-y-3">
                            <Number value={pnl} format="currency" />
                            <div className="opacity-60">
                              <Number value={pnlPercent} format="percent" size="default" />
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <Text color="muted">{getHoldingDuration(holding.holdingSince)}</Text>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <div className="h-px bg-white/10" />

        {/* Component Examples (for reference) */}
        <div className="max-w-2xl space-y-12">
          {/* Text Component Examples */}
          <section className="space-y-6">
            <Text size="body-lg" className="font-semibold text-emerald-400">Text Component</Text>
            
            <div className="space-y-4 bg-zinc-900 p-6 rounded-xl">
              <div className="space-y-2">
                <Text size="tiny" color="muted" className="uppercase">Sizes</Text>
                <Text size="body-lg">Large Body Text</Text>
                <Text>Default Body Text</Text>
                <Text size="body-sm">Small Body Text</Text>
                <Text size="tiny">Tiny Text</Text>
              </div>

              <div className="space-y-2">
                <Text size="tiny" color="muted" className="uppercase">Colors</Text>
                <Text color="default">Default Color</Text>
                <Text color="subtle">Subtle Color</Text>
                <Text color="muted">Muted Color</Text>
                <Text color="primary">Primary Color</Text>
              </div>
            </div>
          </section>

          {/* Number Component Examples */}
          <section className="space-y-6">
            <Text size="body-lg" className="font-semibold text-emerald-400">Number Component</Text>
            
            <div className="space-y-6 bg-zinc-900 p-6 rounded-xl">
              <div className="space-y-4">
                <Text size="tiny" color="muted" className="uppercase">Currency Sizes</Text>
                <div className="space-y-4">
                  <div>
                    <Text size="tiny" color="muted">Stat Size</Text>
                    <Number value={47590} format="currency" size="stat" />
                  </div>
                  
                  <div>
                    <Text size="tiny" color="muted">Large Size</Text>
                    <Number value={47590} format="currency" size="lg" />
                  </div>
                  
                  <div>
                    <Text size="tiny" color="muted">Default Size</Text>
                    <Number value={47590} format="currency" />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <Text size="tiny" color="muted" className="uppercase">Percentages</Text>
                <div className="space-y-4">
                  <div>
                    <Text size="tiny" color="muted">Positive</Text>
                    <Number value={0.0746} format="percent" />
                  </div>
                  
                  <div>
                    <Text size="tiny" color="muted">Negative</Text>
                    <Number value={-0.0746} format="percent" />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <Text size="tiny" color="muted" className="uppercase">Custom Format</Text>
                <div>
                  <Text size="tiny" color="muted">Plain Number</Text>
                  <Number 
                    value={1234567.89} 
                    format="number" 
                    maximumFractionDigits={0}
                    size="lg"
                  />
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
