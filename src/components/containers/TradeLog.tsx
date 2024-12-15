'use client';

import { Text } from '@/components/ui/typography/Text';
import { Number } from '@/components/ui/typography/Number';
import { DateRangeFilter } from '@/components/ui/filters/DateRangeFilter';
import type { FilterValue } from '@/components/ui/filters/DateRangeFilter';
import { useState } from 'react';

interface Trade {
  timestamp: string;
  type: 'BUY' | 'SELL';
  symbol: string;
  shares: number;
  price: number;
  total: number;
  note: string;
}

interface TradeLogProps {
  logs: Trade[];
}

export function TradeLog({ logs }: TradeLogProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(5);
  const [selectedTimeFrame, setSelectedTimeFrame] = useState<FilterValue>('24h');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  const filteredLogs = logs.filter((log) => {
    const logDate = new Date(log.timestamp);
    const now = new Date();

    if (selectedTimeFrame === 'custom' && startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      return logDate >= start && logDate <= end;
    }

    switch (selectedTimeFrame) {
      case '24h':
        return now.getTime() - logDate.getTime() <= 24 * 60 * 60 * 1000;
      case '7d':
        return now.getTime() - logDate.getTime() <= 7 * 24 * 60 * 60 * 1000;
      case '30d':
        return now.getTime() - logDate.getTime() <= 30 * 24 * 60 * 60 * 1000;
      default:
        return true;
    }
  });

  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage);
  const paginatedLogs = filteredLogs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="space-y-4 border-t border-white/5 pt-6">
      <div className="mb-4 flex items-center justify-between">
        <Text size="body-lg" className="font-semibold text-emerald-400">
          Trading Log
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
        />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/10">
              <th className="px-4 py-3 text-left">
                <Text size="tiny" color="muted" className="font-semibold uppercase">
                  Time
                </Text>
              </th>
              <th className="px-4 py-3 text-left">
                <Text size="tiny" color="muted" className="font-semibold uppercase">
                  Action
                </Text>
              </th>
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
                  Price
                </Text>
              </th>
              <th className="px-4 py-3 text-left">
                <Text size="tiny" color="muted" className="font-semibold uppercase">
                  Total
                </Text>
              </th>
              <th className="px-4 py-3 text-left">
                <Text size="tiny" color="muted" className="font-semibold uppercase">
                  Note
                </Text>
              </th>
            </tr>
          </thead>
          <tbody>
            {paginatedLogs.map((log, index) => {
              const timestamp = new Date(log.timestamp);
              const formattedTime = timestamp.toLocaleString('en-US', {
                month: 'short',
                day: 'numeric',
                hour: 'numeric',
                minute: 'numeric',
                hour12: true,
              });

              return (
                <tr
                  key={index}
                  className="border-b border-white/5 transition-colors last:border-0 hover:bg-white/5"
                >
                  <td className="px-4 py-3">
                    <Text as="span" color="muted">
                      {formattedTime}
                    </Text>
                  </td>
                  <td className="px-4 py-3">
                    <Text
                      as="span"
                      className={log.type === 'BUY' ? 'text-emerald-400' : 'text-red-500'}
                    >
                      {log.type}
                    </Text>
                  </td>
                  <td className="px-4 py-3">
                    <Text as="span" className="font-mono">
                      {log.symbol}
                    </Text>
                  </td>
                  <td className="px-4 py-3">
                    <Text as="span">{log.shares}</Text>
                  </td>
                  <td className="px-4 py-3">
                    <Number value={log.price} format="currency" />
                  </td>
                  <td className="px-4 py-3">
                    <Number value={log.total} format="currency" />
                  </td>
                  <td className="px-4 py-3">
                    <Text as="span" color="subtle">
                      {log.note}
                    </Text>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination controls */}
      <div className="flex items-center justify-between border-t border-white/5 pt-4">
        <div className="flex items-center gap-2">
          <Text size="tiny" color="muted">
            Showing {Math.min(itemsPerPage, filteredLogs.length)} of {filteredLogs.length} entries
          </Text>
          <select
            value={itemsPerPage}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
              setItemsPerPage(parseInt(e.target.value, 10));
              setCurrentPage(1);
            }}
            className="rounded border-0 bg-white/5 px-2 py-1 text-xs text-white/60 focus:outline-none focus:ring-1 focus:ring-emerald-400 [&>option]:bg-zinc-900"
          >
            <option value={5}>5 per page</option>
            <option value={10}>10 per page</option>
            <option value={25}>25 per page</option>
            <option value={50}>50 per page</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="rounded p-1 hover:bg-white/5 disabled:opacity-50 disabled:hover:bg-transparent"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <Text size="tiny" color="muted">
            Page {currentPage} of {totalPages}
          </Text>
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="rounded p-1 hover:bg-white/5 disabled:opacity-50 disabled:hover:bg-transparent"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
} 