import { useState } from 'react';
import { supabase } from '../lib/supabase';

export default function AdminLogin() {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setError('Email atau password salah.');
    setLoading(false);
  }

  return (
    <div style={styles.page}>
      <div style={styles.wrap}>
        <p style={styles.brand}>Portfolio Admin</p>
        <h1 style={styles.title}>Sign In</h1>
        <p style={styles.sub}>Masukkan kredensial untuk mengakses panel.</p>

        <form onSubmit={handleSubmit}>
          <div style={styles.field}>
            <label style={styles.label}>Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="admin@email.com"
              style={styles.input}
              required
            />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••••"
              style={styles.input}
              required
            />
          </div>

          {error && <p style={styles.errorMsg}>{error}</p>}

          <button type="submit" style={styles.btn} disabled={loading}>
            {loading ? 'Masuk...' : 'Masuk →'}
          </button>
        </form>

        <a href="/" style={styles.backLink}>← Kembali ke Portfolio</a>
      </div>
    </div>
  );
}

const C = {
  bg: '#0a0a0a', surface: '#141414', border: '#242424',
  text: '#fffbf1', muted: '#666', accent: '#ffc94d', error: '#e74c3c',
  mono: '"DM Mono", monospace', sans: '"Space Grotesk", sans-serif',
};

const styles = {
  page:    { background: C.bg, color: C.text, fontFamily: C.sans, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 },
  wrap:    { width: '100%', maxWidth: 400 },
  brand:   { fontFamily: C.mono, fontSize: 10, letterSpacing: '0.22em', color: C.muted, textTransform: 'uppercase', marginBottom: 48 },
  title:   { fontSize: 32, fontWeight: 700, letterSpacing: '-0.03em', textTransform: 'uppercase', lineHeight: 1, marginBottom: 8 },
  sub:     { fontFamily: C.mono, fontSize: 11, color: C.muted, letterSpacing: '0.1em', marginBottom: 48 },
  field:   { borderBottom: `1px solid ${C.border}`, marginBottom: 0 },
  label:   { display: 'block', fontFamily: C.mono, fontSize: 9, letterSpacing: '0.22em', color: C.muted, textTransform: 'uppercase', padding: '20px 0 6px' },
  input:   { width: '100%', background: 'transparent', border: 'none', outline: 'none', color: C.text, fontFamily: C.sans, fontSize: 15, paddingBottom: 16 },
  errorMsg:{ fontFamily: C.mono, fontSize: 10, color: C.error, letterSpacing: '0.1em', marginTop: 16 },
  btn:     { marginTop: 40, width: '100%', background: C.accent, color: C.bg, fontFamily: C.mono, fontSize: 11, fontWeight: 500, letterSpacing: '0.2em', textTransform: 'uppercase', padding: 20, border: 'none', cursor: 'pointer' },
  backLink:{ display: 'block', textAlign: 'center', marginTop: 28, fontFamily: C.mono, fontSize: 10, letterSpacing: '0.15em', color: C.muted, textDecoration: 'none', textTransform: 'uppercase' },
};
