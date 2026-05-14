import { TYPE } from '../theme.js';
import { AppBar, IconButton, Card, SectionHeader, LinearProgress } from '../atoms.jsx';
import {
  IconArrowLeft, IconMore, IconFire, IconLeaf, IconShield, IconTrophy,
  IconCrown, IconBolt, IconLock, IconStar, IconScale,
} from '../icons.jsx';

function computeStreak(history, goal) {
  if (!history.length) return 0;
  const sorted = [...history].sort((a, b) => b.date.localeCompare(a.date));
  let streak = 0;
  for (let i = 0; i < sorted.length; i++) {
    const expected = new Date(Date.now() - i * 86400_000).toISOString().slice(0, 10);
    if (sorted[i].date === expected && sorted[i].steps >= goal) {
      streak++;
    } else {
      break;
    }
  }
  return streak;
}

export function AchievementsScreen({ tweaks, theme, nav, stepsHistory = [] }) {
  const { stepGoal } = tweaks;
  const sorted = [...stepsHistory].sort((a, b) => a.date.localeCompare(b.date));
  const streak = computeStreak(stepsHistory, stepGoal);
  const lifetimeSteps = sorted.reduce((sum, r) => sum + (r.steps ?? 0), 0);
  const bestDay = sorted.reduce((best, r) => (r.steps ?? 0) > (best?.steps ?? 0) ? r : best, null);

  const badges = [
    {
      id: 1, name: 'First Steps', desc: '1,000 steps in a day',
      unlocked: lifetimeSteps >= 1000, icon: <IconLeaf size={20} />,
      progress: Math.min(lifetimeSteps / 1000, 1),
    },
    {
      id: 2, name: '10K Day', desc: '10,000 steps in a day',
      unlocked: stepsHistory.some(r => r.steps >= 10000), icon: <IconTrophy size={20} />,
      progress: Math.min((bestDay?.steps ?? 0) / 10000, 1),
    },
    {
      id: 3, name: 'Iron Streak', desc: '7 days straight',
      unlocked: streak >= 7, icon: <IconFire size={20} />,
      progress: Math.min(streak / 7, 1),
    },
    {
      id: 4, name: 'Month Warrior', desc: '30 day streak',
      unlocked: streak >= 30, icon: <IconShield size={20} />,
      progress: Math.min(streak / 30, 1),
    },
    {
      id: 5, name: 'Half-Million', desc: '500k lifetime steps',
      unlocked: lifetimeSteps >= 500000, icon: <IconCrown size={20} />,
      progress: Math.min(lifetimeSteps / 500000, 1),
    },
    {
      id: 6, name: 'Million Steps', desc: '1M lifetime steps',
      unlocked: lifetimeSteps >= 1000000, icon: <IconBolt size={20} />,
      progress: Math.min(lifetimeSteps / 1000000, 1),
    },
  ];

  return (
    <div style={{ background: theme.bg, color: theme.text, minHeight: '100%', paddingBottom: 24 }}>
      <AppBar theme={theme}
        leading={<IconButton theme={theme} variant="soft" onClick={() => nav('home')}><IconArrowLeft size={16} color={theme.text} /></IconButton>}
        title="Achievements"
        trailing={<IconButton theme={theme} variant="soft"><IconMore size={16} color={theme.text} /></IconButton>}
      />

      <div style={{ padding: '8px 16px 18px' }}>
        <Card theme={theme} padding={0} style={{ overflow: 'hidden', position: 'relative', background: `linear-gradient(135deg, ${theme.surfaceAlt}, ${theme.surface})` }}>
          <div style={{ position: 'absolute', top: -30, right: -30, width: 180, height: 180, borderRadius: '50%', background: theme.warmSoft, filter: 'blur(40px)' }} />
          <div style={{ padding: '22px 22px 18px', position: 'relative' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <IconFire size={18} color={theme.warm} />
              <span style={{ ...TYPE.sans, fontSize: 11, letterSpacing: '0.18em', color: theme.warm, textTransform: 'uppercase', fontWeight: 600 }}>Active streak</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginTop: 6 }}>
              <span style={{ ...TYPE.display, fontSize: 72, color: theme.text, lineHeight: 1 }}>{streak}</span>
              <span style={{ ...TYPE.serif, fontStyle: 'italic', fontSize: 18, color: theme.textDim }}>{streak === 1 ? 'day strong' : 'days strong'}</span>
            </div>
            <div style={{ ...TYPE.sans, fontSize: 12, color: theme.textDim, marginTop: 6 }}>
              {streak >= 30 ? '🏆 30-day goal reached!' : streak > 0 ? `${30 - streak} days to 30-day badge` : 'Walk today to start your streak'}
            </div>
            <div style={{ display: 'flex', gap: 4, marginTop: 16, flexWrap: 'wrap' }}>
              {Array.from({ length: 30 }).map((_, i) => {
                const filled = i < streak;
                const isToday = i === streak - 1;
                return (
                  <div key={i} style={{
                    width: 10, height: 10, borderRadius: 3,
                    background: isToday ? theme.warm : (filled ? theme.accent : theme.borderStrong),
                    opacity: filled && !isToday ? 0.7 : 1,
                  }} />
                );
              })}
            </div>
          </div>
        </Card>
      </div>

      <div style={{ padding: '0 16px' }}>
        <Card theme={theme} padding={18}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 12 }}>
            <div style={{
              width: 52, height: 52, borderRadius: 14,
              background: theme.accentSoft, color: theme.accent,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              border: `1px solid ${theme.borderStrong}`,
            }}>
              <IconLeaf size={24} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ ...TYPE.sans, fontSize: 11, letterSpacing: '0.16em', color: theme.textMuted, textTransform: 'uppercase' }}>
                Lifetime · {lifetimeSteps.toLocaleString()} steps
              </div>
              <div style={{ ...TYPE.display, fontSize: 18, color: theme.text, marginTop: 2 }}>
                {badges.filter(b => b.unlocked).length} / {badges.length} badges unlocked
              </div>
            </div>
          </div>
          <LinearProgress value={badges.filter(b => b.unlocked).length} max={badges.length} theme={theme} height={6} />
        </Card>
      </div>

      <div style={{ padding: '20px 16px 0' }}>
        <SectionHeader theme={theme} title={`Badges · ${badges.filter(b => b.unlocked).length}/${badges.length}`} />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
          {badges.map(b => (
            <div key={b.id} style={{
              background: theme.surface,
              border: `1px solid ${b.unlocked ? theme.borderStrong : theme.border}`,
              borderRadius: 16, padding: '14px 8px 12px',
              textAlign: 'center', opacity: b.unlocked ? 1 : 0.7,
              position: 'relative', overflow: 'hidden',
            }}>
              <div style={{
                width: 48, height: 48, borderRadius: '50%',
                background: b.unlocked ? theme.accentSoft : theme.surfaceAlt,
                color: b.unlocked ? theme.accent : theme.textMuted,
                margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {b.unlocked ? b.icon : <IconLock size={18} />}
              </div>
              <div style={{ ...TYPE.serif, fontSize: 13, color: theme.text, marginTop: 8, fontWeight: 500 }}>{b.name}</div>
              <div style={{ ...TYPE.sans, fontSize: 10, color: theme.textMuted, marginTop: 2, lineHeight: 1.3 }}>{b.desc}</div>
              {!b.unlocked && b.progress != null && (
                <div style={{ marginTop: 8, padding: '0 8px' }}>
                  <div style={{ height: 3, background: theme.borderStrong, borderRadius: 2 }}>
                    <div style={{ width: `${b.progress * 100}%`, height: '100%', background: theme.accent, borderRadius: 2 }} />
                  </div>
                  <div style={{ ...TYPE.mono, fontSize: 9, color: theme.textMuted, marginTop: 4 }}>{Math.round(b.progress * 100)}%</div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div style={{ padding: '20px 16px 0' }}>
        <SectionHeader theme={theme} title="Recent milestones" />
        <Card theme={theme} padding={0}>
          {(() => {
            const milestones = [];
            if (bestDay) {
              milestones.push({
                date: new Date(bestDay.date).toLocaleDateString('en', { month: 'short', day: 'numeric' }),
                text: `Best day — ${bestDay.steps.toLocaleString()} steps`,
                icon: <IconStar size={14} />,
              });
            }
            if (lifetimeSteps >= 500000) {
              milestones.push({ date: '—', text: '500,000 lifetime steps reached', icon: <IconCrown size={14} /> });
            }
            if (streak >= 7) {
              milestones.push({ date: 'Ongoing', text: `${streak}-day active streak`, icon: <IconStar size={14} /> });
            }
            if (milestones.length === 0) {
              return (
                <div style={{ padding: '20px 16px', textAlign: 'center', ...TYPE.sans, fontSize: 13, color: theme.textDim }}>
                  Hit your daily goal to unlock milestones
                </div>
              );
            }
            return milestones.map((m, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '14px 16px',
                borderTop: i === 0 ? 'none' : `1px solid ${theme.border}`,
              }}>
                <div style={{ width: 32, height: 32, borderRadius: '50%', background: theme.accentSoft, color: theme.accent, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {m.icon}
                </div>
                <div style={{ flex: 1, ...TYPE.sans, fontSize: 13, color: theme.text }}>{m.text}</div>
                <div style={{ ...TYPE.mono, fontSize: 11, color: theme.textMuted }}>{m.date}</div>
              </div>
            ));
          })()}
        </Card>
      </div>
    </div>
  );
}
