import React, { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'

export default function JobDetails() {
  const params = useParams()
  const jobId = params.jobId || params.id   // support either :jobId or :id
  const { jobs, fetchJobs, user } = useApp()
  const [job, setJob] = useState(null)
  const [loading, setLoading] = useState(true)
  const [msg, setMsg] = useState('')
  const nav = useNavigate()

  useEffect(() => {
    let active = true
    async function load() {
      setLoading(true)
      // Ensure jobs list loaded
      if (!jobs.length && fetchJobs) {
        await fetchJobs()
      }
      // Try from list
      const found = (jobs || []).find(j => String(j._id) === String(jobId))
      if (found) {
        if (active) {
          setJob(found)
          setLoading(false)
        }
        return
      }
      // Fallback: fetch single job (requires backend GET /jobs/:id)
      try {
        const res = await fetch(`${process.env.backend_url}/jobs/${jobId}`)
        if (res.ok) {
          const data = await res.json().catch(() => ({}))
          const j = data.job || data
          if (j && active) setJob(j)
        }
      } catch (_) {}
      if (active) setLoading(false)
    }
    if (jobId) load()
    return () => { active = false }
  }, [jobId, jobs, fetchJobs])

  function handleApply() {
    if (!user) return setMsg('Login first')
    if (user.role !== 'freelancer') return setMsg('Only freelancers can apply')
    nav(`/proposals/create/${jobId}`)
  }

  if (loading) return <p>Loading job...</p>
  if (!job) return <p>Job not found.</p>

  return (
    <div className="max-w-2xl mx-auto p-4 border rounded">
      <h2 className="text-2xl font-semibold text-blue-600">{job.title}</h2>
      <p className="mt-2">{job.description}</p>
      {job.budget != null && <p className="mt-2 font-medium">Budget: ${job.budget}</p>}
      {job.category && <p className="mt-1 text-sm">Category: {job.category}</p>}
      <p className="mt-1 text-xs">
        Posted by: {job.createdBy?.name} {job.createdBy?.role && `(${job.createdBy.role})`}
      </p>

      <div className="mt-4 flex gap-2">
        {user?.role === 'freelancer' ? (
          <button onClick={handleApply} className="px-4 py-2 rounded bg-blue-600 text-white">
            Apply
          </button>
        ) : (
          <p className="text-sm">Login as freelancer to apply</p>
        )}
        {user?.role === 'client' && String(user._id) === String(job.createdBy?._id) && (
          <Link to={`/proposals/job/${job._id}`} className="px-4 py-2 rounded border">
            View Proposals
          </Link>
        )}
      </div>
      {msg && <p className="mt-2 text-green-600 text-sm">{msg}</p>}
    </div>
  )
}