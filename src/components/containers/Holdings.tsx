'use client';

import { Text } from '@/components/ui/typography/Text';
import { Number } from '@/components/ui/typography/Number';
import { useState } from 'react';

interface Holding {
  symbol: string;
  shares: number;
  entryPrice: number;
  currentPrice: number;
  holdingSince: string;
}

interface HoldingsProps {
  holdings: Holding[];
}

type SortField = 'symbol' | 'shares' | 'entryPrice' | 'currentPrice' | 'pnl' | 'holdingSince';
type SortDirection = 'asc' | 'desc';

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

export function Holdings({ holdings }: HoldingsProps) {
  const [sortField, setSortField] = useState<SortField>('holdingSince');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  const handleSort = (field: SortField) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const calculatePnL = (holding: Holding) => {
    return (holding.currentPrice - holding.entryPrice) * holding.shares;
  };

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

  const SortIcon = ({ field }: { field: SortField }) => {
    if (field !== sortField) return null;
    return (
      <svg
        className="ml-1 inline-block h-4 w-4"
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

  return (
    <div className="flex h-full flex-col space-y-4">
      <Text size="body-lg" className="font-semibold text-emerald-400">
        Current Holdings
      </Text>

      <div className="min-h-0 flex-1 overflow-hidden border-t border-white/5 pt-6">
        <div className="h-full overflow-y-auto scrollbar-thin scrollbar-track-zinc-800 scrollbar-thumb-zinc-700">
          <table className="w-full">
            <thead className="sticky top-0 z-10 bg-zinc-800/50">
              <tr className="border-b border-white/10">
                <th className="px-4 py-3 text-left">
                  <button
                    onClick={() => handleSort('symbol')}
                    className="flex items-center transition-colors hover:text-emerald-400"
                  >
                    <Text size="tiny" color="muted" className="font-semibold uppercase">
                      Symbol
                    </Text>
                    <SortIcon field="symbol" />
                  </button>
                </th>
                <th className="px-4 py-3 text-left">
                  <button
                    onClick={() => handleSort('shares')}
                    className="flex items-center transition-colors hover:text-emerald-400"
                  >
                    <Text size="tiny" color="muted" className="font-semibold uppercase">
                      Shares
                    </Text>
                    <SortIcon field="shares" />
                  </button>
                </th>
                <th className="px-4 py-3 text-left">
                  <button
                    onClick={() => handleSort('entryPrice')}
                    className="flex items-center transition-colors hover:text-emerald-400"
                  >
                    <Text size="tiny" color="muted" className="font-semibold uppercase">
                      Average
                    </Text>
                    <SortIcon field="entryPrice" />
                  </button>
                </th>
                <th className="px-4 py-3 text-left">
                  <button
                    onClick={() => handleSort('currentPrice')}
                    className="flex items-center transition-colors hover:text-emerald-400"
                  >
                    <Text size="tiny" color="muted" className="font-semibold uppercase">
                      Current
                    </Text>
                    <SortIcon field="currentPrice" />
                  </button>
                </th>
                <th className="px-4 py-3 text-left">
                  <button
                    onClick={() => handleSort('pnl')}
                    className="flex items-center transition-colors hover:text-emerald-400"
                  >
                    <Text size="tiny" color="muted" className="font-semibold uppercase">
                      P&L
                    </Text>
                    <SortIcon field="pnl" />
                  </button>
                </th>
                <th className="px-4 py-3 text-left">
                  <button
                    onClick={() => handleSort('holdingSince')}
                    className="flex items-center transition-colors hover:text-emerald-400"
                  >
                    <Text size="tiny" color="muted" className="font-semibold uppercase">
                      Held For
                    </Text>
                    <SortIcon field="holdingSince" />
                  </button>
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedHoldings.map((holding) => {
                const pnl = calculatePnL(holding);
                const pnlPercent = (holding.currentPrice - holding.entryPrice) / holding.entryPrice;

                return (
                  <tr
                    key={holding.symbol}
                    className="border-b border-white/5 transition-colors last:border-0 hover:bg-white/5"
                  >
                    <td className="px-4 py-3">
                      <Text as="span" className="font-mono">
                        {holding.symbol}
                      </Text>
                    </td>
                    <td className="px-4 py-3">
                      <Text as="span">{holding.shares}</Text>
                    </td>
                    <td className="px-4 py-3">
                      <Number value={holding.entryPrice} format="currency" />
                    </td>
                    <td className="px-4 py-3">
                      <Number value={holding.currentPrice} format="currency" />
                    </td>
                    <td className="px-4 py-3">
                      <div>
                        <Number value={pnl} format="currency" />
                        <div className="opacity-60">
                          <Number value={pnlPercent} format="percent" size="default" />
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <Text as="span" color="muted">
                        {getHoldingDuration(holding.holdingSince)}
                      </Text>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 