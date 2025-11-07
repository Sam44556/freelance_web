import React, { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useApp } from '../context/AppContext'

export default function JobsPage(){
  const { jobs, fetchJobs, loading, user } = useApp()
  const [q, setQ] = useState('')

  useEffect(()=>{ fetchJobs() },[])

  const visibleJobs = useMemo(() => {
    const s = q.trim().toLowerCase()
    if (!s) return jobs
    return jobs.filter(j => {
      const fields = [
        j.title,
        j.description,
        j.category,
        j.createdBy?.name
      ]
      return fields.some(v => String(v || '').toLowerCase().includes(s))
    })
  }, [jobs, q])

  if(loading) return <p>Loading jobs...</p>

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold mb-3">Jobs</h2>
      </div>

      {/* Search bar */}
      <div className="mb-4">
        <input
          type="text"
          value={q}
          onChange={(e)=>setQ(e.target.value)}
          placeholder="Search jobs by title, description, category, or client..."
          className="w-full md:w-1/2 p-2 border rounded"
        />
        {user?.role === 'client' && (
          <Link to="/job" className="ml-4 px-4 py-2 rounded bg-blue-600 text-white">MY JOBS</Link>
        )}
        <p className="text-xs text-gray-500 mt-1">
          Showing {visibleJobs.length} of {jobs.length} jobs
        </p>
      </div>

      {visibleJobs.map(j => (
        <div key={j._id} className="p-4 border rounded flex items-start justify-between">
          <div>
            <h3 className="text-lg font-medium text-blue-600">
              <Link to={`/jobs/${j._id}`}>{j.title}</Link>
            </h3>
            <p className="text-sm">{j.description}</p>
            <p className="text-sm">Budget: ${j.budget} • Category: {j.category}</p>
            <p className="text-xs">By: {j.createdBy?.name} ({j.createdBy?.role})</p>
          </div>
          <div className="ml-4">
            {user?.role === 'client' && (
              <Link to={`/proposals/job/${j._id}`} className="text-sm underline">Proposals</Link>
            )}
            {user?.role === 'freelancer' && (
              <Link to={`/proposals/create/${j._id}`} className="text-sm underline">Apply</Link>
            )}
          </div>
        </div>
      ))}

      {visibleJobs.length === 0 && (
        <p className="text-sm text-gray-600">No jobs match your search.</p>
      )}
    </div>
  )
}