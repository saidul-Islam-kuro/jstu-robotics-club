import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { supabase } from '../lib/supabase.js'

export default function MemberProfile() {
  const { id } = useParams()
  const [member, setMember] = useState(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    let mounted = true
    supabase
      .from('profiles')
      .select('*')
      .eq('id', id)
      .single()
      .then(({ data, error }) => {
        if (!mounted) return
        if (error || !data) setNotFound(true)
        else setMember(data)
        setLoading(false)
      })
    return () => { mounted = false }
  }, [id])

  if (loading) {
    return <div className="center-page"><div className="spinner" /></div>
  }

  if (notFound) {
    return (
      <div className="shell" style={{ padding: '80px 0', textAlign: 'center' }}>
        <h1 style={{ fontSize: '1.6rem', marginBottom: 12 }}>Profile not found</h1>
        <p style={{ color: 'var(--text-dim)', marginBottom: 24 }}>This member may have left the club or the link is incorrect.</p>
        <Link to="/members" className="btn btn-outline">Back to directory</Link>
      </div>
    )
  }

  const initials = (member.full_name || '?').split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase()
  const achievementLines = (member.achievements || '').split('\n').map((l) => l.trim()).filter(Boolean)
  const links = [
    { label: 'GitHub', url: member.github_url, icon: 'github' },
    { label: 'LinkedIn', url: member.linkedin_url, icon: 'linkedin' },
    { label: 'Facebook', url: member.facebook_url, icon: 'facebook' },
  ].filter((l) => l.url)

  const formatBio = (text = '') => {
    const escaped = text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;')

    return escaped
      .replace(/\n/g, '<br />')
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
  }

  return (
    <div className="shell profile-page">
      <Link to="/members" className="profile-back">&larr; Back to directory</Link>

      <div className="profile-header">
        <div className="profile-avatar">
          {member.avatar_url ? <img src={member.avatar_url} alt="" /> : <span>{initials}</span>}
        </div>
        <div className="profile-heading">
          <h1 className="profile-name">{member.full_name}</h1>
          <div className="profile-role">{member.role_title || 'Member'}</div>
          <div className="profile-meta">
            {member.department && <span className="tag">{member.department}</span>}
            {member.batch_session && <span className="tag">Batch {member.batch_session}</span>}
          </div>
        </div>
      </div>

      <div className="profile-grid">
        <div className="profile-main">
          {member.bio && (
            <section className="profile-section">
              <h2 className="profile-h2">About</h2>
              <div className="profile-bio" dangerouslySetInnerHTML={{ __html: formatBio(member.bio) }} />
            </section>
          )}

          {achievementLines.length > 0 && (
            <section className="profile-section">
              <h2 className="profile-h2">Achievements</h2>
              <ul className="profile-achievements">
                {achievementLines.map((line, i) => <li key={i}>{line}</li>)}
              </ul>
            </section>
          )}

          {member.skills?.length > 0 && (
            <section className="profile-section">
              <h2 className="profile-h2">Skills</h2>
              <div className="profile-skills">
                {member.skills.map((s) => <span className="tag tag-accent" key={s}>{s}</span>)}
              </div>
            </section>
          )}
        </div>

        <aside className="profile-side">
          <div className="card profile-side-card">
            <h3 className="profile-side-title">Details</h3>
            {member.student_id && <DetailRow label="Student ID" value={member.student_id} />}
            {member.joined_at && <DetailRow label="Joined" value={new Date(member.joined_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })} />}
            {member.email_public && <DetailRow label="Email" value={member.email_public} isLink={`mailto:${member.email_public}`} />}
            {member.phone_public && <DetailRow label="Phone" value={member.phone_public} />}
          </div>

          {links.length > 0 && (
            <div className="card profile-side-card">
              <h3 className="profile-side-title">Links</h3>
              <div className="profile-links">
                {links.map((l) => (
                  <a key={l.label} href={l.url} target="_blank" rel="noreferrer" className="profile-link">
                    <span className="profile-link-icon" aria-hidden="true">{renderSocialIcon(l.icon)}</span>
                    <span>{l.label}</span>
                  </a>
                ))}
              </div>
            </div>
          )}
        </aside>
      </div>

      <style>{`
        .profile-page { padding-bottom: 96px; }
        .profile-back {
          display: inline-block;
          margin: 28px 0 20px;
          font-size: 14px;
          color: var(--text-dim);
        }
        .profile-back:hover { color: var(--text); }
        .profile-header {
          display: flex;
          gap: 22px;
          align-items: center;
          padding-bottom: 36px;
          border-bottom: 1px solid var(--line-soft);
          margin-bottom: 36px;
        }
        .profile-avatar {
          width: 96px;
          height: 96px;
          border-radius: var(--radius);
          background: var(--bg-card);
          border: 1px solid var(--line);
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          flex-shrink: 0;
          font-family: var(--font-display);
          font-weight: 600;
          font-size: 26px;
          color: var(--accent);
        }
        .profile-avatar img { width: 100%; height: 100%; object-fit: cover; }
        .profile-name { font-size: 1.7rem; }
        .profile-role { color: var(--accent); font-size: 14.5px; font-weight: 600; margin-top: 6px; }
        .profile-meta { display: flex; gap: 8px; margin-top: 12px; flex-wrap: wrap; }
        .profile-grid {
          display: grid;
          grid-template-columns: 1fr 300px;
          gap: 48px;
        }
        .profile-section { margin-bottom: 36px; }
        .profile-h2 { font-size: 15px; text-transform: none; color: var(--text-dim); margin-bottom: 14px; font-weight: 600; }
        .profile-bio {
          line-height: 1.8;
          font-size: 15.5px;
          max-width: 64ch;
          white-space: pre-wrap;
          word-break: break-word;
        }
        .profile-bio strong { color: var(--text); }
        .profile-bio em { color: var(--text-dim); }
        .profile-achievements {
          margin: 0; padding-left: 20px;
          display: flex; flex-direction: column; gap: 10px;
          font-size: 15px; line-height: 1.6; color: var(--text-dim);
        }
        .profile-achievements li::marker { color: var(--accent); }
        .profile-skills { display: flex; gap: 8px; flex-wrap: wrap; }
        .profile-side-card { padding: 20px; margin-bottom: 16px; }
        .profile-side-title { font-size: 13px; color: var(--text-faint); margin-bottom: 14px; font-weight: 600; }
        .profile-links { display: flex; flex-direction: column; gap: 10px; }
        .profile-link {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          font-size: 14px;
          color: var(--text);
          background: var(--bg-raised);
          border: 1px solid var(--line-soft);
          border-radius: 999px;
          padding: 9px 12px;
          transition: border-color 0.15s ease, transform 0.15s ease;
        }
        .profile-link:hover {
          color: var(--accent);
          border-color: var(--line);
          transform: translateY(-1px);
        }
        .profile-link-icon {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 18px;
          height: 18px;
          font-size: 13px;
        }
        @media (max-width: 780px) {
          .profile-grid { grid-template-columns: 1fr; }
          .profile-header { flex-direction: column; align-items: flex-start; }
        }
      `}</style>
    </div>
  )
}

