import { useState } from 'react';
import { TYPE } from '../theme.js';
import {
  StepRing, StatCard, AppBar, IconButton, SectionHeader, Card, Sparkline,
} from '../atoms.jsx';
import {
  IconBell, IconMap, IconFlame, IconClock, IconFire, IconMoon,
  IconDroplet, IconHeart, IconLeaf, IconX,
} from '../icons.jsx';

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

function getTodayLabel() {
  return new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
}

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

export function HomeScreen({ tweaks, theme, nav, stepsHistory = [], weightEntries = [] }) {
  const [showNotif, setShowNotif] = useState(false);
  const { currentSteps, stepGoal, metric, showWeightPanel, userName } = tweaks;
  const displayName = userName || 'there';
  const initial = displayName[0].toUpperCase();
  const distanceKm = (currentSteps * 0.00076).toFixed(2);
  const calories = Math.round(currentSteps * 0.04);
  const minutes = Math.round(currentSteps / 110);
  const remaining = Math.max(0, stepGoal - currentSteps);

  const weeklyReal = stepsHistory.slice(-7).map((row) => row.steps ?? 0);
  const weeklyAvg = weeklyReal.length > 0
    ? Math.round(weeklyReal.reduce((sum, s) => sum + s, 0) / weeklyReal.length)
    : null;

  const streak = computeStreak(stepsHistory, stepGoal);

  const recentWeight = weightEntries.length >= 2 ? weightEntries[weightEntries.length - 1].weight_kg : null;
  const weekAgoWeight = weightEntries.length >= 2
    ? weightEntries[Math.max(0, weightEntries.length - 8)].weight_kg
    : null;
  const weightDelta = (recentWeight != null && weekAgoWeight != null)
    ? (recentWeight - weekAgoWeight).toFixed(1)
    : null;
  const weightSparkline = weightEntries.slice(-8).map(e => e.weight_kg);

  return (
    <div style={{ background: theme.bg, color: theme.text, minHeight: '100%', paddingBottom: 24 }}>
      <AppBar
        theme={theme}
        leading={
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ ...TYPE.sans, fontSize: 11, letterSpacing: '0.18em', color: theme.textDim, textTransform: 'uppercase' }}>
              {getTodayLabel()}
            </span>
            <span style={{ ...TYPE.serif, fontSize: 20, color: theme.text, fontStyle: 'italic' }}>
              {getGreeting()}, {displayName}
            </span>
          </div>
        }
        trailing={
          <>
            <IconButton theme={theme} variant="ghost" onClick={() => setShowNotif(v => !v)}><IconBell size={18} color={theme.text} /></IconButton>
            <IconButton theme={theme} variant="soft" onClick={() => nav('profile')}>
              <div style={{
                width: 28, height: 28, borderRadius: '50%',
                background: `linear-gradient(135deg, ${theme.accent}, ${theme.warm})`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                ...TYPE.sans, fontSize: 12, fontWeight: 600, color: theme.bg,
              }}>{initial}</div>
            </IconButton>
          </>
        }
      />

      <div style={{ display: 'flex', justifyContent: 'center', padding: '8px 0 16px' }}>
        <StepRing steps={currentSteps} goal={stepGoal} theme={theme} size={278} />
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', padding: '0 22px 18px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, ...TYPE.serif, fontSize: 14, color: theme.textDim, fontStyle: 'italic', textAlign: 'center' }}>
          <IconLeaf size={14} color={theme.accent} />
          {remaining > 0
            ? <span>{remaining.toLocaleString()} steps to go — about {Math.round(remaining / 110)} min walk</span>
            : <span>Goal reached. Keep moving, gently.</span>}
        </div>
      </div>

      <div style={{ padding: '0 16px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <StatCard theme={theme} label="Distance"
            value={metric ? distanceKm : (distanceKm * 0.621371).toFixed(2)}
            unit={metric ? 'km' : 'mi'} sub={weeklyAvg ? `avg ${weeklyAvg.toLocaleString()} steps` : 'syncing...'}
            icon={<IconMap size={16} />} />
          <StatCard theme={theme} label="Calories" value={calories} unit="kcal"
            sub={`${Math.round(calories * 0.6)} active`}
            icon={<IconFlame size={16} color={theme.warm} />} accent={theme.warm} />
          <StatCard theme={theme} label="Active Min" value={minutes} unit="min"
            sub={`${Math.max(0, 60 - minutes)} below target`}
            icon={<IconClock size={16} />} />
          <StatCard theme={theme} label="Streak" value={streak} unit="days"
            sub={streak > 0 ? '🔥 keep it up!' : 'Start today!'}
            icon={<IconFire size={16} color={theme.warm} />} accent={theme.warm} />
        </div>
      </div>

      <div style={{ padding: '14px 16px 0' }}>
        <Card theme={theme} padding={0} style={{
          background: `linear-gradient(135deg, ${theme.accent}, ${theme.accentDim})`,
          border: 'none', overflow: 'hidden', position: 'relative',
        }} onClick={() => nav('walk')}>
          <div style={{ padding: '16px 18px', color: theme.bg, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ ...TYPE.sans, fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', opacity: 0.75 }}>Tap to start</div>
              <div style={{ ...TYPE.display, fontSize: 22, marginTop: 2 }}>Begin a walk</div>
              <div style={{ ...TYPE.sans, fontSize: 12, opacity: 0.8, marginTop: 2 }}>GPS · pace · live coaching</div>
            </div>
            <div style={{ width: 52, height: 52, borderRadius: '50%', background: theme.bg, color: theme.accent, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width={22} height={22} viewBox="0 0 24 24" fill="currentColor" stroke="none">
                <path d="M7 5l12 7-12 7V5z" />
              </svg>
            </div>
          </div>
        </Card>
      </div>

      <div style={{ padding: '20px 16px 0' }}>
        <SectionHeader theme={theme} title="Weekly steps" action="Trends →" onAction={() => nav('history')} />
        <Card theme={theme} padding={16}>
          {weeklyReal.length > 0 ? (
            <>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: 3, height: 64 }}>
                {weeklyReal.map((v, i) => {
                  const max = Math.max(...weeklyReal, 1);
                  const h = (v / max) * 64;
                  const isToday = i === weeklyReal.length - 1;
                  return (
                    <div key={i} style={{ flex: 1, height: '100%', display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
                      <div style={{
                        width: '70%', height: Math.max(2, h), borderRadius: 2,
                        background: isToday ? theme.accent : (v >= stepGoal ? theme.accentDim : theme.borderStrong),
                        opacity: isToday ? 1 : 0.75,
                      }} />
                    </div>
                  );
                })}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, ...TYPE.mono, fontSize: 9.5, color: theme.textMuted }}>
                {weeklyReal.map((_, i) => {
                  const d = new Date(Date.now() - (weeklyReal.length - 1 - i) * 86400_000);
                  return <span key={i}>{d.toLocaleDateString('en', { weekday: 'short' }).slice(0, 1)}</span>;
                })}
              </div>
            </>
          ) : (
            <div style={{ height: 64, display: 'flex', alignItems: 'center', justifyContent: 'center', ...TYPE.sans, fontSize: 12, color: theme.textMuted }}>
              Walk today to see your weekly chart
            </div>
          )}
        </Card>
      </div>

      {showWeightPanel && (
        <div style={{ padding: '20px 16px 0' }}>
          <SectionHeader theme={theme} title="Weight loss" action="Open →" onAction={() => nav('weight')} />
          <Card theme={theme} padding={0} onClick={() => nav('weight')} style={{ overflow: 'hidden' }}>
            {recentWeight != null ? (
              <>
                <div style={{ padding: '16px 16px 14px', display: 'grid', gridTemplateColumns: '1fr auto', gap: 12, alignItems: 'center' }}>
                  <div>
                    <div style={{ ...TYPE.sans, fontSize: 11, letterSpacing: '0.16em', textTransform: 'uppercase', color: theme.textMuted }}>
                      {weightDelta !== null && parseFloat(weightDelta) < 0 ? 'Down this week' : 'This week'}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginTop: 4 }}>
                      <span style={{ ...TYPE.display, fontSize: 32, color: theme.text }}>
                        {weightDelta !== null ? (parseFloat(weightDelta) <= 0 ? '' : '+') + weightDelta : '—'}
                      </span>
                      <span style={{ ...TYPE.mono, fontSize: 12, color: theme.textDim }}>{tweaks.metric ? 'kg' : 'lb'}</span>
                    </div>
                    <div style={{ ...TYPE.sans, fontSize: 12, color: theme.textDim, marginTop: 2 }}>
                      {tweaks.metric ? recentWeight.toFixed(1) : (recentWeight * 2.20462).toFixed(1)}{tweaks.metric ? ' kg' : ' lb'} current
                    </div>
                  </div>
                  {weightSparkline.length >= 2 && (
                    <Sparkline data={weightSparkline} width={120} height={48} color={theme.accent} theme={theme} />
                  )}
                </div>
              </>
            ) : (
              <div style={{ padding: '20px 16px', textAlign: 'center', ...TYPE.sans, fontSize: 13, color: theme.textDim }}>
                Log your first weight to see progress
              </div>
            )}
          </Card>
        </div>
      )}

      <div style={{ padding: '20px 16px 0' }}>
        <SectionHeader theme={theme} title="Today's wellness" />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
          <WellnessChip theme={theme} icon={<IconMoon size={16} />} value="—" label="Sleep" />
          <WellnessChip theme={theme} icon={<IconDroplet size={16} />} value="—" label="Water" />
          <WellnessChip theme={theme} icon={<IconHeart size={16} />} value="—" label="Heart bpm" />
        </div>
        <div style={{ ...TYPE.sans, fontSize: 11, color: theme.textMuted, marginTop: 8, textAlign: 'center' }}>
          Sleep, water &amp; heart rate tracking coming soon
        </div>
      </div>

      {showNotif && <NotificationsPanel theme={theme} onClose={() => setShowNotif(false)} />}
    </div>
  );
}

