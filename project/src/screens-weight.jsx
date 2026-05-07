// WEIGHT LOSS DASHBOARD — calories in/out, weight trend, deficit

function WeightScreen({ tweaks, theme, nav }) {
  const { metric } = tweaks;
  const u = metric ? 'kg' : 'lb';
  const weightData = [
    { d: 'Apr 1', w: 72.4 },
    { d: 'Apr 8', w: 71.8 },
    { d: 'Apr 15', w: 71.0 },
    { d: 'Apr 22', w: 70.2 },
    { d: 'Apr 29', w: 69.4 },
    { d: 'May 6', w: 68.6 },
    { d: 'Today', w: 68.4 },
  ];
  const start = 72.4, current = 68.4, goal = 58.8;
  const lost = (start - current).toFixed(1);
  const remaining = (current - goal).toFixed(1);
  const pct = ((start - current) / (start - goal)) * 100;

  return (
    <div data-screen-label="02 Weight Loss" style={{
      background: theme.bg, color: theme.text, minHeight: '100%', paddingBottom: 24,
    }}>
      <AppBar theme={theme}
        leading={<IconButton theme={theme} variant="soft" onClick={() => nav('home')}>
          <IconArrowLeft size={16} color={theme.text} /></IconButton>}
        title="Weight loss"
        trailing={<IconButton theme={theme} variant="soft"><IconMore size={16} color={theme.text} /></IconButton>}
      />

      {/* Hero — current weight */}
      <div style={{ padding: '8px 22px 18px', textAlign: 'center' }}>
        <div style={{ ...TYPE.sans, fontSize: 11, letterSpacing: '0.18em',
          color: theme.textDim, textTransform: 'uppercase' }}>Current weight</div>
        <div style={{ ...TYPE.display, fontSize: 72, lineHeight: 1, color: theme.text,
          marginTop: 6, display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: 6 }}>
          {current}
          <span style={{ ...TYPE.mono, fontSize: 18, color: theme.textDim, fontWeight: 400 }}>{u}</span>
        </div>
        <div style={{ ...TYPE.serif, fontSize: 14, fontStyle: 'italic',
          color: theme.accent, marginTop: 6 }}>
          −{lost}{u} since April · trending healthy
        </div>
      </div>

      {/* Goal progress bar */}
      <div style={{ padding: '0 16px 8px' }}>
        <Card theme={theme} padding={16}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10,
            ...TYPE.sans, fontSize: 11, color: theme.textDim, letterSpacing: '0.04em' }}>
            <span>Start <strong style={{ color: theme.text }}>{start}{u}</strong></span>
            <span style={{ color: theme.accent }}>{Math.round(pct)}% there</span>
            <span>Goal <strong style={{ color: theme.text }}>{goal}{u}</strong></span>
          </div>
          <div style={{ position: 'relative', height: 8 }}>
            <div style={{ position: 'absolute', inset: 0, borderRadius: 4,
              background: theme.borderStrong }} />
            <div style={{ position: 'absolute', left: 0, top: 0, height: 8, width: `${pct}%`,
              borderRadius: 4, background: theme.accent }} />
            <div style={{ position: 'absolute', left: `${pct}%`, top: -4, width: 16, height: 16,
              borderRadius: '50%', background: theme.accent, transform: 'translateX(-50%)',
              boxShadow: `0 0 0 4px ${theme.bg}` }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 10,
            ...TYPE.mono, fontSize: 11, color: theme.textDim }}>
            <span>{lost}{u} lost</span>
            <span>{remaining}{u} to go</span>
          </div>
        </Card>
      </div>

      {/* Weight trend chart */}
      <div style={{ padding: '14px 16px 0' }}>
        <SectionHeader theme={theme} title="Weight trend · 6 weeks" action="3M · 6M · 1Y" />
        <Card theme={theme} padding={18}>
          <WeightLineChart data={weightData} theme={theme} u={u} goal={goal} />
        </Card>
      </div>

      {/* Calorie balance today */}
      <div style={{ padding: '20px 16px 0' }}>
        <SectionHeader theme={theme} title="Today's calorie balance" />
        <Card theme={theme} padding={18}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 14 }}>
            <CaloryStat theme={theme} label="Eaten" value={1620} target={2100} color={theme.warm} />
            <CaloryStat theme={theme} label="Burned" value={2432} target={2400} color={theme.accent} />
          </div>
          <div style={{ borderTop: `1px solid ${theme.border}`, paddingTop: 14,
            display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ ...TYPE.sans, fontSize: 11, letterSpacing: '0.16em',
                color: theme.textMuted, textTransform: 'uppercase' }}>Net deficit</div>
              <div style={{ ...TYPE.display, fontSize: 32, color: theme.accent, marginTop: 2 }}>−812</div>
              <div style={{ ...TYPE.sans, fontSize: 11, color: theme.textDim, marginTop: 1 }}>
                ≈ 0.10{u} lost today
              </div>
            </div>
            <div style={{ width: 90, height: 90 }}>
              <DonutBalance eaten={1620} burned={2432} theme={theme} />
            </div>
          </div>
        </Card>
      </div>

      {/* Weekly summary table */}
      <div style={{ padding: '20px 16px 0' }}>
        <SectionHeader theme={theme} title="This week's deficit" />
        <Card theme={theme} padding={0}>
          <table style={{ width: '100%', borderCollapse: 'collapse',
            ...TYPE.sans, fontSize: 13, color: theme.text }}>
            <thead>
              <tr style={{ ...TYPE.mono, fontSize: 10, color: theme.textMuted,
                letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 400 }}>Day</th>
                <th style={{ padding: '12px 8px', textAlign: 'right', fontWeight: 400 }}>In</th>
                <th style={{ padding: '12px 8px', textAlign: 'right', fontWeight: 400 }}>Out</th>
                <th style={{ padding: '12px 16px', textAlign: 'right', fontWeight: 400 }}>Net</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['Mon', 1840, 2210, -370],
                ['Tue', 1620, 2432, -812],
                ['Wed', 2010, 2380, -370],
                ['Thu', 1740, 2290, -550],
                ['Fri', 1990, 2520, -530],
                ['Sat', 2240, 2640, -400],
                ['Sun', 1880, 2410, -530],
              ].map(([d, eat, burn, net], i) => (
                <tr key={i} style={{ borderTop: i === 0 ? 'none' : `1px solid ${theme.border}` }}>
                  <td style={{ padding: '10px 16px' }}>{d}</td>
                  <td style={{ padding: '10px 8px', textAlign: 'right', ...TYPE.mono, color: theme.textDim }}>{eat.toLocaleString()}</td>
                  <td style={{ padding: '10px 8px', textAlign: 'right', ...TYPE.mono, color: theme.textDim }}>{burn.toLocaleString()}</td>
                  <td style={{ padding: '10px 16px', textAlign: 'right', ...TYPE.mono,
                    color: net < 0 ? theme.accent : theme.rose, fontWeight: 500 }}>{net}</td>
                </tr>
              ))}
              <tr style={{ borderTop: `1px solid ${theme.borderStrong}`, background: theme.surfaceAlt }}>
                <td style={{ padding: '12px 16px', ...TYPE.sans, fontWeight: 600 }}>Total</td>
                <td style={{ padding: '12px 8px', textAlign: 'right', ...TYPE.mono, fontWeight: 600 }}>13,320</td>
                <td style={{ padding: '12px 8px', textAlign: 'right', ...TYPE.mono, fontWeight: 600 }}>16,882</td>
                <td style={{ padding: '12px 16px', textAlign: 'right', ...TYPE.mono,
                  color: theme.accent, fontWeight: 600 }}>−3,562</td>
              </tr>
            </tbody>
          </table>
        </Card>
      </div>

      <div style={{ padding: '20px 16px 0' }}>
        <button style={{
          width: '100%', padding: '14px 18px', borderRadius: 14,
          background: theme.surface, border: `1px solid ${theme.border}`,
          color: theme.text, ...TYPE.sans, fontSize: 14, fontWeight: 500,
          cursor: 'pointer', display: 'flex', alignItems: 'center',
          justifyContent: 'center', gap: 8,
        }}>
          <IconPlus size={16} /> Log weight
        </button>
      </div>
    </div>
  );
}

