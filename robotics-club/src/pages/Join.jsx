import { useState } from 'react'
import { supabase } from '../lib/supabase.js'
import PageHeader from '../components/PageHeader.jsx'

const initialForm = {
  full_name: '',
  student_id: '',
  department: '',
  batch_session: '',
  email: '',
  phone: '',
  why_join: '',
  skills_interest: '',
}

export default function Join() {
  const [form, setForm] = useState(initialForm)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!form.full_name.trim() || !form.department.trim() || !form.email.trim()) {
      setError('Please fill in your name, department, and email.')
      return
    }

    setSubmitting(true)
    const { error } = await supabase.from('applications').insert([form])
    setSubmitting(false)

    if (error) {
      setError('Something went wrong submitting your application. Please try again.')
      return
    }
    setDone(true)
  }

  if (done) {
    return (
      <div className="shell" style={{ padding: '96px 0', maxWidth: 560, margin: '0 auto', textAlign: 'center' }}>
        <div className="tag tag-success" style={{ marginBottom: 20 }}>Application received</div>
        <h1 style={{ fontSize: '1.8rem', marginBottom: 14 }}>Thanks, {form.full_name.split(' ')[0]}.</h1>
        <p style={{ color: 'var(--text-dim)', lineHeight: 1.7 }}>
          The committee will review your application and reach out at {form.email} once a decision is made.
        </p>
      </div>
    )
  }

  return (
    <div className="shell join-page">
      <PageHeader
        eyebrow="Membership"
        title="Apply to join"
        lead="Open to students from every department and batch. Applications are reviewed by the committee on a rolling basis."
      />

      <form className="join-form" onSubmit={handleSubmit}>
        {error && <div className="banner banner-error" style={{ marginBottom: 20 }}>{error}</div>}

        <div className="join-form-row">
          <div className="field">
            <label htmlFor="full_name">Full name</label>
            <input id="full_name" type="text" value={form.full_name} onChange={update('full_name')} required />
          </div>
          <div className="field">
            <label htmlFor="student_id">Student ID</label>
            <input id="student_id" type="text" value={form.student_id} onChange={update('student_id')} />
          </div>
        </div>

        <div className="join-form-row">
          <div className="field">
            <label htmlFor="department">Department</label>
            <input id="department" type="text" placeholder="e.g. EEE" value={form.department} onChange={update('department')} required />
          </div>
          <div className="field">
            <label htmlFor="batch_session">Batch / session</label>
            <input id="batch_session" type="text" placeholder="e.g. 2022-23" value={form.batch_session} onChange={update('batch_session')} />
          </div>
        </div>

        <div className="join-form-row">
          <div className="field">
            <label htmlFor="email">Email</label>
            <input id="email" type="email" value={form.email} onChange={update('email')} required />
          </div>
          <div className="field">
            <label htmlFor="phone">Phone</label>
            <input id="phone" type="tel" value={form.phone} onChange={update('phone')} />
          </div>
        </div>

        <div className="field">
          <label htmlFor="skills_interest">Relevant skills or interests</label>
          <input id="skills_interest" type="text" placeholder="e.g. Arduino, CAD, programming" value={form.skills_interest} onChange={update('skills_interest')} />
        </div>

        <div className="field">
          <label htmlFor="why_join">Why do you want to join?</label>
          <textarea id="why_join" value={form.why_join} onChange={update('why_join')} />
        </div>

        <button type="submit" className="btn btn-primary btn-block" disabled={submitting}>
          {submitting ? 'Submitting…' : 'Submit application'}
        </button>
      </form>

      <style>{`
        .join-page { padding-bottom: 96px; }
        .join-form {
          max-width: 620px;
          background: var(--bg-card);
          border: 1px solid var(--line-soft);
          border-radius: var(--radius);
          padding: 36px;
        }
        .join-form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }
        @media (max-width: 560px) {
          .join-form { padding: 24px; }
          .join-form-row { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  )
}
