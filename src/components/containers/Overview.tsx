import { Text } from '@/components/ui/typography/Text';
import { Number } from '@/components/ui/typography/Number';
import { useAccountBalance } from '@/hooks/useAccountBalance';

export function Overview() {
  const { balance, loading, error } = useAccountBalance();

  if (loading) {
    return (
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2 animate-pulse">
          <div className="h-4 w-16 bg-white/10 rounded" />
          <div className="h-8 w-32 bg-white/10 rounded" />
          <div className="h-4 w-24 bg-white/10 rounded" />
        </div>
        <div className="space-y-2 animate-pulse">
          <div className="h-4 w-16 bg-white/10 rounded" />
          <div className="h-8 w-32 bg-white/10 rounded" />
          <div className="h-4 w-24 bg-white/10 rounded" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-500/20 bg-red-500/10 p-4">
        <Text color="primary" className="text-red-500">Failed to load account balance</Text>
      </div>
    );
  }

  if (!balance) {
    return (
      <div className="rounded-lg border border-yellow-500/20 bg-yellow-500/10 p-4">
        <Text color="primary" className="text-yellow-500">No balance data available</Text>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="grid gap-6 md:grid-cols-2">
        {/* Available Cash */}
        <div className="space-y-2">
          <Text size="tiny" color="muted" className="uppercase">
            Cash
          </Text>
          <Number value={balance.cash} format="currency" size="stat" />
          <Text size="tiny" color="subtle">
            As of {new Date(balance.created_at).toLocaleString()}
          </Text>
        </div>

        {/* Portfolio Value */}
        <div className="space-y-2">
          <Text size="tiny" color="muted" className="uppercase">
            Portfolio
          </Text>
          <Number value={balance.portfolio_value} format="currency" size="stat" />
          <Text size="tiny" color="subtle">
            As of {new Date(balance.created_at).toLocaleString()}
          </Text>
        </div>
      </div>
      <Text size="tiny" color="muted" className="italic">
        Account balances are only updated during market hours.
      </Text>
    </div>
  );
} 