'use client';

import { Text } from '@/components/ui/typography/Text';
import { Status } from '@/components/ui/Status';
import { useSystemStatus } from '@/hooks/useSystemStatus';

export function SystemStatus() {
  const { accountStatus } = useSystemStatus();

  return (
    <div className="space-y-4">
      <div className="grid gap-6 md:grid-cols-2">
        {/* Left Column */}
        <div className="space-y-2">
          <Text size="tiny" color="muted" className="uppercase">
            Account Status
          </Text>
          <div className="flex flex-col gap-1.5">
            <Status
              color={accountStatus.status === 'ACTIVE' ? 'green' : 'red'}
              label="Account"
              info={accountStatus.status === 'ACTIVE' ? 'Active' : 'Inactive'}
              animate={false}
            />
            <Status
              color={!accountStatus.account_blocked ? 'green' : 'red'}
              label="Account Block"
              info={accountStatus.account_blocked ? 'Yes' : 'No'}
              animate={false}
            />
            <Status
              color={!accountStatus.trade_suspended_by_user ? 'green' : 'yellow'}
              label="User Suspended"
              info={accountStatus.trade_suspended_by_user ? 'Yes' : 'No'}
              animate={false}
            />
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-2">
          <Text size="tiny" color="muted" className="uppercase">
            Trading Status
          </Text>
          <div className="flex flex-col gap-1.5">
            <Status
              color={!accountStatus.trading_blocked ? 'green' : 'red'}
              label="Trading"
              info={accountStatus.trading_blocked ? 'Blocked' : 'Allowed'}
              animate={false}
            />
            <Status
              color={!accountStatus.transfers_blocked ? 'green' : 'red'}
              label="Transfers"
              info={accountStatus.transfers_blocked ? 'Blocked' : 'Allowed'}
              animate={false}
            />
            <Status
              color={accountStatus.shorting_enabled ? 'green' : 'yellow'}
              label="Shorting"
              info={accountStatus.shorting_enabled ? 'Enabled' : 'Disabled'}
              animate={false}
            />
          </div>
        </div>
      </div>
      <Text size="tiny" color="muted" className="italic">
        Last updated: {new Date(accountStatus.created_at).toLocaleString()}
      </Text>
    </div>
  );
} 