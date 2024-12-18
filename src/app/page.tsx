'use client';

import { Overview } from '@/components/containers/Overview';
import { Performance } from '@/components/containers/Performance';
import { Holdings } from '@/components/containers/Holdings';
import { TradeLog } from '@/components/containers/TradeLog';
import { Status } from '@/components/ui/Status';
import { Text } from '@/components/ui/typography/Text';
import { useEffect, useState } from 'react';

// Market hours in EST (24-hour format)
const MARKET_OPEN_HOUR = 9;  // 9:30 AM EST
const MARKET_OPEN_MINUTE = 30;
const MARKET_CLOSE_HOUR = 16; // 4:00 PM EST
const MARKET_CLOSE_MINUTE = 0;

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

// Mock status data
const botStatus = {
  status: 'ACTIVE' as const,
  lastActive: '2024-03-13T15:58:23Z',
  message: 'Trading normally',
};

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
  const [isMarketOpen, setIsMarketOpen] = useState(false);
  const [marketTime, setMarketTime] = useState('');

  useEffect(() => {
    const checkMarketStatus = () => {
      const now = new Date();
      // Convert to EST
      const estTime = new Date(now.toLocaleString('en-US', { timeZone: 'America/New_York' }));
      const hours = estTime.getHours();
      const minutes = estTime.getMinutes();
      const day = estTime.getDay();

      // Check if it's a weekday
      const isWeekday = day >= 1 && day <= 5;

      // Check if current time is within market hours
      const isWithinHours =
        (hours > MARKET_OPEN_HOUR || (hours === MARKET_OPEN_HOUR && minutes >= MARKET_OPEN_MINUTE)) &&
        (hours < MARKET_CLOSE_HOUR || (hours === MARKET_CLOSE_HOUR && minutes <= MARKET_CLOSE_MINUTE));

      setIsMarketOpen(isWeekday && isWithinHours);

      // Format the time string
      const formattedTime = estTime.toLocaleString('en-US', {
        timeZone: 'America/New_York',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      });

      // Format timezone separately to match the design
      const timezoneName = 'EST';
      setMarketTime(`${formattedTime} ${timezoneName}`);
    };

    // Check immediately and then every minute
    checkMarketStatus();
    const interval = setInterval(checkMarketStatus, 60000);

    return () => clearInterval(interval);
  }, []);

  return (
    <main className="min-h-screen bg-zinc-900 p-6 text-white">
      <div className="mx-auto max-w-[1600px] space-y-6">
        {/* Header with Status */}
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <svg
                viewBox="0 0 24 24"
                className="h-9 w-9 text-emerald-400"
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
              <Text
                size="body-lg"
                className="font-mono text-xl font-semibold uppercase tracking-[.25em] text-emerald-400"
              >
                Warren
              </Text>
            </div>
            <div className="pl-2">
              <Status
                color={botStatus.status === 'ACTIVE' ? 'green' : 'red'}
                label={botStatus.status === 'ACTIVE' ? 'Online' : 'Offline'}
                info={botStatus.message}
                animate={botStatus.status === 'ACTIVE'}
              />
            </div>
          </div>
          <div className="flex flex-col justify-center">
            <Status
              color={isMarketOpen ? 'green' : 'red'}
              label={isMarketOpen ? 'Market Open' : 'Market Closed'}
              info={`${marketTime}`}
              animate={isMarketOpen}
            />
          </div>
        </div>

        {/* Main Grid Layout */}
        <div className="grid gap-6 lg:grid-cols-12">
          {/* Left Column - Overview and Performance */}
          <div className="space-y-6 lg:col-span-6">
            <div className="rounded-lg bg-gradient-to-b from-zinc-800/50 to-zinc-800/30 p-6 shadow-[4px_4px_0_0_rgba(0,0,0,0.3)]">
              <Overview />
            </div>
            <div className="relative overflow-hidden rounded-lg bg-gradient-to-b from-zinc-800/50 to-zinc-800/30 p-6 shadow-[4px_4px_0_0_rgba(0,0,0,0.3)]">
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
            <div className="rounded-lg bg-gradient-to-b from-zinc-800/50 to-zinc-800/30 p-6 lg:h-[669px] shadow-[4px_4px_0_0_rgba(0,0,0,0.3)]">
              <Holdings holdings={holdings} />
            </div>
          </div>

          {/* Bottom Full Width - Trade Log */}
          <div className="lg:col-span-12">
            <div className="rounded-lg bg-gradient-to-b from-zinc-800/50 to-zinc-800/30 p-6 shadow-[4px_4px_0_0_rgba(0,0,0,0.3)]">
              <TradeLog logs={tradingLog} />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
