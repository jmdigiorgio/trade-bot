import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

interface ClockData {
  is_open: boolean;
  next_open: string;
  next_close: string;
  created_at: string;
}

export function useClock() {
  const [clock, setClock] = useState<ClockData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Function to fetch latest clock data
    async function fetchLatestClock() {
      try {
        const { data, error } = await supabase
          .from('clock_snapshot')
          .select('is_open, next_open, next_close, created_at')
          .order('created_at', { ascending: false })
          .limit(1)
          .single();

        if (error) throw error;
        setClock(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch clock data'));
      } finally {
        setLoading(false);
      }
    }

    // Initial fetch
    fetchLatestClock();

    // Set up real-time subscription for immediate updates
    const subscription = supabase
      .channel('clock_snapshot_changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'clock_snapshot',
        },
        (payload) => {
          setClock(payload.new as ClockData);
        }
      )
      .subscribe();

    // Cleanup subscription
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return { clock, loading, error };
} 