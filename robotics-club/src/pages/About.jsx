import { Link } from 'react-router-dom'
import PageHeader from '../components/PageHeader.jsx'

const timeline = [
  { year: 'Founding', text: 'The club was formed by a small group of students who wanted a dedicated space for hands-on robotics outside the classroom.' },
  { year: 'Workshops begin', text: 'N/A' },
  { year: 'First competition', text: 'N/A' },
  { year: 'Today', text: 'The club now runs project teams, an onboarding track for first-years, and a public notice board and member directory — this very website.' },
]

const projects = [
  {
    name: 'Line Follower Bot',
    desc: 'A sensor-guided autonomous bot built for regional line-following competitions and beginner robotics training.',
    image: '/line-follower-bot.jpg',
  },
  {
    name: 'Chunked Base64 Bot',
    desc: 'A Base64-Streamed Multimodal AI companion on the ESP32-C3.',
    image: '/chunked-Based64-bot.jpeg',
  },
  {
    name: 'Autonomous Rover',
    desc: 'An obstacle-avoiding rover built around an ultrasonic sensor array and a custom navigation routine.',
    image: '/Autonomous-Rover.jpg',
  },
]

export default function About() {
  return (
    <div className="shell about-page">
      <PageHeader
        eyebrow="Club tour"
        title="Who we are and what we build"
        lead="A walk through the club — from our founding to our current projects and membership opportunities."
      />

      <section className="about-section">
        <h2 className="about-h2">Our story</h2>
        <div className="timeline">
          {timeline.map((t, i) => (
            <div className="timeline-row" key={i}>
              <div className="timeline-year">{t.year}</div>
              <p className="timeline-text">{t.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="about-section">
        <h2 className="about-h2">Past &amp; current projects</h2>
        <div className="project-grid">
          {projects.map((p) => (
            <div className="project-card card" key={p.name}>
              <img src={p.image} alt={p.name} className="project-photo" />
              <div className="project-body">
                <h3 className="project-name">{p.name}</h3>
                <p className="project-desc">{p.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="about-section about-cta">
        <h2 className="about-h2">Like what you see?</h2>
        <p className="about-cta-text">Membership is open to students from every department and batch.</p>
        <Link to="/join" className="btn btn-primary">Apply for membership</Link>
      </section>

      <style>{`
        .about-page { padding-bottom: 96px; }
        .about-section { margin-bottom: 72px; }
        .about-h2 {
          font-size: 1.5rem;
          margin-bottom: 28px;
        }
        .timeline {
          display: flex;
          flex-direction: column;
          gap: 0;
          border-top: 1px solid var(--line-soft);
        }
        .timeline-row {
          display: grid;
          grid-template-columns: 180px 1fr;
          gap: 24px;
          padding: 22px 0;
          border-bottom: 1px solid var(--line-soft);
        }
        .timeline-year {
          font-family: var(--font-display);
          font-weight: 600;
          color: var(--accent);
          font-size: 14.5px;
        }
        .timeline-text {
          color: var(--text-dim);
          line-height: 1.65;
          max-width: 62ch;
        }
        .project-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
          gap: 20px;
        }
        .project-card { overflow: hidden; }
        .project-photo {
          width: 100%;
          height: 180px;
          object-fit: cover;
          display: block;
          border-bottom: 1px solid var(--line-soft);
          background: var(--bg-raised);
        }
        .project-body { padding: 20px; }
        .project-name {
          font-size: 16px;
          margin-bottom: 8px;
        }
        .project-desc {
          font-size: 14px;
          color: var(--text-dim);
          line-height: 1.6;
        }
        .about-cta {
          text-align: left;
          background: var(--bg-card);
          border: 1px solid var(--line-soft);
          border-radius: var(--radius);
          padding: 40px;
        }
        .about-cta-text {
          color: var(--text-dim);
          margin: 10px 0 22px;
        }
        @media (max-width: 640px) {
          .timeline-row { grid-template-columns: 1fr; gap: 6px; }
        }
      `}</style>
    </div>
  )
}
