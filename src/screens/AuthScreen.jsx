import { useState } from 'react';
import { TYPE } from '../theme.js';

export function AuthScreen({ theme, onAuth, onGoogleAuth }) {
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
        <div style={{ ...TYPE.display, fontSize: 32, color: theme.text }}>Stride</div>
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

      <button
        type="button"
        onClick={onGoogleAuth}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 10,
          width: '100%',
          padding: '13px 18px',
          borderRadius: 14,
          background: theme.surface,
          border: `1px solid ${theme.border}`,
          color: theme.text,
          ...TYPE.sans,
          fontSize: 14,
          fontWeight: 600,
          cursor: 'pointer',
          marginBottom: 8,
        }}
      >
        <svg width="18" height="18" viewBox="0 0 48 48">
          <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
          <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
          <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
          <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.31-8.16 2.31-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
        </svg>
        Continue with Google
      </button>

      <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '4px 0 12px' }}>
        <div style={{ flex: 1, height: 1, background: theme.border }} />
        <span style={{ ...TYPE.sans, fontSize: 11, color: theme.textDim, letterSpacing: '0.08em', textTransform: 'uppercase' }}>or use email</span>
        <div style={{ flex: 1, height: 1, background: theme.border }} />
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
