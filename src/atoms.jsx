import { TYPE } from './theme.js';
import {
  IconHome, IconChart, IconPlay, IconUsers, IconUser,
} from './icons.jsx';

export function StepRing({ steps, goal, theme, size = 260, thickness = 14, label = true, animate = true }) {
  const pct = Math.min(steps / goal, 1);
  const r = (size - thickness) / 2;
  const c = 2 * Math.PI * r;
  const dash = c * pct;
  return (
    <div style={{ position: 'relative', width: size, height: size, animation: animate ? 'breathe 6s ease-in-out infinite' : 'none' }}>
      <div style={{
        position: 'absolute', inset: -8,
        background: `radial-gradient(circle, ${theme.accentSoft} 0%, transparent 65%)`,
        filter: 'blur(8px)',
      }} />
      <svg width={size} height={size} style={{ position: 'relative', transform: 'rotate(-90deg)' }}>
        <circle cx={size / 2} cy={size / 2} r={r} stroke={theme.borderStrong} strokeWidth={thickness} fill="none" />
        <circle cx={size / 2} cy={size / 2} r={r} stroke={theme.accent} strokeWidth={thickness}
          fill="none" strokeLinecap="round"
          strokeDasharray={`${dash} ${c}`}
          style={{ transition: 'stroke-dasharray 600ms cubic-bezier(.2,.8,.2,1)' }} />
        {Array.from({ length: 60 }).map((_, i) => {
          const a = (i / 60) * Math.PI * 2;
          const x1 = size / 2 + Math.cos(a) * (r + thickness / 2 + 6);
          const y1 = size / 2 + Math.sin(a) * (r + thickness / 2 + 6);
          const x2 = size / 2 + Math.cos(a) * (r + thickness / 2 + (i % 5 === 0 ? 14 : 9));
          const y2 = size / 2 + Math.sin(a) * (r + thickness / 2 + (i % 5 === 0 ? 14 : 9));
          return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={theme.borderStrong}
            strokeWidth={i % 5 === 0 ? 1.2 : 0.6} />;
        })}
      </svg>
      <div style={{
        position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', textAlign: 'center',
      }}>
        {label && <div style={{ ...TYPE.sans, fontSize: 11, letterSpacing: '0.18em', color: theme.textDim, textTransform: 'uppercase', marginBottom: 6 }}>Today's steps</div>}
        <div style={{ ...TYPE.display, fontSize: 64, lineHeight: 1, color: theme.text }}>
          {steps.toLocaleString()}
        </div>
        <div style={{ ...TYPE.mono, fontSize: 12, color: theme.textDim, marginTop: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ color: theme.accent }}>{Math.round(pct * 100)}%</span>
          <span style={{ opacity: 0.5 }}>·</span>
          <span>goal {goal.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
}

export function StatCard({ label, value, unit, sub, icon, theme, accent }) {
  return (
    <div style={{
      background: theme.surface, border: `1px solid ${theme.border}`,
      borderRadius: 16, padding: '14px 14px 12px',
      display: 'flex', flexDirection: 'column', gap: 8, minHeight: 88,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ ...TYPE.sans, fontSize: 10.5, letterSpacing: '0.16em', color: theme.textMuted, textTransform: 'uppercase' }}>{label}</div>
        {icon && <div style={{ color: accent || theme.accent }}>{icon}</div>}
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
        <div style={{ ...TYPE.display, fontSize: 26, color: theme.text, lineHeight: 1 }}>{value}</div>
        {unit && <div style={{ ...TYPE.mono, fontSize: 11, color: theme.textDim }}>{unit}</div>}
      </div>
      {sub && <div style={{ ...TYPE.sans, fontSize: 11, color: theme.textDim }}>{sub}</div>}
    </div>
  );
}

export function BottomNav({ active, onChange, theme }) {
  const items = [
    { id: 'home', label: 'Today', icon: <IconHome size={20} /> },
    { id: 'history', label: 'Trends', icon: <IconChart size={20} /> },
    { id: 'walk', label: 'Walk', icon: <IconPlay size={18} />, primary: true },
    { id: 'friends', label: 'Friends', icon: <IconUsers size={20} /> },
    { id: 'profile', label: 'You', icon: <IconUser size={20} /> },
  ];
  return (
    <div style={{
      background: theme.surface,
      borderTop: `1px solid ${theme.border}`,
      display: 'flex', alignItems: 'center', justifyContent: 'space-around',
      padding: '10px 6px 6px', gap: 2,
    }}>
      {items.map(it => {
        const isActive = active === it.id;
        if (it.primary) {
          return (
            <button key={it.id} onClick={() => onChange(it.id)} style={{
              border: 'none', cursor: 'pointer',
              background: theme.accent,
              color: theme.bg,
              width: 56, height: 56, borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: `0 6px 18px ${theme.accentSoft}`,
              marginTop: -16,
              transition: 'transform 200ms',
            }}>{it.icon}</button>
          );
        }
        return (
          <button key={it.id} onClick={() => onChange(it.id)} style={{
            background: 'transparent', border: 'none', cursor: 'pointer',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
            color: isActive ? theme.accent : theme.textMuted,
            padding: '6px 10px', minWidth: 56,
            ...TYPE.sans,
          }}>
            {it.icon}
            <span style={{ fontSize: 10, letterSpacing: '0.04em', fontWeight: isActive ? 600 : 500 }}>{it.label}</span>
          </button>
        );
      })}
    </div>
  );
}

export function AppBar({ title, subtitle, theme, leading, trailing, large = false }) {
  return (
    <div style={{
      padding: large ? '20px 22px 18px' : '14px 18px 12px',
      background: theme.bg,
      display: 'flex', flexDirection: 'column', gap: large ? 6 : 0,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', minHeight: 36 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {leading}
          {!large && <div style={{ ...TYPE.serif, fontSize: 18, color: theme.text }}>{title}</div>}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>{trailing}</div>
      </div>
      {large && (
        <div>
          {subtitle && <div style={{ ...TYPE.sans, fontSize: 11, letterSpacing: '0.18em', color: theme.textDim, textTransform: 'uppercase', marginBottom: 4 }}>{subtitle}</div>}
          <div style={{ ...TYPE.display, fontSize: 30, color: theme.text, lineHeight: 1.1 }}>{title}</div>
        </div>
      )}
    </div>
  );
}

export function IconButton({ children, onClick, theme, variant = 'ghost', size = 36 }) {
  const styles = {
    ghost: { background: 'transparent', color: theme.text, border: 'none' },
    soft: { background: theme.surface, color: theme.text, border: `1px solid ${theme.border}` },
    accent: { background: theme.accent, color: theme.bg, border: 'none' },
  }[variant];
  return (
    <button onClick={onClick} style={{
      ...styles, cursor: 'pointer',
      width: size, height: size, borderRadius: '50%',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      flexShrink: 0,
    }}>{children}</button>
  );
}

export function SectionHeader({ title, action, theme }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'baseline', justifyContent: 'space-between',
      padding: '4px 4px 10px',
    }}>
      <div style={{ ...TYPE.sans, fontSize: 11, letterSpacing: '0.2em', color: theme.textDim, textTransform: 'uppercase', fontWeight: 500 }}>{title}</div>
      {action && <div style={{ ...TYPE.sans, fontSize: 12, color: theme.accent, cursor: 'pointer' }}>{action}</div>}
    </div>
  );
}

export function Pill({ children, theme, tone = 'default', icon }) {
  const tones = {
    default: { bg: theme.surfaceAlt, color: theme.textDim, border: theme.border },
    accent: { bg: theme.accentSoft, color: theme.accent, border: theme.borderStrong },
    warm: { bg: theme.warmSoft, color: theme.warm, border: theme.warmSoft },
  }[tone];
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      background: tones.bg, color: tones.color,
      border: `1px solid ${tones.border}`,
      padding: '4px 10px', borderRadius: 999,
      ...TYPE.sans, fontSize: 11, letterSpacing: '0.04em', fontWeight: 500,
      whiteSpace: 'nowrap',
    }}>{icon}{children}</span>
  );
}

