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
    { label: 'GitHub', url: member.github_url },
    { label: 'LinkedIn', url: member.linkedin_url },
    { label: 'Facebook', url: member.facebook_url },
  ].filter((l) => l.url)

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
              <p className="profile-bio">{member.bio}</p>
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
                  <a key={l.label} href={l.url} target="_blank" rel="noreferrer" className="profile-link">{l.label} &rarr;</a>
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
        .profile-bio { line-height: 1.7; font-size: 15.5px; max-width: 64ch; }
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
        .profile-link { font-size: 14px; color: var(--text); }
        .profile-link:hover { color: var(--accent); }
        @media (max-width: 780px) {
          .profile-grid { grid-template-columns: 1fr; }
          .profile-header { flex-direction: column; align-items: flex-start; }
        }
      `}</style>
    </div>
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
