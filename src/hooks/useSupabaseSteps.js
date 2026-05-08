import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '../lib/supabase.js';

function today() {
  return new Date().toISOString().slice(0, 10);
}

export function useSupabaseSteps(userId, localSteps) {
  const [history, setHistory] = useState([]);
  const saveTimer = useRef(null);

  useEffect(() => {
    if (!userId) return;
    const since = new Date(Date.now() - 365 * 86400_000).toISOString().slice(0, 10);
    supabase
      .from('steps_log')
      .select('date, steps')
      .eq('user_id', userId)
      .gte('date', since)
      .order('date', { ascending: true })
      .then(({ data }) => {
        if (data) setHistory(data);
      });
  }, [userId]);

  const saveSteps = useCallback(
    (steps) => {
      if (!userId) return;
      clearTimeout(saveTimer.current);
      saveTimer.current = setTimeout(async () => {
        await supabase.from('steps_log').upsert(
          { user_id: userId, date: today(), steps, updated_at: new Date().toISOString() },
          { onConflict: 'user_id,date' },
        );
        setHistory((prev) => {
          const d = today();
          const exists = prev.find((r) => r.date === d);
          if (exists) return prev.map((r) => (r.date === d ? { ...r, steps } : r));
          return [...prev, { date: d, steps }];
        });
      }, 2000);
    },
    [userId],
  );

  useEffect(() => {
    if (userId && localSteps > 0) saveSteps(localSteps);
  }, [localSteps, userId, saveSteps]);

  return { history };
}
