import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase.js';

export function useWeight(userId) {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    const since = new Date(Date.now() - 90 * 86400_000).toISOString().slice(0, 10);
    const { data } = await supabase
      .from('weight_log')
      .select('id, date, weight_kg')
      .eq('user_id', userId)
      .gte('date', since)
      .order('date', { ascending: true });
    if (data) setEntries(data);
    setLoading(false);
  }, [userId]);

  useEffect(() => {
    load();
  }, [load]);

  async function logWeight(weightKg) {
    if (!userId) return;
    const date = new Date().toISOString().slice(0, 10);
    const { data, error } = await supabase
      .from('weight_log')
      .insert({ user_id: userId, date, weight_kg: weightKg })
      .select()
      .single();
    if (!error && data) {
      setEntries((prev) => [...prev, data]);
    }
    return error;
  }

  const latest = entries.length ? entries[entries.length - 1].weight_kg : null;
  const oldest = entries.length ? entries[0].weight_kg : null;

  return { entries, latest, oldest, loading, logWeight };
}
