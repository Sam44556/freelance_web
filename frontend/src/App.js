import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import NavBar from './components/NavBar'
import { useApp } from './context/AppContext'

// Pages (create these if missing)
import Landing from './pages/Landing'
import JobsPage from './pages/JobsPage'
import FreelancersPage from './pages/FreelancersPage'
import ProfileEdit from './pages/ProfileEdit'
import NotificationsFreelancer from './pages/NotificationsFreelancer'
import NotificationsClient from './pages/NotificationsClient'
import ProposalCreate from './pages/ProposalCreate'
import ProposalsForJob from './pages/ProposalsForJob'
import Login from './pages/Login'
import JobPage from './pages/JobPage'
import Signup from './pages/Signup'
// Optional pages (comment out if you don’t have them yet)
 import JobCreate from './pages/JobCreate'
 import JobDetail from './pages/JobDetails'
 import ProposalsMe from './pages/ProposalsMe'
export default function App() {
  const { ready } = useApp?.() || { ready: true }

  if (!ready) return null

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <NavBar />
      <main className="container mx-auto px-4 py-6">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/jobs" element={<JobsPage />} />
          <Route path="/jobs/create" element={<JobCreate />} />
          <Route path="/:jobId" element={<JobDetail />} />
          <Route path="/jobs/:jobId/propose" element={<ProposalCreate />} />
          <Route path="/myjobs" element={<JobPage />} />
          <Route path="/freelancers" element={<FreelancersPage />} />
          <Route path="/profile/edit" element={<ProfileEdit />} />
          <Route path="/proposals/me" element={<ProposalsMe />} />
          <Route path="/notifications" element={<NotificationsFreelancer />} />
          <Route path="/notifications/sent" element={<NotificationsClient />} />
           <Route path="/proposals/create/:jobId" element={<ProposalCreate />} />
          <Route path="/proposals/job/:jobId" element={<ProposalsForJob />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="*" element={<Navigate to="/" replace />} />
          
        </Routes>
      </main>
    </div>
  )
}