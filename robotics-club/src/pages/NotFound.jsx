import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="shell" style={{ padding: '100px 0', textAlign: 'center' }}>
      <h1 style={{ fontSize: '2rem', marginBottom: 14 }}>404</h1>
      <p style={{ color: 'var(--text-dim)', marginBottom: 24 }}>This page doesn't exist.</p>
      <Link to="/" className="btn btn-outline">Back home</Link>
    </div>
  )
}
