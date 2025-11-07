import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useApp } from '../context/AppContext'

export default function ProposalsForJob(){
  const { jobId } = useParams()
  const { user, getProposalsForJob, updateProposalStatus } = useApp()
  const [proposals, setProposals] = useState([])
  const [msg, setMsg] = useState('')
  const [busyId, setBusyId] = useState(null)

  useEffect(()=>{
    async function load(){
      const res = await getProposalsForJob(jobId, user?._id)
      if(res.ok) setProposals(res.proposals)
    }
    load()
  },[jobId, user, getProposalsForJob])

  async function changeStatus(id, status){
    try {
      setBusyId(id)
      const res = await updateProposalStatus(id, status)
      if(res.ok) setMsg(`Proposal ${status}`)
      // reload
      const fresh = await getProposalsForJob(jobId, user._id)
      if(fresh.ok) setProposals(fresh.proposals)
    } finally {
      setBusyId(null)
    }
  }

  if(!user) return <p>Login as client to view proposals</p>

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Proposals for job</h2>
      {msg && <p className="text-green-600">{msg}</p>}

      <div className="space-y-3">
        {proposals.map(p=> {
          const status = (p.status || 'pending').toLowerCase()
          const isPending = status === 'pending'
          const isAccepted = status === 'accepted'
          const isRejected = status === 'rejected'

          return (
            <div key={p._id} className="p-3 border rounded">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-medium">Freelancer: {p.freelancer?.name}</p>
                  <p className="text-sm">Price: ${p.proposedPrice} — Delivery: {p.deliveryTime} days</p>
                </div>

                {/* Status badge */}
                <span
                  className={
                    'px-2 py-0.5 rounded text-xs font-medium ' +
                    (isAccepted ? 'bg-green-100 text-green-700' :
                     isRejected ? 'bg-red-100 text-red-700' :
                     'bg-gray-100 text-gray-700')
                  }
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </span>
              </div>

              <p className="mt-2">{p.coverLetter}</p>

              {/* Actions */}
              {isPending && (
                <div className="mt-2 flex gap-2">
                  <button
                    onClick={()=>changeStatus(p._id,'accepted')}
                    className="px-3 py-1 rounded bg-green-600 text-white disabled:opacity-60"
                    disabled={busyId === p._id}
                  >
                    Accept
                  </button>
                  <button
                    onClick={()=>changeStatus(p._id,'rejected')}
                    className="px-3 py-1 rounded bg-red-600 text-white disabled:opacity-60"
                    disabled={busyId === p._id}
                  >
                    Reject
                  </button>
                </div>
              )}

              {/* Accepted: show contact info */}
              {isAccepted && (
                <div className="mt-3 p-3 rounded border bg-green-50">
                  <p className="font-medium text-green-700">Contact freelancer</p>
                  {p.freelancer?.email && (
                    <p className="text-sm">
                      Email: <a className="text-blue-600 underline" href={`mailto:${p.freelancer.email}`}>
                        {p.freelancer.email}
                      </a>
                    </p>
                  )}
                  {p.freelancer?.phone && (
                    <p className="text-sm">
                      Phone: <a className="text-blue-600 underline" href={`tel:${p.freelancer.phone}`}>
                        {p.freelancer.phone}
                      </a>
                    </p>
                  )}
                </div>
              )}

              {/* Rejected: no actions */}
              {isRejected && (
                <p className="mt-2 text-sm text-gray-600">This proposal was rejected.</p>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}