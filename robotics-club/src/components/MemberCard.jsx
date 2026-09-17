import { Link } from 'react-router-dom'

export default function MemberCard({ member }) {
  const initials = (member.full_name || '?')
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

  return (
    <Link to={`/members/${member.id}`} className="member-card">
      <div className="member-card-avatar">
        {member.avatar_url ? (
          <img src={member.avatar_url} alt="" />
        ) : (
          <span>{initials}</span>
        )}
      </div>
      <div className="member-card-body">
        <div className="member-card-name">{member.full_name}</div>
        <div className="member-card-role">{member.role_title || 'Member'}</div>
        {member.department && (
          <div className="member-card-dept">{member.department}{member.batch_session ? ` · ${member.batch_session}` : ''}</div>
        )}
      </div>

      <style>{`
        .member-card {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 16px;
          background: var(--bg-card);
          border: 1px solid var(--line-soft);
          border-radius: var(--radius);
          transition: border-color 0.15s ease, transform 0.1s ease;
        }
        .member-card:hover {
          border-color: var(--accent);
        }
        .member-card-avatar {
          width: 52px;
          height: 52px;
          border-radius: var(--radius-sm);
          background: var(--bg-raised);
          border: 1px solid var(--line);
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          font-family: var(--font-display);
          font-weight: 600;
          font-size: 15px;
          color: var(--accent);
        }
        .member-card-avatar img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .member-card-body { min-width: 0; }
        .member-card-name {
          font-weight: 600;
          font-size: 15px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .member-card-role {
          font-size: 13px;
          color: var(--accent);
          margin-top: 2px;
        }
        .member-card-dept {
          font-size: 12.5px;
          color: var(--text-faint);
          margin-top: 3px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      `}</style>
    </Link>
  )
}
