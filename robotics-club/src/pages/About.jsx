import { Link } from 'react-router-dom'
import PageHeader from '../components/PageHeader.jsx'

const timeline = [
  { year: 'Founding', text: 'The club was formed by a small group of students who wanted a dedicated space for hands-on robotics outside the classroom. Replace this with your club\u2019s real founding story.' },
  { year: 'Workshops begin', text: 'Weekly build sessions started covering microcontrollers, sensors, and basic mechanical design.' },
  { year: 'First competition', text: 'The club entered its first inter-university robotics competition. Add your actual results and placements here.' },
  { year: 'Today', text: 'The club now runs project teams, an onboarding track for first-years, and a public notice board and member directory — this very website.' },
]

const projects = [
  { name: 'Line Follower Bot', desc: 'A sensor-guided autonomous bot built for regional line-following competitions. Swap in your real project name and description.' },
  { name: 'Robotic Arm', desc: 'A 4-DOF pick-and-place arm used as a teaching project for new members learning servo control.' },
  { name: 'Autonomous Rover', desc: 'An obstacle-avoiding rover built around an ultrasonic sensor array and a custom PID controller.' },
]

export default function About() {
  return (
    <div className="shell about-page">
      <PageHeader
        eyebrow="Club tour"
        title="Who we are and what we build"
        lead="A walk through the club — replace every line on this page with your club's real history, projects, and photos."
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
              <div className="project-photo" aria-hidden="true" />
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
          height: 140px;
          background:
            repeating-linear-gradient(135deg, var(--bg-raised) 0 10px, var(--bg-card) 10px 20px);
          border-bottom: 1px solid var(--line-soft);
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
