import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase.js'
import { useAuth } from '../context/AuthContext.jsx'

export default function AdminNotices() {
  const { user } = useAuth()
  const [notices, setNotices] = useState([])
  const [loading, setLoading] = useState(true)
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [pinned, setPinned] = useState(false)
  const [posting, setPosting] = useState(false)
  const [error, setError] = useState('')

  const load = () => {
    supabase
      .from('notices')
      .select('*')
      .order('pinned', { ascending: false })
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        setNotices(data || [])
        setLoading(false)
      })
  }

  useEffect(load, [])

  const handlePost = async (e) => {
    e.preventDefault()
    setError('')
    if (!title.trim() || !body.trim()) {
      setError('Title and body are both required.')
      return
    }
    setPosting(true)
    const { error } = await supabase.from('notices').insert([{
      title: title.trim(),
      body: body.trim(),
      pinned,
      author_id: user.id,
    }])
    setPosting(false)
    if (error) {
      setError('Could not post notice.')
      return
    }
    setTitle('')
    setBody('')
    setPinned(false)
    load()
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this notice? This cannot be undone.')) return
    await supabase.from('notices').delete().eq('id', id)
    load()
  }

  const togglePin = async (n) => {
    await supabase.from('notices').update({ pinned: !n.pinned }).eq('id', n.id)
    load()
  }

  return (
    <div className="shell admin-page">
      <div className="admin-head">
        <div className="admin-eyebrow">Admin</div>
        <h1 className="admin-title">Notice board</h1>
      </div>

      <form onSubmit={handlePost} className="admin-form card">
        {error && <div className="banner banner-error" style={{ marginBottom: 16 }}>{error}</div>}
        <div className="field">
          <label htmlFor="title">Title</label>
          <input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
        </div>
        <div className="field">
          <label htmlFor="body">Body</label>
          <textarea id="body" value={body} onChange={(e) => setBody(e.target.value)} required style={{ minHeight: 120 }} />
          <span className="field-hint">Use plain text, **bold**, *italic*, and paste URLs to make them clickable.</span>
        </div>
        <label className="admin-checkbox">
          <input type="checkbox" checked={pinned} onChange={(e) => setPinned(e.target.checked)} />
          Pin to top
        </label>
        <button type="submit" className="btn btn-primary" disabled={posting} style={{ marginTop: 16 }}>
          {posting ? 'Posting…' : 'Post notice'}
        </button>
      </form>

      <h2 className="admin-subtitle">Published notices</h2>

      {loading && <div className="spinner" />}

      <div className="admin-list">
        {notices.map((n) => (
          <div className="admin-notice-row card" key={n.id}>
            <div className="admin-notice-info">
              <div className="admin-notice-head">
                {n.pinned && <span className="tag tag-accent">Pinned</span>}
                <span className="admin-notice-date">{new Date(n.created_at).toLocaleDateString()}</span>
              </div>
              <div className="admin-notice-title">{n.title}</div>
            </div>
            <div className="admin-notice-actions">
              <button className="btn btn-ghost btn-sm" onClick={() => togglePin(n)}>
                {n.pinned ? 'Unpin' : 'Pin'}
              </button>
              <button className="btn btn-ghost btn-sm" onClick={() => handleDelete(n.id)} style={{ color: 'var(--danger)' }}>
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      <style>{`
        .admin-page { padding: 48px 0 96px; }
        .admin-head { margin-bottom: 28px; }
        .admin-eyebrow { color: var(--accent); font-size: 13px; font-weight: 600; margin-bottom: 8px; }
        .admin-title { font-size: 1.7rem; }
        .admin-form { max-width: 620px; padding: 28px; margin-bottom: 44px; }
        .admin-checkbox {
          display: flex; align-items: center; gap: 8px;
          font-size: 14px; color: var(--text-dim); cursor: pointer;
        }
        .admin-subtitle { font-size: 15px; color: var(--text-dim); margin-bottom: 16px; }
        .admin-list { display: flex; flex-direction: column; gap: 10px; max-width: 720px; }
        .admin-notice-row {
          display: flex; justify-content: space-between; align-items: center;
          gap: 16px; padding: 16px 20px;
        }
        .admin-notice-head { display: flex; gap: 8px; align-items: center; margin-bottom: 6px; }
        .admin-notice-date { font-size: 12.5px; color: var(--text-faint); }
        .admin-notice-title { font-weight: 600; font-size: 14.5px; }
        .admin-notice-actions { display: flex; gap: 8px; flex-shrink: 0; }
      `}</style>
    </div>
  )
}
