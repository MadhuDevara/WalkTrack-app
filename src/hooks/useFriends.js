import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase.js';

export function useFriends(userId) {
  const [friends, setFriends] = useState([]);
  const [pending, setPending] = useState([]);
  const [loading, setLoading] = useState(false);

  const today = new Date().toISOString().slice(0, 10);

  const load = useCallback(async () => {
    if (!userId) return;
    setLoading(true);

    const { data: friendships } = await supabase
      .from('friendships')
      .select('requester_id, addressee_id')
      .eq('status', 'accepted')
      .or(`requester_id.eq.${userId},addressee_id.eq.${userId}`);

    const friendIds = (friendships ?? []).map((f) =>
      f.requester_id === userId ? f.addressee_id : f.requester_id,
    );

    const { data: reqs } = await supabase
      .from('friendships')
      .select('id, requester_id, profiles:requester_id(display_name)')
      .eq('addressee_id', userId)
      .eq('status', 'pending');
    setPending(reqs ?? []);

    if (friendIds.length === 0) {
      setFriends([]);
      setLoading(false);
      return;
    }

    const { data: profiles } = await supabase
      .from('profiles')
      .select('id, display_name')
      .in('id', friendIds);

    const { data: stepsRows } = await supabase
      .from('steps_log')
      .select('user_id, steps')
      .in('user_id', friendIds)
      .eq('date', today);

    const stepsMap = Object.fromEntries((stepsRows ?? []).map((r) => [r.user_id, r.steps]));

    const list = (profiles ?? []).map((p) => ({
      id: p.id,
      name: p.display_name || 'Friend',
      steps: stepsMap[p.id] ?? 0,
      you: false,
    }));

    const { data: myStepsRow } = await supabase
      .from('steps_log')
      .select('steps')
      .eq('user_id', userId)
      .eq('date', today)
      .single();

    const mySteps = myStepsRow?.steps ?? 0;
    list.push({ id: userId, name: 'You', steps: mySteps, you: true });

    list.sort((a, b) => b.steps - a.steps);
    list.forEach((f, i) => {
      f.rank = i + 1;
    });

    setFriends(list);
    setLoading(false);
  }, [userId, today]);

  useEffect(() => {
    load();
  }, [load]);

  async function sendFriendRequest(username) {
    const { data: target } = await supabase
      .from('profiles')
      .select('id')
      .ilike('username', username.trim())
      .single();

    if (!target) return { error: 'User not found. Ask them to set a username in their profile.' };

    const { error } = await supabase.from('friendships').insert({
      requester_id: userId,
      addressee_id: target.id,
    });
    return { error: error?.message };
  }

  async function acceptRequest(friendshipId) {
    await supabase.from('friendships').update({ status: 'accepted' }).eq('id', friendshipId);
    await load();
  }

  async function declineRequest(friendshipId) {
    await supabase.from('friendships').update({ status: 'declined' }).eq('id', friendshipId);
    setPending((prev) => prev.filter((r) => r.id !== friendshipId));
  }

  return {
    friends,
    pending,
    loading,
    sendFriendRequest,
    acceptRequest,
    declineRequest,
    reload: load,
  };
}
