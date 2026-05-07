import { TYPE } from '../theme.js';
import { AppBar, IconButton, Card, SectionHeader } from '../atoms.jsx';
import { IconPlus, IconTrophy } from '../icons.jsx';

export function FriendsScreen({ tweaks, theme }) {
  const friends = [
    { rank: 1, name: 'Priya R.', steps: 18420, you: false, change: 0 },
    { rank: 2, name: 'Ben L.', steps: 14310, you: false, change: 1 },
    { rank: 3, name: 'You', steps: 12842, you: true, change: 2 },
    { rank: 4, name: 'Carla M.', steps: 11920, you: false, change: -1 },
    { rank: 5, name: 'Sam O.', steps: 10210, you: false, change: 0 },
    { rank: 6, name: 'Dev K.', steps: 8940, you: false, change: -2 },
    { rank: 7, name: 'Asha T.', steps: 7180, you: false, change: 0 },
  ];

  return (
    <div style={{ background: theme.bg, color: theme.text, minHeight: '100%', paddingBottom: 24 }}>
      <AppBar theme={theme} large title="Friends" subtitle="Weekly challenge"
        trailing={<IconButton theme={theme} variant="soft"><IconPlus size={16} color={theme.text} /></IconButton>}
      />

      <div style={{ padding: '0 16px 14px' }}>
        <Card theme={theme} padding={0} style={{ overflow: 'hidden', background: `linear-gradient(135deg, ${theme.accent}, ${theme.accentDim})`, border: 'none' }}>
          <div style={{ padding: '16px 18px', color: theme.bg }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ ...TYPE.sans, fontSize: 11, letterSpacing: '0.16em', textTransform: 'uppercase', opacity: 0.75 }}>Active challenge</div>
                <div style={{ ...TYPE.display, fontSize: 22, marginTop: 4 }}>May Mileage</div>
                <div style={{ ...TYPE.sans, fontSize: 12, opacity: 0.85, marginTop: 2 }}>3 days left · 7 friends competing</div>
              </div>
              <div style={{ width: 44, height: 44, borderRadius: '50%', background: theme.bg, color: theme.accent, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <IconTrophy size={20} />
              </div>
            </div>
            <div style={{ marginTop: 14, height: 4, background: 'rgba(0,0,0,0.18)', borderRadius: 2 }}>
              <div style={{ width: '64%', height: '100%', background: theme.bg, borderRadius: 2, opacity: 0.9 }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6, ...TYPE.mono, fontSize: 11, opacity: 0.85 }}>
              <span>192,400 / 300,000</span>
              <span>64%</span>
            </div>
          </div>
        </Card>
      </div>

      <div style={{ padding: '0 16px 16px' }}>
        <SectionHeader theme={theme} title="Today's podium" />
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, justifyContent: 'center', padding: '12px 0 4px' }}>
          {[friends[1], friends[0], friends[2]].map((f, i) => {
            const place = [2, 1, 3][i];
            const heights = { 1: 92, 2: 70, 3: 56 };
            return (
              <div key={f.rank} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, maxWidth: 90 }}>
                <div style={{
                  width: 44, height: 44, borderRadius: '50%',
                  background: place === 1 ? theme.accent : theme.surfaceAlt,
                  color: place === 1 ? theme.bg : theme.text,
                  border: `2px solid ${place === 1 ? theme.warm : theme.borderStrong}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  ...TYPE.sans, fontSize: 14, fontWeight: 600,
                }}>{f.name[0]}</div>
                <div style={{ ...TYPE.sans, fontSize: 11, color: theme.text, textAlign: 'center', fontWeight: 500, maxWidth: 80, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {f.you ? 'You' : f.name}
                </div>
                <div style={{ ...TYPE.mono, fontSize: 11, color: theme.textDim }}>{(f.steps / 1000).toFixed(1)}k</div>
                <div style={{
                  width: '100%', height: heights[place],
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

      <div style={{ padding: '0 16px' }}>
        <SectionHeader theme={theme} title="Leaderboard · today" action="Friends · All" />
        <Card theme={theme} padding={0}>
          {friends.map((f, i) => (
            <div key={f.rank} style={{
              display: 'grid', gridTemplateColumns: '28px 36px 1fr 80px',
              gap: 10, alignItems: 'center', padding: '12px 14px',
              borderTop: i === 0 ? 'none' : `1px solid ${theme.border}`,
              background: f.you ? theme.accentSoft : 'transparent',
            }}>
              <div style={{ ...TYPE.mono, fontSize: 13, color: f.rank <= 3 ? theme.accent : theme.textMuted, fontWeight: f.rank <= 3 ? 600 : 400 }}>{f.rank}</div>
              <div style={{ width: 32, height: 32, borderRadius: '50%', background: f.you ? theme.accent : theme.surfaceAlt, color: f.you ? theme.bg : theme.text, display: 'flex', alignItems: 'center', justifyContent: 'center', ...TYPE.sans, fontSize: 12, fontWeight: 600 }}>{f.name[0]}</div>
              <div>
                <div style={{ ...TYPE.sans, fontSize: 13, color: theme.text, fontWeight: f.you ? 600 : 500 }}>{f.name}</div>
                <div style={{ ...TYPE.mono, fontSize: 10, color: theme.textMuted, marginTop: 1 }}>
                  {Math.round(f.steps * 0.00076)} km · {Math.round(f.steps * 0.04)} kcal
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ ...TYPE.mono, fontSize: 13, color: theme.text }}>{f.steps.toLocaleString()}</div>
                {f.change !== 0 && (
                  <div style={{ ...TYPE.mono, fontSize: 10, marginTop: 1, color: f.change > 0 ? theme.accent : theme.rose, display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 2 }}>
                    {f.change > 0 ? '↑' : '↓'} {Math.abs(f.change)}
                  </div>
                )}
              </div>
            </div>
          ))}
        </Card>
      </div>

      <div style={{ padding: '20px 16px 0' }}>
        <SectionHeader theme={theme} title="Activity feed" />
        <Card theme={theme} padding={0}>
          {[
            { who: 'Priya R.', what: 'just hit 18k steps 🌿', when: '12m' },
            { who: 'Ben L.', what: 'completed Marathon Month', when: '2h' },
            { who: 'Carla M.', what: 'added you to "May Mileage"', when: '5h' },
          ].map((a, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', borderTop: i === 0 ? 'none' : `1px solid ${theme.border}` }}>
              <div style={{ width: 32, height: 32, borderRadius: '50%', background: theme.surfaceAlt, color: theme.text, display: 'flex', alignItems: 'center', justifyContent: 'center', ...TYPE.sans, fontSize: 12, fontWeight: 600 }}>{a.who[0]}</div>
              <div style={{ flex: 1, ...TYPE.sans, fontSize: 13, color: theme.text }}>
                <strong style={{ fontWeight: 600 }}>{a.who}</strong>
                <span style={{ color: theme.textDim, fontWeight: 400 }}> {a.what}</span>
              </div>
              <div style={{ ...TYPE.mono, fontSize: 11, color: theme.textMuted }}>{a.when}</div>
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
}
