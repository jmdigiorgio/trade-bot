export interface PortfolioMetrics {
  paperBalance: number;
  dailyPnL: number;
  totalPnL: number;
  winRate: number;
}

export interface PortfolioOverviewProps {
  metrics: PortfolioMetrics;
  isLoading?: boolean;
} 