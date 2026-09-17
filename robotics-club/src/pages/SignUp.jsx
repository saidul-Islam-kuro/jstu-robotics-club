import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase.js'

export default function SignUp() {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    const normalizedEmail = email.trim().toLowerCase()
    const trimmedFullName = fullName.trim()

    if (!trimmedFullName) {
      setError('Please enter your full name.')
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }

    setLoading(true)

    const { data: acceptedApp, error: acceptedLookupError } = await supabase
      .from('applications')
      .select('id, email, status, full_name')
      .eq('email', normalizedEmail)
      .eq('status', 'accepted')
      .maybeSingle()

    if (acceptedLookupError) {
      setLoading(false)
      setError('We could not verify your application status. Please try again.')
      return
    }

    if (!acceptedApp) {
      setLoading(false)
      setError('Only people with an accepted membership application can create an account.')
      return
    }

    const { data, error } = await supabase.auth.signUp({
      email: normalizedEmail,
      password,
      options: { data: { full_name: trimmedFullName || acceptedApp.full_name } },
    })
    setLoading(false)

    if (error) {
      setError(error.message)
      return
    }

    if (data.session) {
      navigate('/dashboard', { replace: true })
    } else {
      setDone(true)
    }
  }

  if (done) {
    return (
      <div className="shell auth-page">
        <div className="auth-card card" style={{ textAlign: 'center' }}>
          <div className="tag tag-success" style={{ marginBottom: 16 }}>Check your inbox</div>
          <h1 className="auth-title">Confirm your email</h1>
          <p className="auth-sub">
            We sent a confirmation link to {email}. Click it, then log in.
          </p>
          <Link to="/login" className="btn btn-outline btn-block">Go to log in</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="shell auth-page">
      <div className="auth-card card">
        <h1 className="auth-title">Create your member account</h1>
        <p className="auth-sub">
          For members whose application has been accepted by the committee.
        </p>

        <form onSubmit={handleSubmit}>
          {error && <div className="banner banner-error" style={{ marginBottom: 18 }}>{error}</div>}

          <div className="field">
            <label htmlFor="full_name">Full name</label>
            <input id="full_name" type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} required autoFocus />
          </div>
          <div className="field">
            <label htmlFor="email">Email</label>
            <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="field">
            <label htmlFor="password">Password</label>
            <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} />
            <span className="field-hint">At least 6 characters.</span>
          </div>

          <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
            {loading ? 'Creating account…' : 'Create account'}
          </button>
        </form>

        <p className="auth-footnote">
          Already have an account? <Link to="/login">Log in</Link>
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