function renderSocialIcon(icon) {
  const shared = { width: 14, height: 14, viewBox: '0 0 24 24', fill: 'currentColor' }

  if (icon === 'github') {
    return (
      <svg {...shared} aria-hidden="true" viewBox="0 0 24 24">
        <path d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.49v-1.7c-2.78.61-3.37-1.34-3.37-1.34-.45-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.61.07-.61 1 .07 1.53 1.03 1.53 1.03.89 1.53 2.34 1.09 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.56-1.11-4.56-4.94 0-1.09.38-1.98 1.02-2.68-.1-.25-.44-1.28.1-2.65 0 0 .84-.27 2.75 1.02A9.55 9.55 0 0 1 12 6.77c.85 0 1.71.12 2.51.35 1.9-1.29 2.74-1.02 2.74-1.02.54 1.37.2 2.4.1 2.65.64.7 1.02 1.59 1.02 2.68 0 3.84-2.35 4.68-4.58 4.93.36.31.68.93.68 1.87v2.77c0 .27.18.59.69.49A10 10 0 0 0 12 2Z" />
      </svg>
    )
  }

  if (icon === 'linkedin') {
    return (
      <svg {...shared} aria-hidden="true" viewBox="0 0 24 24">
        <path d="M6.94 8.5A1.56 1.56 0 1 1 6.94 5.4a1.56 1.56 0 0 1 0 3.1ZM5.5 9.75h2.88v8.75H5.5V9.75Zm5.02 0h2.76v1.2h.04c.38-.72 1.31-1.48 2.7-1.48 2.89 0 3.42 1.9 3.42 4.37v4.66h-2.88v-4.37c0-1.04-.02-2.38-1.45-2.38-1.46 0-1.68 1.14-1.68 2.31v4.44h-2.88V9.75Z" />
      </svg>
    )
  }

  return (
    <svg {...shared} aria-hidden="true" viewBox="0 0 24 24">
      <path d="M13.4 8.68c0 1.03-.94 1.66-2.13 1.66h-1.47v-3.3h1.46c1.19 0 2.14.62 2.14 1.64ZM12 2a10 10 0 1 0 10 10A10.01 10.01 0 0 0 12 2Zm-2.9 15.2V6.8h3.7c2.56 0 4.15 1.33 4.15 3.52 0 2.1-1.58 3.52-4.15 3.52h-3.7Zm10.78 0h-2.26V6.8h2.26Z" />
    </svg>
  )
}

function DetailRow({ label, value, isLink }) {
  return (
    <div className="detail-row">
      <span className="detail-label">{label}</span>
      {isLink ? <a href={isLink} className="detail-value">{value}</a> : <span className="detail-value">{value}</span>}
      <style>{`
        .detail-row {
          display: flex;
          justify-content: space-between;
          gap: 10px;
          padding: 9px 0;
          border-bottom: 1px solid var(--line-soft);
          font-size: 13.5px;
        }
        .detail-row:last-child { border-bottom: none; }
        .detail-label { color: var(--text-faint); }
        .detail-value { text-align: right; word-break: break-word; }
        a.detail-value:hover { color: var(--accent); }
      `}</style>
    </div>
  )
}
