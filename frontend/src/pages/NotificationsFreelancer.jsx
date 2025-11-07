import React, { useEffect, useState } from 'react'
import { useApp } from '../context/AppContext'

export default function NotificationsFreelancer() {
  const { user, getInvitationsForMe, respondToInvitation } = useApp()
  const [invites, setInvites] = useState([])
  const [busyId, setBusyId] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  async function load(initial = false) {
    if (!user?._id) return
    if (initial) { setLoading(true); setError('') }
    const res = await getInvitationsForMe()
    if (res.ok) {
      setInvites(res.invitations || [])
      setError('')
    } else {
      setError(res.message || 'Failed to load invitations')
    }
    if (initial) setLoading(false)
  }

  useEffect(() => {
    if (!user?._id) return
    load(true)
    const t = setInterval(() => load(false), 10000)
    return () => clearInterval(t)
  }, [user?._id])

  if (!user) return <p>Please login as a freelancer.</p>

  async function onRespond(id, status) {
    setBusyId(id)
    const res = await respondToInvitation(id, status)
    setBusyId(null)
    if (res.ok) {
      setInvites(prev => prev.map(i => i._id === id ? { ...i, status } : i))
    }
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Invitations</h2>

      {loading && (
        <div className="space-y-2">
          <div className="h-16 bg-gray-100 animate-pulse rounded" />
          <div className="h-16 bg-gray-100 animate-pulse rounded" />
        </div>
      )}

      {error && !loading && <p className="text-sm text-red-600">{error}</p>}

      {!loading && invites.length === 0 && (
        <p className="text-sm text-gray-600">No invitations yet.</p>
      )}

      {!loading && invites.length > 0 && (
        <div className="space-y-3">
          {invites.map(i => {
            const isPending = i.status === 'pending'
            const isAccepted = i.status === 'accepted'
            const isRejected = i.status === 'rejected'
            return (
              <div key={i._id} className="p-3 border rounded">
                <p className="font-medium">Job: {i.job?.title}</p>
                <p className="text-sm">From: {i.client?.name} — {i.client?.email}</p>
                {i.message && <p className="mt-1">{i.message}</p>}

                <div className="mt-2 flex items-center gap-2">
                  <span className={`text-xs px-2 py-0.5 rounded ${isPending?'bg-gray-100 text-gray-700':isAccepted?'bg-green-100 text-green-700':'bg-red-100 text-red-700'}`}>
                    {i.status}
                  </span>

                  {isPending && (
                    <>
                      <button
                        onClick={()=>onRespond(i._id,'accepted')}
                        className="px-3 py-1 rounded bg-green-600 text-white text-sm disabled:opacity-60"
                        disabled={busyId===i._id}
                      >
                        Accept
                      </button>
                      <button
                        onClick={()=>onRespond(i._id,'rejected')}
                        className="px-3 py-1 rounded bg-red-600 text-white text-sm disabled:opacity-60"
                        disabled={busyId===i._id}
                      >
                        Reject
                      </button>
                    </>
                  )}
                </div>

                {isAccepted && (
                  <div className="mt-3 p-3 rounded border bg-green-50">
                    <p className="font-medium text-green-700">Client contact</p>
                    {i.client?.email && (
                      <p className="text-sm">
                        Email: <a className="text-blue-600 underline" href={`mailto:${i.client.email}`}>{i.client.email}</a>
                      </p>
                    )}
                  </div>
                )}

                {isRejected && <p className="mt-2 text-sm text-gray-600">You rejected this invitation.</p>}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}