import { useState, useCallback, useRef, useEffect } from 'react';
import { useTheme, TYPE } from './theme.js';
import { BottomNav } from './atoms.jsx';
import { HomeScreen } from './screens/HomeScreen.jsx';
import { WeightScreen } from './screens/WeightScreen.jsx';
import { HistoryScreen } from './screens/HistoryScreen.jsx';
import { WalkScreen } from './screens/WalkScreen.jsx';
import { AchievementsScreen } from './screens/AchievementsScreen.jsx';
import { FriendsScreen } from './screens/FriendsScreen.jsx';
import { ProfileScreen } from './screens/ProfileScreen.jsx';
import { OnboardingScreen } from './screens/OnboardingScreen.jsx';

const TWEAK_DEFAULTS = {
  palette: ['#0F1B14', '#34D399', '#F5F1EA', '#A8D5A2'],
  stepGoal: 10000,
  currentSteps: 7842,
  dark: true,
  metric: true,
  showWeightPanel: true,
  hasOnboarded: true,
};

const PALETTES = [
  ['#0F1B14', '#34D399', '#F5F1EA', '#A8D5A2'],
  ['#1A1612', '#E8C26B', '#F5F1EA', '#C7A35E'],
  ['#0F1418', '#7DD3FC', '#F5F1EA', '#0EA5E9'],
  ['#1A1316', '#E8967A', '#F5F1EA', '#C26A4F'],
  ['#F5F1EA', '#1F8A5B', '#1C2418', '#34D399'],
];