function CaloryStat({ theme, label, value, target, color }) {
  const pct = Math.min(value/target, 1) * 100;
  return (
    <div>
      <div style={{ ...TYPE.sans, fontSize: 11, letterSpacing: '0.16em',
        color: theme.textMuted, textTransform: 'uppercase' }}>{label}</div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginTop: 4 }}>
        <span style={{ ...TYPE.display, fontSize: 24, color: theme.text }}>{value.toLocaleString()}</span>
        <span style={{ ...TYPE.mono, fontSize: 11, color: theme.textMuted }}>/ {target.toLocaleString()}</span>
      </div>
      <div style={{ height: 4, background: theme.borderStrong, borderRadius: 2, marginTop: 8, overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${pct}%`, background: color, borderRadius: 2 }} />
      </div>
    </div>
  );
}

function DonutBalance({ eaten, burned, theme }) {
  const total = eaten + burned;
  const eatPct = eaten / total;
  const r = 38, c = 2 * Math.PI * r;
  return (
    <svg viewBox="0 0 90 90" width="100%" height="100%">
      <circle cx="45" cy="45" r={r} stroke={theme.warm} strokeWidth="9" fill="none"
        strokeDasharray={`${c * eatPct} ${c}`} transform="rotate(-90 45 45)" strokeLinecap="round" />
      <circle cx="45" cy="45" r={r} stroke={theme.accent} strokeWidth="9" fill="none"
        strokeDasharray={`${c * (1 - eatPct)} ${c}`}
        strokeDashoffset={`-${c * eatPct}`}
        transform="rotate(-90 45 45)" strokeLinecap="round" />
    </svg>
  );
}

function WeightLineChart({ data, theme, u, goal }) {
  const w = 320, h = 140, pad = 16;
  const ws = data.map(d => d.w);
  const min = Math.min(...ws, goal) - 1;
  const max = Math.max(...ws) + 1;
  const range = max - min;
  const points = data.map((d, i) => {
    const x = pad + (i / (data.length - 1)) * (w - pad * 2);
    const y = pad + (1 - (d.w - min) / range) * (h - pad * 2);
    return { x, y, ...d };
  });
  const path = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ');
  const area = path + ` L${points[points.length-1].x},${h-pad} L${pad},${h-pad} Z`;
  const goalY = pad + (1 - (goal - min) / range) * (h - pad * 2);
  return (
    <div>
      <svg viewBox={`0 0 ${w} ${h}`} width="100%" preserveAspectRatio="none" style={{ display: 'block' }}>
        <defs>
          <linearGradient id="weightFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={theme.accent} stopOpacity="0.25" />
            <stop offset="100%" stopColor={theme.accent} stopOpacity="0" />
          </linearGradient>
        </defs>
        {/* horizontal grid */}
        {[0, 0.5, 1].map(t => (
          <line key={t} x1={pad} x2={w-pad} y1={pad + t * (h - pad*2)} y2={pad + t * (h - pad*2)}
            stroke={theme.border} strokeWidth="1" />
        ))}
        {/* goal line */}
        <line x1={pad} x2={w-pad} y1={goalY} y2={goalY}
          stroke={theme.warm} strokeWidth="1" strokeDasharray="3 4" />
        <text x={w-pad} y={goalY-4} textAnchor="end"
          fontSize="9" fill={theme.warm} fontFamily="JetBrains Mono">goal {goal}{u}</text>
        <path d={area} fill="url(#weightFill)" />
        <path d={path} stroke={theme.accent} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        {points.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r={i === points.length-1 ? 4 : 2.5}
            fill={i === points.length-1 ? theme.accent : theme.bg}
            stroke={theme.accent} strokeWidth="2" />
        ))}
      </svg>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8,
        ...TYPE.mono, fontSize: 9.5, color: theme.textMuted }}>
        {data.map((d, i) => <span key={i}>{d.d}</span>)}
      </div>
    </div>
  );
}

Object.assign(window, { WeightScreen });
