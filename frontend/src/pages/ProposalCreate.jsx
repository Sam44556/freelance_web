import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'

export default function ProposalCreate(){
  const { jobId } = useParams()
  const { user, createProposal, getProposalsByFreelancer } = useApp()
  const nav = useNavigate()

  const [coverLetter,setCoverLetter] = useState('')
  const [price,setPrice] = useState('')
  const [delivery,setDelivery] = useState('')
  const [err,setErr] = useState('')
  const [alreadySubmitted, setAlreadySubmitted] = useState(false)
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    async function check() {
      if (!user) { setChecking(false); return }
      try {
        const res = await getProposalsByFreelancer(user._id)
        if (res?.ok && Array.isArray(res.proposals)) {
          const exists = res.proposals.some(p => {
            const pid = p?.job?._id || p?.job
            return String(pid) === String(jobId)
          })
          setAlreadySubmitted(exists)
          if (exists) setErr('You already submitted a proposal for this job.')
        }
      } finally {
        setChecking(false)
      }
    }
    check()
  }, [user, jobId, getProposalsByFreelancer])

  async function submit(e){
    e.preventDefault()
    if (!user) return nav('/login')
    if (alreadySubmitted) return
    setErr('')
    const res = await createProposal({
      jobId,
      coverLetter,
      proposedPrice: Number(price),
      deliveryTime: Number(delivery)
    })
    if(res.ok) nav('/jobs')
    else setErr(res.message || 'Failed to submit proposal')
  }

  if (!user) return <p>Please login as a freelancer to submit a proposal.</p>
  if (checking) return <p>Checking existing proposal...</p>

  return (
    <div className="max-w-xl mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-xl font-semibold text-blue-600">Send Proposal</h2>

      <form onSubmit={submit} className="mt-4 space-y-3">
        {alreadySubmitted && (
          <p className="text-red-600 font-medium">
            You already submitted a proposal for this job.
          </p>
        )}

        <textarea
          className="w-full p-2 border rounded"
          placeholder="Cover letter"
          value={coverLetter}
          onChange={e=>setCoverLetter(e.target.value)}
          disabled={alreadySubmitted}
          required
        />
        <input
          type="number"
          className="w-full p-2 border rounded"
          placeholder="Proposed price"
          value={price}
          onChange={e=>setPrice(e.target.value)}
          disabled={alreadySubmitted}
          min="0"
          required
        />
        <input
          type="number"
          className="w-full p-2 border rounded"
          placeholder="Delivery time (days)"
          value={delivery}
          onChange={e=>setDelivery(e.target.value)}
          disabled={alreadySubmitted}
          min="1"
          required
        />

        {err && <p className="text-red-500">{err}</p>}

        <button
          className="px-4 py-2 rounded bg-blue-600 text-white disabled:opacity-60"
          disabled={alreadySubmitted}
        >
          Send Proposal
        </button>
      </form>
    </div>
  )
}