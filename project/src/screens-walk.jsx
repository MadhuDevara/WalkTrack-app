// LIVE WALK SESSION

function WalkScreen({ tweaks, theme, nav }) {
  const { metric } = tweaks;
  const [running, setRunning] = React.useState(true);
  const [elapsed, setElapsed] = React.useState(842); // seconds
  const [steps, setSteps] = React.useState(1284);

  React.useEffect(() => {
    if (!running) return;
    const id = setInterval(() => {
      setElapsed(e => e + 1);
      setSteps(s => s + Math.floor(Math.random() * 3 + 1));
    }, 1000);
    return () => clearInterval(id);
  }, [running]);

  const fmtTime = (s) => {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    return `${h ? h + ':' : ''}${String(m).padStart(2,'0')}:${String(sec).padStart(2,'0')}`;
  };
  const distKm = (steps * 0.00076);
  const dist = metric ? distKm.toFixed(2) : (distKm * 0.621371).toFixed(2);
  const pace = elapsed > 0 ? (elapsed / 60 / Math.max(distKm, 0.01)).toFixed(1) : '—';
  const cals = Math.round(steps * 0.045);

  return (
    <div data-screen-label="04 Live Walk" style={{
      background: theme.bg, color: theme.text, minHeight: '100%',
      display: 'flex', flexDirection: 'column',
    }}>
      {/* Map placeholder */}
      <div style={{
        height: 220, position: 'relative', overflow: 'hidden',
        background: `linear-gradient(135deg, ${theme.surfaceAlt}, ${theme.surface})`,
        borderBottom: `1px solid ${theme.border}`,
      }}>
        {/* Map grid */}
        <svg width="100%" height="100%" style={{ position: 'absolute', inset: 0, opacity: 0.35 }}>
          <defs>
            <pattern id="grid" width="32" height="32" patternUnits="userSpaceOnUse">
              <path d="M 32 0 L 0 0 0 32" fill="none" stroke={theme.borderStrong} strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
        {/* Route path */}
        <svg width="100%" height="100%" style={{ position: 'absolute', inset: 0 }} viewBox="0 0 412 220">
          <path d="M 30 180 Q 80 160, 100 130 T 180 100 Q 220 90, 240 60 T 330 50"
            fill="none" stroke={theme.accent} strokeWidth="3" strokeLinecap="round"
            strokeDasharray="0" />
          <path d="M 330 50 Q 360 45, 380 30"
            fill="none" stroke={theme.accent} strokeWidth="3" strokeLinecap="round"
            strokeDasharray="3 5" opacity="0.5" />
          {/* Start */}
          <circle cx="30" cy="180" r="6" fill={theme.bg} stroke={theme.accent} strokeWidth="2.5" />
          {/* Current */}
          <circle cx="330" cy="50" r="10" fill={theme.accent} opacity="0.3"
            style={{ animation: 'pulse-ring 1.6s ease-in-out infinite' }} />
          <circle cx="330" cy="50" r="5" fill={theme.accent} stroke={theme.bg} strokeWidth="2" />
        </svg>
        {/* Top controls */}
        <div style={{ position: 'absolute', top: 14, left: 14, right: 14,
          display: 'flex', justifyContent: 'space-between', zIndex: 1 }}>
          <IconButton theme={theme} variant="soft" onClick={() => nav('home')}>
            <IconArrowLeft size={16} color={theme.text} />
          </IconButton>
          <Pill theme={theme} tone="accent" icon={<span style={{
            width: 6, height: 6, borderRadius: '50%', background: theme.accent,
            display: 'inline-block', animation: 'breathe 1.5s infinite',
          }} />}>LIVE GPS</Pill>
        </div>
      </div>

      {/* Stat hero */}
      <div style={{ padding: '24px 22px 12px', textAlign: 'center' }}>
        <div style={{ ...TYPE.sans, fontSize: 11, letterSpacing: '0.2em',
          color: theme.textDim, textTransform: 'uppercase' }}>Time elapsed</div>
        <div style={{ ...TYPE.display, fontSize: 64, color: theme.text, lineHeight: 1,
          marginTop: 4, fontVariantNumeric: 'tabular-nums', ...TYPE.mono, fontWeight: 500 }}>
          {fmtTime(elapsed)}
        </div>
      </div>

      {/* Stat row */}
      <div style={{ padding: '0 16px',
        display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
        <LiveStat theme={theme} label="Steps" value={steps.toLocaleString()} />
        <LiveStat theme={theme} label={metric ? 'Km' : 'Mi'} value={dist} />
        <LiveStat theme={theme} label="Pace" value={pace} unit="/km" />
      </div>

      <div style={{ padding: '12px 16px 0',
        display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
        <LiveStat theme={theme} label="Calories" value={cals} unit="kcal" />
        <LiveStat theme={theme} label="Heart rate" value="124" unit="bpm" pulse />
      </div>

      {/* Splits */}
      <div style={{ padding: '20px 16px 0', flex: 1 }}>
        <SectionHeader theme={theme} title="Splits" action="Auto · 1 km" />
        <Card theme={theme} padding={0}>
          {[
            { km: 1, time: '7:42', pace: '7:42', delta: 0 },
            { km: 2, time: '7:28', pace: '7:28', delta: -14 },
            { km: 3, time: '7:54', pace: '7:54', delta: 12 },
          ].map((s, i, arr) => (
            <div key={i} style={{
              display: 'grid', gridTemplateColumns: '40px 1fr 80px 60px',
              alignItems: 'center', padding: '12px 16px', gap: 12,
              borderTop: i === 0 ? 'none' : `1px solid ${theme.border}`,
            }}>
              <div style={{ ...TYPE.mono, fontSize: 13, color: theme.textDim }}>{s.km}</div>
              <div style={{ height: 4, background: theme.borderStrong, borderRadius: 2,
                overflow: 'hidden' }}>
                <div style={{ width: `${100 - i * 8}%`, height: '100%',
                  background: theme.accent, borderRadius: 2 }} />
              </div>
              <div style={{ ...TYPE.mono, fontSize: 13, color: theme.text, textAlign: 'right' }}>{s.time}</div>
              <div style={{ ...TYPE.mono, fontSize: 11, textAlign: 'right',
                color: s.delta < 0 ? theme.accent : (s.delta > 0 ? theme.rose : theme.textMuted) }}>
                {s.delta === 0 ? '—' : (s.delta > 0 ? `+${s.delta}s` : `${s.delta}s`)}
              </div>
            </div>
          ))}
        </Card>
      </div>

      {/* Action buttons */}
      <div style={{ padding: '24px 16px 20px',
        display: 'flex', gap: 12, alignItems: 'center', justifyContent: 'center' }}>
        <button onClick={() => nav('home')} style={{
          width: 56, height: 56, borderRadius: '50%',
          background: theme.surface, border: `1px solid ${theme.border}`,
          color: theme.danger, cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <IconX size={20} />
        </button>
        <button onClick={() => setRunning(r => !r)} style={{
          flex: 1, height: 60, borderRadius: 30,
          background: running ? theme.accent : theme.surface,
          border: running ? 'none' : `1px solid ${theme.borderStrong}`,
          color: running ? theme.bg : theme.text,
          cursor: 'pointer', ...TYPE.sans, fontSize: 14, fontWeight: 600,
          letterSpacing: '0.16em', textTransform: 'uppercase',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        }}>
          {running ? <IconPause size={18} /> : <IconPlay size={18} />}
          {running ? 'Pause' : 'Resume'}
        </button>
        <button style={{
          width: 56, height: 56, borderRadius: '50%',
          background: theme.surface, border: `1px solid ${theme.border}`,
          color: theme.text, cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <IconBolt size={20} />
        </button>
      </div>
    </div>
  );
}

function LiveStat({ theme, label, value, unit, pulse }) {
  return (
    <div style={{
      background: theme.surface, border: `1px solid ${theme.border}`,
      borderRadius: 14, padding: '12px 12px 10px', textAlign: 'center',
    }}>
      <div style={{ ...TYPE.sans, fontSize: 10, letterSpacing: '0.18em',
        color: theme.textMuted, textTransform: 'uppercase' }}>{label}</div>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: 3, marginTop: 4 }}>
        <span style={{ ...TYPE.display, fontSize: 22, color: theme.text,
          animation: pulse ? 'breathe 1s infinite' : 'none' }}>{value}</span>
        {unit && <span style={{ ...TYPE.mono, fontSize: 10, color: theme.textMuted }}>{unit}</span>}
      </div>
    </div>
  );
}

Object.assign(window, { WalkScreen });
