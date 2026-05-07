import { TYPE } from '../theme.js';
import { AppBar, IconButton, Card, SectionHeader, LinearProgress } from '../atoms.jsx';
import {
  IconArrowLeft, IconMore, IconFire, IconLeaf, IconShield, IconTrophy,
  IconCrown, IconBolt, IconLock, IconStar, IconScale,
} from '../icons.jsx';

export function AchievementsScreen({ tweaks, theme, nav }) {
  const badges = [
    { id: 1, name: 'Early Riser', desc: '10k before noon', unlocked: true, icon: <IconLeaf size={20} /> },
    { id: 2, name: 'Weekend Warrior', desc: 'Sat + Sun goals', unlocked: true, icon: <IconShield size={20} /> },
    { id: 3, name: 'Marathon Month', desc: '42km in a week', unlocked: true, icon: <IconTrophy size={20} /> },
    { id: 4, name: 'Iron Streak', desc: '30 days straight', unlocked: false, icon: <IconFire size={20} />, progress: 28 / 30 },
    { id: 5, name: 'Half-Million', desc: '500k lifetime steps', unlocked: false, icon: <IconCrown size={20} />, progress: 0.62 },
    { id: 6, name: 'Mountain Goat', desc: '10,000 ft elevation', unlocked: false, icon: <IconBolt size={20} />, progress: 0.34 },
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
              <span style={{ ...TYPE.display, fontSize: 72, color: theme.text, lineHeight: 1 }}>28</span>
              <span style={{ ...TYPE.serif, fontStyle: 'italic', fontSize: 18, color: theme.textDim }}>days strong</span>
            </div>
            <div style={{ ...TYPE.sans, fontSize: 12, color: theme.textDim, marginTop: 6 }}>Personal best · 2 days to a new record</div>
            <div style={{ display: 'flex', gap: 4, marginTop: 16, flexWrap: 'wrap' }}>
              {Array.from({ length: 30 }).map((_, i) => {
                const filled = i < 28;
                const today = i === 27;
                return (
                  <div key={i} style={{
                    width: 10, height: 10, borderRadius: 3,
                    background: today ? theme.warm : (filled ? theme.accent : theme.borderStrong),
                    opacity: filled && !today ? 0.7 : 1,
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
              <div style={{ ...TYPE.sans, fontSize: 11, letterSpacing: '0.16em', color: theme.textMuted, textTransform: 'uppercase' }}>Level 12 · Trailblazer</div>
              <div style={{ ...TYPE.display, fontSize: 18, color: theme.text, marginTop: 2 }}>Next: Pathfinder</div>
            </div>
            <div style={{ ...TYPE.mono, fontSize: 12, color: theme.textDim }}>
              <span style={{ color: theme.accent, fontWeight: 600 }}>2,840</span> / 5,000 XP
            </div>
          </div>
          <LinearProgress value={2840} max={5000} theme={theme} height={6} />
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
          {[
            { date: 'May 5', text: 'Hit 14,820 — new daily record', icon: <IconStar size={14} /> },
            { date: 'May 3', text: 'Lost 4kg since starting', icon: <IconScale size={14} /> },
            { date: 'Apr 30', text: '500,000 lifetime steps', icon: <IconCrown size={14} /> },
          ].map((m, i) => (
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
          ))}
        </Card>
      </div>
    </div>
  );
}
