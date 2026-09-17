import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="shell footer-inner">
        <div>
          <div className="footer-brand">JSTU Robotics Club</div>
          <p className="footer-sub">Jamalpur Science &amp; Technology University</p>
        </div>
        <div className="footer-links">
          <Link to="/about">About</Link>
          <Link to="/members">Members</Link>
          <Link to="/notices">Notice Board</Link>
          <Link to="/join">Join</Link>
        </div>
      </div>

      <div className="shell footer-footnote">
        Developed By <span className="footer-author">Saidul Islam</span> <span className="footer-author-accent">Kuro</span>
      </div>

      <style>{`
        .footer {
          border-top: 1px solid var(--line-soft);
          padding: 36px 0 18px;
          margin-top: 80px;
        }
        .footer-inner {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          flex-wrap: wrap;
          gap: 20px;
        }
        .footer-brand {
          font-family: var(--font-display);
          font-weight: 600;
          font-size: 15px;
        }
        .footer-sub {
          color: var(--text-faint);
          font-size: 13.5px;
          margin-top: 4px;
        }
        .footer-links {
          display: flex;
          gap: 22px;
          font-size: 13.5px;
          color: var(--text-dim);
        }
        .footer-links a:hover { color: var(--text); }
        .footer-footnote {
          text-align: center;
          font-size: 14px;
          font-weight: 700;
          color: var(--text-faint);
          padding-bottom: 18px;
          letter-spacing: 0.01em;
        }
        .footer-author {
          color: var(--text);
        }
        .footer-author-accent {
          color: var(--accent);
        }
      `}</style>
    </footer>
  )
}