export default function App() {
  const [tweaks, setTweaksState] = useState(TWEAK_DEFAULTS);
  const [screen, setScreen] = useState(TWEAK_DEFAULTS.hasOnboarded ? 'home' : 'onboarding');
  const [tweaksOpen, setTweaksOpen] = useState(false);
  const theme = useTheme(tweaks.dark, tweaks.palette);

  const setTweak = useCallback((key, value) => {
    setTweaksState(prev => ({ ...prev, [key]: value }));
  }, []);

  const nav = (s) => setScreen(s);

  const screens = {
    onboarding: OnboardingScreen,
    home: HomeScreen,
    weight: WeightScreen,
    history: HistoryScreen,
    walk: WalkScreen,
    achievements: AchievementsScreen,
    friends: FriendsScreen,
    profile: ProfileScreen,
  };

  const Cur = screens[screen] || HomeScreen;
  const showBottomNav = !['onboarding', 'walk'].includes(screen);
  const navMap = { home: 'home', history: 'history', friends: 'friends', profile: 'profile', weight: 'home', achievements: 'profile' };

  return (
    <div style={{
      fontFamily: '"Inter Tight", system-ui, sans-serif',
      background: '#f5f1ea',
      backgroundImage: 'radial-gradient(900px 600px at 10% 0%, #ebe3d4 0%, transparent 60%), radial-gradient(900px 700px at 90% 100%, #e2d8c4 0%, transparent 60%)',
      minHeight: '100vh',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '32px 16px', boxSizing: 'border-box',
      color: '#1c2418',
    }}>
      <style>{`
        html, body { margin: 0; padding: 0; height: 100%; }
        .stride-scroll::-webkit-scrollbar { width: 0; height: 0; }
        .stride-scroll { scrollbar-width: none; }
        @keyframes pulse-ring {
          0% { transform: scale(0.96); opacity: 0.7; }
          50% { transform: scale(1.04); opacity: 0.3; }
          100% { transform: scale(0.96); opacity: 0.7; }
        }
        @keyframes breathe {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.02); }
        }
        @keyframes slideUp {
          from { transform: translateY(12px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
      `}</style>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 32, flexWrap: 'wrap' }}>
        <DeviceShell theme={theme} dark={tweaks.dark}>
          <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: theme.bg, color: theme.text }}>
            <div className="stride-scroll" style={{ flex: 1, overflow: 'auto', minHeight: 0 }}>
              <Cur tweaks={tweaks} theme={theme} nav={nav} setTweak={setTweak} app={{ screen, setScreen }} />
            </div>
            {showBottomNav && (
              <BottomNav active={navMap[screen] || screen} theme={theme}
                onChange={(id) => { if (id === 'walk') setScreen('walk'); else setScreen(id); }} />
            )}
          </div>
        </DeviceShell>

        <div style={{ maxWidth: 240, color: '#3a3528' }}>
          <div style={{ ...TYPE.sans, fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#7a715f' }}>Stride · v0.1</div>
          <div style={{ ...TYPE.serif, fontSize: 22, lineHeight: 1.25, color: '#1c2418', marginTop: 8, fontStyle: 'italic' }}>
            A premium wellness step counter for the long walk.
          </div>
          <div style={{ ...TYPE.sans, fontSize: 12, color: '#5a5447', marginTop: 12, lineHeight: 1.6 }}>
            Eight screens, one continuous flow. Tap the floating <strong>walk</strong> button to start a session, the avatar for profile, or use the panel below to toggle palette, goals, and live progress.
          </div>
          <div style={{ marginTop: 16, padding: '12px 14px', background: 'rgba(31,60,41,0.06)', borderRadius: 12, border: '1px solid rgba(31,60,41,0.1)' }}>
            <div style={{ ...TYPE.sans, fontSize: 10.5, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#7a715f' }}>Try this</div>
            <ul style={{ ...TYPE.sans, fontSize: 12, color: '#3a3528', margin: '6px 0 0 0', padding: '0 0 0 16px', lineHeight: 1.6 }}>
              <li>Drag the steps slider → ring fills live</li>
              <li>Profile → Stride Premium opens the upsell sheet</li>
              <li>Live Walk auto-counts seconds & steps</li>
            </ul>
          </div>

          <TweaksPanel tweaks={tweaks} setTweak={setTweak} screen={screen} setScreen={setScreen} />
        </div>
      </div>
    </div>
  );
}

function DeviceShell({ children, theme, dark }) {
  return (
    <div style={{
      width: 380, height: 820, borderRadius: 44, padding: 8,
      background: dark ? '#2a2520' : '#cfc6b3',
      boxShadow: '0 40px 80px rgba(31, 60, 41, 0.18), 0 12px 30px rgba(31, 60, 41, 0.10)',
      position: 'relative',
    }}>
      <div style={{
        width: '100%', height: '100%', borderRadius: 36,
        background: theme.bg, overflow: 'hidden',
        display: 'flex', flexDirection: 'column', position: 'relative',
      }}>
        <div style={{
          position: 'absolute', top: 14, left: '50%', transform: 'translateX(-50%)',
          width: 10, height: 10, borderRadius: '50%', background: '#000', zIndex: 100,
        }} />
        <div style={{
          height: 36, padding: '0 22px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          ...TYPE.mono, fontSize: 12, color: theme.text, flexShrink: 0,
        }}>
          <span>9:30</span>
          <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
            <svg width="14" height="11" viewBox="0 0 14 11" fill={theme.text}>
              <rect x="0" y="8" width="2" height="3" rx="0.5"/>
              <rect x="4" y="6" width="2" height="5" rx="0.5"/>
              <rect x="8" y="3" width="2" height="8" rx="0.5"/>
              <rect x="12" y="0" width="2" height="11" rx="0.5"/>
            </svg>
            <svg width="14" height="11" viewBox="0 0 14 11" fill="none" stroke={theme.text} strokeWidth="1.2">
              <path d="M1 4.5C3 2.5 11 2.5 13 4.5"/>
              <path d="M3 6.5C5 5 9 5 11 6.5"/>
              <path d="M5 8.5C6 7.5 8 7.5 9 8.5"/>
              <circle cx="7" cy="9.5" r="0.6" fill={theme.text}/>
            </svg>
            <svg width="22" height="11" viewBox="0 0 22 11">
              <rect x="0.5" y="0.5" width="18" height="10" rx="2" fill="none" stroke={theme.text} strokeWidth="1"/>
              <rect x="2" y="2" width="13" height="7" rx="1" fill={theme.accent}/>
              <rect x="19" y="3" width="2" height="5" rx="1" fill={theme.text}/>
            </svg>
          </div>
        </div>
        {children}
        <div style={{ height: 22, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <div style={{ width: 100, height: 4, borderRadius: 2, background: theme.text, opacity: 0.4 }} />
        </div>
      </div>
    </div>
  );
}

function TweaksPanel({ tweaks, setTweak, screen, setScreen }) {
  const [open, setOpen] = useState(false);

  return (
    <div style={{ marginTop: 20 }}>
      <button onClick={() => setOpen(o => !o)} style={{
        width: '100%', padding: '10px 14px', borderRadius: 10,
        background: open ? 'rgba(31,60,41,0.12)' : 'rgba(31,60,41,0.06)',
        border: '1px solid rgba(31,60,41,0.12)',
        color: '#3a3528', cursor: 'pointer',
        ...TYPE.sans, fontSize: 12, fontWeight: 600,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <span>⚙ Tweaks</span>
        <span style={{ opacity: 0.5, fontSize: 10 }}>{open ? '▲' : '▼'}</span>
      </button>

      {open && (
        <div style={{
          marginTop: 8, padding: '14px', borderRadius: 12,
          background: 'rgba(250,249,247,0.9)',
          border: '1px solid rgba(255,255,255,0.6)',
          boxShadow: '0 8px 24px rgba(0,0,0,0.10)',
          display: 'flex', flexDirection: 'column', gap: 14,
          ...TYPE.sans, fontSize: 12, color: '#29261b',
        }}>
          <TweakSection label="Palette">
            <div style={{ display: 'flex', gap: 6 }}>
              {PALETTES.map((p, i) => {
                const active = JSON.stringify(tweaks.palette) === JSON.stringify(p);
                return (
                  <button key={i} onClick={() => setTweak('palette', p)} style={{
                    flex: 1, height: 36, borderRadius: 6, cursor: 'pointer',
                    background: p[0], border: active ? `2px solid ${p[1]}` : '1.5px solid rgba(0,0,0,0.15)',
                    position: 'relative', overflow: 'hidden',
                  }}>
                    <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: '35%', background: p[1] }} />
                  </button>
                );
              })}
            </div>
          </TweakSection>

          <TweakToggleRow label="Dark mode" value={tweaks.dark} onChange={(v) => setTweak('dark', v)} />

          <TweakSection label="Goals & data">
            <TweakSliderRow label="Step goal" value={tweaks.stepGoal} min={4000} max={20000} step={500}
              onChange={(v) => setTweak('stepGoal', v)} />
            <TweakSliderRow label="Today's steps" value={tweaks.currentSteps} min={0} max={20000} step={100}
              onChange={(v) => setTweak('currentSteps', v)} />
            <TweakToggleRow label="Weight panel" value={tweaks.showWeightPanel} onChange={(v) => setTweak('showWeightPanel', v)} />
            <TweakToggleRow label="Metric units" value={tweaks.metric} onChange={(v) => setTweak('metric', v)} />
          </TweakSection>

          <TweakSection label="Navigate">
            <select value={screen} onChange={(e) => setScreen(e.target.value)} style={{
              width: '100%', padding: '6px 8px', borderRadius: 7,
              border: '0.5px solid rgba(0,0,0,0.12)',
              background: 'rgba(255,255,255,0.7)', color: '#29261b',
              ...TYPE.sans, fontSize: 12, cursor: 'pointer',
            }}>
              {[
                { value: 'onboarding', label: 'Onboarding' },
                { value: 'home', label: 'Home / Today' },
                { value: 'weight', label: 'Weight loss' },
                { value: 'history', label: 'Trends' },
                { value: 'walk', label: 'Live walk' },
                { value: 'achievements', label: 'Achievements' },
                { value: 'friends', label: 'Friends' },
                { value: 'profile', label: 'Profile' },
              ].map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </TweakSection>
        </div>
      )}
    </div>
  );
}

function TweakSection({ label, children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(41,38,27,0.45)' }}>{label}</div>
      {children}
    </div>
  );
}

function TweakToggleRow({ label, value, onChange }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <span style={{ fontSize: 12, color: 'rgba(41,38,27,0.72)', fontWeight: 500 }}>{label}</span>
      <button type="button" onClick={() => onChange(!value)} style={{
        position: 'relative', width: 32, height: 18, border: 0, borderRadius: 999,
        background: value ? '#34c759' : 'rgba(0,0,0,0.15)',
        transition: 'background 0.15s', cursor: 'pointer', padding: 0,
      }}>
        <span style={{
          position: 'absolute', top: 2, left: value ? 16 : 2,
          width: 14, height: 14, borderRadius: '50%',
          background: '#fff', boxShadow: '0 1px 2px rgba(0,0,0,0.25)',
          transition: 'left 0.15s', display: 'block',
        }} />
      </button>
    </div>
  );
}

function TweakSliderRow({ label, value, min, max, step, onChange }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'rgba(41,38,27,0.72)' }}>
        <span style={{ fontWeight: 500 }}>{label}</span>
        <span style={{ color: 'rgba(41,38,27,0.5)', fontVariantNumeric: 'tabular-nums' }}>{value.toLocaleString()}</span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{ width: '100%', accentColor: '#34D399' }} />
    </div>
  );
}
