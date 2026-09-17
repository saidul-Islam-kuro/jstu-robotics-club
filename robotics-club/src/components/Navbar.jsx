import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

const navLinks = [
  { to: '/about', label: 'About' },
  { to: '/members', label: 'Members' },
  { to: '/notices', label: 'Notice Board' },
  { to: '/join', label: 'Join' },
]

export default function Navbar() {
  const { user, profile, signOut } = useAuth()
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
  }

  return (
    <header className="navbar">
      <div className="shell navbar-inner">
        <Link to="/" className="navbar-brand" onClick={() => setOpen(false)}>
          <svg width="26" height="26" viewBox="0 0 32 32" fill="none">
            <rect width="32" height="32" rx="6" fill="var(--accent)" />
            <circle cx="16" cy="16" r="4" fill="#0E1420" />
            <circle cx="6" cy="8" r="2" fill="#0E1420" />
            <circle cx="26" cy="8" r="2" fill="#0E1420" />
            <circle cx="6" cy="24" r="2" fill="#0E1420" />
            <circle cx="26" cy="24" r="2" fill="#0E1420" />
            <path d="M16 16L6 8M16 16L26 8M16 16L6 24M16 16L26 24" stroke="#0E1420" strokeWidth="1.2" />
          </svg>
          <span>
            JSTU Robotics<span className="navbar-brand-dot">.</span>
          </span>
        </Link>

        <nav className={`navbar-links ${open ? 'is-open' : ''}`}>
          {navLinks.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) => `navbar-link ${isActive ? 'is-active' : ''}`}
              onClick={() => setOpen(false)}
            >
              {l.label}
            </NavLink>
          ))}

          <div className="navbar-auth navbar-auth-mobile">
            {user ? (
              <>
                <Link to="/dashboard" className="btn btn-outline btn-sm" onClick={() => setOpen(false)}>
                  {profile?.full_name?.split(' ')[0] || 'Dashboard'}
                </Link>
                <button className="btn btn-ghost btn-sm" onClick={handleSignOut}>Sign out</button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn-ghost btn-sm" onClick={() => setOpen(false)}>Log in</Link>
                <Link to="/join" className="btn btn-primary btn-sm" onClick={() => setOpen(false)}>Apply</Link>
              </>
            )}
          </div>
        </nav>

        <div className="navbar-auth navbar-auth-desktop">
          {user ? (
            <>
              <Link to="/dashboard" className="btn btn-outline btn-sm">
                {profile?.full_name?.split(' ')[0] || 'Dashboard'}
              </Link>
              <button className="btn btn-ghost btn-sm" onClick={handleSignOut}>Sign out</button>
            </>
          ) : (
            <>
              <div className="navbar-actions-left">
                <Link to="/login" className="btn btn-ghost btn-sm">Log in</Link>
                <Link to="/join" className="btn btn-primary btn-sm">Apply</Link>
              </div>
              <img src="/logo.png" alt="University logo" className="university-logo" />
            </>
          )}
        </div>

        <button
          className="navbar-toggle"
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      <style>{`
        .navbar {
          position: sticky;
          top: 0;
          z-index: 40;
          background: rgba(14, 20, 32, 0.85);
          backdrop-filter: blur(10px);
          border-bottom: 1px solid var(--line-soft);
        }
        .navbar-inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 64px;
          gap: 24px;
        }
        .navbar-brand {
          display: flex;
          align-items: center;
          gap: 10px;
          font-family: var(--font-display);
          font-weight: 600;
          font-size: 16.5px;
          flex-shrink: 0;
        }
        .navbar-brand-dot { color: var(--accent); }
        .navbar-links {
          display: flex;
          align-items: center;
          gap: 28px;
          flex: 1;
        }
        .navbar-link {
          font-size: 14.5px;
          font-weight: 500;
          color: var(--text-dim);
          position: relative;
          padding: 4px 0;
          transition: color 0.15s ease;
        }
        .navbar-link:hover { color: var(--text); }
        .navbar-link.is-active { color: var(--text); }
        .navbar-link.is-active::after {
          content: '';
          position: absolute;
          left: 0; right: 0; bottom: -20px;
          height: 2px;
          background: var(--accent);
        }
        .navbar-auth {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 12px;
          flex-shrink: 0;
        }
        .navbar-actions-left {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .university-logo {
          width: 52px;
          height: 52px;
          object-fit: contain;
          display: block;
          border: none;
          background: transparent;
          box-shadow: none;
          border-radius: 0;
          padding: 0;
        }
        .navbar-auth-mobile { display: none; }
        .navbar-toggle {
          display: none;
          flex-direction: column;
          gap: 4px;
          background: none;
          border: none;
          padding: 8px;
        }
        .navbar-toggle span {
          width: 20px;
          height: 2px;
          background: var(--text);
          display: block;
        }
        @media (max-width: 860px) {
          .navbar-links {
            position: fixed;
            top: 64px;
            left: 0; right: 0;
            background: var(--bg-raised);
            border-bottom: 1px solid var(--line-soft);
            flex-direction: column;
            align-items: flex-start;
            gap: 0;
            padding: 8px 0;
            transform: translateY(-8px);
            opacity: 0;
            pointer-events: none;
            transition: opacity 0.15s ease, transform 0.15s ease;
          }
          .navbar-links.is-open {
            opacity: 1;
            transform: translateY(0);
            pointer-events: auto;
          }
          .navbar-link {
            width: 100%;
            padding: 14px 28px;
          }
          .navbar-link.is-active::after { display: none; }
          .navbar-link.is-active { background: var(--bg-card); }
          .navbar-auth-desktop { display: none; }
          .navbar-auth-mobile {
            display: flex;
            padding: 14px 28px;
            width: 100%;
          }
          .navbar-toggle { display: flex; }
        }
      `}</style>
    </header>
  )
}
