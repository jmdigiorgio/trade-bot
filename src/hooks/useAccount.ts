import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

interface AccountBalance {
  cash: number;
  equity: number;
  created_at: string;
}

export function useAccount() {
  const [balance, setBalance] = useState<AccountBalance | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Function to fetch latest balance
    async function fetchLatestBalance() {
      try {
        const { data, error } = await supabase
          .from('account_snapshot')
          .select('cash, equity, created_at')
          .order('created_at', { ascending: false })
          .limit(1)
          .single();

        if (error) throw error;
        setBalance(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch account data'));
      } finally {
        setLoading(false);
      }
    }

    // Initial fetch
    fetchLatestBalance();

    // Set up real-time subscription for immediate updates
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
          setBalance(payload.new as AccountBalance);
        }
      )
      .subscribe();

    // Cleanup subscription
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return { balance, loading, error };
} 