import { useState, useEffect } from 'react';
import { TYPE } from '../theme.js';
import { AppBar, IconButton, SectionHeader, Card, Pill } from '../atoms.jsx';
import { IconArrowLeft, IconX, IconPause, IconPlay, IconBolt } from '../icons.jsx';
import { useStepCounter } from '../hooks/useStepCounter.js';

const TIPS = [
  { title: 'Heel to toe', body: 'Land on your heel and roll forward to your toes for efficient, low-impact walking.' },
  { title: 'Arm swing', body: 'Bend elbows at 90° and swing forward (not across). Bigger swing = faster pace.' },
  { title: 'Breathing rhythm', body: 'Inhale for 3 steps, exhale for 2. Keeps your pace steady and lungs open.' },
  { title: 'Core engaged', body: 'Pull your navel gently in. Upright posture reduces back strain on long walks.' },
  { title: 'Cadence target', body: 'Aim for 100–120 steps/min brisk walking. Faster cadence burns more calories.' },
];

export function WalkScreen({ tweaks, theme, nav, sensorPermission, requestSensorPermission }) {
  const { metric } = tweaks;
  const [running, setRunning] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [showTips, setShowTips] = useState(false);
  const [tipIdx, setTipIdx] = useState(0);
  const { steps, permission, requestPermission, reset } = useStepCounter(running);
  const effectivePermission = sensorPermission || permission;
  const effectiveRequest = requestSensorPermission || requestPermission;

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => setElapsed(e => e + 1), 1000);
    return () => clearInterval(id);
  }, [running]);

  const handleStart = async () => {
    if (effectivePermission === 'prompt') await effectiveRequest();
    reset();
    setElapsed(0);
    setRunning(true);
  };

  const fmtTime = (s) => {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    return `${h ? h + ':' : ''}${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
  };
  const distKm = steps * 0.00076;
  const dist = metric ? distKm.toFixed(2) : (distKm * 0.621371).toFixed(2);
  const pace = elapsed > 0 ? (elapsed / 60 / Math.max(distKm, 0.01)).toFixed(1) : '—';
  const cals = Math.round(steps * 0.045);

  return (
    <div style={{ background: theme.bg, color: theme.text, minHeight: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ height: 220, position: 'relative', overflow: 'hidden', background: `linear-gradient(135deg, ${theme.surfaceAlt}, ${theme.surface})`, borderBottom: `1px solid ${theme.border}` }}>
        <svg width="100%" height="100%" style={{ position: 'absolute', inset: 0, opacity: 0.35 }}>
          <defs>
            <pattern id="grid" width="32" height="32" patternUnits="userSpaceOnUse">
              <path d="M 32 0 L 0 0 0 32" fill="none" stroke={theme.borderStrong} strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
        <svg width="100%" height="100%" style={{ position: 'absolute', inset: 0 }} viewBox="0 0 412 220">
          <path d="M 30 180 Q 80 160, 100 130 T 180 100 Q 220 90, 240 60 T 330 50"
            fill="none" stroke={theme.accent} strokeWidth="3" strokeLinecap="round" />
          <path d="M 330 50 Q 360 45, 380 30"
            fill="none" stroke={theme.accent} strokeWidth="3" strokeLinecap="round" strokeDasharray="3 5" opacity="0.5" />
          <circle cx="30" cy="180" r="6" fill={theme.bg} stroke={theme.accent} strokeWidth="2.5" />
          <circle cx="330" cy="50" r="10" fill={theme.accent} opacity="0.3" style={{ animation: 'pulse-ring 1.6s ease-in-out infinite' }} />
          <circle cx="330" cy="50" r="5" fill={theme.accent} stroke={theme.bg} strokeWidth="2" />
        </svg>
        <div style={{ position: 'absolute', top: 14, left: 14, right: 14, display: 'flex', justifyContent: 'space-between', zIndex: 1 }}>
          <IconButton theme={theme} variant="soft" onClick={() => nav('home')}>
            <IconArrowLeft size={16} color={theme.text} />
          </IconButton>
          <Pill theme={theme} tone="accent" icon={<span style={{ width: 6, height: 6, borderRadius: '50%', background: theme.accent, display: 'inline-block', animation: 'breathe 1.5s infinite' }} />}>LIVE GPS</Pill>
        </div>
      </div>

      <div style={{ padding: '24px 22px 12px', textAlign: 'center' }}>
        <div style={{ ...TYPE.sans, fontSize: 11, letterSpacing: '0.2em', color: theme.textDim, textTransform: 'uppercase' }}>Time elapsed</div>
        <div style={{ ...TYPE.display, fontSize: 64, color: theme.text, lineHeight: 1, marginTop: 4, fontVariantNumeric: 'tabular-nums', ...TYPE.mono, fontWeight: 500 }}>
          {fmtTime(elapsed)}
        </div>
      </div>

      <div style={{ padding: '0 16px', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
        <LiveStat theme={theme} label="Steps" value={steps.toLocaleString()} />
        <LiveStat theme={theme} label={metric ? 'Km' : 'Mi'} value={dist} />
        <LiveStat theme={theme} label="Pace" value={pace} unit="/km" />
      </div>

      <div style={{ padding: '12px 16px 0', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
        <LiveStat theme={theme} label="Calories" value={cals} unit="kcal" />
        <LiveStat theme={theme} label="Heart rate" value="—" unit="bpm" />
      </div>

      <div style={{ padding: '20px 16px 0', flex: 1 }}>
        <SectionHeader theme={theme} title="Splits" action="Auto · 1 km" />
        <Card theme={theme} padding={16}>
          <div style={{ textAlign: 'center', ...TYPE.sans, fontSize: 13, color: theme.textDim }}>
            {running ? 'Splits will appear as you complete each km' : 'Start a walk to track splits'}
          </div>
        </Card>
      </div>

      {effectivePermission === 'prompt' && !running && (
        <div style={{ margin: '0 16px 12px', padding: '14px 16px', borderRadius: 14, background: theme.accentSoft, border: `1px solid ${theme.borderStrong}`, ...TYPE.sans, fontSize: 13, color: theme.text }}>
          📱 This app needs access to your phone's motion sensor to count real steps.
        </div>
      )}
      {effectivePermission === 'denied' && (
        <div style={{ margin: '0 16px 12px', padding: '14px 16px', borderRadius: 14, background: theme.warmSoft, border: `1px solid ${theme.warm}`, ...TYPE.sans, fontSize: 13, color: theme.text }}>
          ⚠️ Motion access denied. Enable it in your browser settings to count real steps.
        </div>
      )}

      <div style={{ padding: '24px 16px 20px', display: 'flex', gap: 12, alignItems: 'center', justifyContent: 'center' }}>
        <button onClick={() => { setRunning(false); reset(); nav('home'); }} style={{
          width: 56, height: 56, borderRadius: '50%',
          background: theme.surface, border: `1px solid ${theme.border}`,
          color: theme.danger, cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <IconX size={20} />
        </button>
        <button onClick={() => running ? setRunning(false) : handleStart()} style={{
          flex: 1, height: 60, borderRadius: 30,
          background: running ? theme.accent : theme.surface,
          border: running ? 'none' : `1px solid ${theme.borderStrong}`,
          color: running ? theme.bg : theme.text,
          cursor: 'pointer', ...TYPE.sans, fontSize: 14, fontWeight: 600,
          letterSpacing: '0.16em', textTransform: 'uppercase',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        }}>
          {running ? <IconPause size={18} /> : <IconPlay size={18} />}
          {running ? 'Pause' : (elapsed > 0 ? 'Resume' : 'Start Walk')}
        </button>
        <button onClick={() => setShowTips(true)} style={{
          width: 56, height: 56, borderRadius: '50%',
          background: theme.surface, border: `1px solid ${theme.border}`,
          color: theme.text, cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <IconBolt size={20} />
        </button>
      </div>

      {showTips && (
        <div style={{
          position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.55)',
          display: 'flex', alignItems: 'flex-end', zIndex: 50,
        }} onClick={() => setShowTips(false)}>
          <div onClick={e => e.stopPropagation()} style={{
            background: theme.bg, width: '100%', borderRadius: '20px 20px 0 0',
            border: `1px solid ${theme.border}`, paddingBottom: 24,
          }}>
            <div style={{ display: 'flex', justifyContent: 'center', padding: '10px 0 4px' }}>
              <div style={{ width: 36, height: 4, borderRadius: 2, background: theme.borderStrong }} />
            </div>
            <div style={{ padding: '8px 18px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ ...TYPE.sans, fontSize: 15, fontWeight: 600, color: theme.text }}>Coaching tip</span>
              <div style={{ display: 'flex', gap: 6 }}>
                {TIPS.map((_, i) => (
                  <div key={i} onClick={() => setTipIdx(i)} style={{ width: 6, height: 6, borderRadius: '50%', background: i === tipIdx ? theme.accent : theme.borderStrong, cursor: 'pointer' }} />
                ))}
              </div>
            </div>
            <div style={{ padding: '0 18px 8px' }}>
              <div style={{ padding: '18px', background: theme.surface, border: `1px solid ${theme.border}`, borderRadius: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: theme.accentSoft, color: theme.accent, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <IconBolt size={16} />
                  </div>
                  <div style={{ ...TYPE.sans, fontSize: 14, fontWeight: 600, color: theme.text }}>{TIPS[tipIdx].title}</div>
                </div>
                <div style={{ ...TYPE.sans, fontSize: 13, color: theme.textDim, lineHeight: 1.6 }}>{TIPS[tipIdx].body}</div>
              </div>
              <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                <button onClick={() => setTipIdx(i => (i + TIPS.length - 1) % TIPS.length)} style={{ flex: 1, padding: '12px', borderRadius: 12, background: theme.surface, border: `1px solid ${theme.border}`, color: theme.text, cursor: 'pointer', ...TYPE.sans, fontSize: 13 }}>← Prev</button>
                <button onClick={() => setTipIdx(i => (i + 1) % TIPS.length)} style={{ flex: 1, padding: '12px', borderRadius: 12, background: theme.accent, border: 'none', color: theme.bg, cursor: 'pointer', ...TYPE.sans, fontSize: 13, fontWeight: 600 }}>Next →</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function LiveStat({ theme, label, value, unit, pulse }) {
  return (
    <div style={{ background: theme.surface, border: `1px solid ${theme.border}`, borderRadius: 14, padding: '12px 12px 10px', textAlign: 'center' }}>
      <div style={{ ...TYPE.sans, fontSize: 10, letterSpacing: '0.18em', color: theme.textMuted, textTransform: 'uppercase' }}>{label}</div>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: 3, marginTop: 4 }}>
        <span style={{ ...TYPE.display, fontSize: 22, color: theme.text, animation: pulse ? 'breathe 1s infinite' : 'none' }}>{value}</span>
        {unit && <span style={{ ...TYPE.mono, fontSize: 10, color: theme.textMuted }}>{unit}</span>}
      </div>
    </div>
  );
}
