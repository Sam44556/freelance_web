import React, { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { Button } from '../components/ui/button'
import { Badge } from '../components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '../components/ui/card'
import { Separator } from '../components/ui/separator'
import { Avatar, AvatarFallback } from '../components/ui/avatar'
import {
  Briefcase,
  DollarSign,
  User,
  Calendar,
  ChevronLeft,
  Share2,
  CircleCheck,
  AlertCircle
} from 'lucide-react'

export default function JobDetails() {
  const params = useParams()
  const jobId = params.jobId || params.id
  const { jobs, fetchJobs, user } = useApp()
  const [job, setJob] = useState(null)
  const [loading, setLoading] = useState(true)
  const [msg, setMsg] = useState('')
  const nav = useNavigate()

  useEffect(() => {
    let active = true
    async function load() {
      setLoading(true)
      if (!jobs.length && fetchJobs) {
        await fetchJobs()
      }
      const found = (jobs || []).find(j => String(j._id) === String(jobId))
      if (found) {
        if (active) {
          setJob(found)
          setLoading(false)
        }
        return
      }
      try {
        const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/jobs/${jobId}`)
        if (res.ok) {
          const data = await res.json().catch(() => ({}))
          const j = data.job || data
          if (j && active) setJob(j)
        }
      } catch (_) { }
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

  if (loading) return (
    <div className="max-w-4xl mx-auto space-y-4">
      <div className="h-8 w-48 bg-muted animate-pulse rounded" />
      <div className="h-[400px] w-full bg-muted animate-pulse rounded-xl" />
    </div>
  )

  if (!job) return (
    <div className="text-center py-20">
      <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
      <h3 className="text-xl font-semibold">Job not found</h3>
      <Button variant="link" onClick={() => nav('/jobs')}>Back to Jobs</Button>
    </div>
  )

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      <Button
        variant="ghost"
        size="sm"
        className="mb-2"
        onClick={() => nav(-1)}
      >
        <ChevronLeft className="mr-2 h-4 w-4" /> Back
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-none shadow-sm">
            <CardHeader className="pb-4">
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <Badge variant="secondary">{job.category}</Badge>
                <Badge variant="outline">Verified Client</Badge>
              </div>
              <CardTitle className="text-3xl font-bold leading-tight">{job.title}</CardTitle>
              <div className="flex flex-wrap items-center text-sm text-muted-foreground gap-4 pt-2">
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4" /> Posted 2 days ago
                </span>
                <span className="flex items-center gap-1.5">
                  <Briefcase className="h-4 w-4" /> Full-time
                </span>
              </div>
            </CardHeader>
            <Separator />
            <CardContent className="pt-6">
              <h3 className="text-lg font-semibold mb-3">Project Description</h3>
              <div className="text-muted-foreground whitespace-pre-wrap leading-relaxed">
                {job.description}
              </div>

              <div className="mt-8 space-y-4">
                <h3 className="text-lg font-semibold">Required Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {["React", "Node.js", "Tailwind CSS", "UI/UX Design"].map((skill, i) => (
                    <Badge key={i} variant="secondary" className="px-3 py-1">{skill}</Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="border-none shadow-md bg-primary text-primary-foreground">
            <CardHeader>
              <CardTitle className="text-lg">Project Budget</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold flex items-center">
                <DollarSign className="h-8 w-8" />
                {job.budget}
              </div>
              <p className="text-primary-foreground/80 text-sm mt-1">Fixed Price</p>
            </CardContent>
            <CardFooter className="flex flex-col gap-3 pt-0">
              {user?.role === 'freelancer' ? (
                <Button className="w-full bg-background text-primary hover:bg-background/90" size="lg" onClick={handleApply}>
                  Submit a Proposal
                </Button>
              ) : !user ? (
                <Link to="/login" className="w-full">
                  <Button className="w-full bg-background text-primary hover:bg-background/90" size="lg">
                    Login to Apply
                  </Button>
                </Link>
              ) : null}

              {user?.role === 'client' && String(user._id) === String(job.createdBy?._id) && (
                <Link to={`/proposals/job/${job._id}`} className="w-full">
                  <Button className="w-full bg-background text-primary hover:bg-background/90" size="lg">
                    View Proposals
                  </Button>
                </Link>
              )}
              <Button variant="ghost" className="w-full text-primary-foreground hover:bg-primary-foreground/10">
                <Share2 className="mr-2 h-4 w-4" /> Share Job
              </Button>
            </CardFooter>
          </Card>

          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">About the Client</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarFallback><User className="h-5 w-5" /></AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold">{job.createdBy?.name || 'Client'}</p>
                  <p className="text-xs text-muted-foreground uppercase">{job.createdBy?.role}</p>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Location</span>
                  <span>United States</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Member since</span>
                  <span>Jan 2024</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Total Spent</span>
                  <span className="font-semibold">$12.5k</span>
                </div>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-green-600 font-medium">
                <CircleCheck className="h-4 w-4" /> Payment Method Verified
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      {msg && (
        <div className="fixed bottom-8 right-8 bg-green-100 border border-green-200 text-green-800 px-6 py-3 rounded-lg shadow-xl animate-in fade-in slide-in-from-bottom-4">
          {msg}
        </div>
      )}
    </div>
  )
}
