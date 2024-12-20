import { Text } from '@/components/ui/typography/Text';
import { Status } from '@/components/ui/Status';
import { useClock } from '@/hooks/useClock';
import { useEffect, useState } from 'react';

function getTimeUntil(targetDate: string): string {
  const now = new Date();
  const target = new Date(targetDate);
  const diff = target.getTime() - now.getTime();

  if (diff <= 0) return "0h 0m 0s";

  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  return `${hours}h ${minutes}m ${seconds}s`;
}

interface HeaderProps {
  botStatus: {
    status: 'ACTIVE' | 'INACTIVE';
    lastActive: string;
    message: string;
  };
}

export function Header({ botStatus }: HeaderProps) {
  const { clock, loading, error } = useClock();
  const [countdown, setCountdown] = useState<string>("");

  useEffect(() => {
    if (!clock) return;

    const updateCountdown = () => {
      const targetTime = clock.is_open ? clock.next_close : clock.next_open;
      setCountdown(getTimeUntil(targetTime));
    };

    // Initial update
    updateCountdown();

    // Update every second
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, [clock]);

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <svg
            viewBox="0 0 24 24"
            className="h-9 w-9 text-emerald-400"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8.25 3v1.5M4.5 8.25H3m18 0h-1.5M4.5 12H3m18 0h-1.5m-15 3.75H3m18 0h-1.5M8.25 19.5V21M12 3v1.5m0 15V21m3.75-18v1.5m0 15V21m-9-1.5h10.5a2.25 2.25 0 002.25-2.25V6.75a2.25 2.25 0 00-2.25-2.25H6.75A2.25 2.25 0 004.5 6.75v10.5a2.25 2.25 0 002.25 2.25zm.75-12h9v9h-9v-9z"
            />
          </svg>
          <Text
            size="body-lg"
            className="font-mono text-xl font-semibold uppercase tracking-[.25em] text-emerald-400"
          >
            Warren
          </Text>
        </div>
        <div className="pl-2">
          <Status
            color={botStatus.status === 'ACTIVE' ? 'green' : 'red'}
            label={botStatus.status === 'ACTIVE' ? 'Online' : 'Offline'}
            info={botStatus.message}
            animate={botStatus.status === 'ACTIVE'}
          />
        </div>
      </div>
      <div className="flex flex-col justify-center items-end gap-1">
        {loading ? (
          <Status
            color="yellow"
            label="Loading"
            info="Fetching market status..."
            animate={true}
          />
        ) : error ? (
          <Status
            color="red"
            label="Error"
            info="Failed to fetch market status"
            animate={false}
          />
        ) : clock ? (
          <>
            <Status
              color={clock.is_open ? 'green' : 'red'}
              label={clock.is_open ? 'Market Open' : 'Market Closed'}
              info=""
              animate={clock.is_open}
            />
            <Text size="tiny" color="subtle" className="italic">
              {clock.is_open ? 'Closes' : 'Opens'} in {countdown}
            </Text>
          </>
        ) : (
          <Status
            color="yellow"
            label="Unknown"
            info="Market status unavailable"
            animate={false}
          />
        )}
      </div>
    </div>
  );
} 