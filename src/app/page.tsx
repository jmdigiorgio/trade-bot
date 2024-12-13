import { PortfolioOverview } from '@/features/dashboard/components/PortfolioOverview';

export default function Home() {
  // Mock data for development
  const mockMetrics = {
    paperBalance: 10567.89,
    dailyPnL: 234.56,
    totalPnL: 1567.89,
    winRate: 0.67
  };

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          Trading Bot Dashboard
        </h1>
        <div className="grid gap-6">
          <PortfolioOverview metrics={mockMetrics} />
          {/* More components will go here */}
        </div>
      </div>
    </main>
  );
}
