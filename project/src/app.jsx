// MAIN APP — wires screens, navigation, tweaks panel, android frame

function App() {
  const [t, setTweak] = useTweaks(window.__TWEAK_DEFAULTS);
  const [screen, setScreen] = React.useState(t.hasOnboarded ? 'home' : 'onboarding');
  const theme = useTheme(t.dark, t.palette);

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
  // bottom-nav screens (everything except onboarding & walk)
  const showBottomNav = !['onboarding', 'walk'].includes(screen);

  // Map screen → bottom-nav active id
  const navMap = { home: 'home', history: 'history', friends: 'friends',
                   profile: 'profile', weight: 'home', achievements: 'profile' };

  return (
    <>
      <TweaksPanel title="Tweaks">
        <TweakSection label="Theme">
          <TweakColor label="Palette" value={t.palette}
            options={[
              ['#0F1B14', '#34D399', '#F5F1EA', '#A8D5A2'], // forest/mint
              ['#1A1612', '#E8C26B', '#F5F1EA', '#C7A35E'], // earth/gold
              ['#0F1418', '#7DD3FC', '#F5F1EA', '#0EA5E9'], // ink/sky
              ['#1A1316', '#E8967A', '#F5F1EA', '#C26A4F'], // clay/rose
              ['#F5F1EA', '#1F8A5B', '#1C2418', '#34D399'], // light/forest
            ]}
            onChange={(v) => setTweak('palette', v)} />
          <TweakToggle label="Dark mode" value={t.dark} onChange={(v) => setTweak('dark', v)} />
        </TweakSection>

        <TweakSection label="Goals & data">
          <TweakSlider label="Daily step goal" value={t.stepGoal}
            min={4000} max={20000} step={500} unit=""
            onChange={(v) => setTweak('stepGoal', v)} />
          <TweakSlider label="Today's progress" value={t.currentSteps}
            min={0} max={20000} step={100} unit=""
            onChange={(v) => setTweak('currentSteps', v)} />
          <TweakRadio label="Units" value={t.metric ? 'metric' : 'imperial'}
            options={[
              { value: 'metric', label: 'Metric' },
              { value: 'imperial', label: 'Imperial' },
            ]}
            onChange={(v) => setTweak('metric', v === 'metric')} />
          <TweakToggle label="Show weight panel" value={t.showWeightPanel}
            onChange={(v) => setTweak('showWeightPanel', v)} />
        </TweakSection>

        <TweakSection label="Navigate">
          <TweakSelect label="Jump to screen" value={screen}
            options={[
              { value: 'onboarding', label: 'Onboarding' },
              { value: 'home', label: 'Home / Today' },
              { value: 'weight', label: 'Weight loss' },
              { value: 'history', label: 'Trends' },
              { value: 'walk', label: 'Live walk' },
              { value: 'achievements', label: 'Achievements' },
              { value: 'friends', label: 'Friends' },
              { value: 'profile', label: 'Profile' },
            ]}
            onChange={(v) => setScreen(v)} />
        </TweakSection>
      </TweaksPanel>

      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        gap: 32, flexWrap: 'wrap',
      }}>
        <DeviceShell theme={theme} dark={t.dark}>
          <div style={{ display: 'flex', flexDirection: 'column', height: '100%',
            background: theme.bg, color: theme.text }}>
            <div className="stride-scroll" style={{ flex: 1, overflow: 'auto', minHeight: 0 }}>
              <Cur tweaks={t} theme={theme} nav={nav} setTweak={setTweak} app={{ screen, setScreen }} />
            </div>
            {showBottomNav && (
              <BottomNav active={navMap[screen] || screen} theme={theme}
                onChange={(id) => {
                  if (id === 'walk') setScreen('walk');
                  else setScreen(id);
                }} />
            )}
          </div>
        </DeviceShell>

        {/* Side caption */}
        <div style={{ maxWidth: 240, color: '#3a3528' }}>
          <div style={{ ...TYPE.sans, fontSize: 11, letterSpacing: '0.2em',
            textTransform: 'uppercase', color: '#7a715f' }}>Stride · v0.1</div>
          <div style={{ ...TYPE.serif, fontSize: 22, lineHeight: 1.25,
            color: '#1c2418', marginTop: 8, fontStyle: 'italic' }}>
            A premium wellness step counter for the long walk.
          </div>
          <div style={{ ...TYPE.sans, fontSize: 12, color: '#5a5447',
            marginTop: 12, lineHeight: 1.6 }}>
            Eight screens, one continuous flow. Tap the floating <strong>walk</strong> button
            to start a session, the avatar for profile, or use Tweaks to toggle palette,
            goals, and live progress.
          </div>
          <div style={{ marginTop: 16, padding: '12px 14px',
            background: 'rgba(31,60,41,0.06)', borderRadius: 12, border: '1px solid rgba(31,60,41,0.1)' }}>
            <div style={{ ...TYPE.sans, fontSize: 10.5, letterSpacing: '0.16em',
              textTransform: 'uppercase', color: '#7a715f' }}>Try this</div>
            <ul style={{ ...TYPE.sans, fontSize: 12, color: '#3a3528',
              margin: '6px 0 0 0', padding: '0 0 0 16px', lineHeight: 1.6 }}>
              <li>Drag the steps slider in Tweaks → ring fills live</li>
              <li>Profile → Stride Premium opens the upsell sheet</li>
              <li>Live Walk auto-counts seconds & steps</li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}

// Custom slimmer device shell — Android-inspired but tuned for Stride
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
        display: 'flex', flexDirection: 'column',
        position: 'relative',
      }}>
        {/* Camera punch hole */}
        <div style={{
          position: 'absolute', top: 14, left: '50%',
          transform: 'translateX(-50%)',
          width: 10, height: 10, borderRadius: '50%',
          background: '#000', zIndex: 100,
        }} />
        {/* Status bar */}
        <div style={{
          height: 36, padding: '0 22px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          ...TYPE.mono, fontSize: 12, color: theme.text,
          flexShrink: 0,
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
        {/* Home indicator */}
        <div style={{ height: 22, display: 'flex', alignItems: 'center',
          justifyContent: 'center', flexShrink: 0 }}>
          <div style={{ width: 100, height: 4, borderRadius: 2,
            background: theme.text, opacity: 0.4 }} />
        </div>
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
