// PROFILE + PREMIUM SUBSCRIPTION

function ProfileScreen({ tweaks, theme, nav, setTweak }) {
  const [showPremium, setShowPremium] = React.useState(false);

  return (
    <div data-screen-label="07 Profile" style={{
      background: theme.bg, color: theme.text, minHeight: '100%', paddingBottom: 24,
    }}>
      <AppBar theme={theme}
        leading={<IconButton theme={theme} variant="soft" onClick={() => nav('home')}>
          <IconArrowLeft size={16} color={theme.text} /></IconButton>}
        title="Profile"
        trailing={<IconButton theme={theme} variant="soft"><IconSettings size={16} color={theme.text} /></IconButton>}
      />

      {/* Profile header */}
      <div style={{ padding: '8px 22px 20px', textAlign: 'center' }}>
        <div style={{
          width: 88, height: 88, borderRadius: '50%',
          background: `linear-gradient(135deg, ${theme.accent}, ${theme.warm})`,
          margin: '0 auto', display: 'flex',
          alignItems: 'center', justifyContent: 'center',
          ...TYPE.serif, fontSize: 36, color: theme.bg, fontWeight: 500,
          border: `3px solid ${theme.bg}`,
          boxShadow: `0 0 0 2px ${theme.accent}`,
        }}>M</div>
        <div style={{ ...TYPE.display, fontSize: 24, color: theme.text, marginTop: 12 }}>Maya Chen</div>
        <div style={{ ...TYPE.sans, fontSize: 13, color: theme.textDim, marginTop: 2 }}>
          Joined April 2026 · Level 12
        </div>
        <div style={{ display: 'flex', gap: 6, justifyContent: 'center', marginTop: 10 }}>
          <Pill theme={theme} tone="accent" icon={<IconLeaf size={11} />}>Trailblazer</Pill>
          <Pill theme={theme} tone="warm" icon={<IconFire size={11} />}>28 day streak</Pill>
        </div>
      </div>

      {/* Premium upsell */}
      <div style={{ padding: '0 16px 18px' }}>
        <Card theme={theme} padding={0} onClick={() => setShowPremium(true)} style={{
          overflow: 'hidden', position: 'relative', cursor: 'pointer',
          background: `linear-gradient(135deg, #1a2920 0%, #1f2f25 100%)`,
          border: `1px solid ${theme.warmSoft}`,
        }}>
          <div style={{ position: 'absolute', top: -20, right: -20, width: 140, height: 140,
            borderRadius: '50%', background: theme.warmSoft, filter: 'blur(40px)' }} />
          <div style={{ padding: '18px 18px', position: 'relative',
            display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{
              width: 48, height: 48, borderRadius: 14,
              background: theme.warm, color: theme.bg,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <IconCrown size={22} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ ...TYPE.serif, fontSize: 18, color: theme.text, fontWeight: 500 }}>
                  Stride Premium
                </span>
                <span style={{ ...TYPE.sans, fontSize: 9, padding: '2px 6px',
                  background: theme.warm, color: theme.bg, borderRadius: 4,
                  letterSpacing: '0.1em', fontWeight: 700 }}>SOON</span>
              </div>
              <div style={{ ...TYPE.sans, fontSize: 12, color: theme.textDim, marginTop: 2 }}>
                Coaching, advanced analytics, ad-free
              </div>
            </div>
            <IconArrowRight size={18} color={theme.text} />
          </div>
        </Card>
      </div>

      {/* Lifetime stats */}
      <div style={{ padding: '0 16px' }}>
        <SectionHeader theme={theme} title="Lifetime" />
        <Card theme={theme} padding={0}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
            <LifeCell theme={theme} label="Total steps" value="312,480" />
            <LifeCell theme={theme} label="Distance" value={tweaks.metric ? '237.5 km' : '147.6 mi'} border />
            <LifeCell theme={theme} label="Active days" value="84" top />
            <LifeCell theme={theme} label="Calories" value="124k" top border />
          </div>
        </Card>
      </div>

      {/* Settings list */}
      <div style={{ padding: '20px 16px 0' }}>
        <SectionHeader theme={theme} title="Preferences" />
        <Card theme={theme} padding={0}>
          <SettingRow theme={theme} icon={<IconBell size={16} />} label="Notifications" sub="Goal, friends, reminders" />
          <SettingRow theme={theme} icon={<IconHeart size={16} />} label="Connected health" sub="Google Fit · Wear OS" />
          <SettingRow theme={theme} icon={<IconShield size={16} />} label="Privacy" sub="Who sees your activity" />
          <SettingRow theme={theme} icon={<IconLock size={16} />} label="Account" sub="maya.chen@…" last />
        </Card>
      </div>

      {/* Quick access tiles */}
      <div style={{ padding: '20px 16px 0' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <QuickTile theme={theme} icon={<IconTrophy size={18} />} label="Achievements" sub="3 of 6 unlocked"
            onClick={() => nav('achievements')} />
          <QuickTile theme={theme} icon={<IconScale size={18} />} label="Weight loss" sub="−4.0 kg this month"
            onClick={() => nav('weight')} />
        </div>
      </div>

      {/* Premium modal */}
      {showPremium && <PremiumSheet theme={theme} onClose={() => setShowPremium(false)} />}
    </div>
  );
}

function LifeCell({ theme, label, value, top, border }) {
  return (
    <div style={{
      padding: '14px 16px',
      borderTop: top ? `1px solid ${theme.border}` : 'none',
      borderLeft: border ? `1px solid ${theme.border}` : 'none',
    }}>
      <div style={{ ...TYPE.sans, fontSize: 10.5, letterSpacing: '0.16em',
        color: theme.textMuted, textTransform: 'uppercase' }}>{label}</div>
      <div style={{ ...TYPE.display, fontSize: 22, color: theme.text, marginTop: 4 }}>{value}</div>
    </div>
  );
}

function SettingRow({ theme, icon, label, sub, last }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 12,
      padding: '14px 16px',
      borderTop: last ? `1px solid ${theme.border}` : 'none',
      borderBottom: !last ? `1px solid ${theme.border}` : 'none',
      cursor: 'pointer',
    }}>
      <div style={{ width: 34, height: 34, borderRadius: 10,
        background: theme.surfaceAlt, color: theme.textDim,
        display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{icon}</div>
      <div style={{ flex: 1 }}>
        <div style={{ ...TYPE.sans, fontSize: 13, color: theme.text, fontWeight: 500 }}>{label}</div>
        <div style={{ ...TYPE.sans, fontSize: 11, color: theme.textDim, marginTop: 1 }}>{sub}</div>
      </div>
      <IconArrowRight size={14} color={theme.textMuted} />
    </div>
  );
}

function QuickTile({ theme, icon, label, sub, onClick }) {
  return (
    <Card theme={theme} padding={14} onClick={onClick}>
      <div style={{ color: theme.accent, marginBottom: 8 }}>{icon}</div>
      <div style={{ ...TYPE.sans, fontSize: 13, color: theme.text, fontWeight: 600 }}>{label}</div>
      <div style={{ ...TYPE.sans, fontSize: 11, color: theme.textDim, marginTop: 2 }}>{sub}</div>
    </Card>
  );
}

function PremiumSheet({ theme, onClose }) {
  const features = [
    { icon: <IconBolt size={16} />, title: 'AI walking coach', desc: 'Personalized weekly plans, voice cues during walks' },
    { icon: <IconChart size={16} />, title: 'Advanced analytics', desc: 'VO2 max, recovery, training load' },
    { icon: <IconHeart size={16} />, title: 'Health integrations', desc: 'Apple Health, Garmin, Whoop, Oura' },
    { icon: <IconShield size={16} />, title: 'Ad-free forever', desc: 'No banners, no upsells, ever' },
    { icon: <IconUsers size={16} />, title: 'Family plan', desc: 'Up to 6 accounts on one subscription' },
  ];

  return (
    <div style={{
      position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.55)',
      display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
      zIndex: 50, animation: 'slideUp 240ms ease',
    }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{
        background: theme.bg, width: '100%',
        borderRadius: '20px 20px 0 0',
        border: `1px solid ${theme.border}`,
        maxHeight: '92%', overflow: 'auto', paddingBottom: 20,
      }} className="stride-scroll">
        <div style={{ display: 'flex', justifyContent: 'center', padding: '10px 0' }}>
          <div style={{ width: 36, height: 4, borderRadius: 2, background: theme.borderStrong }} />
        </div>
        <div style={{ padding: '8px 22px 18px', textAlign: 'center' }}>
          <div style={{ width: 56, height: 56, borderRadius: 16,
            background: theme.warm, color: theme.bg,
            margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <IconCrown size={26} />
          </div>
          <div style={{ ...TYPE.display, fontSize: 28, color: theme.text, marginTop: 14 }}>
            Stride Premium
          </div>
          <div style={{ ...TYPE.serif, fontSize: 14, fontStyle: 'italic',
            color: theme.textDim, marginTop: 4 }}>
            Coming this summer · join the waitlist
          </div>
        </div>

        <div style={{ padding: '0 18px' }}>
          {features.map((f, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'flex-start', gap: 12,
              padding: '12px 0',
              borderBottom: i < features.length - 1 ? `1px solid ${theme.border}` : 'none',
            }}>
              <div style={{ width: 32, height: 32, borderRadius: 10,
                background: theme.accentSoft, color: theme.accent,
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                {f.icon}
              </div>
              <div>
                <div style={{ ...TYPE.sans, fontSize: 14, color: theme.text, fontWeight: 600 }}>{f.title}</div>
                <div style={{ ...TYPE.sans, fontSize: 12, color: theme.textDim, marginTop: 2 }}>{f.desc}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Plan choice */}
        <div style={{ padding: '18px 18px 0' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <div style={{
              border: `1px solid ${theme.border}`, borderRadius: 14,
              padding: 14, position: 'relative',
            }}>
              <div style={{ ...TYPE.sans, fontSize: 11, letterSpacing: '0.14em',
                color: theme.textMuted, textTransform: 'uppercase' }}>Monthly</div>
              <div style={{ ...TYPE.display, fontSize: 24, color: theme.text, marginTop: 6 }}>
                $5.99<span style={{ ...TYPE.mono, fontSize: 11, color: theme.textDim }}>/mo</span>
              </div>
              <div style={{ ...TYPE.sans, fontSize: 11, color: theme.textDim, marginTop: 4 }}>Cancel anytime</div>
            </div>
            <div style={{
              border: `2px solid ${theme.accent}`, borderRadius: 14,
              padding: 14, position: 'relative',
              background: theme.accentSoft,
            }}>
              <div style={{ position: 'absolute', top: -10, right: 10,
                background: theme.accent, color: theme.bg,
                padding: '3px 8px', borderRadius: 6,
                ...TYPE.sans, fontSize: 9, fontWeight: 700, letterSpacing: '0.1em' }}>
                BEST VALUE
              </div>
              <div style={{ ...TYPE.sans, fontSize: 11, letterSpacing: '0.14em',
                color: theme.accent, textTransform: 'uppercase', fontWeight: 600 }}>Yearly</div>
              <div style={{ ...TYPE.display, fontSize: 24, color: theme.text, marginTop: 6 }}>
                $39<span style={{ ...TYPE.mono, fontSize: 11, color: theme.textDim }}>/yr</span>
              </div>
              <div style={{ ...TYPE.sans, fontSize: 11, color: theme.accent, marginTop: 4 }}>Save 45%</div>
            </div>
          </div>

          <button style={{
            width: '100%', marginTop: 16,
            padding: '14px 18px', borderRadius: 14,
            background: theme.accent, color: theme.bg, border: 'none',
            ...TYPE.sans, fontSize: 14, fontWeight: 600, letterSpacing: '0.06em',
            cursor: 'pointer',
          }}>
            Join the waitlist · Get 50% off launch
          </button>
          <div style={{ textAlign: 'center', marginTop: 10,
            ...TYPE.sans, fontSize: 11, color: theme.textMuted }}>
            We'll notify you when it's ready · No charge today
          </div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { ProfileScreen });
