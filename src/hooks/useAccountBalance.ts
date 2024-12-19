import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { AccountBalance } from '@/types/account';

export function useAccountBalance() {
  const [balance, setBalance] = useState<AccountBalance | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Function to fetch latest balance
    async function fetchLatestBalance() {
      try {
        const { data, error } = await supabase
          .from('overview_snapshot')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(1)
          .single();

        if (error) throw error;
        setBalance(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch balance'));
      } finally {
        setLoading(false);
      }
    }

    // Initial fetch
    fetchLatestBalance();

    // Set up real-time subscription for immediate updates
    const subscription = supabase
      .channel('overview_snapshot_changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'overview_snapshot',
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