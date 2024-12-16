import { Text } from '@/components/ui/typography/Text';

type StatusColor = 'green' | 'red' | 'yellow' | 'blue';

interface StatusProps {
  color: StatusColor;
  label: string;
  info: string;
  animate?: boolean;
}

export function Status({ color, label, info, animate = false }: StatusProps) {
  const getColorClass = (color: StatusColor): string => {
    switch (color) {
      case 'green':
        return 'bg-emerald-400';
      case 'red':
        return 'bg-red-500';
      case 'yellow':
        return 'bg-yellow-400';
      case 'blue':
        return 'bg-blue-400';
    }
  };

  const [infoLabel, infoValue] = info.includes('\n') ? info.split('\n') : ['', info];

  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2">
        <div
          className={`h-2 w-2 rounded-full ${getColorClass(color)} ${
            animate ? 'animate-pulse' : ''
          }`}
        />
        <Text as="span" size="tiny" color="muted" className="uppercase">
          {label}
        </Text>
      </div>
      <div className="flex flex-col items-start">
        {infoLabel && (
          <Text as="span" size="tiny" color="muted">
            {infoLabel}
          </Text>
        )}
        <Text as="span" size="tiny" color="subtle">
          {infoValue}
        </Text>
      </div>
    </div>
  );
} 