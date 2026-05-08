import { useState } from 'react';
import { TYPE } from '../theme.js';
import { AppBar, IconButton, Card, SectionHeader, BarChart, Pill } from '../atoms.jsx';
import { IconCalendar, IconMap, IconFlame, IconCheck, IconStar, IconArrowUp } from '../icons.jsx';

export function HistoryScreen({ tweaks, theme, stepsHistory = [] }) {
  const { metric, stepGoal } = tweaks;
  const [tab, setTab] = useState('week');

  const toShortDay = (dateStr) => new Date(dateStr).toLocaleDateString('en-US', { weekday: 'short' }).slice(0, 1);
  const byDate = [...stepsHistory].sort((a, b) => a.date.localeCompare(b.date));
  const last7 = byDate.slice(-7);
  const week = {
    labels: last7.length > 0 ? last7.map((d) => toShortDay(d.date)) : ['M', 'T', 'W', 'T', 'F', 'S', 'S'],
    data: last7.length > 0 ? last7.map((d) => d.steps ?? 0) : [8420, 7842, 11240, 9180, 12300, 14820, 6240],
    highlight: last7.length > 0 ? last7.length - 1 : 1,
  };

  const last28 = byDate.slice(-28);
  const monthBuckets = [];
  if (last28.length > 0) {
    for (let i = 0; i < 4; i += 1) {
      const chunk = last28.slice(i * 7, i * 7 + 7);
      monthBuckets.push(chunk.reduce((sum, d) => sum + (d.steps ?? 0), 0));
    }
  }
  const month = {
    labels: ['W1', 'W2', 'W3', 'W4'],
    data: monthBuckets.length === 4 ? monthBuckets : [62400, 71200, 84300, 76840],
    highlight: monthBuckets.length === 4 ? 3 : 2,
  };

  const MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const yearBuckets = Array.from({ length: 12 }, (_, i) => {
    const d = new Date();
    d.setDate(1);
    d.setMonth(d.getMonth() - (11 - i));
    const prefix = d.toISOString().slice(0, 7);
    const rows = byDate.filter(r => r.date.startsWith(prefix));
    return {
      label: MONTH_LABELS[d.getMonth()].slice(0, 1),
      total: rows.reduce((s, r) => s + (r.steps ?? 0), 0),
    };
  });
  const year = {
    labels: yearBuckets.map(b => b.label),
    data: yearBuckets.map(b => b.total),
    highlight: 11,
  };

  const view = tab === 'week' ? week : tab === 'month' ? month : year;
  const total = view.data.reduce((a, b) => a + b, 0);
  const avg = Math.round(total / (tab === 'year' ? 12 : view.data.length));

  return (
    <div style={{ background: theme.bg, color: theme.text, minHeight: '100%', paddingBottom: 24 }}>
      <AppBar theme={theme} large title="Trends" subtitle={tab === 'year' ? 'Last 12 months' : tab === 'month' ? 'Last 30 days' : 'Last 7 days'}
        leading={null}
        trailing={<IconButton theme={theme} variant="soft"><IconCalendar size={16} color={theme.text} /></IconButton>}
      />

      <div style={{ padding: '4px 16px 16px' }}>
        <div style={{ display: 'flex', gap: 4, padding: 4, background: theme.surface, border: `1px solid ${theme.border}`, borderRadius: 12 }}>
          {['week', 'month', 'year'].map(t => (
            <button key={t} onClick={() => setTab(t)} style={{
              flex: 1, padding: '8px 10px', borderRadius: 8, cursor: 'pointer',
              border: 'none',
              background: tab === t ? theme.accent : 'transparent',
              color: tab === t ? theme.bg : theme.textDim,
              ...TYPE.sans, fontSize: 12, fontWeight: 500, letterSpacing: '0.06em',
              textTransform: 'capitalize',
            }}>{t}</button>
          ))}
        </div>
      </div>

      <div style={{ padding: '0 22px 14px' }}>
        <div style={{ ...TYPE.sans, fontSize: 11, letterSpacing: '0.18em', color: theme.textDim, textTransform: 'uppercase' }}>Daily average</div>
        <div style={{ ...TYPE.display, fontSize: 56, color: theme.text, lineHeight: 1, marginTop: 4 }}>
          {avg.toLocaleString()}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 6 }}>
          <Pill theme={theme} tone="accent" icon={<IconArrowUp size={11} />}>+12% vs last {tab}</Pill>
          <span style={{ ...TYPE.mono, fontSize: 11, color: theme.textMuted }}>{total.toLocaleString()} total</span>
        </div>
      </div>

      <div style={{ padding: '0 16px 0' }}>
        <Card theme={theme} padding={20}>
          <BarChart data={view.data} labels={view.labels} theme={theme}
            highlight={view.highlight} goal={tab === 'week' ? stepGoal : tab === 'month' ? stepGoal * 7 : stepGoal * 30}
            height={160} />
        </Card>
      </div>

      <div style={{ padding: '20px 16px 0' }}>
        <SectionHeader theme={theme} title="Records" />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <Record theme={theme} label="Best day" value="14,820" sub="Saturday" icon={<IconStar size={16} />} />
          <Record theme={theme} label="Total distance" value={metric ? '218.4' : '135.7'}
            unit={metric ? 'km' : 'mi'} sub="this month" icon={<IconMap size={16} />} />
          <Record theme={theme} label="Calories burned" value="68,420" sub="this month"
            icon={<IconFlame size={16} />} accent={theme.warm} />
          <Record theme={theme} label="Active days" value="26/30" sub="86% consistency" icon={<IconCheck size={16} />} />
        </div>
      </div>

      <div style={{ padding: '20px 16px 0' }}>
        <SectionHeader theme={theme} title="Pace breakdown" />
        <Card theme={theme} padding={18}>
          {[
            { label: 'Brisk', mins: 142, pct: 0.42, color: theme.accent },
            { label: 'Moderate', mins: 168, pct: 0.50, color: theme.accentDim },
            { label: 'Leisure', mins: 28, pct: 0.08, color: theme.borderStrong },
          ].map((r, i) => (
            <div key={i} style={{ marginBottom: i < 2 ? 14 : 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, ...TYPE.sans, fontSize: 12, color: theme.text }}>
                <span>{r.label}</span>
                <span style={{ ...TYPE.mono, color: theme.textDim }}>{r.mins} min · {Math.round(r.pct * 100)}%</span>
              </div>
              <div style={{ height: 5, background: theme.borderStrong, borderRadius: 3, overflow: 'hidden' }}>
                <div style={{ width: `${r.pct * 100}%`, height: '100%', background: r.color, borderRadius: 3 }} />
              </div>
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
}

function Record({ theme, label, value, unit, sub, icon, accent }) {
  return (
    <div style={{ background: theme.surface, border: `1px solid ${theme.border}`, borderRadius: 16, padding: 14 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ ...TYPE.sans, fontSize: 10.5, letterSpacing: '0.16em', color: theme.textMuted, textTransform: 'uppercase' }}>{label}</div>
        <div style={{ color: accent || theme.accent }}>{icon}</div>
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginTop: 8 }}>
        <span style={{ ...TYPE.display, fontSize: 22, color: theme.text }}>{value}</span>
        {unit && <span style={{ ...TYPE.mono, fontSize: 10, color: theme.textDim }}>{unit}</span>}
      </div>
      <div style={{ ...TYPE.sans, fontSize: 11, color: theme.textDim, marginTop: 2 }}>{sub}</div>
    </div>
  );
}
