import { Text } from '@/components/ui/typography/Text';

type BotStatus = 'ACTIVE' | 'PAUSED' | 'ERROR' | 'MAINTENANCE';

interface BotStatusCardProps {
  status: BotStatus;
  lastActive: string;
  message: string;
}

export function BotStatusCard({ status, lastActive, message }: BotStatusCardProps) {
  return (
    <div className="flex items-center gap-4">
      <div className="flex flex-col items-end gap-1">
        <div className="flex items-center gap-2">
          <div
            className={`h-2 w-2 rounded-full ${
              status === 'ACTIVE'
                ? 'animate-pulse bg-emerald-400'
                : status === 'PAUSED'
                  ? 'bg-yellow-400'
                  : status === 'MAINTENANCE'
                    ? 'bg-blue-400'
                    : 'bg-red-500'
            }`}
          />
          <Text as="span" size="tiny" color="muted" className="uppercase">
            {status === 'ACTIVE' && 'Online'}
            {status === 'PAUSED' && 'Paused'}
            {status === 'MAINTENANCE' && 'Maintenance'}
            {status === 'ERROR' && 'Error'}
          </Text>
        </div>
        <Text as="span" size="tiny" color="subtle">
          Last active{' '}
          {new Date(lastActive).toLocaleString('en-US', {
            hour: 'numeric',
            minute: 'numeric',
            hour12: true,
          })}
        </Text>
        <Text as="span" size="tiny" color="subtle">
          {message}
        </Text>
      </div>
    </div>
  );
}
