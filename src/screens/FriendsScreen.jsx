import { useState } from 'react';
import { TYPE } from '../theme.js';
import { AppBar, IconButton, Card, SectionHeader } from '../atoms.jsx';
import { IconPlus, IconTrophy } from '../icons.jsx';

export function FriendsScreen({ tweaks, theme, friends = [], pending = [], onSendRequest, onAccept, onDecline, loading }) {
  const [showAdd, setShowAdd] = useState(false);
  const [query, setQuery] = useState('');
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState('');
  const [sendSuccess, setSendSuccess] = useState('');

  async function handleAdd() {
    if (!query.trim()) return;
    setSending(true);
    setSendError('');
    setSendSuccess('');
    const { error } = await onSendRequest(query.trim());
    if (error) setSendError(error);
    else { setSendSuccess('Friend request sent!'); setQuery(''); }
    setSending(false);
  }

  const top3 = friends.slice(0, 3);
  const podiumOrder = top3.length >= 3 ? [top3[1], top3[0], top3[2]] : top3;

  return (
    <div style={{ background: theme.bg, color: theme.text, minHeight: '100%', paddingBottom: 24 }}>
      <AppBar theme={theme} large title="Friends" subtitle="Weekly challenge"
        trailing={<IconButton theme={theme} variant="soft" onClick={() => setShowAdd(s => !s)}><IconPlus size={16} color={theme.text} /></IconButton>}
      />

      {showAdd && (
        <div style={{ padding: '0 16px 14px' }}>
          <Card theme={theme} padding={16}>
            <div style={{ ...TYPE.sans, fontSize: 12, color: theme.textDim, marginBottom: 10 }}>
              Enter a friend's <strong style={{ color: theme.text }}>username</strong> to send a request.
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <input
                value={query} onChange={e => setQuery(e.target.value)}
                placeholder="username"
                style={{
                  flex: 1, padding: '10px 12px', borderRadius: 10,
                  background: theme.surface, border: `1px solid ${theme.border}`,
                  color: theme.text, ...TYPE.sans, fontSize: 13, outline: 'none',
                }}
              />
              <button onClick={handleAdd} disabled={sending || !query.trim()} style={{
                padding: '10px 16px', borderRadius: 10, border: 'none',
                background: theme.accent, color: theme.bg,
                ...TYPE.sans, fontSize: 13, fontWeight: 600,
                cursor: sending ? 'not-allowed' : 'pointer',
                opacity: !query.trim() || sending ? 0.6 : 1,
              }}>
                {sending ? '…' : 'Add'}
              </button>
            </div>
            {sendError && <div style={{ ...TYPE.sans, fontSize: 12, color: '#ef4444', marginTop: 8 }}>{sendError}</div>}
            {sendSuccess && <div style={{ ...TYPE.sans, fontSize: 12, color: theme.accent, marginTop: 8 }}>{sendSuccess}</div>}
          </Card>
        </div>
      )}

      {pending.length > 0 && (
        <div style={{ padding: '0 16px 14px' }}>
          <SectionHeader theme={theme} title="Friend requests" />
          <Card theme={theme} padding={0}>
            {pending.map((req, i) => (
              <div key={req.id} style={{
                display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px',
                borderTop: i === 0 ? 'none' : `1px solid ${theme.border}`,
              }}>
                <div style={{ width: 36, height: 36, borderRadius: '50%', background: theme.surfaceAlt, color: theme.text, display: 'flex', alignItems: 'center', justifyContent: 'center', ...TYPE.sans, fontSize: 14, fontWeight: 600 }}>
                  {(req.profiles?.display_name || '?')[0]}
                </div>
                <div style={{ flex: 1, ...TYPE.sans, fontSize: 13, color: theme.text, fontWeight: 500 }}>
                  {req.profiles?.display_name || 'Someone'}
                </div>
                <button onClick={() => onAccept(req.id)} style={{
                  padding: '6px 12px', borderRadius: 8, border: 'none',
                  background: theme.accent, color: theme.bg, ...TYPE.sans, fontSize: 12, fontWeight: 600, cursor: 'pointer',
                }}>Accept</button>
                <button onClick={() => onDecline(req.id)} style={{
                  padding: '6px 10px', borderRadius: 8, border: `1px solid ${theme.border}`,
                  background: 'transparent', color: theme.textDim, ...TYPE.sans, fontSize: 12, cursor: 'pointer',
                }}>Decline</button>
              </div>
            ))}
          </Card>
        </div>
      )}

      {friends.length >= 2 && (
        <div style={{ padding: '0 16px 16px' }}>
          <SectionHeader theme={theme} title="Today's podium" />
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, justifyContent: 'center', padding: '12px 0 4px' }}>
            {podiumOrder.map((f, i) => {
              if (!f) return null;
              const place = f.rank;
              const heights = { 1: 92, 2: 70, 3: 56 };
              return (
                <div key={f.id} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, maxWidth: 90 }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: '50%',
                    background: f.you ? theme.accent : theme.surfaceAlt,
                    color: f.you ? theme.bg : theme.text,
                    border: `2px solid ${place === 1 ? theme.warm : theme.borderStrong}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    ...TYPE.sans, fontSize: 14, fontWeight: 600,
                  }}>{(f.name || '?')[0]}</div>
                  <div style={{ ...TYPE.sans, fontSize: 11, color: theme.text, textAlign: 'center', fontWeight: 500, maxWidth: 80, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {f.name}
                  </div>
                  <div style={{ ...TYPE.mono, fontSize: 11, color: theme.textDim }}>{(f.steps / 1000).toFixed(1)}k</div>
                  <div style={{
                    width: '100%', height: heights[place] || 56,
                    background: place === 1 ? theme.accent : place === 2 ? theme.surface : theme.surfaceAlt,
                    border: `1px solid ${place === 1 ? theme.accent : theme.border}`,
                    borderRadius: '10px 10px 0 0',
                    display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
                    paddingTop: 8,
                    ...TYPE.serif, fontSize: 22, fontWeight: 500,
                    color: place === 1 ? theme.bg : theme.text,
                  }}>{place}</div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div style={{ padding: '0 16px' }}>
        <SectionHeader theme={theme} title="Leaderboard · today" />
        {loading && (
          <div style={{ ...TYPE.sans, fontSize: 13, color: theme.textDim, textAlign: 'center', padding: '24px 0' }}>
            Loading…
          </div>
        )}
        {!loading && friends.length === 0 && (
          <Card theme={theme} padding={24} style={{ textAlign: 'center' }}>
            <div style={{ ...TYPE.serif, fontSize: 16, fontStyle: 'italic', color: theme.textDim }}>No friends yet</div>
            <div style={{ ...TYPE.sans, fontSize: 12, color: theme.textMuted, marginTop: 6 }}>Tap + to add a friend by username</div>
          </Card>
        )}
        {!loading && friends.length > 0 && (
          <Card theme={theme} padding={0}>
            {friends.map((f, i) => (
              <div key={f.id} style={{
                display: 'grid', gridTemplateColumns: '28px 36px 1fr 80px',
                gap: 10, alignItems: 'center', padding: '12px 14px',
                borderTop: i === 0 ? 'none' : `1px solid ${theme.border}`,
                background: f.you ? theme.accentSoft : 'transparent',
              }}>
                <div style={{ ...TYPE.mono, fontSize: 13, color: f.rank <= 3 ? theme.accent : theme.textMuted, fontWeight: f.rank <= 3 ? 600 : 400 }}>
                  {f.rank}
                </div>
                <div style={{ width: 32, height: 32, borderRadius: '50%', background: f.you ? theme.accent : theme.surfaceAlt, color: f.you ? theme.bg : theme.text, display: 'flex', alignItems: 'center', justifyContent: 'center', ...TYPE.sans, fontSize: 12, fontWeight: 600 }}>
                  {(f.name || '?')[0]}
                </div>
                <div>
                  <div style={{ ...TYPE.sans, fontSize: 13, color: theme.text, fontWeight: f.you ? 600 : 500 }}>{f.name}</div>
                  <div style={{ ...TYPE.mono, fontSize: 10, color: theme.textMuted, marginTop: 1 }}>
                    {Math.round(f.steps * 0.00076)} km · {Math.round(f.steps * 0.04)} kcal
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ ...TYPE.mono, fontSize: 13, color: theme.text }}>{f.steps.toLocaleString()}</div>
                </div>
              </div>
            ))}
          </Card>
        )}
      </div>
    </div>
  );
}
