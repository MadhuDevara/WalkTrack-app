import { useState } from 'react';
import { TYPE } from '../theme.js';
import { Pill } from '../atoms.jsx';
import {
  IconArrowLeft, IconArrowRight, IconCheck,
  IconScale, IconLeaf, IconHeart, IconUsers, IconFootprint,
} from '../icons.jsx';

export function OnboardingScreen({ tweaks, theme, nav, setTweak }) {
  const [step, setStep] = useState(0);
  const [data, setData] = useState({
    name: '', weight: 72, goalWeight: 60, target: 10000, why: null,
  });

  const set = (k, v) => setData(d => ({ ...d, [k]: v }));

  const steps = [
    {
      title: 'Welcome to Stride',
      subtitle: 'Walk your way to a healthier you',
      body: <WelcomeStep theme={theme} />,
    },
    {
      title: "What's your name?",
      subtitle: 'So we can personalise your experience',
      body: <NameStep theme={theme} value={data.name} onChange={(v) => set('name', v)} />,
    },
    {
      title: 'Your why',
      subtitle: 'What brings you here?',
      body: <WhyStep theme={theme} value={data.why} onChange={(v) => set('why', v)} />,
    },
    {
      title: 'Where you stand',
      subtitle: 'Your starting weight',
      body: <WeightStep theme={theme} value={data.weight} onChange={(v) => set('weight', v)} />,
    },
    {
      title: "Where you're going",
      subtitle: 'Your goal weight',
      body: <GoalStep theme={theme} start={data.weight} value={data.goalWeight} onChange={(v) => set('goalWeight', v)} />,
    },
    {
      title: 'Daily steps',
      subtitle: 'How active should each day be?',
      body: <StepGoalStep theme={theme} value={data.target} onChange={(v) => set('target', v)} />,
    },
  ];

  const cur = steps[step];
  const last = step === steps.length - 1;

  return (
    <div style={{ background: theme.bg, color: theme.text, minHeight: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '14px 18px 8px', display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ flex: 1, display: 'flex', gap: 4 }}>
          {steps.map((_, i) => (
            <div key={i} style={{
              flex: 1, height: 3, borderRadius: 2,
              background: i <= step ? theme.accent : theme.borderStrong,
              transition: 'background 300ms',
            }} />
          ))}
        </div>
        <button onClick={() => { setTweak('hasOnboarded', true); nav('home'); }}
          style={{ background: 'transparent', border: 'none', color: theme.textMuted, ...TYPE.sans, fontSize: 12, cursor: 'pointer' }}>
          Skip
        </button>
      </div>

      <div style={{ flex: 1, padding: '20px 22px', display: 'flex', flexDirection: 'column' }}>
        <div style={{ ...TYPE.sans, fontSize: 11, letterSpacing: '0.18em', color: theme.textDim, textTransform: 'uppercase' }}>
          Step {step + 1} of {steps.length}
        </div>
        <div style={{ ...TYPE.display, fontSize: 32, color: theme.text, marginTop: 8, lineHeight: 1.1 }}>{cur.title}</div>
        <div style={{ ...TYPE.serif, fontSize: 16, fontStyle: 'italic', color: theme.textDim, marginTop: 4 }}>{cur.subtitle}</div>
        <div style={{ flex: 1, marginTop: 24, animation: 'slideUp 320ms ease' }} key={step}>
          {cur.body}
        </div>
      </div>

      <div style={{ padding: '0 18px 24px', display: 'flex', gap: 10, alignItems: 'center' }}>
        {step > 0 && (
          <button onClick={() => setStep(s => s - 1)} style={{
            width: 56, height: 56, borderRadius: '50%',
            background: theme.surface, border: `1px solid ${theme.border}`,
            color: theme.text, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <IconArrowLeft size={18} />
          </button>
        )}
        <button onClick={() => {
          if (last) {
            setTweak('stepGoal', data.target);
            setTweak('userName', data.name.trim() || 'You');
            setTweak('startWeight', data.weight);
            setTweak('goalWeight', data.goalWeight);
            setTweak('joinDate', new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }));
            setTweak('hasOnboarded', true);
            nav('home');
          } else {
            setStep(s => s + 1);
          }
        }} style={{
          flex: 1, height: 56, borderRadius: 28,
          background: theme.accent, color: theme.bg, border: 'none',
          ...TYPE.sans, fontSize: 14, fontWeight: 600, letterSpacing: '0.06em',
          cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        }}>
          {last ? 'Begin walking' : 'Continue'}
          <IconArrowRight size={18} />
        </button>
      </div>
    </div>
  );
}

function NameStep({ theme, value, onChange }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24, paddingTop: 16 }}>
      <input
        type="text"
        placeholder="Your first name"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        autoFocus
        style={{
          width: '100%', padding: '18px 20px', borderRadius: 16, boxSizing: 'border-box',
          border: `1.5px solid ${value ? theme.accent : theme.border}`,
          background: theme.surface, color: theme.text,
          ...TYPE.display, fontSize: 28,
          outline: 'none', textAlign: 'center',
          transition: 'border-color 200ms',
        }}
      />
      <div style={{ ...TYPE.serif, fontSize: 14, fontStyle: 'italic', color: theme.textDim }}>
        This is how we'll greet you every day
      </div>
    </div>
  );
}

