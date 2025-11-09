import React, { createContext, useContext, useEffect, useState } from 'react'

const AppContext = createContext(null)
export const useApp = () => useContext(AppContext)

const API =
  (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_URL) ||
  process.env.backend_url ||
  'http://localhost:5000/api'

export function AppProvider({ children }) {
  // Auth/user
  const [user, setUser] = useState(null)
  const [ready, setReady] = useState(false)

  // Jobs
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(false)

  // ---------- Auth (no Authorization header; store user in localStorage) ----------
  useEffect(() => {
    try {
      const raw = localStorage.getItem('user')
      if (raw) setUser(JSON.parse(raw))
    } finally {
      setReady(true)
    }
  }, [])

  async function login({ email, password }) {
    const res = await fetch(`${API}/api/users/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    })
    const data = await res.json().catch(() => ({}))
    if (res.ok && data?.user) {
      setUser(data.user)
      localStorage.setItem('user', JSON.stringify(data.user))
      return { ok: true, user: data.user }
    }
    return { ok: false, message: data?.message || 'Login failed' }
  }

  async function signup(payload) {
    const res = await fetch(`${API}/api/users/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
    const data = await res.json().catch(() => ({}))
    if (res.ok && data?.user) {
      setUser(data.user)
      localStorage.setItem('user', JSON.stringify(data.user))
      return { ok: true, user: data.user }
    }
    return { ok: false, message: data?.message || 'Signup failed' }
  }

  function logout() {
    localStorage.removeItem('user')
    setUser(null)
  }

  // ---------- Jobs ----------
  async function fetchJobs() {
    setLoading(true)
    try {
      const res = await fetch(`${API}/api/jobs`)
      const data = await res.json().catch(() => ({}))
      // accept either array or { jobs: [] }
      const list = Array.isArray(data) ? data : (data.jobs || [])
      setJobs(list)
      return { ok: res.ok, jobs: list }
    } catch (e) {
      return { ok: false, message: e.message }
    } finally {
      setLoading(false)
    }
  }

  async function createJob(job) {
    if (!user?._id) return { ok: false, message: 'Login first' }
    const res = await fetch(`${API}/api/jobs/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...job, clientId: user._id })
    })
    const data = await res.json().catch(() => ({}))
    if (res.ok) {
      await fetchJobs()
      return { ok: true, job: data.job || data }
    }
    return { ok: false, message: data?.message || 'Failed to create job' }
  }

  async function deleteJob(jobId) {
    if (!user?._id) return { ok: false, message: 'Login first' }
    const res = await fetch(`${API}/api/jobs/${jobId}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: user._id })
    })
    const data = await res.json().catch(() => ({}))
    if (res.ok) {
      setJobs(prev => prev.filter(j => j._id !== jobId))
      return { ok: true }
    }
    return { ok: false, message: data?.message || 'Failed to delete job' }
  }

  // Only jobs created by current user
  const getMyJobs = async () => {
    await fetchJobs()
    const mine = (jobs || []).filter(j => String((j.createdBy?._id || j.createdBy)) === String(user?._id))
    return mine
  }

  // ---------- Profiles ----------
  const getProfiles = async (search = '') => {
    const url = new URL(`${API}/api/profiles`)
    if (search) url.searchParams.set('search', search)
    const res = await fetch(url, { headers: { 'Content-Type': 'application/json' } })
    const data = await res.json().catch(() => ({}))
    return { ok: res.ok && data.ok !== false, profiles: data.profiles || [], message: data.message }
  }

  const getMyProfile = async () => {
    if (!user?._id) return { ok: false, message: 'Login first' }
    const res = await fetch(`${API}/api/profiles/me?userId=${encodeURIComponent(user._id)}`, {
      headers: { 'Content-Type': 'application/json' }
    })
    const data = await res.json().catch(() => ({}))
    return { ok: res.ok && data.ok !== false, profile: data.profile || null, message: data.message }
  }

  const saveMyProfile = async (profile) => {
    if (!user?._id) return { ok: false, message: 'Login first' }
    const res = await fetch(`${API}/api/profiles/me`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: user._id, ...profile })
    })
    const data = await res.json().catch(() => ({}))
    return { ok: res.ok && data.ok !== false, profile: data.profile, message: data.message }
  }

  // ---------- Invitations ----------
  const sendInvitation = async ({ jobId, freelancerId, message }) => {
    if (!user?._id) return { ok: false, message: 'Login first' }
    const res = await fetch(`${API}/api/invitations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ jobId, clientId: user._id, freelancerId, message })
    })
    const data = await res.json().catch(() => ({}))
    return { ok: res.ok && data.ok !== false, invitation: data.invitation, message: data.message }
  }

  const getInvitationsForMe = async () => {
    if (!user?._id) return { ok: false, message: 'Login first' }
    const res = await fetch(`${API}/api/invitations/me?freelancerId=${encodeURIComponent(user._id)}`)
    const data = await res.json().catch(() => ({}))
    return { ok: res.ok && data.ok !== false, invitations: data.invitations || [], message: data.message }
  }

  const getInvitationsSent = async () => {
    if (!user?._id) return { ok: false, message: 'Login first' }
    const res = await fetch(`${API}/api/invitations/sent?clientId=${encodeURIComponent(user._id)}`)
    const data = await res.json().catch(() => ({}))
    return { ok: res.ok && data.ok !== false, invitations: data.invitations || [], message: data.message }
  }

  const respondToInvitation = async (id, status) => {
    if (!user?._id) return { ok: false, message: 'Login first' }
    const res = await fetch(`${API}/api/invitations/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, freelancerId: user._id })
    })
    const data = await res.json().catch(() => ({}))
    return { ok: res.ok && data.ok !== false, invitation: data.invitation, message: data.message }
  }

  // ---------- Proposals ----------
  async function createProposal({ jobId, coverLetter, proposedPrice, deliveryTime }) {
    if (!user?._id) return { ok: false, message: 'Login first' }
    const res = await fetch(`${API}/api/proposals/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jobId,
        freelancerId: user._id,
        coverLetter,
        proposedPrice,
        deliveryTime
      })
    })
    const data = await res.json().catch(() => ({}))
    return { ok: res.ok, ...data }
  }

  async function getProposalsForJob(jobId) {
    if (!jobId) return { ok: false, proposals: [], message: 'Missing jobId' }
    // Optional: include clientId to let backend authorize
    const url = `${API}/api/proposals/job/${jobId}?clientId=${encodeURIComponent(user?._id || '')}`
    const res = await fetch(url)
    const data = await res.json().catch(() => ({}))
    if (res.ok && Array.isArray(data)) return { ok: true, proposals: data }
    return { ok: false, proposals: [], message: data?.message || 'Failed to load proposals' }
  }

  async function getProposalsByFreelancer(freelancerId) {
    const id = freelancerId || user?._id
    if (!id) return { ok: false, proposals: [], message: 'Missing freelancer id' }
    const res = await fetch(`${API}/api/proposals/freelancer/${id}`)
    const data = await res.json().catch(() => ({}))
    if (res.ok && Array.isArray(data)) return { ok: true, proposals: data }
    return { ok: false, proposals: [], message: data?.message || 'Failed to load proposals' }
  }

  async function updateProposalStatus(proposalId, status) {
    const res = await fetch(`${API}/api/proposals/${proposalId}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    })
    const data = await res.json().catch(() => ({}))
    return { ok: res.ok, ...data }
  }


  const value = {
    // auth
    user,
    setUser,
    ready,
    login,
    signup,
    logout,

    // jobs
    jobs,
    loading,
    fetchJobs,
    createJob,
    deleteJob,
    getMyJobs,

    // profiles
    getProfiles,
    getMyProfile,
    saveMyProfile,

    // invitations
    sendInvitation,
    getInvitationsForMe,
    getInvitationsSent,
    respondToInvitation,

    // proposals
    createProposal,
    getProposalsForJob,
    getProposalsByFreelancer,
    updateProposalStatus
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}