export function LinearProgress({ value, max = 100, theme, color, height = 6 }) {
  const pct = Math.min(value / max, 1) * 100;
  return (
    <div style={{ width: '100%', height, borderRadius: height, background: theme.borderStrong, overflow: 'hidden' }}>
      <div style={{
        width: `${pct}%`, height: '100%', borderRadius: height,
        background: color || theme.accent,
        transition: 'width 600ms cubic-bezier(.2,.8,.2,1)',
      }} />
    </div>
  );
}

export function Card({ children, theme, padding = 16, style, onClick }) {
  return (
    <div onClick={onClick} style={{
      background: theme.surface,
      border: `1px solid ${theme.border}`,
      borderRadius: 18, padding,
      cursor: onClick ? 'pointer' : 'default',
      ...style,
    }}>{children}</div>
  );
}

export function Sparkline({ data, width = 100, height = 32, color, theme }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((v - min) / range) * height;
    return `${x},${y}`;
  }).join(' ');
  return (
    <svg width={width} height={height}>
      <polyline points={points} fill="none" stroke={color || theme.accent}
        strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function BarChart({ data, labels, theme, height = 140, highlight = -1, goal }) {
  const max = Math.max(...data, goal || 0) * 1.1;
  return (
    <div style={{ position: 'relative' }}>
      {goal && (
        <div style={{
          position: 'absolute', left: 0, right: 0,
          top: height - (goal / max) * height,
          borderTop: `1px dashed ${theme.borderStrong}`,
          pointerEvents: 'none',
        }}>
          <span style={{ position: 'absolute', right: 0, top: -16, ...TYPE.mono, fontSize: 9, color: theme.textMuted }}>
            {(goal / 1000).toFixed(0)}k goal
          </span>
        </div>
      )}
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height }}>
        {data.map((v, i) => {
          const h = (v / max) * height;
          const isHi = i === highlight;
          const hitGoal = goal && v >= goal;
          return (
            <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', height: '100%' }}>
              <div style={{
                width: '100%', height: h, borderRadius: 4,
                background: isHi ? theme.accent : (hitGoal ? theme.accent : theme.borderStrong),
                opacity: isHi ? 1 : (hitGoal ? 0.7 : 1),
                transition: 'height 600ms cubic-bezier(.2,.8,.2,1)',
              }} />
            </div>
          );
        })}
      </div>
      {labels && (
        <div style={{ display: 'flex', gap: 6, marginTop: 6 }}>
          {labels.map((l, i) => (
            <div key={i} style={{
              flex: 1, textAlign: 'center', ...TYPE.sans, fontSize: 10,
              color: i === highlight ? theme.accent : theme.textMuted,
              fontWeight: i === highlight ? 600 : 400,
            }}>{l}</div>
          ))}
        </div>
      )}
    </div>
  );
}
