import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

interface Position {
  symbol: string;
  qty: number;
  cost_basis: number;
  current_price: number;
  unrealized_plpc: number;
  created_at: string;
}

export function usePositions() {
  const [positions, setPositions] = useState<Position[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Function to fetch positions
    async function fetchPositions() {
      try {
        const { data, error: fetchError } = await supabase
          .from('positions_snapshot')
          .select('symbol, qty, cost_basis, current_price, unrealized_plpc, created_at');

        if (fetchError) {
          setError(fetchError);
          return;
        }

        setPositions(data || []);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch positions data'));
      } finally {
        setLoading(false);
      }
    }

    // Initial fetch
    fetchPositions();

    // Set up real-time subscription for updates
    const subscription = supabase
      .channel('positions_snapshot_changes')
      .on(
        'postgres_changes',
        {
          event: '*', // Listen for all changes (INSERT, UPDATE, DELETE)
          schema: 'public',
          table: 'positions_snapshot',
        },
        () => {
          // Refetch all positions when any change occurs
          fetchPositions();
        }
      )
      .subscribe();

    // Cleanup subscription
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return {
    positions,
    loading,
    error
  };
} 