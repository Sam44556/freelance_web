import React, { useEffect, useState } from 'react'
import { useApp } from '../context/AppContext'

export default function NotificationsClient() {
  const { user, getInvitationsSent } = useApp()
  const [invites, setInvites] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  async function load(initial = false) {
    if (!user?._id) return
    if (initial) { setLoading(true); setError('') }
    const res = await getInvitationsSent()
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
    let timer
    load(true)
    timer = setInterval(() => load(false), 10000)
    return () => clearInterval(timer)
  }, [user?._id]) // wait until user is ready

  if (!user) return <p>Please login as a client.</p>

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Your Invitations</h2>

      {loading && (
        <div className="space-y-2">
          <div className="h-16 bg-gray-100 animate-pulse rounded" />
          <div className="h-16 bg-gray-100 animate-pulse rounded" />
        </div>
      )}

      {error && !loading && <p className="text-sm text-red-600">{error}</p>}

      {!loading && invites.length === 0 && (
        <p className="text-sm text-gray-600">No invitations sent yet.</p>
      )}

      {!loading && invites.length > 0 && (
        <div className="space-y-3">
          {invites.map(i => {
            const isAccepted = i.status === 'accepted'
            const isRejected = i.status === 'rejected'
            const isPending = i.status === 'pending'
            return (
              <div key={i._id} className="p-3 border rounded">
                <p className="font-medium">Job: {i.job?.title}</p>
                <p className="text-sm">To: {i.freelancer?.name} — {i.freelancer?.email}</p>
                {i.message && <p className="mt-1">{i.message}</p>}

                <span className={`inline-block mt-2 text-xs px-2 py-0.5 rounded ${isPending?'bg-gray-100 text-gray-700':isAccepted?'bg-green-100 text-green-700':'bg-red-100 text-red-700'}`}>
                  {i.status}
                </span>

                {isAccepted && (
                  <div className="mt-3 p-3 rounded border bg-green-50">
                    <p className="font-medium text-green-700">Freelancer contact</p>
                    {i.freelancer?.email && (
                      <p className="text-sm">
                        Email: <a className="text-blue-600 underline" href={`mailto:${i.freelancer.email}`}>{i.freelancer.email}</a>
                      </p>
                    )}
                  </div>
                )}

                {isRejected && (
                  <p className="mt-2 text-sm text-gray-600">Invitation was rejected.</p>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}