import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function Dashboard() {
  const { profile, isAdmin } = useAuth()

  const profileComplete = Boolean(profile?.bio && profile?.department && profile?.batch_session)

  return (
    <div className="shell dashboard-page">
      <div className="dash-head">
        <div className="dash-eyebrow">Member dashboard</div>
        <h1 className="dash-title">Welcome, {profile?.full_name?.split(' ')[0] || 'there'}.</h1>
      </div>

      {!profileComplete && (
        <div className="dash-banner">
          <div>
            <strong>Your profile isn't complete yet.</strong>
            <p>Add your bio, department, and batch so club members can find you in the directory.</p>
          </div>
          <Link to="/dashboard/edit" className="btn btn-primary btn-sm">Complete profile</Link>
        </div>
      )}

      <div className="dash-grid">
        <Link to="/dashboard/edit" className="dash-card card">
          <div className="dash-card-icon">✎</div>
          <h2>Edit your profile</h2>
          <p>Update your bio, achievements, skills, and contact links.</p>
        </Link>

        <Link to={`/members/${profile?.id}`} className="dash-card card">
          <div className="dash-card-icon">◎</div>
          <h2>View public profile</h2>
          <p>See exactly what other visitors see when they view your page.</p>
        </Link>

        <Link to="/notices" className="dash-card card">
          <div className="dash-card-icon">▤</div>
          <h2>Notice board</h2>
          <p>Catch up on the latest club announcements.</p>
        </Link>

        {isAdmin && (
          <>
            <Link to="/admin/notices" className="dash-card card dash-card-admin">
              <div className="dash-card-icon">✚</div>
              <h2>Post a notice</h2>
              <p>Admin — publish an announcement to the notice board.</p>
            </Link>
            <Link to="/admin/applications" className="dash-card card dash-card-admin">
              <div className="dash-card-icon">✓</div>
              <h2>Review applications</h2>
              <p>Admin — see and act on pending membership applications.</p>
            </Link>
          </>
        )}
      </div>

      <style>{`
        .dashboard-page { padding: 48px 0 96px; }
        .dash-head { margin-bottom: 32px; }
        .dash-eyebrow { color: var(--accent); font-size: 13px; font-weight: 600; margin-bottom: 8px; }
        .dash-title { font-size: 1.8rem; }
        .dash-banner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          flex-wrap: wrap;
          background: var(--accent-wash);
          border: 1px solid rgba(255,107,53,0.3);
          border-radius: var(--radius);
          padding: 18px 22px;
          margin-bottom: 32px;
        }
        .dash-banner p { color: var(--text-dim); font-size: 14px; margin-top: 4px; }
        .dash-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
          gap: 16px;
        }
        .dash-card {
          padding: 24px;
          transition: border-color 0.15s ease;
        }
        .dash-card:hover { border-color: var(--accent); }
        .dash-card-admin { border-color: rgba(255,107,53,0.3); }
        .dash-card-icon {
          font-size: 20px;
          color: var(--accent);
          margin-bottom: 14px;
        }
        .dash-card h2 { font-size: 15.5px; margin-bottom: 6px; }
        .dash-card p { font-size: 13.5px; color: var(--text-dim); line-height: 1.55; }
      `}</style>
    </div>
  )
}