function WelcomeStep({ theme }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', textAlign: 'center', gap: 24 }}>
      <div style={{
        width: 160, height: 160, borderRadius: '50%',
        background: `radial-gradient(circle, ${theme.accentSoft} 0%, transparent 70%)`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        animation: 'breathe 4s ease-in-out infinite',
      }}>
        <div style={{ width: 100, height: 100, borderRadius: '50%', background: theme.accent, color: theme.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <IconFootprint size={48} />
        </div>
      </div>
      <div style={{ ...TYPE.serif, fontSize: 16, fontStyle: 'italic', color: theme.textDim, maxWidth: 280, lineHeight: 1.5 }}>
        "A journey of a thousand miles begins with a single step."
      </div>
    </div>
  );
}

function WhyStep({ theme, value, onChange }) {
  const opts = [
    { id: 'lose', title: 'Lose weight', sub: 'Burn more than I eat', icon: <IconScale size={20} /> },
    { id: 'habit', title: 'Build the habit', sub: 'Move every day', icon: <IconLeaf size={20} /> },
    { id: 'health', title: 'Get healthier', sub: 'Heart, sleep, energy', icon: <IconHeart size={20} /> },
    { id: 'compete', title: 'Compete with friends', sub: 'Make it social', icon: <IconUsers size={20} /> },
  ];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {opts.map(o => (
        <div key={o.id} onClick={() => onChange(o.id)} style={{
          display: 'flex', alignItems: 'center', gap: 14,
          padding: '14px 16px', borderRadius: 14,
          background: value === o.id ? theme.accentSoft : theme.surface,
          border: `1px solid ${value === o.id ? theme.accent : theme.border}`,
          cursor: 'pointer', transition: 'all 180ms',
        }}>
          <div style={{
            width: 40, height: 40, borderRadius: 12,
            background: value === o.id ? theme.accent : theme.surfaceAlt,
            color: value === o.id ? theme.bg : theme.textDim,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>{o.icon}</div>
          <div style={{ flex: 1 }}>
            <div style={{ ...TYPE.sans, fontSize: 14, color: theme.text, fontWeight: 600 }}>{o.title}</div>
            <div style={{ ...TYPE.sans, fontSize: 12, color: theme.textDim, marginTop: 2 }}>{o.sub}</div>
          </div>
          {value === o.id && (
            <div style={{ width: 22, height: 22, borderRadius: '50%', background: theme.accent, color: theme.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <IconCheck size={14} />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function WeightStep({ theme, value, onChange }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24 }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
        <span style={{ ...TYPE.display, fontSize: 96, color: theme.text, lineHeight: 1 }}>{value}</span>
        <span style={{ ...TYPE.mono, fontSize: 18, color: theme.textDim }}>kg</span>
      </div>
      <input type="range" min="40" max="150" value={value}
        onChange={(e) => onChange(parseInt(e.target.value))}
        style={{ width: '100%', accentColor: theme.accent }} />
      <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', ...TYPE.mono, fontSize: 11, color: theme.textMuted }}>
        <span>40 kg</span><span>150 kg</span>
      </div>
    </div>
  );
}

function GoalStep({ theme, start, value, onChange }) {
  const diff = start - value;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 18 }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
        <span style={{ ...TYPE.display, fontSize: 96, color: theme.text, lineHeight: 1 }}>{value}</span>
        <span style={{ ...TYPE.mono, fontSize: 18, color: theme.textDim }}>kg</span>
      </div>
      <Pill theme={theme} tone="accent">−{diff} kg to lose</Pill>
      <input type="range" min="40" max={start} value={value}
        onChange={(e) => onChange(parseInt(e.target.value))}
        style={{ width: '100%', accentColor: theme.accent }} />
      <div style={{ ...TYPE.serif, fontSize: 14, fontStyle: 'italic', color: theme.textDim, textAlign: 'center', maxWidth: 280, lineHeight: 1.5 }}>
        At a healthy 0.5 kg/week pace, you'll reach this in <strong style={{ color: theme.accent }}>{Math.ceil(diff / 0.5)} weeks</strong>.
      </div>
    </div>
  );
}

function StepGoalStep({ theme, value, onChange }) {
  const presets = [6000, 8000, 10000, 12000];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 22 }}>
      <div style={{ ...TYPE.display, fontSize: 88, color: theme.text, lineHeight: 1 }}>
        {value.toLocaleString()}
      </div>
      <div style={{ ...TYPE.serif, fontSize: 14, fontStyle: 'italic', color: theme.textDim }}>steps per day</div>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
        {presets.map(p => (
          <button key={p} onClick={() => onChange(p)} style={{
            padding: '8px 16px', borderRadius: 999,
            border: `1px solid ${value === p ? theme.accent : theme.border}`,
            background: value === p ? theme.accentSoft : theme.surface,
            color: value === p ? theme.accent : theme.text,
            ...TYPE.mono, fontSize: 12, cursor: 'pointer',
          }}>{(p / 1000).toFixed(0)}k</button>
        ))}
      </div>
      <input type="range" min="3000" max="20000" step="500" value={value}
        onChange={(e) => onChange(parseInt(e.target.value))}
        style={{ width: '100%', accentColor: theme.accent }} />
    </div>
  );
}
