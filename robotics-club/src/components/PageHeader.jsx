export default function PageHeader({ eyebrow, title, lead }) {
  return (
    <div className="page-header">
      <div className="shell">
        {eyebrow && <div className="page-header-eyebrow">{eyebrow}</div>}
        <h1 className="page-header-title">{title}</h1>
        {lead && <p className="page-header-lead">{lead}</p>}
      </div>

      <style>{`
        .page-header {
          padding: 56px 0 40px;
          border-bottom: 1px solid var(--line-soft);
          margin-bottom: 48px;
        }
        .page-header-eyebrow {
          font-size: 13px;
          font-weight: 600;
          color: var(--accent);
          margin-bottom: 12px;
        }
        .page-header-title {
          font-size: clamp(1.8rem, 3.4vw, 2.6rem);
        }
        .page-header-lead {
          margin-top: 14px;
          color: var(--text-dim);
          font-size: 16px;
          max-width: 58ch;
          line-height: 1.65;
        }
      `}</style>
    </div>
  )
}
