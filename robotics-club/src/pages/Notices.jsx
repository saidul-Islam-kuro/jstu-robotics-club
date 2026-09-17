import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase.js'
import PageHeader from '../components/PageHeader.jsx'

export default function Notices() {
  const [notices, setNotices] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const formatNoticeBody = (text = '') => {
    const escaped = text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;')

    return escaped
      .replace(/(https?:\/\/[^\s<>"]+|www\.[^\s<>"']+)/g, '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>')
      .replace(/\n/g, '<br />')
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
  }

  useEffect(() => {
    let mounted = true
    supabase
      .from('notices')
      .select('id, title, body, pinned, created_at')
      .order('pinned', { ascending: false })
      .order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (!mounted) return
        if (error) setError('Could not load the notice board right now.')
        else setNotices(data || [])
        setLoading(false)
      })
    return () => { mounted = false }
  }, [])

  return (
    <div className="shell notices-page">
      <PageHeader
        eyebrow="Notice board"
        title="Announcements"
        lead="Meeting times, competition dates, and club updates — posted by the committee."
      />

      {loading && <div className="center-page" style={{ minHeight: '30vh' }}><div className="spinner" /></div>}
      {error && <div className="banner banner-error">{error}</div>}

      {!loading && !error && notices.length === 0 && (
        <div className="notices-empty">No notices yet. Check back soon.</div>
      )}

      <div className="notices-list">
        {notices.map((n) => (
          <article className="notice-card card" key={n.id}>
            <div className="notice-card-head">
              {n.pinned && <span className="tag tag-accent">Pinned</span>}
              <time className="notice-date">
                {new Date(n.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </time>
            </div>
            <h2 className="notice-title">{n.title}</h2>
            <div className="notice-body" dangerouslySetInnerHTML={{ __html: formatNoticeBody(n.body) }} />
          </article>
        ))}
      </div>

      <style>{`
        .notices-page { padding-bottom: 96px; }
        .notices-empty {
          padding: 60px 20px;
          text-align: center;
          color: var(--text-faint);
        }
        .notices-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
          max-width: 760px;
        }
        .notice-card { padding: 26px; }
        .notice-card-head {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 12px;
        }
        .notice-date {
          font-size: 13px;
          color: var(--text-faint);
        }
        .notice-title { font-size: 1.15rem; margin-bottom: 10px; }
        .notice-body {
          color: var(--text-dim);
          line-height: 1.8;
          white-space: pre-wrap;
          word-break: break-word;
        }
        .notice-body a {
          color: var(--accent);
          text-decoration: underline;
          text-underline-offset: 2px;
        }
        .notice-body strong { color: var(--text); }
        .notice-body em { color: var(--text-dim); }
      `}</style>
    </div>
  )
}
