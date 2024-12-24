'use client';

import { Text } from '@/components/ui/typography/Text';
import { Number } from '@/components/ui/typography/Number';
import { Performance } from '@/components/containers/Performance';
import { TradeLog } from '@/components/containers/TradeLog';
import { Header } from '@/components/containers/Header';
import { Status } from '@/components/ui/Status';
import { Container } from '@/components/ui/containers/Container';
import { useAccount } from '@/hooks/useAccount';
import { useSystemStatus } from '@/hooks/useSystemStatus';
import { usePositions } from '@/hooks/usePositions';
import { useState, useEffect } from 'react';

function formatDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  });
}

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
  const { balance, loading, error } = useAccount();
  const { accountStatus } = useSystemStatus();
  const { positions, loading: positionsLoading, error: positionsError } = usePositions();
  const [formattedDate, setFormattedDate] = useState<string>('');

  useEffect(() => {
    if (balance?.created_at) {
      setFormattedDate(formatDate(balance.created_at));
    }
  }, [balance?.created_at]);

  return (
    <main className="min-h-screen bg-zinc-900 text-white overflow-x-hidden">
      <div className="p-4 sm:p-6 space-y-6 w-full">
        {/* Header */}
        <Header />

        {/* Main Grid Layout */}
        <div className="grid gap-6">
          {/* Top Row Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Overview */}
            <Container
              header={
                <Text size="body-lg" className="font-semibold text-gray-400">
                  Portfolio Overview
                </Text>
              }
              footer={
                formattedDate ? (
                  <Text size="tiny" color="muted" className="italic opacity-60">
                    Last updated: {formattedDate}
                  </Text>
                ) : null
              }
              grid
            >
              {loading ? (
                <>
                  <div className="space-y-2 animate-pulse">
                    <div className="h-4 w-16 bg-white/10 rounded" />
                    <div className="h-8 w-32 bg-white/10 rounded" />
                  </div>
                  <div className="space-y-2 animate-pulse">
                    <div className="h-4 w-16 bg-white/10 rounded" />
                    <div className="h-8 w-32 bg-white/10 rounded" />
                  </div>
                  <div className="space-y-2 animate-pulse">
                    <div className="h-4 w-16 bg-white/10 rounded" />
                    <div className="h-8 w-32 bg-white/10 rounded" />
                  </div>
                </>
              ) : error ? (
                <Text color="primary" className="text-red-500">Failed to load account data</Text>
              ) : !balance ? (
                <Text color="primary" className="text-yellow-500">No balance data available</Text>
              ) : (
                <>
                  {/* Cash Balance */}
                  <div className="space-y-1">
                    <Text size="tiny" color="muted" className="uppercase tracking-wider">
                      Cash
                    </Text>
                    <Number value={balance.cash} format="currency" size="stat" className="text-emerald-400" />
                  </div>

                  {/* Investment Value */}
                  <div className="space-y-1">
                    <Text size="tiny" color="muted" className="uppercase tracking-wider">
                      Investments
                    </Text>
                    <Number value={balance.equity - balance.cash} format="currency" size="stat" className="text-emerald-400" />
                  </div>

                  {/* Portfolio Value */}
                  <div className="space-y-1">
                    <Text size="tiny" color="muted" className="uppercase tracking-wider">
                      Portfolio
                    </Text>
                    <Number value={balance.equity} format="currency" size="stat" className="text-emerald-400" />
                  </div>
                </>
              )}
            </Container>

            {/* System Status */}
            <Container
              header={
                <Text size="body-lg" className="font-semibold text-gray-400">
                  Account Status
                </Text>
              }
              footer={
                <Text size="tiny" color="muted" className="italic opacity-60">
                  Last updated: {new Date(accountStatus.created_at).toLocaleString()}
                </Text>
              }
              grid
              columns={2}
            >
              {/* Left Column */}
              <div className="space-y-2">
                <Text size="tiny" color="muted" className="uppercase">
                  Account Status
                </Text>
                <div className="flex flex-col gap-1.5">
                  <Status
                    color={accountStatus.status === 'ACTIVE' ? 'green' : 'red'}
                    label="Account"
                    info={accountStatus.status === 'ACTIVE' ? 'Active' : 'Inactive'}
                    animate={false}
                  />
                  <Status
                    color={!accountStatus.account_blocked ? 'green' : 'red'}
                    label="Account Block"
                    info={accountStatus.account_blocked ? 'Yes' : 'No'}
                    animate={false}
                  />
                  <Status
                    color={!accountStatus.trade_suspended_by_user ? 'green' : 'yellow'}
                    label="User Suspended"
                    info={accountStatus.trade_suspended_by_user ? 'Yes' : 'No'}
                    animate={false}
                  />
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-2">
                <Text size="tiny" color="muted" className="uppercase">
                  Trading Status
                </Text>
                <div className="flex flex-col gap-1.5">
                  <Status
                    color={!accountStatus.trading_blocked ? 'green' : 'red'}
                    label="Trading"
                    info={accountStatus.trading_blocked ? 'Blocked' : 'Allowed'}
                    animate={false}
                  />
                  <Status
                    color={!accountStatus.transfers_blocked ? 'green' : 'red'}
                    label="Transfers"
                    info={accountStatus.transfers_blocked ? 'Blocked' : 'Allowed'}
                    animate={false}
                  />
                  <Status
                    color={accountStatus.shorting_enabled ? 'green' : 'yellow'}
                    label="Shorting"
                    info={accountStatus.shorting_enabled ? 'Enabled' : 'Disabled'}
                    animate={false}
                  />
                </div>
              </div>
            </Container>
          </div>

          {/* Positions Row */}
          <div className="grid grid-cols-1">
            {/* Positions */}
            <Container
              header={
                <Text size="body-lg" className="font-semibold text-gray-400">
                  Current Positions
                </Text>
              }
              footer={
                <Text size="tiny" color="muted" className="italic opacity-60">
                  Last updated: {positions?.[0]?.created_at ? formatDate(positions[0].created_at) : 'Never'}
                </Text>
              }
            >
              {positionsLoading ? (
                <div className="space-y-4 animate-pulse">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="flex justify-between items-center border-b border-white/5 pb-4 last:border-0">
                      <div className="space-y-2">
                        <div className="h-4 w-16 bg-white/10 rounded" />
                        <div className="h-6 w-24 bg-white/10 rounded" />
                      </div>
                      <div className="space-y-2">
                        <div className="h-4 w-20 bg-white/10 rounded" />
                        <div className="h-6 w-32 bg-white/10 rounded" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : positionsError ? (
                <Text color="primary" className="text-red-500">Failed to load positions</Text>
              ) : positions?.length === 0 ? (
                <Text color="muted">No active positions</Text>
              ) : (
                <div className="min-h-0 flex-1 overflow-hidden border-t border-white/5 pt-6">
                  <div className="h-full overflow-y-auto scrollbar-thin scrollbar-track-zinc-800 scrollbar-thumb-zinc-700">
                    <table className="w-full">
                      <thead className="sticky top-0 z-10 bg-zinc-800/50">
                        <tr className="border-b border-white/10">
                          <th className="px-4 py-3 text-left">
                            <Text size="tiny" color="muted" className="font-semibold uppercase">
                              Symbol
                            </Text>
                          </th>
                          <th className="px-4 py-3 text-left">
                            <Text size="tiny" color="muted" className="font-semibold uppercase">
                              Shares
                            </Text>
                          </th>
                          <th className="px-4 py-3 text-left">
                            <Text size="tiny" color="muted" className="font-semibold uppercase">
                              Average
                            </Text>
                          </th>
                          <th className="px-4 py-3 text-left">
                            <Text size="tiny" color="muted" className="font-semibold uppercase">
                              Current
                            </Text>
                          </th>
                          <th className="px-4 py-3 text-left">
                            <Text size="tiny" color="muted" className="font-semibold uppercase">
                              P&L
                            </Text>
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {positions.map((position) => {
                          const pnlValue = (position.current_price - position.cost_basis) * position.qty;
                          
                          return (
                            <tr
                              key={position.symbol}
                              className="border-b border-white/5 transition-colors last:border-0 hover:bg-white/5"
                            >
                              <td className="px-4 py-3">
                                <Text as="span" className="font-mono">
                                  {position.symbol}
                                </Text>
                              </td>
                              <td className="px-4 py-3">
                                <Text as="span">{position.qty}</Text>
                              </td>
                              <td className="px-4 py-3">
                                <Number value={position.cost_basis} format="currency" />
                              </td>
                              <td className="px-4 py-3">
                                <Number value={position.current_price} format="currency" />
                              </td>
                              <td className="px-4 py-3">
                                <div>
                                  <Number value={pnlValue} format="currency" className={pnlValue >= 0 ? 'text-emerald-400' : 'text-red-500'} />
                                  <div className="opacity-60">
                                    <Number value={position.unrealized_plpc} format="percent" size="default" className={position.unrealized_plpc >= 0 ? 'text-emerald-400' : 'text-red-500'} />
                                  </div>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </Container>
          </div>

          {/* Performance and Holdings Grid */}
          <div className="grid grid-cols-1 gap-6">
            {/* Left Column - Performance */}
            <Container>
              <div className="h-[500px] relative">
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
            </Container>
          </div>

          {/* Bottom Full Width - Trade Log */}
          <Container>
            <div className="overflow-x-auto">
              <TradeLog logs={tradingLog} />
            </div>
          </Container>
        </div>
      </div>
    </main>
  );
}
