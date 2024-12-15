import { OverviewCard } from '@/components/containers/OverviewCard';
import { BotStatusCard } from '@/components/containers/BotStatusCard';
import { PerformanceCard } from '@/components/containers/PerformanceCard';
import { HoldingsCard } from '@/components/containers/HoldingsCard';
import { TradingLogCard } from '@/components/containers/TradingLogCard';
import { Text } from '@/components/ui/typography/Text';

// Mock data for holdings
const holdings = [
  {
    symbol: 'AAPL',
    shares: 100,
    entryPrice: 175.23,
    currentPrice: 178.9,
    targetPrice: 185.0,
    stopLoss: 172.5,
    holdingSince: '2024-03-11T14:30:00Z',
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
    symbol: 'NVDA',
    shares: 25,
    entryPrice: 890.45,
    currentPrice: 919.13,
    targetPrice: 950.0,
    stopLoss: 875.0,
    holdingSince: '2024-03-12T15:45:00Z',
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

// Mock data for the performance chart
const chartData = [
  { date: '2024-03-07', value: 82450 },
  { date: '2024-03-08', value: 84320 },
  { date: '2024-03-09', value: 83150 },
  { date: '2024-03-10', value: 85600 },
  { date: '2024-03-11', value: 84900 },
  { date: '2024-03-12', value: 86377 },
  { date: '2024-03-13', value: 86377 },
].map((item) => ({
  ...item,
  date: new Date(item.date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  }),
}));

// Mock P&L data for different time periods
const profitAndLoss = {
  today: { value: 1234.56, percentage: 0.0234 },
  week: { value: -3456.78, percentage: -0.0456 },
  month: { value: 12345.67, percentage: 0.1234 },
  quarter: { value: 45678.9, percentage: 0.2345 },
  year: { value: 123456.78, percentage: 0.3456 },
  allTime: { value: 567890.12, percentage: 1.2345 },
};

export default function Home() {
  // Calculate total invested capital
  const investedCapital = holdings.reduce((total, holding) => {
    return total + holding.shares * holding.currentPrice;
  }, 0);

  return (
    <main className="min-h-screen bg-black p-8">
      <div className="mx-auto max-w-6xl space-y-12">
        {/* Bot Performance Section */}
        <section className="space-y-6">
          <div className="space-y-6 rounded-xl bg-zinc-900 p-6">
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <svg
                  viewBox="0 0 24 24"
                  className="h-6 w-6 text-emerald-400"
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
                  className="font-mono font-semibold uppercase tracking-[.25em] text-emerald-400"
                >
                  Warren
                </Text>
              </div>
              <BotStatusCard
                status={botStatus.status}
                lastActive={botStatus.lastActive}
                message={botStatus.message}
              />
            </div>

            <OverviewCard
              availableCash={25420.69}
              investedCapital={investedCapital}
              totalPositions={holdings.length}
            />

            <PerformanceCard profitAndLoss={profitAndLoss} chartData={chartData} />

            <HoldingsCard holdings={holdings} />

            <TradingLogCard logs={tradingLog} />
          </div>
        </section>
      </div>
    </main>
  );
}
