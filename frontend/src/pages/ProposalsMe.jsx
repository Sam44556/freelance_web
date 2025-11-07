import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useApp } from '../context/AppContext'

export default function ProposalsMe() {
  const { user, getProposalsByFreelancer } = useApp()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [proposals, setProposals] = useState([])

  useEffect(() => {
    if (!user?._id || user.role !== 'freelancer') return
    ;(async () => {
      setLoading(true)
      const res = await getProposalsByFreelancer()
      if (res.ok) {
        // newest first if createdAt exists
        const list = (res.proposals || []).slice().sort((a, b) => {
          const da = new Date(a.createdAt || 0).getTime()
          const db = new Date(b.createdAt || 0).getTime()
          return db - da
        })
        setProposals(list)
        setError('')
      } else {
        setError(res.message || 'Failed to load proposals')
      }
      setLoading(false)
    })()
  }, [user?._id, user?.role])

  if (!user) return <p>Please login as a freelancer.</p>
  if (user.role !== 'freelancer') return <p>Only freelancers can view this page.</p>

  if (loading) return <p>Loading...</p>
  if (error) return <p className="text-red-600 text-sm">{error}</p>

  return (
    <div>
      <h2 className="text-xl font-semibold mb-3">My Proposals</h2>

      {proposals.length === 0 ? (
        <p className="text-sm text-gray-600">You have not submitted any proposals yet.</p>
      ) : (
        <div className="space-y-3">
{proposals.map(p => {
  const isPending = p.status === 'pending'
  const isAccepted = p.status === 'accepted'
  const isRejected = p.status === 'rejected'
  const badgeClass = isPending
    ? 'bg-gray-100 text-gray-700'
    : isAccepted
    ? 'bg-green-100 text-green-700'
    : 'bg-red-100 text-red-700'
  // fallback: job.createdBy holds the client
  const clientUser = p.job?.createdBy
  return (
    <div key={p._id} className="p-3 border rounded bg-white">
      <div className="flex items-center justify-between">
        <div>
          <p className="font-medium">{p.job?.title || 'Job'}</p>
        </div>
        <span className={`text-xs px-2 py-0.5 rounded ${badgeClass}`}>{p.status}</span>
      </div>

      <p className="text-sm mt-2">{p.coverLetter}</p>
      <p className="text-sm mt-1">Bid: ${p.proposedPrice} • Delivery: {p.deliveryTime}d</p>

      {isAccepted && clientUser?.email && (
        <div className="mt-3 p-3 rounded border bg-green-50">
          <p className="font-medium text-green-700">Client contact</p>
          <p className="text-sm">
            Email: <a className="text-blue-600 underline" href={`mailto:${clientUser.email}`}>{clientUser.email}</a>
          </p>
        </div>
      )}

      {isRejected && (
        <p className="mt-2 text-sm text-gray-600">This proposal was rejected.</p>
      )}
    </div>
  )
})}
        </div>
      )}
    </div>
  )
}