import React, { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Textarea } from '../components/ui/textarea'
import { Label } from '../components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Send, AlertCircle, Clock, DollarSign, FileText } from 'lucide-react'

export default function ProposalCreate() {
  const { jobId } = useParams()
  const { user, createProposal, getProposalsByFreelancer } = useApp()
  const nav = useNavigate()

  const [coverLetter, setCoverLetter] = useState('')
  const [price, setPrice] = useState('')
  const [delivery, setDelivery] = useState('')
  const [err, setErr] = useState('')
  const [alreadySubmitted, setAlreadySubmitted] = useState(false)
  const [checking, setChecking] = useState(true)
  const [loading, setLoading] = useState(false)

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
          if (exists) setErr('You have already submitted a proposal for this project.')
        }
      } finally {
        setChecking(false)
      }
    }
    check()
  }, [user, jobId, getProposalsByFreelancer])

  async function submit(e) {
    e.preventDefault()
    if (!user) return nav('/login')
    if (alreadySubmitted) return

    setLoading(true)
    setErr('')

    try {
      const res = await createProposal({
        jobId,
        coverLetter,
        proposedPrice: Number(price),
        deliveryTime: Number(delivery)
      })
      if (res.ok) nav('/jobs')
      else setErr(res.message || 'Failed to submit proposal')
    } catch (error) {
      setErr('An unexpected error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (!user) return (
    <div className="flex flex-col items-center justify-center py-20 bg-muted/20 rounded-2xl border-2 border-dashed max-w-2xl mx-auto">
      <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
      <h3 className="text-xl font-semibold">Authentication Required</h3>
      <p className="text-muted-foreground mt-2 mb-6 text-center max-w-sm">Please login as a freelancer to submit your professional proposal.</p>
      <Link to="/login">
        <Button size="lg">Log In Now</Button>
      </Link>
    </div>
  )

  if (checking) return (
    <div className="max-w-2xl mx-auto py-20 space-y-4">
      <div className="h-8 w-48 bg-muted animate-pulse rounded mx-auto" />
      <div className="h-64 w-full bg-muted animate-pulse rounded-xl" />
    </div>
  )

  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      <Card className="border-none shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1.5 bg-primary" />
        <CardHeader className="text-center pt-8">
          <div className="flex justify-center mb-4 text-primary">
            <Send className="h-12 w-12" />
          </div>
          <CardTitle className="text-3xl font-bold">Submit Your Proposal</CardTitle>
          <CardDescription>
            Show the client why you're the best fit for this project
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={submit} className="space-y-6">
            {alreadySubmitted && (
              <div className="flex items-center gap-3 p-4 bg-orange-50 border border-orange-200 text-orange-800 rounded-lg">
                <AlertCircle className="h-5 w-5 shrink-0" />
                <p className="text-sm font-medium">You've already applied for this job. Each freelancer can only submit one proposal per project.</p>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="coverLetter" className="flex items-center gap-2">
                <FileText className="h-4 w-4" /> Cover Letter
              </Label>
              <Textarea
                id="coverLetter"
                className="min-h-[200px] resize-none shadow-sm"
                placeholder="Write a compelling cover letter detailng your experience and how you'll solve the client's needs..."
                value={coverLetter}
                onChange={e => setCoverLetter(e.target.value)}
                disabled={alreadySubmitted}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="price" className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4" /> Proposed Bid ($)
                </Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                  <Input
                    id="price"
                    type="number"
                    className="pl-7 h-11 shadow-sm"
                    placeholder="e.g. 250"
                    value={price}
                    onChange={e => setPrice(e.target.value)}
                    disabled={alreadySubmitted}
                    min="1"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="delivery" className="flex items-center gap-2">
                  <Clock className="h-4 w-4" /> Delivery Time (Days)
                </Label>
                <Input
                  id="delivery"
                  type="number"
                  className="h-11 shadow-sm"
                  placeholder="e.g. 5"
                  value={delivery}
                  onChange={e => setDelivery(e.target.value)}
                  disabled={alreadySubmitted}
                  min="1"
                  required
                />
              </div>
            </div>

            {err && !alreadySubmitted && (
              <div className="flex items-center gap-2 bg-destructive/10 text-destructive p-4 rounded-lg text-sm">
                <AlertCircle className="h-4 w-4" />
                <p>{err}</p>
              </div>
            )}

            <div className="pt-4 flex flex-col gap-4">
              <Button
                type="submit"
                size="lg"
                className="w-full h-12 text-lg shadow-lg shadow-primary/20"
                disabled={alreadySubmitted || loading}
              >
                {loading ? 'Submitting...' : 'Send Proposal Now'}
              </Button>
              <Button type="button" variant="ghost" className="w-full" onClick={() => nav(-1)}>
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
