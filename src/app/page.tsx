'use client';

import { Overview } from '@/components/containers/Overview';
import { Performance } from '@/components/containers/Performance';
import { Holdings } from '@/components/containers/Holdings';
import { TradeLog } from '@/components/containers/TradeLog';
import { Header } from '@/components/containers/Header';
import { SystemStatus } from '@/components/containers/SystemStatus';

// Mock data for holdings
const holdings = [
  {
    symbol: 'NVDA',
    shares: 25,
    entryPrice: 890.45,
    currentPrice: 919.13,
    targetPrice: 950.0,
    stopLoss: 875.0,
    holdingSince: '2024-03-12T15:45:00Z',
  },
  {
    symbol: 'MSFT',
    shares: 50,
    entryPrice: 405.12,
    currentPrice: 401.78,
    targetPrice: 420.0,
    stopLoss: 395.0,
    holdingSince: '2024-03-12T10:15:00Z',
  },
  {
    symbol: 'AAPL',
    shares: 100,
    entryPrice: 175.23,
    currentPrice: 178.90,
    targetPrice: 185.0,
    stopLoss: 172.5,
    holdingSince: '2024-03-11T14:30:00Z',
  },
  {
    symbol: 'GOOGL',
    shares: 40,
    entryPrice: 147.68,
    currentPrice: 150.87,
    targetPrice: 155.0,
    stopLoss: 145.0,
    holdingSince: '2024-03-13T09:15:00Z',
  },
  {
    symbol: 'META',
    shares: 60,
    entryPrice: 505.85,
    currentPrice: 514.23,
    targetPrice: 525.0,
    stopLoss: 495.0,
    holdingSince: '2024-03-13T11:30:00Z',
  },
  {
    symbol: 'TSLA',
    shares: 75,
    entryPrice: 178.25,
    currentPrice: 175.43,
    targetPrice: 190.0,
    stopLoss: 170.0,
    holdingSince: '2024-03-13T13:45:00Z',
  },
  {
    symbol: 'AMD',
    shares: 120,
    entryPrice: 192.45,
    currentPrice: 195.78,
    targetPrice: 205.0,
    stopLoss: 185.0,
    holdingSince: '2024-03-13T14:20:00Z',
  },
];

// Mock data for trading log
const tradingLog = [
  {
    timestamp: '2024-03-13T15:45:00Z',
    type: 'BUY' as const,
    symbol: 'NVDA',
    shares: 25,
    price: 890.45,
    total: 22261.25,
    note: 'Entry: Momentum breakout above 890',
  },
  {
    timestamp: '2024-03-12T10:15:00Z',
    type: 'SELL' as const,
    symbol: 'AMD',
    shares: 150,
    price: 205.67,
    total: 30850.5,
    note: 'Exit: Target price reached',
  },
  {
    timestamp: '2024-03-12T10:15:00Z',
    type: 'BUY' as const,
    symbol: 'MSFT',
    shares: 50,
    price: 405.12,
    total: 20256.0,
    note: 'Entry: Support level bounce',
  },
  {
    timestamp: '2024-03-11T14:30:00Z',
    type: 'BUY' as const,
    symbol: 'AAPL',
    shares: 100,
    price: 175.23,
    total: 17523.0,
    note: 'Entry: Moving average crossover',
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-zinc-900 p-6 text-white">
      <div className="mx-auto max-w-[1600px] space-y-6">
        {/* Header */}
        <Header />

        {/* Main Grid Layout */}
        <div className="grid gap-6 lg:grid-cols-12">
          {/* Top Row Grid */}
          <div className="grid grid-cols-2 gap-6 lg:col-span-12">
            {/* Overview */}
            <div className="rounded-lg bg-gradient-to-b from-zinc-800/50 to-zinc-800/30 p-6 shadow-[4px_4px_0_0_rgba(0,0,0,0.3)]">
              <Overview />
            </div>
            {/* System Status */}
            <div className="rounded-lg bg-gradient-to-b from-zinc-800/50 to-zinc-800/30 p-6 shadow-[4px_4px_0_0_rgba(0,0,0,0.3)]">
              <SystemStatus />
            </div>
          </div>

          {/* Left Column - Performance */}
          <div className="lg:col-span-6">
            <div className="h-[500px] relative rounded-lg bg-gradient-to-b from-zinc-800/50 to-zinc-800/30 p-6 pb-12 shadow-[4px_4px_0_0_rgba(0,0,0,0.3)]">
              <Performance
                profitAndLoss={{
                  today: { value: 2500, percentage: 0.025 },
                  week: { value: 5000, percentage: 0.05 },
                  month: { value: 12000, percentage: 0.12 },
                  year: { value: 50000, percentage: 0.5 },
                  allTime: { value: 100000, percentage: 1.0 }
                }}
                chartData={[
                  { date: '2024-03-01', value: 150000 },
                  { date: '2024-03-07', value: 155000 },
                  { date: '2024-03-14', value: 160040.25 },
                ]}
              />
            </div>
          </div>

          {/* Right Column - Holdings */}
          <div className="lg:col-span-6">
            <div className="h-[500px] overflow-hidden rounded-lg bg-gradient-to-b from-zinc-800/50 to-zinc-800/30 p-6 shadow-[4px_4px_0_0_rgba(0,0,0,0.3)]">
              <div className="h-full overflow-x-auto">
                <Holdings holdings={holdings} />
              </div>
            </div>
          </div>

          {/* Bottom Full Width - Trade Log */}
          <div className="lg:col-span-12">
            <div className="overflow-hidden rounded-lg bg-gradient-to-b from-zinc-800/50 to-zinc-800/30 p-6 shadow-[4px_4px_0_0_rgba(0,0,0,0.3)]">
              <div className="overflow-x-auto">
                <TradeLog logs={tradingLog} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
