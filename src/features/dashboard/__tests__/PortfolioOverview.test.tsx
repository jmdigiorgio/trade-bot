import { render, screen } from '@testing-library/react';
import { PortfolioOverview } from '../components/PortfolioOverview';

describe('PortfolioOverview', () => {
  const mockMetrics = {
    paperBalance: 10000.50,
    dailyPnL: 250.75,
    totalPnL: -150.25,
    winRate: 0.65
  };

  it('renders all metrics correctly', () => {
    render(<PortfolioOverview metrics={mockMetrics} />);
    
    expect(screen.getByTestId('paper-balance')).toHaveTextContent('$10,000.50');
    expect(screen.getByTestId('daily-pnl')).toHaveTextContent('$250.75');
    expect(screen.getByTestId('total-pnl')).toHaveTextContent('-$150.25');
    expect(screen.getByTestId('win-rate')).toHaveTextContent('65.0%');
  });

  it('applies correct colors to P&L values', () => {
    render(<PortfolioOverview metrics={mockMetrics} />);
    
    expect(screen.getByTestId('daily-pnl')).toHaveClass('text-green-600');
    expect(screen.getByTestId('total-pnl')).toHaveClass('text-red-600');
  });

  it('shows loading state when isLoading is true', () => {
    render(<PortfolioOverview metrics={mockMetrics} isLoading={true} />);
    
    expect(screen.queryByTestId('paper-balance')).not.toBeInTheDocument();
    expect(screen.getByRole('article')).toHaveClass('animate-pulse');
  });
}); 