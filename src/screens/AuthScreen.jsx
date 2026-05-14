import { useState } from 'react';
import { TYPE } from '../theme.js';

export function AuthScreen({ theme, onAuth }) {
  const [mode, setMode] = useState('signin');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    const err = await onAuth(mode, email, password, name);
    if (err) setError(err.message);
    setLoading(false);
  }

  const inputStyle = {
    width: '100%',
    padding: '13px 14px',
    borderRadius: 12,
    background: theme.surface,
    border: `1px solid ${theme.border}`,
    color: theme.text,
    ...TYPE.sans,
    fontSize: 14,
    outline: 'none',
    boxSizing: 'border-box',
  };

  const labelStyle = {
    ...TYPE.sans,
    fontSize: 11,
    fontWeight: 600,
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    color: theme.textDim,
    display: 'block',
    marginBottom: 6,
  };

  return (
    <div
      style={{
        background: theme.bg,
        color: theme.text,
        minHeight: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '0 24px 40px',
      }}
    >
      <div style={{ textAlign: 'center', marginBottom: 40 }}>
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: 20,
            margin: '0 auto 16px',
            background: theme.accent,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <svg
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke={theme.bg}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M13 4v16M6 12l7-8 7 8" />
          </svg>
        </div>
        <div style={{ ...TYPE.display, fontSize: 32, color: theme.text }}>WalkTrack</div>
        <div
          style={{
            ...TYPE.serif,
            fontSize: 14,
            fontStyle: 'italic',
            color: theme.textDim,
            marginTop: 4,
          }}
        >
          {mode === 'signin' ? 'Welcome back' : 'Start your journey'}
        </div>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {mode === 'signup' && (
          <div>
            <label style={labelStyle}>Your name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Maya Chen"
              style={inputStyle}
            />
          </div>
        )}
        <div>
          <label style={labelStyle}>Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            style={inputStyle}
          />
        </div>
        <div>
          <label style={labelStyle}>Password</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={mode === 'signup' ? 'Min 6 characters' : '••••••••'}
            minLength={6}
            style={inputStyle}
          />
        </div>
        {error && (
          <div
            style={{
              padding: '10px 14px',
              borderRadius: 10,
              background: 'rgba(239,68,68,0.12)',
              border: '1px solid rgba(239,68,68,0.25)',
              ...TYPE.sans,
              fontSize: 13,
              color: '#ef4444',
            }}
          >
            {error}
          </div>
        )}
        <button
          type="submit"
          disabled={loading}
          style={{
            marginTop: 4,
            padding: '14px 18px',
            borderRadius: 14,
            background: theme.accent,
            color: theme.bg,
            border: 'none',
            ...TYPE.sans,
            fontSize: 14,
            fontWeight: 600,
            letterSpacing: '0.06em',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.7 : 1,
          }}
        >
          {loading ? 'Please wait…' : mode === 'signin' ? 'Sign in' : 'Create account'}
        </button>
      </form>

      <button
        onClick={() => {
          setMode((m) => (m === 'signin' ? 'signup' : 'signin'));
          setError('');
        }}
        style={{
          marginTop: 20,
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          ...TYPE.sans,
          fontSize: 13,
          color: theme.textDim,
          textAlign: 'center',
        }}
      >
        {mode === 'signin' ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
      </button>
    </div>
  );
}
