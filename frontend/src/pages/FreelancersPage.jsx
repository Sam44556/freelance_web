import React, { useEffect, useMemo, useState } from 'react'
import { useApp } from '../context/AppContext'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar'
import { Label } from '../components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '../components/ui/select'
import { Search, Users, MapPin, DollarSign, Star, Mail } from 'lucide-react'

export default function FreelancersPage() {
  const { user, getProfiles, sendInvitation, getMyJobs } = useApp()
  const [q, setQ] = useState('')
  const [profiles, setProfiles] = useState([])
  const [jobs, setJobs] = useState([])
  const [busy, setBusy] = useState(null)
  const isClient = user?.role === 'client'

  useEffect(() => {
    async function load() {
      const res = await getProfiles('')
      if (res.ok) setProfiles(res.profiles)
      if (isClient) {
        const myJobs = await getMyJobs()
        setJobs(myJobs)
      }
    }
    load()
  }, [getProfiles, getMyJobs, isClient])

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase()
    if (!s) return profiles
    return profiles.filter(p => {
      const fields = [
        p?.user?.name, p?.user?.email, p?.title, p?.bio, (p?.skills || []).join(' '), p?.location
      ]
      return fields.some(v => String(v || '').toLowerCase().includes(s))
    })
  }, [profiles, q])

  const [inviteMsg, setInviteMsg] = useState('')
  const [selectedJob, setSelectedJob] = useState('')

  async function invite(freelancerId) {
    if (!isClient) return
    if (!selectedJob) return alert('Select a job to invite for')
    setBusy(freelancerId)
    const res = await sendInvitation({ jobId: selectedJob, freelancerId, message: inviteMsg })
    setBusy(null)
    if (res.ok) {
      setInviteMsg('')
      alert('Invitation sent successfully')
    } else {
      alert(res.message || 'Failed to send invitation')
    }
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Top Freelancers</h1>
          <p className="text-muted-foreground mt-1">Hire the best talent from around the world</p>
        </div>
      </div>

      <div className="flex flex-col gap-6">
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground transition-colors group-focus-within:text-primary" />
          <Input
            value={q}
            onChange={e => setQ(e.target.value)}
            placeholder="Search by name, title, skills, bio, location..."
            className="pl-10 h-12 text-lg shadow-sm"
          />
        </div>

        {isClient && (
          <Card className="bg-muted/30 border-dashed">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <Mail className="h-5 w-5 text-primary" />
                Invite to Project
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Select Job</Label>
                  <Select value={selectedJob} onValueChange={setSelectedJob}>
                    <SelectTrigger className="bg-background">
                      <SelectValue placeholder="Which job are you hiring for?" />
                    </SelectTrigger>
                    <SelectContent>
                      {jobs.map(j => (
                        <SelectItem key={j._id} value={j._id}>{j.title}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Invitation Message (Optional)</Label>
                  <Input
                    className="bg-background"
                    placeholder="Briefly describe why you're interested..."
                    value={inviteMsg}
                    onChange={e => setInviteMsg(e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map(p => (
          <Card key={p._id || p.user?._id} className="group hover:shadow-lg transition-all duration-300">
            <CardHeader className="pb-3">
              <div className="flex items-start gap-4">
                <Avatar className="h-16 w-16 border-2 border-background shadow-sm">
                  <AvatarImage src={p.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${p.user?.name}`} />
                  <AvatarFallback>{p.user?.name?.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="space-y-1">
                  <CardTitle className="text-xl">{p.user?.name}</CardTitle>
                  <p className="text-sm font-medium text-primary">{p.title}</p>
                  <div className="flex items-center gap-1 text-yellow-500">
                    <Star className="h-3 w-3 fill-current" />
                    <Star className="h-3 w-3 fill-current" />
                    <Star className="h-3 w-3 fill-current" />
                    <Star className="h-3 w-3 fill-current" />
                    <Star className="h-3 w-3 fill-current" />
                    <span className="text-xs text-muted-foreground ml-1">(5.0)</span>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pb-4 space-y-4">
              <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
                {p.bio || "No bio available."}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {(p.skills || []).slice(0, 5).map((skill, i) => (
                  <Badge key={i} variant="secondary" className="font-normal">{skill}</Badge>
                ))}
                {(p.skills || []).length > 5 && (
                  <Badge variant="secondary" className="font-normal">+{(p.skills || []).length - 5}</Badge>
                )}
              </div>
              <div className="flex items-center justify-between pt-2 border-t text-sm">
                <span className="flex items-center gap-1.5 text-muted-foreground">
                  <MapPin className="h-3.5 w-3.5" /> {p.location || 'Remote'}
                </span>
                <span className="font-bold text-foreground flex items-center">
                  <DollarSign className="h-3.5 w-3.5 text-primary" />
                  {p.hourlyRate ? `${p.hourlyRate}/hr` : 'N/A'}
                </span>
              </div>
            </CardContent>
            {isClient && (
              <CardFooter className="bg-muted/20 border-t pt-4">
                <Button
                  className="w-full shadow-sm"
                  onClick={() => invite(p.user?._id)}
                  disabled={busy === p.user?._id || !selectedJob}
                >
                  {busy === p.user?._id ? (
                    'Sending...'
                  ) : (
                    <>
                      <Mail className="mr-2 h-4 w-4" />
                      Send Invitation
                    </>
                  )}
                </Button>
              </CardFooter>
            )}
          </Card>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-20 bg-muted/20 rounded-xl border-2 border-dashed">
          <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-semibold">No freelancers found</h3>
          <p className="text-muted-foreground mt-2">Try adjusting your search terms.</p>
        </div>
      )}
    </div>
  )
}
