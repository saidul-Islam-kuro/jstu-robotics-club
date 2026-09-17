import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase.js'

export default function Home() {
  const [memberCount, setMemberCount] = useState(null)
  const [latestNotice, setLatestNotice] = useState(null)

  useEffect(() => {
    supabase
      .from('profiles')
      .select('id', { count: 'exact', head: true })
      .eq('is_active', true)
      .then(({ count }) => setMemberCount(count))

    supabase
      .from('notices')
      .select('id, title, created_at')
      .order('created_at', { ascending: false })
      .limit(1)
      .then(({ data }) => setLatestNotice(data?.[0] ?? null))
  }, [])

  return (
    <div className="home">
      <section className="hero">
        <div className="shell hero-inner">
          <div className="hero-copy">
            <div className="hero-eyebrow">Jamalpur Science &amp; Technology University</div>
            <h1 className="hero-title">
              We build machines that<br />think, move, and compete.
            </h1>
            <p className="hero-lead">
              The Robotics Club is JSTU's student-run home for anyone who wants to design,
              wire, code, and race robots — from first-time builders to competition teams.
              {memberCount != null && ` Currently ${memberCount} members strong.`}
            </p>
            <div className="hero-actions">
              <Link to="/join" className="btn btn-primary">Apply for membership</Link>
              <Link to="/about" className="btn btn-outline">Take the club tour</Link>
            </div>
          </div>
          <div className="hero-graphic" aria-hidden="true">
            <CircuitArt />
          </div>
        </div>
      </section>

      {latestNotice && (
        <div className="shell">
          <Link to="/notices" className="notice-strip">
            <span className="tag tag-accent">Latest notice</span>
            <span className="notice-strip-title">{latestNotice.title}</span>
            <span className="notice-strip-arrow">View notice board</span>
          </Link>
        </div>
      )}

      <section className="shell what-section">
        <h2 className="section-title">What the club does</h2>
        <div className="what-grid">
          <div className="what-item">
            <div className="what-num">Build</div>
            <p>Weekly workshop sessions covering embedded systems, CAD, mechanical
              design, and control software — open to every member regardless of
              department.</p>
          </div>
          <div className="what-item">
            <div className="what-num">Compete</div>
            <p>We field teams at national and regional robotics competitions,
              line-following contests, and hackathons throughout the year.</p>
          </div>
          <div className="what-item">
            <div className="what-num">Connect</div>
            <p>A member directory, project archive, and notice board keep the
              whole club — new and returning — on the same page.</p>
          </div>
        </div>
      </section>

      <section className="shell cta-section">
        <div className="cta-card">
          <div>
            <h2 className="section-title">Want in?</h2>
            <p className="cta-text">Applications are reviewed by the club committee on a rolling basis.
              It takes about five minutes to apply.</p>
          </div>
          <Link to="/join" className="btn btn-primary">Start your application</Link>
        </div>
      </section>

      <style>{`
        .hero {
          border-bottom: 1px solid var(--line-soft);
          overflow: hidden;
          position: relative;
        }
        .hero-inner {
          display: grid;
          grid-template-columns: 1.1fr 0.9fr;
          align-items: center;
          gap: 40px;
          padding: 72px 28px 64px;
        }
        .hero-eyebrow {
          font-size: 13.5px;
          font-weight: 600;
          color: var(--accent);
          margin-bottom: 18px;
        }
        .hero-title {
          font-size: clamp(2rem, 4.2vw, 3.4rem);
          max-width: 14ch;
        }
        .hero-lead {
          margin-top: 22px;
          color: var(--text-dim);
          font-size: 17px;
          max-width: 46ch;
          line-height: 1.65;
        }
        .hero-actions {
          margin-top: 32px;
          display: flex;
          gap: 14px;
          flex-wrap: wrap;
        }
        .hero-graphic {
          display: flex;
          justify-content: center;
        }
        .notice-strip {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 14px 20px;
          margin-top: 24px;
          background: var(--bg-card);
          border: 1px solid var(--line-soft);
          border-radius: var(--radius);
          transition: border-color 0.15s ease;
        }
        .notice-strip:hover { border-color: var(--line); }
        .notice-strip-title {
          flex: 1;
          font-weight: 500;
          font-size: 14.5px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .notice-strip-arrow {
          font-size: 13px;
          color: var(--text-faint);
          flex-shrink: 0;
        }
        .what-section { padding: 96px 28px; }
        .section-title {
          font-size: 1.8rem;
          margin-bottom: 40px;
        }
        .what-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1px;
          background: var(--line-soft);
          border: 1px solid var(--line-soft);
        }
        .what-item {
          background: var(--bg);
          padding: 32px 28px;
        }
        .what-num {
          font-family: var(--font-display);
          font-weight: 600;
          font-size: 15px;
          color: var(--accent);
          margin-bottom: 14px;
        }
        .what-item p {
          color: var(--text-dim);
          font-size: 15px;
          line-height: 1.65;
        }
        .cta-section { padding-bottom: 96px; }
        .cta-card {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 24px;
          flex-wrap: wrap;
          background: var(--bg-card);
          border: 1px solid var(--line-soft);
          border-radius: var(--radius);
          padding: 44px;
        }
        .cta-card .section-title { margin-bottom: 8px; }
        .cta-text {
          color: var(--text-dim);
          max-width: 48ch;
        }
        @media (max-width: 860px) {
          .hero-inner {
            grid-template-columns: 1fr;
            padding: 48px 20px 40px;
          }
          .hero-graphic { display: none; }
          .what-grid { grid-template-columns: 1fr; }
          .cta-card { padding: 28px; }
        }
      `}</style>
    </div>
  )
}

function CircuitArt() {
  return (
    <svg width="420" height="420" viewBox="0 0 420 420" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="210" cy="210" r="30" fill="var(--accent)" />
      <circle cx="210" cy="210" r="30" fill="var(--accent)" opacity="0.25">
        <animate attributeName="r" values="30;50;30" dur="3.5s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.25;0;0.25" dur="3.5s" repeatCount="indefinite" />
      </circle>

      {[
        [210, 40], [380, 130], [380, 290], [210, 380], [40, 290], [40, 130],
      ].map(([x, y], i) => (
        <g key={i}>
          <line x1="210" y1="210" x2={x} y2={y} stroke="var(--line)" strokeWidth="1.5" />
          <circle cx={x} cy={y} r="7" fill="var(--bg-card)" stroke="var(--steel)" strokeWidth="1.5" />
        </g>
      ))}

      <line x1="40" y1="130" x2="40" y2="290" stroke="var(--line-soft)" strokeWidth="1" />
      <line x1="380" y1="130" x2="380" y2="290" stroke="var(--line-soft)" strokeWidth="1" />
      <line x1="210" y1="40" x2="40" y2="130" stroke="var(--line-soft)" strokeWidth="1" />
      <line x1="210" y1="40" x2="380" y2="130" stroke="var(--line-soft)" strokeWidth="1" />
      <line x1="210" y1="380" x2="40" y2="290" stroke="var(--line-soft)" strokeWidth="1" />
      <line x1="210" y1="380" x2="380" y2="290" stroke="var(--line-soft)" strokeWidth="1" />

      <text x="210" y="216" textAnchor="middle" fontFamily="Space Grotesk" fontWeight="600" fontSize="13" fill="#14100C">RBC</text>
    </svg>
  )
}
