import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { supabase } from '../lib/supabase.js'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    setLoading(false)
    if (error) {
      setError(error.message === 'Invalid login credentials'
        ? 'Incorrect email or password.'
        : error.message)
      return
    }
    const dest = location.state?.from?.pathname || '/dashboard'
    navigate(dest, { replace: true })
  }

  return (
    <div className="shell auth-page">
      <div className="auth-card card">
        <h1 className="auth-title">Member log in</h1>
        <p className="auth-sub">Log in to edit your profile and view member-only pages.</p>

        <form onSubmit={handleSubmit}>
          {error && <div className="banner banner-error" style={{ marginBottom: 18 }}>{error}</div>}

          <div className="field">
            <label htmlFor="email">Email</label>
            <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoFocus />
          </div>
          <div className="field">
            <label htmlFor="password">Password</label>
            <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>

          <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
            {loading ? 'Logging in…' : 'Log in'}
          </button>
        </form>

        <p className="auth-footnote">
          Don't have an account yet? <Link to="/signup">Sign up</Link> — you'll need to be an accepted club member.
        </p>
      </div>

      <style>{`
        .auth-page {
          display: flex;
          justify-content: center;
          padding: 72px 20px 96px;
        }
        .auth-card {
          width: 100%;
          max-width: 420px;
          padding: 36px;
        }
        .auth-title { font-size: 1.5rem; margin-bottom: 8px; }
        .auth-sub { color: var(--text-dim); font-size: 14.5px; margin-bottom: 28px; }
        .auth-footnote {
          margin-top: 20px;
          font-size: 13.5px;
          color: var(--text-faint);
          text-align: center;
        }
        .auth-footnote a { color: var(--accent); }
      `}</style>
    </div>
  )
}
