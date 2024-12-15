import { Text } from '@/components/ui/typography/Text';
import { Number } from '@/components/ui/typography/Number';

interface OverviewCardProps {
  availableCash: number;
  investedCapital: number;
  totalPositions: number;
}

export function OverviewCard({
  availableCash,
  investedCapital,
  totalPositions,
}: OverviewCardProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Available Cash */}
      <div className="space-y-2">
        <Text size="tiny" color="muted" className="uppercase">
          Available
        </Text>
        <Number value={availableCash} format="currency" size="stat" />
        <Text size="tiny" color="subtle">
          Ready to deploy
        </Text>
      </div>

      {/* Invested Capital */}
      <div className="space-y-2">
        <Text size="tiny" color="muted" className="uppercase">
          Held
        </Text>
        <Number value={investedCapital} format="currency" size="stat" />
        <Text size="tiny" color="subtle">
          Held across {totalPositions} positions
        </Text>
      </div>
    </div>
  );
}
