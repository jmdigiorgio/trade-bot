import { Card } from '@/components/ui/Card';
import { PortfolioOverviewProps } from '../types/portfolio';

export function PortfolioOverview({ metrics, isLoading = false }: PortfolioOverviewProps) {
  if (isLoading) {
    return (
      <Card className="animate-pulse">
        <div className="h-24 bg-gray-200 dark:bg-gray-700 rounded" />
      </Card>
    );
  }

  const formatCurrency = (value: number) => 
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);

  const formatPercentage = (value: number) =>
    new Intl.NumberFormat('en-US', { style: 'percent', minimumFractionDigits: 1 }).format(value);

  return (
    <Card className="bg-white dark:bg-gray-800 shadow-lg">
      <h2 className="text-xl font-semibold mb-6 text-gray-900 dark:text-white">Portfolio Overview</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div className="space-y-2">
          <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Paper Balance</div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white" data-testid="paper-balance">
            {formatCurrency(metrics.paperBalance)}
          </div>
        </div>
        <div className="space-y-2">
          <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Daily P&L</div>
          <div 
            className={`text-2xl font-bold ${
              metrics.dailyPnL >= 0 ? 'text-green-500 dark:text-green-400' : 'text-red-500 dark:text-red-400'
            }`}
            data-testid="daily-pnl"
          >
            {formatCurrency(metrics.dailyPnL)}
          </div>
        </div>
        <div className="space-y-2">
          <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Total P&L</div>
          <div 
            className={`text-2xl font-bold ${
              metrics.totalPnL >= 0 ? 'text-green-500 dark:text-green-400' : 'text-red-500 dark:text-red-400'
            }`}
            data-testid="total-pnl"
          >
            {formatCurrency(metrics.totalPnL)}
          </div>
        </div>
        <div className="space-y-2">
          <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Win Rate</div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white" data-testid="win-rate">
            {formatPercentage(metrics.winRate)}
          </div>
        </div>
      </div>
    </Card>
  );
} 