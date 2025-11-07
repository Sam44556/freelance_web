import React, { useEffect, useMemo, useState } from 'react'
import { useApp } from '../context/AppContext'

export default function FreelancersPage(){
  const { user, getProfiles, sendInvitation, getMyJobs } = useApp()
  const [q, setQ] = useState('')
  const [profiles, setProfiles] = useState([])
  const [jobs, setJobs] = useState([])
  const [busy, setBusy] = useState(null)
  const isClient = user?.role === 'client'

  useEffect(() => {
    async function load(){
      const res = await getProfiles('')
      if (res.ok) setProfiles(res.profiles)
      if (isClient) {
        const myJobs = await getMyJobs()
        setJobs(myJobs)
      }
    }
    load()
  }, [getProfiles, getMyJobs, isClient])

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase()
    if (!s) return profiles
    return profiles.filter(p => {
      const fields = [
        p?.user?.name, p?.user?.email, p?.title, p?.bio, (p?.skills||[]).join(' '), p?.location
      ]
      return fields.some(v => String(v || '').toLowerCase().includes(s))
    })
  }, [profiles, q])

  const [inviteMsg, setInviteMsg] = useState('')
  const [selectedJob, setSelectedJob] = useState('')

  async function invite(freelancerId){
    if (!isClient) return
    if (!selectedJob) return alert('Select a job to invite for')
    setBusy(freelancerId)
    const res = await sendInvitation({ jobId: selectedJob, freelancerId, message: inviteMsg })
    setBusy(null)
    if (res.ok) {
      setInviteMsg('')
      alert('Invitation sent')
    } else {
      alert(res.message || 'Failed to send invitation')
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold mb-3">Freelancers</h2>
      </div>

      <div className="mb-4">
        <input
          value={q}
          onChange={e=>setQ(e.target.value)}
          placeholder="Search by name, title, skills, bio, location..."
          className="w-full md:w-2/3 p-2 border rounded"
        />
        <p className="text-xs text-gray-500 mt-1">Showing {filtered.length} freelancers</p>
      </div>

      {isClient && (
        <div className="mb-6 flex flex-col md:flex-row gap-3">
          <select
            className="p-2 border rounded md:w-1/3"
            value={selectedJob}
            onChange={e=>setSelectedJob(e.target.value)}
          >
            <option value="">Select one of your jobs...</option>
            {jobs.map(j => <option key={j._id} value={j._id}>{j.title}</option>)}
          </select>
          <input
            className="p-2 border rounded flex-1"
            placeholder="Invitation message (optional)"
            value={inviteMsg}
            onChange={e=>setInviteMsg(e.target.value)}
          />
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-4">
        {filtered.map(p => (
          <div key={p._id || p.user?._id} className="p-4 border rounded">
            <div className="flex items-start gap-3">
              {p.avatar && <img src={p.avatar} alt="" className="w-12 h-12 rounded-full object-cover" />}
              <div>
                <p className="font-semibold">{p.user?.name}</p>
                <p className="text-sm text-gray-600">{p.title}</p>
                <p className="text-sm mt-1">{p.bio}</p>
                <p className="text-xs mt-1">Skills: {(p.skills||[]).join(', ')}</p>
                <p className="text-xs mt-1">Location: {p.location} {p.hourlyRate ? `• $${p.hourlyRate}/hr` : ''}</p>
              </div>
            </div>

            {isClient && (
              <div className="mt-3">
                <button
                  onClick={()=>invite(p.user._id)}
                  className="px-3 py-1 rounded bg-blue-600 text-white text-sm disabled:opacity-60"
                  disabled={busy === p.user._id || !selectedJob}
                >
                  {busy === p.user._id ? 'Sending...' : 'Send Invitation'}
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {filtered.length === 0 && <p className="text-sm text-gray-600">No freelancers match your search.</p>}
    </div>
  )
}