function NotificationsPanel({ theme, onClose }) {
  return (
    <div style={{
      position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.45)',
      display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
      zIndex: 50, paddingTop: 56,
    }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{
        background: theme.bg, width: 'calc(100% - 32px)', borderRadius: 18,
        border: `1px solid ${theme.border}`,
        boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
        overflow: 'hidden',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px 10px' }}>
          <span style={{ ...TYPE.sans, fontSize: 14, fontWeight: 600, color: theme.text }}>Notifications</span>
          <IconButton theme={theme} variant="ghost" onClick={onClose}><IconX size={16} color={theme.textDim} /></IconButton>
        </div>
        <div style={{ padding: '8px 16px 20px', textAlign: 'center' }}>
          <div style={{ width: 48, height: 48, borderRadius: '50%', background: theme.surface, border: `1px solid ${theme.border}`, margin: '8px auto 12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <IconBell size={20} color={theme.textDim} />
          </div>
          <div style={{ ...TYPE.sans, fontSize: 13, color: theme.textDim }}>You're all caught up</div>
          <div style={{ ...TYPE.sans, fontSize: 12, color: theme.textMuted, marginTop: 4 }}>Goal alerts and friend activity will appear here</div>
        </div>
      </div>
    </div>
  );
}

function WellnessChip({ theme, icon, value, label, tone }) {
  return (
    <div style={{
      background: theme.surface, border: `1px solid ${theme.border}`,
      borderRadius: 14, padding: '12px 10px',
      display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'flex-start',
    }}>
      <div style={{ color: tone === 'active' ? theme.accent : theme.textDim }}>{icon}</div>
      <div style={{ ...TYPE.display, fontSize: 16, color: theme.text }}>{value}</div>
      <div style={{ ...TYPE.sans, fontSize: 10, letterSpacing: '0.14em', color: theme.textMuted, textTransform: 'uppercase' }}>{label}</div>
    </div>
  );
}
