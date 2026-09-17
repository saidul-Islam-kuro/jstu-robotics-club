import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase.js'

export default function AdminApplications() {
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('pending')

  const load = () => {
    supabase
      .from('applications')
      .select('*')
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        setApplications(data || [])
        setLoading(false)
      })
  }

  useEffect(load, [])

  const openMailto = (email, subject, body) => {
    const mailto = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`

    const fallback = () => {
      const text = `To: ${email}\nSubject: ${subject}\n\n${body}`
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text).catch(() => {})
      }
      window.alert(
        'No email app was detected in this browser.\n\nThe email draft was copied to your clipboard instead.\n\nPaste it into Gmail/Outlook and send it manually.'
      )
    }

    try {
      const anchor = document.createElement('a')
      anchor.href = mailto
      anchor.style.display = 'none'
      document.body.appendChild(anchor)
      anchor.click()
      document.body.removeChild(anchor)
      setTimeout(fallback, 400)
    } catch {
      fallback()
    }
  }

  const sendAcceptanceEmail = (application) => {
    const firstName = application.full_name?.split(' ')[0] || 'Applicant'
    const subject = 'Your JSTU Robotics Club membership application has been accepted'
    const body = [
      `Dear ${firstName},`,
      '',
      'Congratulations — your membership application has been accepted by the club committee.',
      '',
      'Please complete your member signup using the link below:',
      'https://your-project-url.vercel.app/signup',
      '',
      'Once you sign up, you will be able to update your profile and access member features.',
      '',
      'Best regards,',
      'JSTU Robotics Club',
    ].join('\n')

    openMailto(application.email, subject, body)
  }

  const sendFeeReminderEmail = (application) => {
    const firstName = application.full_name?.split(' ')[0] || 'Applicant'
    const subject = 'Action required before your JSTU Robotics Club membership can be approved'
    const body = [
      `Dear ${firstName},`,
      '',
      'Thank you for your interest in joining JSTU Robotics Club.',
      '',
      'Before your application can be approved, you must complete two steps:',
      '1) Pay the membership fee physically to a club executive, and',
      '2) Fill out the required membership form in person.',
      '',
      'Once both steps are completed, the club committee can review your application again and approve your membership.',
      '',
      'Best regards,',
      'JSTU Robotics Club',
    ].join('\n')

    openMailto(application.email, subject, body)
  }

  const updateStatus = async (id, status) => {
    await supabase.from('applications').update({ status }).eq('id', id)
    load()
  }

  const handleAccept = async (application) => {
    await updateStatus(application.id, 'accepted')
    sendAcceptanceEmail(application)
  }

  const handleFeeReminder = async (application) => {
    await updateStatus(application.id, 'pending')
    sendFeeReminderEmail(application)
  }

  const filtered = applications.filter((a) => filter === 'all' || a.status === filter)

  return (
    <div className="shell admin-page">
      <div className="admin-head">
        <div className="admin-eyebrow">Admin</div>
        <h1 className="admin-title">Membership applications</h1>
      </div>

      <div className="admin-tabs">
        {['pending', 'accepted', 'rejected', 'all'].map((f) => (
          <button
            key={f}
            className={`admin-tab ${filter === f ? 'is-active' : ''}`}
            onClick={() => setFilter(f)}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {loading && <div className="spinner" />}

      {!loading && filtered.length === 0 && (
        <div className="admin-empty">No {filter !== 'all' ? filter : ''} applications.</div>
      )}

      <div className="app-list">
        {filtered.map((a) => (
          <div className="app-card card" key={a.id}>
            <div className="app-card-main">
              <div className="app-card-head">
                <span className="app-name">{a.full_name}</span>
                <span className={`tag ${a.status === 'accepted' ? 'tag-success' : a.status === 'rejected' ? '' : 'tag-accent'}`}>
                  {a.status}
                </span>
              </div>
              <div className="app-meta">
                {a.department}{a.batch_session ? ` · ${a.batch_session}` : ''}{a.student_id ? ` · ID ${a.student_id}` : ''}
              </div>
              <div className="app-meta">{a.email}{a.phone ? ` · ${a.phone}` : ''}</div>
              {a.skills_interest && <div className="app-detail"><strong>Skills/interest:</strong> {a.skills_interest}</div>}
              {a.why_join && <div className="app-detail"><strong>Why join:</strong> {a.why_join}</div>}
              <div className="app-date">Applied {new Date(a.created_at).toLocaleDateString()}</div>
            </div>
            {a.status === 'pending' && (
              <div className="app-actions app-actions-stack">
                <button className="premium-btn premium-btn-primary btn btn-sm" onClick={() => handleAccept(a)}>Accept & notify</button>
                <button className="premium-btn premium-btn-muted btn btn-sm" onClick={() => handleFeeReminder(a)}>Send fee reminder</button>
                <button className="premium-btn premium-btn-danger btn btn-sm" onClick={() => updateStatus(a.id, 'rejected')}>Reject</button>
              </div>
            )}
            {a.status !== 'pending' && (
              <div className="app-actions">
                <button className="btn btn-ghost btn-sm" onClick={() => updateStatus(a.id, 'pending')}>Reset to pending</button>
              </div>
            )}
          </div>
        ))}
      </div>

      <style>{`
        .admin-page { padding: 48px 0 96px; }
        .admin-head { margin-bottom: 28px; }
        .admin-eyebrow { color: var(--accent); font-size: 13px; font-weight: 600; margin-bottom: 8px; }
        .admin-title { font-size: 1.7rem; }
        .admin-tabs { display: flex; gap: 6px; margin-bottom: 28px; }
        .admin-tab {
          background: transparent;
          border: 1px solid var(--line-soft);
          border-radius: var(--radius-sm);
          padding: 8px 16px;
          font-size: 13.5px;
          color: var(--text-dim);
        }
        .admin-tab.is-active { background: var(--bg-card); color: var(--text); border-color: var(--line); }
        .admin-empty { padding: 40px 0; color: var(--text-faint); }
        .app-list { display: flex; flex-direction: column; gap: 14px; max-width: 720px; }
        .app-card { padding: 22px; display: flex; justify-content: space-between; gap: 20px; flex-wrap: wrap; }
        .app-card-main { flex: 1; min-width: 240px; }
        .app-card-head { display: flex; align-items: center; gap: 10px; margin-bottom: 8px; }
        .app-name { font-weight: 600; font-size: 15.5px; }
        .app-meta { font-size: 13.5px; color: var(--text-dim); margin-bottom: 4px; }
        .app-detail { font-size: 13.5px; color: var(--text-dim); margin-top: 8px; line-height: 1.5; }
        .app-date { font-size: 12px; color: var(--text-faint); margin-top: 10px; }
        .app-actions { display: flex; gap: 8px; align-items: flex-start; flex-shrink: 0; }
        .app-actions-stack { flex-direction: column; }
        .premium-btn {
          min-width: 155px;
          border-radius: 10px;
          padding: 10px 14px;
          font-weight: 700;
          letter-spacing: 0.01em;
          transition: transform 0.15s ease, filter 0.15s ease, border-color 0.15s ease;
          border: 1px solid transparent;
          box-shadow: none;
        }
        .premium-btn:hover {
          transform: translateY(-1px);
          filter: brightness(1.02);
        }
        .premium-btn-primary {
          background: rgba(245, 148, 63, 0.12);
          border-color: rgba(245, 148, 63, 0.38);
          color: var(--accent);
        }
        .premium-btn-muted {
          background: rgba(255, 255, 255, 0.02);
          border-color: rgba(255, 255, 255, 0.08);
          color: var(--text);
        }
        .premium-btn-danger {
          background: rgba(220, 93, 93, 0.08);
          border-color: rgba(220, 93, 93, 0.22);
          color: var(--danger);
        }
      `}</style>
    </div>
  )
}
