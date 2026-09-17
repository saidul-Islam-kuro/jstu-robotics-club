import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase.js'
import { useAuth } from '../context/AuthContext.jsx'

const emptyForm = {
  full_name: '',
  role_title: '',
  department: '',
  batch_session: '',
  student_id: '',
  bio: '',
  email_public: '',
  phone_public: '',
  github_url: '',
  linkedin_url: '',
  facebook_url: '',
  skills: '',
  achievements: '',
}

export default function EditProfile() {
  const { profile, refreshProfile, user } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState(emptyForm)
  const [avatarFile, setAvatarFile] = useState(null)
  const [avatarPreview, setAvatarPreview] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    if (profile) {
      setForm({
        full_name: profile.full_name || '',
        role_title: profile.role_title || '',
        department: profile.department || '',
        batch_session: profile.batch_session || '',
        student_id: profile.student_id || '',
        bio: profile.bio || '',
        email_public: profile.email_public || '',
        phone_public: profile.phone_public || '',
        github_url: profile.github_url || '',
        linkedin_url: profile.linkedin_url || '',
        facebook_url: profile.facebook_url || '',
        skills: (profile.skills || []).join(', '),
        achievements: profile.achievements || '',
      })
      setAvatarPreview(profile.avatar_url || '')
    }
  }, [profile])

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setAvatarFile(file)
    setAvatarPreview(URL.createObjectURL(file))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess(false)

    if (!form.full_name.trim()) {
      setError('Name cannot be empty.')
      return
    }

    setSaving(true)

    let avatar_url = profile?.avatar_url || null

    if (avatarFile) {
      const ext = avatarFile.name.split('.').pop()
      const path = `${user.id}/avatar.${ext}`
      const { error: uploadError } = await supabase
        .storage
        .from('avatars')
        .upload(path, avatarFile, { upsert: true })

      if (uploadError) {
        setSaving(false)
        setError('Could not upload your photo. Profile text was not saved either — please try again.')
        return
      }
      const { data: urlData } = supabase.storage.from('avatars').getPublicUrl(path)
      avatar_url = `${urlData.publicUrl}?t=${Date.now()}`
    }

    const payload = {
      full_name: form.full_name.trim(),
      role_title: form.role_title.trim() || 'Member',
      department: form.department.trim(),
      batch_session: form.batch_session.trim(),
      student_id: form.student_id.trim(),
      bio: form.bio.trim(),
      email_public: form.email_public.trim(),
      phone_public: form.phone_public.trim(),
      github_url: form.github_url.trim(),
      linkedin_url: form.linkedin_url.trim(),
      facebook_url: form.facebook_url.trim(),
      skills: form.skills.split(',').map((s) => s.trim()).filter(Boolean),
      achievements: form.achievements.trim(),
      avatar_url,
    }

    const { error: updateError } = await supabase
      .from('profiles')
      .update(payload)
      .eq('id', user.id)

    setSaving(false)

    if (updateError) {
      setError('Could not save your profile. Please try again.')
      return
    }

    await refreshProfile()
    setSuccess(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const initials = (form.full_name || '?').split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase()

  return (
    <div className="shell edit-page">
      <div className="edit-head">
        <div className="edit-eyebrow">Your profile</div>
        <h1 className="edit-title">Edit profile</h1>
        <p className="edit-lead">This is what other visitors will see on your public member page.</p>
      </div>

      <form onSubmit={handleSubmit} className="edit-form">
        {success && <div className="banner banner-success" style={{ marginBottom: 20 }}>Profile saved.</div>}
        {error && <div className="banner banner-error" style={{ marginBottom: 20 }}>{error}</div>}

        <div className="edit-avatar-row">
          <div className="edit-avatar-preview">
            {avatarPreview ? <img src={avatarPreview} alt="" /> : <span>{initials}</span>}
          </div>
          <div>
            <label htmlFor="avatar" className="btn btn-outline btn-sm">Change photo</label>
            <input id="avatar" type="file" accept="image/*" onChange={handleAvatarChange} style={{ display: 'none' }} />
            <p className="field-hint" style={{ marginTop: 8 }}>Square images work best.</p>
          </div>
        </div>

        <h2 className="edit-section-title">Basics</h2>
        <div className="edit-row">
          <div className="field">
            <label htmlFor="full_name">Full name</label>
            <input id="full_name" value={form.full_name} onChange={update('full_name')} required />
          </div>
          <div className="field">
            <label htmlFor="role_title">Club role</label>
            <input id="role_title" placeholder="e.g. Hardware Lead, Member" value={form.role_title} onChange={update('role_title')} />
          </div>
        </div>
        <div className="edit-row">
          <div className="field">
            <label htmlFor="department">Department</label>
            <input id="department" placeholder="e.g. EEE" value={form.department} onChange={update('department')} />
          </div>
          <div className="field">
            <label htmlFor="batch_session">Batch / session</label>
            <input id="batch_session" placeholder="e.g. 2022-23" value={form.batch_session} onChange={update('batch_session')} />
          </div>
        </div>
        <div className="field">
          <label htmlFor="student_id">Student ID</label>
          <input id="student_id" value={form.student_id} onChange={update('student_id')} />
        </div>

        <h2 className="edit-section-title">About you</h2>
        <div className="field">
          <label htmlFor="bio">Bio</label>
          <textarea id="bio" value={form.bio} onChange={update('bio')} placeholder="A couple of sentences about yourself." />
        </div>
        <div className="field">
          <label htmlFor="skills">Skills</label>
          <input id="skills" placeholder="Comma separated, e.g. ROS, Embedded C, CAD" value={form.skills} onChange={update('skills')} />
          <span className="field-hint">Separate each skill with a comma.</span>
        </div>
        <div className="field">
          <label htmlFor="achievements">Achievements</label>
          <textarea id="achievements" value={form.achievements} onChange={update('achievements')} placeholder="One achievement per line." />
          <span className="field-hint">Put each achievement on its own line.</span>
        </div>

        <h2 className="edit-section-title">Contact &amp; links (optional, public)</h2>
        <div className="edit-row">
          <div className="field">
            <label htmlFor="email_public">Public email</label>
            <input id="email_public" type="email" value={form.email_public} onChange={update('email_public')} />
          </div>
          <div className="field">
            <label htmlFor="phone_public">Public phone</label>
            <input id="phone_public" value={form.phone_public} onChange={update('phone_public')} />
          </div>
        </div>
        <div className="field">
          <label htmlFor="github_url">GitHub URL</label>
          <input id="github_url" value={form.github_url} onChange={update('github_url')} />
        </div>
        <div className="field">
          <label htmlFor="linkedin_url">LinkedIn URL</label>
          <input id="linkedin_url" value={form.linkedin_url} onChange={update('linkedin_url')} />
        </div>
        <div className="field">
          <label htmlFor="facebook_url">Facebook URL</label>
          <input id="facebook_url" value={form.facebook_url} onChange={update('facebook_url')} />
        </div>

        <div className="edit-actions">
          <button type="button" className="btn btn-ghost" onClick={() => navigate('/dashboard')}>Cancel</button>
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? 'Saving…' : 'Save profile'}
          </button>
        </div>
      </form>

      <style>{`
        .edit-page { padding: 48px 0 96px; }
        .edit-head { margin-bottom: 32px; max-width: 620px; }
        .edit-eyebrow { color: var(--accent); font-size: 13px; font-weight: 600; margin-bottom: 8px; }
        .edit-title { font-size: 1.7rem; }
        .edit-lead { color: var(--text-dim); margin-top: 10px; font-size: 14.5px; }
        .edit-form {
          max-width: 620px;
          background: var(--bg-card);
          border: 1px solid var(--line-soft);
          border-radius: var(--radius);
          padding: 36px;
        }
        .edit-section-title {
          font-size: 14px;
          color: var(--text-dim);
          margin: 28px 0 18px;
          padding-top: 24px;
          border-top: 1px solid var(--line-soft);
        }
        .edit-form > .edit-section-title:first-of-type { border-top: none; padding-top: 0; margin-top: 8px; }
        .edit-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }
        .edit-avatar-row {
          display: flex;
          align-items: center;
          gap: 18px;
          margin-bottom: 8px;
        }
        .edit-avatar-preview {
          width: 72px;
          height: 72px;
          border-radius: var(--radius);
          background: var(--bg-raised);
          border: 1px solid var(--line);
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          flex-shrink: 0;
          font-family: var(--font-display);
          font-weight: 600;
          color: var(--accent);
        }
        .edit-avatar-preview img { width: 100%; height: 100%; object-fit: cover; }
        .edit-actions {
          display: flex;
          justify-content: flex-end;
          gap: 12px;
          margin-top: 28px;
          padding-top: 24px;
          border-top: 1px solid var(--line-soft);
        }
        @media (max-width: 560px) {
          .edit-form { padding: 24px; }
          .edit-row { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  )
}
