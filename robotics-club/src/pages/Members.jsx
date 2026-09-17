import { useEffect, useMemo, useState } from 'react'
import { supabase } from '../lib/supabase.js'
import PageHeader from '../components/PageHeader.jsx'
import MemberCard from '../components/MemberCard.jsx'

export default function Members() {
  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [query, setQuery] = useState('')
  const [deptFilter, setDeptFilter] = useState('all')

  useEffect(() => {
    let mounted = true
    supabase
      .from('profiles')
      .select('id, full_name, role_title, department, batch_session, avatar_url')
      .eq('is_active', true)
      .order('full_name', { ascending: true })
      .then(({ data, error }) => {
        if (!mounted) return
        if (error) setError('Could not load members right now.')
        else setMembers(data || [])
        setLoading(false)
      })
    return () => { mounted = false }
  }, [])

  const departments = useMemo(() => {
    const set = new Set(members.map((m) => m.department).filter(Boolean))
    return ['all', ...Array.from(set).sort()]
  }, [members])

  const filtered = useMemo(() => {
    return members.filter((m) => {
      const matchesQuery = query.trim() === '' ||
        m.full_name?.toLowerCase().includes(query.toLowerCase()) ||
        m.role_title?.toLowerCase().includes(query.toLowerCase())
      const matchesDept = deptFilter === 'all' || m.department === deptFilter
      return matchesQuery && matchesDept
    })
  }, [members, query, deptFilter])

  return (
    <div className="shell members-page">
      <PageHeader
        eyebrow="Directory"
        title="Club members"
        lead="Every current member of JSTU Robotics Club, in one place. Tap a profile to see their bio, achievements, and contact links."
      />

      <div className="members-controls">
        <input
          type="text"
          placeholder="Search by name or role…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="members-search"
        />
        <select value={deptFilter} onChange={(e) => setDeptFilter(e.target.value)} className="members-filter">
          {departments.map((d) => (
            <option key={d} value={d}>{d === 'all' ? 'All departments' : d}</option>
          ))}
        </select>
      </div>

      {loading && (
        <div className="center-page" style={{ minHeight: '30vh' }}><div className="spinner" /></div>
      )}

      {error && <div className="banner banner-error">{error}</div>}

      {!loading && !error && filtered.length === 0 && (
        <div className="members-empty">
          {members.length === 0
            ? 'No members yet. Once people sign up and complete their profile, they\u2019ll appear here.'
            : 'No members match your search.'}
        </div>
      )}

      {!loading && filtered.length > 0 && (
        <div className="members-grid">
          {filtered.map((m) => <MemberCard member={m} key={m.id} />)}
        </div>
      )}

      <style>{`
        .members-page { padding-bottom: 96px; }
        .members-controls {
          display: flex;
          gap: 12px;
          margin-bottom: 28px;
          flex-wrap: wrap;
        }
        .members-search {
          flex: 1;
          min-width: 220px;
          background: var(--bg-card);
          border: 1px solid var(--line-soft);
          border-radius: var(--radius-sm);
          padding: 11px 14px;
          color: var(--text);
        }
        .members-search:focus { outline: none; border-color: var(--accent); }
        .members-filter {
          background: var(--bg-card);
          border: 1px solid var(--line-soft);
          border-radius: var(--radius-sm);
          padding: 11px 14px;
          color: var(--text);
        }
        .members-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
          gap: 14px;
        }
        .members-empty {
          padding: 60px 20px;
          text-align: center;
          color: var(--text-faint);
        }
      `}</style>
    </div>
  )
}
