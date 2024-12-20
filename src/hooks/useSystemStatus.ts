import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

interface AccountStatus {
  status: 'ACTIVE' | 'INACTIVE';
  trading_blocked: boolean;
  transfers_blocked: boolean;
  account_blocked: boolean;
  trade_suspended_by_user: boolean;
  shorting_enabled: boolean;
  created_at: string;
}

export function useSystemStatus() {
  const [accountStatus, setAccountStatus] = useState<AccountStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Function to fetch latest status
    async function fetchSystemStatus() {
      try {
        const { data, error: fetchError } = await supabase
          .from('account_snapshot')
          .select('status, trading_blocked, transfers_blocked, account_blocked, trade_suspended_by_user, shorting_enabled, created_at')
          .order('created_at', { ascending: false })
          .limit(1)
          .single();

        if (fetchError) {
          setError(fetchError);
          return;
        }

        if (!data) {
          setError(new Error('No status data available'));
          return;
        }

        setAccountStatus(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch status data'));
      } finally {
        setLoading(false);
      }
    }

    // Initial fetch
    fetchSystemStatus();

    // Set up real-time subscription for updates
    const subscription = supabase
      .channel('account_snapshot_changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'account_snapshot',
        },
        (payload) => {
          if (payload.new) {
            setAccountStatus(payload.new as AccountStatus);
            setError(null);
          }
        }
      )
      .subscribe();

    // Cleanup subscription
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return {
    accountStatus: accountStatus ?? {
      status: 'ACTIVE',
      trading_blocked: false,
      transfers_blocked: false,
      account_blocked: false,
      trade_suspended_by_user: false,
      shorting_enabled: true,
      created_at: new Date().toISOString()
    },
    loading,
    error
  };
} 