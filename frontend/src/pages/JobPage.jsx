import React from 'react'
import { Link } from 'react-router-dom'
import { useApp } from '../context/AppContext'

export default function JobsPage(){
  const { jobs, loading, user, deleteJob } = useApp()

  if (!user) {
    return <p className="p-4">Please login to view your jobs.</p>
  }

  const myJobs = (jobs || []).filter(j => {
    const createdById = typeof j.createdBy === 'string' ? j.createdBy : j.createdBy?._id
    return String(createdById) === String(user._id)
  })

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold">My Jobs</h2>
        <Link to="/jobs/create" className="px-4 py-2 rounded bg-blue-600 text-white">Post Job</Link>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : myJobs.length === 0 ? (
        <p className="text-sm text-gray-600">You have not posted any jobs yet.</p>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {myJobs.map(j=> (
            <div key={j._id} className="p-4 border rounded">
              <h3 className="text-lg font-semibold text-blue-600">{j.title}</h3>
              <p className="text-sm mt-1">{j.description}</p>
              <p className="mt-2 font-medium">Budget: ${j.budget}</p>
              <p className="text-xs mt-1">Category: {j.category}</p>
              <div className="flex gap-2 mt-3">
                <Link to={`/${j._id}`} className="px-3 py-1 rounded border text-sm">View</Link>
                <button
                  onClick={()=>deleteJob(j._id)}
                  className="px-3 py-1 rounded bg-red-500 text-white text-sm"
                >
                  Delete {j._id}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      </div>
      )
      }