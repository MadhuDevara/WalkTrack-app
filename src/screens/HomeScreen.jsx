import { TYPE } from '../theme.js';
import {
  StepRing, StatCard, AppBar, IconButton, SectionHeader, Card, Sparkline,
} from '../atoms.jsx';
import {
  IconBell, IconMap, IconFlame, IconClock, IconFire, IconMoon,
  IconDroplet, IconHeart, IconLeaf,
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

export function HomeScreen({ tweaks, theme, nav, stepsHistory = [] }) {
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

  const hourly = [120, 0, 0, 0, 0, 0, 80, 340, 920, 540, 380, 720, 880, 460, 290, 540, 820, 1100, 540, 260, 80, 0, 0, 0];
  const hourlyShown = hourly.slice(0, 18);

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
            <IconButton theme={theme} variant="ghost"><IconBell size={18} color={theme.text} /></IconButton>
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
          <StatCard theme={theme} label="Streak" value={28} unit="days"
            sub="🔥 personal best"
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
        <SectionHeader theme={theme} title="Activity by hour" action="Trends →" />
        <Card theme={theme} padding={16}>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 3, height: 64 }}>
            {hourlyShown.map((v, i) => {
              const max = Math.max(...hourlyShown);
              const h = (v / max) * 64;
              const isNow = i === 14;
              return (
                <div key={i} style={{ flex: 1, height: '100%', display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
                  <div style={{
                    width: '70%', height: Math.max(2, h), borderRadius: 2,
                    background: isNow ? theme.accent : (v > 0 ? theme.accentDim : theme.borderStrong),
                    opacity: isNow ? 1 : (v > 0 ? 0.55 : 1),
                  }} />
                </div>
              );
            })}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, ...TYPE.mono, fontSize: 9.5, color: theme.textMuted }}>
            <span>6a</span><span>9a</span><span>12p</span><span>3p</span><span>now</span>
          </div>
        </Card>
      </div>

      {showWeightPanel && (
        <div style={{ padding: '20px 16px 0' }}>
          <SectionHeader theme={theme} title="Weight loss" action="Open →" />
          <Card theme={theme} padding={0} onClick={() => nav('weight')} style={{ overflow: 'hidden' }}>
            <div style={{ padding: '16px 16px 14px', display: 'grid', gridTemplateColumns: '1fr auto', gap: 12, alignItems: 'center' }}>
              <div>
                <div style={{ ...TYPE.sans, fontSize: 11, letterSpacing: '0.16em', textTransform: 'uppercase', color: theme.textMuted }}>Down this week</div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginTop: 4 }}>
                  <span style={{ ...TYPE.display, fontSize: 32, color: theme.text }}>−1.2</span>
                  <span style={{ ...TYPE.mono, fontSize: 12, color: theme.textDim }}>{tweaks.metric ? 'kg' : 'lb'}</span>
                </div>
                <div style={{ ...TYPE.sans, fontSize: 12, color: theme.textDim, marginTop: 2 }}>
                  68.4{tweaks.metric ? 'kg' : 'lb'} · 9.6 to goal
                </div>
              </div>
              <Sparkline data={[72, 71.8, 71.4, 71.6, 70.9, 70.2, 69.6, 68.4]} width={120} height={48} color={theme.accent} theme={theme} />
            </div>
            <div style={{ borderTop: `1px solid ${theme.border}`, padding: '10px 16px', display: 'flex', justifyContent: 'space-between', ...TYPE.mono, fontSize: 11, color: theme.textDim }}>
              <span><span style={{ color: theme.accent }}>+312</span> deficit today</span>
              <span>{tweaks.metric ? '4.0kg' : '8.8lb'} since Apr 1</span>
            </div>
          </Card>
        </div>
      )}

      <div style={{ padding: '20px 16px 0' }}>
        <SectionHeader theme={theme} title="Today's wellness" />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
          <WellnessChip theme={theme} icon={<IconMoon size={16} />} value="7h 12m" label="Sleep" />
          <WellnessChip theme={theme} icon={<IconDroplet size={16} />} value="5/8" label="Water" tone="active" />
          <WellnessChip theme={theme} icon={<IconHeart size={16} />} value="64" label="Resting bpm" />
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
