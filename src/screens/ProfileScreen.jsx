import { useState, useEffect } from 'react';
import { TYPE } from '../theme.js';
import { AppBar, IconButton, Card, SectionHeader, Pill } from '../atoms.jsx';
import {
  IconArrowLeft, IconArrowRight, IconMore,
  IconLeaf, IconFire, IconCrown, IconBell, IconHeart,
  IconShield, IconLock, IconTrophy, IconScale, IconChart, IconUsers, IconBolt, IconX, IconCheck,
} from '../icons.jsx';

function loadPref(key, def) {
  try { const v = localStorage.getItem('stride:pref:' + key); return v === null ? def : JSON.parse(v); } catch { return def; }
}
function savePref(key, val) {
  try { localStorage.setItem('stride:pref:' + key, JSON.stringify(val)); } catch {}
}

function computeStreak(history, goal) {
  if (!history.length) return 0;
  const sorted = [...history].sort((a, b) => b.date.localeCompare(a.date));
  let streak = 0;
  for (let i = 0; i < sorted.length; i++) {
    const expected = new Date(Date.now() - i * 86400_000).toISOString().slice(0, 10);
    if (sorted[i].date === expected && sorted[i].steps >= goal) streak++;
    else break;
  }
  return streak;
}

export function ProfileScreen({ tweaks, theme, nav, onSignOut, onUpdateProfile, profile, stepsHistory = [], weightEntries = [] }) {
  const [showPremium, setShowPremium] = useState(false);
  const [showNotifModal, setShowNotifModal] = useState(false);
  const [showHealthModal, setShowHealthModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const [notifGoal, setNotifGoal] = useState(() => loadPref('notifGoal', true));
  const [notifFriends, setNotifFriends] = useState(() => loadPref('notifFriends', true));
  const [showOnLeaderboard, setShowOnLeaderboard] = useState(() => loadPref('showOnLeaderboard', true));

  useEffect(() => { savePref('notifGoal', notifGoal); }, [notifGoal]);
  useEffect(() => { savePref('notifFriends', notifFriends); }, [notifFriends]);
  useEffect(() => { savePref('showOnLeaderboard', showOnLeaderboard); }, [showOnLeaderboard]);

  const displayName = profile?.display_name || tweaks.userName || 'You';
  const username = profile?.username || '';
  const initial = displayName[0].toUpperCase();
  const joinDate = profile?.join_date
    ? new Date(profile.join_date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    : (tweaks.joinDate || 'Recently');

  const sorted = [...stepsHistory].sort((a, b) => a.date.localeCompare(b.date));
  const lifetimeSteps = sorted.reduce((s, r) => s + (r.steps ?? 0), 0);
  const lifetimeKm = (lifetimeSteps * 0.00076).toFixed(1);
  const lifetimeMi = (lifetimeSteps * 0.00076 * 0.621371).toFixed(1);
  const lifetimeCals = lifetimeSteps > 0 ? (Math.round(lifetimeSteps * 0.04 / 1000) + 'k') : '—';
  const activeDaysAll = sorted.filter(r => (r.steps ?? 0) > 0).length;
  const streak = computeStreak(stepsHistory, tweaks.stepGoal);

  const nowPrefix = new Date().toISOString().slice(0, 7);
  const monthWeight = weightEntries.filter(e => e.date?.startsWith(nowPrefix));
  const weightDelta = monthWeight.length >= 2
    ? (monthWeight[monthWeight.length - 1].weight_kg - monthWeight[0].weight_kg).toFixed(1)
    : null;

  const badgeCount = (() => {
    const best = sorted.reduce((b, r) => (r.steps ?? 0) > (b?.steps ?? 0) ? r : b, null);
    let count = 0;
    if (lifetimeSteps >= 1000) count++;
    if (stepsHistory.some(r => r.steps >= 10000)) count++;
    if (streak >= 7) count++;
    if (streak >= 30) count++;
    if (lifetimeSteps >= 500000) count++;
    if (lifetimeSteps >= 1000000) count++;
    return count;
  })();

  return (
    <div style={{ background: theme.bg, color: theme.text, minHeight: '100%', paddingBottom: 24, position: 'relative' }}>
      <AppBar theme={theme}
        leading={<IconButton theme={theme} variant="soft" onClick={() => nav('home')}><IconArrowLeft size={16} color={theme.text} /></IconButton>}
        title="Profile"
        trailing={
          <div style={{ display: 'flex', gap: 8 }}>
            <IconButton theme={theme} variant="soft" onClick={() => setShowEditModal(true)}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={theme.text} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
              </svg>
            </IconButton>
            <IconButton theme={theme} variant="soft" onClick={() => setShowNotifModal(true)}>
              <IconBell size={16} color={theme.text} />
            </IconButton>
          </div>
        }
      />

      <div style={{ padding: '8px 22px 20px', textAlign: 'center' }}>
        <div style={{
          width: 88, height: 88, borderRadius: '50%',
          background: `linear-gradient(135deg, ${theme.accent}, ${theme.warm})`,
          margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center',
          ...TYPE.serif, fontSize: 36, color: theme.bg, fontWeight: 500,
          border: `3px solid ${theme.bg}`, boxShadow: `0 0 0 2px ${theme.accent}`,
          cursor: 'pointer',
        }} onClick={() => setShowEditModal(true)}>{initial}</div>
        <div style={{ ...TYPE.display, fontSize: 24, color: theme.text, marginTop: 12 }}>{displayName}</div>
        {username && (
          <div style={{ ...TYPE.mono, fontSize: 12, color: theme.textMuted, marginTop: 2 }}>@{username}</div>
        )}
        <div style={{ ...TYPE.sans, fontSize: 13, color: theme.textDim, marginTop: 2 }}>Joined {joinDate}</div>
        <div style={{ display: 'flex', gap: 6, justifyContent: 'center', marginTop: 10, flexWrap: 'wrap' }}>
          {streak > 0 && <Pill theme={theme} tone="warm" icon={<IconFire size={11} />}>{streak} day streak</Pill>}
          {lifetimeSteps > 0 && <Pill theme={theme} tone="accent" icon={<IconLeaf size={11} />}>{(lifetimeSteps / 1000).toFixed(0)}k steps</Pill>}
          {streak === 0 && lifetimeSteps === 0 && <Pill theme={theme} tone="accent" icon={<IconLeaf size={11} />}>Just starting</Pill>}
        </div>
      </div>

      <div style={{ padding: '0 16px 18px' }}>
        <Card theme={theme} padding={0} onClick={() => setShowPremium(true)} style={{
          overflow: 'hidden', position: 'relative', cursor: 'pointer',
          background: 'linear-gradient(135deg, #1a2920 0%, #1f2f25 100%)',
          border: `1px solid ${theme.warmSoft}`,
        }}>
          <div style={{ position: 'absolute', top: -20, right: -20, width: 140, height: 140, borderRadius: '50%', background: theme.warmSoft, filter: 'blur(40px)' }} />
          <div style={{ padding: '18px 18px', position: 'relative', display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 48, height: 48, borderRadius: 14, background: theme.warm, color: theme.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <IconCrown size={22} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ ...TYPE.serif, fontSize: 18, color: theme.text, fontWeight: 500 }}>Stride Premium</span>
                <span style={{ ...TYPE.sans, fontSize: 9, padding: '2px 6px', background: theme.warm, color: theme.bg, borderRadius: 4, letterSpacing: '0.1em', fontWeight: 700 }}>SOON</span>
              </div>
              <div style={{ ...TYPE.sans, fontSize: 12, color: theme.textDim, marginTop: 2 }}>Coaching, advanced analytics, ad-free</div>
            </div>
            <IconArrowRight size={18} color={theme.text} />
          </div>
        </Card>
      </div>

      <div style={{ padding: '0 16px' }}>
        <SectionHeader theme={theme} title="Lifetime" />
        <Card theme={theme} padding={0}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
            <LifeCell theme={theme} label="Total steps" value={lifetimeSteps > 0 ? lifetimeSteps.toLocaleString() : '—'} />
            <LifeCell theme={theme} label="Distance" value={lifetimeSteps > 0 ? (tweaks.metric ? lifetimeKm + ' km' : lifetimeMi + ' mi') : '—'} border />
            <LifeCell theme={theme} label="Active days" value={activeDaysAll > 0 ? String(activeDaysAll) : '—'} top />
            <LifeCell theme={theme} label="Calories" value={lifetimeCals} top border />
          </div>
        </Card>
      </div>

      <div style={{ padding: '20px 16px 0' }}>
        <SectionHeader theme={theme} title="Preferences" />
        <Card theme={theme} padding={0}>
          <SettingRow theme={theme} icon={<IconBell size={16} />} label="Notifications" sub={notifGoal || notifFriends ? 'Goal, friends, reminders' : 'All notifications off'} onClick={() => setShowNotifModal(true)} />
          <SettingRow theme={theme} icon={<IconHeart size={16} />} label="Connected health" sub="Google Fit · Health Connect" onClick={() => setShowHealthModal(true)} />
          <SettingRow theme={theme} icon={<IconShield size={16} />} label="Privacy" sub={showOnLeaderboard ? 'Visible on leaderboard' : 'Hidden from leaderboard'} onClick={() => setShowPrivacyModal(true)} />
          <SettingRow theme={theme} icon={<IconLock size={16} />} label="Sign out" sub="Tap to sign out" last onClick={onSignOut} />
        </Card>
      </div>

      <div style={{ padding: '20px 16px 0' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <QuickTile theme={theme} icon={<IconTrophy size={18} />} label="Achievements" sub={`${badgeCount} of 6 unlocked`} onClick={() => nav('achievements')} />
          <QuickTile theme={theme} icon={<IconScale size={18} />} label="Weight"
            sub={weightDelta !== null ? `${parseFloat(weightDelta) <= 0 ? '' : '+'}${weightDelta} ${tweaks.metric ? 'kg' : 'lb'} this month` : 'Log your weight'}
            onClick={() => nav('weight')} />
        </div>
      </div>

      {showPremium && <PremiumSheet theme={theme} onClose={() => setShowPremium(false)} />}
      {showEditModal && <EditProfileSheet theme={theme} profile={profile} tweaks={tweaks} onUpdateProfile={onUpdateProfile} onClose={() => setShowEditModal(false)} />}

      {showNotifModal && (
        <BottomSheet theme={theme} title="Notifications" onClose={() => setShowNotifModal(false)}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <ToggleRow theme={theme} label="Daily goal reminder" sub="Alert when you're close to your step goal" value={notifGoal} onChange={setNotifGoal} />
            <ToggleRow theme={theme} label="Friend activity" sub="When friends beat you on the leaderboard" value={notifFriends} onChange={setNotifFriends} />
          </div>
          <div style={{ ...TYPE.sans, fontSize: 11, color: theme.textMuted, marginTop: 14, lineHeight: 1.5 }}>
            Note: push notifications require the native app. Browser alerts are limited.
          </div>
        </BottomSheet>
      )}

      {showHealthModal && (
        <BottomSheet theme={theme} title="Connected Health" onClose={() => setShowHealthModal(false)}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', padding: '12px 0', borderBottom: `1px solid ${theme.border}` }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: theme.accentSoft, color: theme.accent, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <IconHeart size={16} />
              </div>
              <div>
                <div style={{ ...TYPE.sans, fontSize: 13, fontWeight: 600, color: theme.text }}>Google Health Connect</div>
                <div style={{ ...TYPE.sans, fontSize: 12, color: theme.textDim, marginTop: 2, lineHeight: 1.5 }}>
                  For background step counting, enable Health Connect on your Android device.
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', padding: '12px 0' }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: theme.warmSoft, color: theme.warm, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <IconBolt size={16} />
              </div>
              <div>
                <div style={{ ...TYPE.sans, fontSize: 13, fontWeight: 600, color: theme.text }}>Wear OS · Garmin · Fitbit</div>
                <div style={{ ...TYPE.sans, fontSize: 12, color: theme.textDim, marginTop: 2, lineHeight: 1.5 }}>
                  Wearable sync coming in a future update via Health Connect integration.
                </div>
              </div>
            </div>
          </div>
        </BottomSheet>
      )}

      {showPrivacyModal && (
        <BottomSheet theme={theme} title="Privacy" onClose={() => setShowPrivacyModal(false)}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <ToggleRow theme={theme} label="Show me on leaderboard" sub="Friends can see your daily step count" value={showOnLeaderboard} onChange={setShowOnLeaderboard} />
          </div>
          <div style={{ ...TYPE.sans, fontSize: 11, color: theme.textMuted, marginTop: 14, lineHeight: 1.5 }}>
            When hidden, you still see your friends but they won't see you in their rankings.
          </div>
        </BottomSheet>
      )}
    </div>
  );
}

function EditProfileSheet({ theme, profile, tweaks, onUpdateProfile, onClose }) {
  const [displayName, setDisplayName] = useState(profile?.display_name || tweaks.userName || '');
  const [username, setUsername] = useState(profile?.username || '');
  const [stepGoal, setStepGoal] = useState(profile?.step_goal ?? tweaks.stepGoal ?? 10000);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);

  async function handleSave() {
    if (!displayName.trim()) { setError('Name cannot be empty'); return; }
    if (username && !/^[a-z0-9_]{3,20}$/.test(username)) {
      setError('Username: 3–20 chars, lowercase letters, numbers, underscores only');
      return;
    }
    setSaving(true);
    setError('');
    const updates = {
      display_name: displayName.trim(),
      step_goal: stepGoal,
    };
    if (username.trim()) updates.username = username.trim().toLowerCase();
    const err = await onUpdateProfile(updates);
    setSaving(false);
    if (err) { setError(err.message || 'Save failed'); return; }
    setSaved(true);
    setTimeout(onClose, 800);
  }

  return (
    <BottomSheet theme={theme} title="Edit profile" onClose={onClose}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <Field theme={theme} label="Display name">
          <input value={displayName} onChange={e => setDisplayName(e.target.value)}
            placeholder="Your name"
            style={{ width: '100%', boxSizing: 'border-box', padding: '11px 14px', borderRadius: 10, background: theme.surface, border: `1px solid ${theme.border}`, color: theme.text, ...TYPE.sans, fontSize: 14, outline: 'none' }} />
        </Field>

        <Field theme={theme} label="Username" hint="Used for friend requests — must be unique">
          <input value={username} onChange={e => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
            placeholder="e.g. john_doe"
            style={{ width: '100%', boxSizing: 'border-box', padding: '11px 14px', borderRadius: 10, background: theme.surface, border: `1px solid ${theme.border}`, color: theme.text, ...TYPE.sans, fontSize: 14, outline: 'none' }} />
        </Field>

        <Field theme={theme} label={`Daily step goal · ${stepGoal.toLocaleString()}`}>
          <input type="range" min="3000" max="20000" step="500" value={stepGoal}
            onChange={e => setStepGoal(Number(e.target.value))}
            style={{ width: '100%', accentColor: theme.accent }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', ...TYPE.mono, fontSize: 10, color: theme.textMuted, marginTop: 2 }}>
            <span>3k</span><span>20k</span>
          </div>
        </Field>

        {error && <div style={{ ...TYPE.sans, fontSize: 12, color: '#ef4444' }}>{error}</div>}

        <button onClick={handleSave} disabled={saving || saved} style={{
          width: '100%', padding: '14px', borderRadius: 14,
          background: saved ? theme.accentDim : theme.accent, color: theme.bg, border: 'none',
          ...TYPE.sans, fontSize: 14, fontWeight: 600, cursor: saving ? 'not-allowed' : 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          opacity: saving ? 0.7 : 1,
        }}>
          {saved ? <><IconCheck size={16} /> Saved!</> : saving ? 'Saving…' : 'Save changes'}
        </button>
      </div>
    </BottomSheet>
  );
}

function Field({ theme, label, hint, children }) {
  return (
    <div>
      <div style={{ ...TYPE.sans, fontSize: 11, fontWeight: 600, color: theme.textDim, marginBottom: 6, letterSpacing: '0.06em' }}>{label}</div>
      {hint && <div style={{ ...TYPE.sans, fontSize: 11, color: theme.textMuted, marginBottom: 6 }}>{hint}</div>}
      {children}
    </div>
  );
}

function LifeCell({ theme, label, value, top, border }) {
  return (
    <div style={{ padding: '14px 16px', borderTop: top ? `1px solid ${theme.border}` : 'none', borderLeft: border ? `1px solid ${theme.border}` : 'none' }}>
      <div style={{ ...TYPE.sans, fontSize: 10.5, letterSpacing: '0.16em', color: theme.textMuted, textTransform: 'uppercase' }}>{label}</div>
      <div style={{ ...TYPE.display, fontSize: 22, color: theme.text, marginTop: 4 }}>{value}</div>
    </div>
  );
}

function SettingRow({ theme, icon, label, sub, last, onClick }) {
  return (
    <div onClick={onClick} style={{
      display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px',
      borderTop: last ? `1px solid ${theme.border}` : 'none',
      borderBottom: !last ? `1px solid ${theme.border}` : 'none',
      cursor: 'pointer',
    }}>
      <div style={{ width: 34, height: 34, borderRadius: 10, background: theme.surfaceAlt, color: theme.textDim, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{icon}</div>
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
    <div onClick={onClick} style={{
      background: theme.surface, border: `1px solid ${theme.border}`,
      borderRadius: 18, padding: 14, cursor: 'pointer',
    }}>
      <div style={{ color: theme.accent, marginBottom: 8 }}>{icon}</div>
      <div style={{ ...TYPE.sans, fontSize: 13, color: theme.text, fontWeight: 600 }}>{label}</div>
      <div style={{ ...TYPE.sans, fontSize: 11, color: theme.textDim, marginTop: 2 }}>{sub}</div>
    </div>
  );
}

function BottomSheet({ theme, title, onClose, children }) {
  return (
    <div style={{
      position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.55)',
      display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
      zIndex: 50,
    }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{
        background: theme.bg, width: '100%',
        borderRadius: '20px 20px 0 0', border: `1px solid ${theme.border}`,
        maxHeight: '80%', overflow: 'auto', paddingBottom: 24,
      }}>
        <div style={{ display: 'flex', justifyContent: 'center', padding: '10px 0 4px' }}>
          <div style={{ width: 36, height: 4, borderRadius: 2, background: theme.borderStrong }} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 18px 14px' }}>
          <span style={{ ...TYPE.sans, fontSize: 15, fontWeight: 600, color: theme.text }}>{title}</span>
          <IconButton theme={theme} variant="soft" onClick={onClose}><IconX size={14} color={theme.textDim} /></IconButton>
        </div>
        <div style={{ padding: '0 18px' }}>{children}</div>
      </div>
    </div>
  );
}

function ToggleRow({ theme, label, sub, value, onChange }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0', borderBottom: `1px solid ${theme.border}` }}>
      <div style={{ flex: 1 }}>
        <div style={{ ...TYPE.sans, fontSize: 13, fontWeight: 500, color: theme.text }}>{label}</div>
        <div style={{ ...TYPE.sans, fontSize: 11, color: theme.textDim, marginTop: 2 }}>{sub}</div>
      </div>
      <button type="button" onClick={() => onChange(v => !v)} style={{
        position: 'relative', width: 44, height: 24, border: 0, borderRadius: 999, flexShrink: 0,
        background: value ? theme.accent : theme.borderStrong,
        transition: 'background 0.15s', cursor: 'pointer', padding: 0,
      }}>
        <span style={{
          position: 'absolute', top: 3, left: value ? 22 : 3,
          width: 18, height: 18, borderRadius: '50%',
          background: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
          transition: 'left 0.15s', display: 'block',
        }} />
      </button>
    </div>
  );
}

function PremiumSheet({ theme, onClose }) {
  const [joined, setJoined] = useState(false);

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
        borderRadius: '20px 20px 0 0', border: `1px solid ${theme.border}`,
        maxHeight: '92%', overflow: 'auto', paddingBottom: 20,
      }}>
        <div style={{ display: 'flex', justifyContent: 'center', padding: '10px 0' }}>
          <div style={{ width: 36, height: 4, borderRadius: 2, background: theme.borderStrong }} />
        </div>
        <div style={{ padding: '8px 22px 18px', textAlign: 'center' }}>
          <div style={{ width: 56, height: 56, borderRadius: 16, background: theme.warm, color: theme.bg, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <IconCrown size={26} />
          </div>
          <div style={{ ...TYPE.display, fontSize: 28, color: theme.text, marginTop: 14 }}>Stride Premium</div>
          <div style={{ ...TYPE.serif, fontSize: 14, fontStyle: 'italic', color: theme.textDim, marginTop: 4 }}>Coming this summer · join the waitlist</div>
        </div>
        <div style={{ padding: '0 18px' }}>
          {features.map((f, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'flex-start', gap: 12, padding: '12px 0',
              borderBottom: i < features.length - 1 ? `1px solid ${theme.border}` : 'none',
            }}>
              <div style={{ width: 32, height: 32, borderRadius: 10, background: theme.accentSoft, color: theme.accent, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                {f.icon}
              </div>
              <div>
                <div style={{ ...TYPE.sans, fontSize: 14, color: theme.text, fontWeight: 600 }}>{f.title}</div>
                <div style={{ ...TYPE.sans, fontSize: 12, color: theme.textDim, marginTop: 2 }}>{f.desc}</div>
              </div>
            </div>
          ))}
        </div>
        <div style={{ padding: '18px 18px 0' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <div style={{ border: `1px solid ${theme.border}`, borderRadius: 14, padding: 14 }}>
              <div style={{ ...TYPE.sans, fontSize: 11, letterSpacing: '0.14em', color: theme.textMuted, textTransform: 'uppercase' }}>Monthly</div>
              <div style={{ ...TYPE.display, fontSize: 24, color: theme.text, marginTop: 6 }}>$5.99<span style={{ ...TYPE.mono, fontSize: 11, color: theme.textDim }}>/mo</span></div>
              <div style={{ ...TYPE.sans, fontSize: 11, color: theme.textDim, marginTop: 4 }}>Cancel anytime</div>
            </div>
            <div style={{ border: `2px solid ${theme.accent}`, borderRadius: 14, padding: 14, position: 'relative', background: theme.accentSoft }}>
              <div style={{ position: 'absolute', top: -10, right: 10, background: theme.accent, color: theme.bg, padding: '3px 8px', borderRadius: 6, ...TYPE.sans, fontSize: 9, fontWeight: 700, letterSpacing: '0.1em' }}>BEST VALUE</div>
              <div style={{ ...TYPE.sans, fontSize: 11, letterSpacing: '0.14em', color: theme.accent, textTransform: 'uppercase', fontWeight: 600 }}>Yearly</div>
              <div style={{ ...TYPE.display, fontSize: 24, color: theme.text, marginTop: 6 }}>$39<span style={{ ...TYPE.mono, fontSize: 11, color: theme.textDim }}>/yr</span></div>
              <div style={{ ...TYPE.sans, fontSize: 11, color: theme.accent, marginTop: 4 }}>Save 45%</div>
            </div>
          </div>
          {joined ? (
            <div style={{ marginTop: 16, padding: '14px', borderRadius: 14, background: theme.accentSoft, border: `1px solid ${theme.accent}`, textAlign: 'center', ...TYPE.sans, fontSize: 14, color: theme.accent, fontWeight: 600 }}>
              ✓ You're on the waitlist! We'll notify you at launch.
            </div>
          ) : (
            <button onClick={() => setJoined(true)} style={{ width: '100%', marginTop: 16, padding: '14px 18px', borderRadius: 14, background: theme.accent, color: theme.bg, border: 'none', ...TYPE.sans, fontSize: 14, fontWeight: 600, letterSpacing: '0.06em', cursor: 'pointer' }}>
              Join the waitlist · Get 50% off launch
            </button>
          )}
          <div style={{ textAlign: 'center', marginTop: 10, ...TYPE.sans, fontSize: 11, color: theme.textMuted }}>
            We'll notify you when it's ready · No charge today
          </div>
        </div>
      </div>
    </div>
  );
}
