import React, { useEffect, useState } from 'react'
import { useApp } from '../context/AppContext'

export default function ProfileEdit(){
  const { user, getMyProfile, saveMyProfile } = useApp()
  const [profile, setProfile] = useState({ title:'', bio:'', skills:[], hourlyRate:'', location:'', phone:'', website:'', avatar:'', available:true })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    async function load(){
      const res = await getMyProfile()
      if (res.ok && res.profile) {
        setProfile({
          ...profile,
          ...res.profile,
          skills: Array.isArray(res.profile.skills) ? res.profile.skills : (res.profile.skills || '').split(',').map(s=>s.trim()).filter(Boolean)
        })
      }
    }
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (!user) return <p>Please login as a freelancer.</p>

  const onChange = (k, v) => setProfile(prev => ({ ...prev, [k]: v }))

  async function save(e){
    e.preventDefault()
    setSaving(true)
    const payload = { ...profile, skills: Array.isArray(profile.skills) ? profile.skills : String(profile.skills||'').split(',').map(s=>s.trim()).filter(Boolean) }
    const res = await saveMyProfile(payload)
    setSaving(false)
    if (res.ok) alert('Profile saved')
    else alert(res.message || 'Failed to save')
  }

  return (
    <form onSubmit={save} className="max-w-2xl mx-auto space-y-3">
      <h2 className="text-2xl font-semibold mb-2">My Profile</h2>
      <input className="w-full p-2 border rounded" placeholder="Title (e.g., Full-Stack Developer)" value={profile.title} onChange={e=>onChange('title', e.target.value)} />
      <textarea className="w-full p-2 border rounded" placeholder="Bio" value={profile.bio} onChange={e=>onChange('bio', e.target.value)} />
      <input className="w-full p-2 border rounded" placeholder="Skills (comma separated)" value={Array.isArray(profile.skills)? profile.skills.join(', ') : profile.skills} onChange={e=>onChange('skills', e.target.value)} />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <input type="number" className="p-2 border rounded" placeholder="Hourly rate" value={profile.hourlyRate||''} onChange={e=>onChange('hourlyRate', e.target.value)} />
        <input className="p-2 border rounded" placeholder="Location" value={profile.location||''} onChange={e=>onChange('location', e.target.value)} />
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={!!profile.available} onChange={e=>onChange('available', e.target.checked)} />
          Available for work
        </label>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <input className="p-2 border rounded" placeholder="Phone" value={profile.phone||''} onChange={e=>onChange('phone', e.target.value)} />
        <input className="p-2 border rounded" placeholder="Website" value={profile.website||''} onChange={e=>onChange('website', e.target.value)} />
        <input className="p-2 border rounded" placeholder="Avatar URL" value={profile.avatar||''} onChange={e=>onChange('avatar', e.target.value)} />
      </div>
      <button className="px-4 py-2 rounded bg-blue-600 text-white disabled:opacity-60" disabled={saving}>
        {saving ? 'Saving...' : 'Save Profile'}
      </button>
    </form>
  )
}