import React, { useEffect, useState } from 'react'
import { useApp } from '../context/AppContext'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Textarea } from '../components/ui/textarea'
import { Label } from '../components/ui/label'
import { Switch } from '../components/ui/switch'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs'
import { User, Briefcase, Globe, Phone, Camera, ShieldCheck, AlertCircle } from 'lucide-react'

export default function ProfileEdit() {
  const { user, getMyProfile, saveMyProfile } = useApp()
  const [profile, setProfile] = useState({
    title: '', bio: '', skills: [], hourlyRate: '',
    location: '', phone: '', website: '', avatar: '', available: true
  })
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })

  useEffect(() => {
    async function load() {
      if (!user) return
      const res = await getMyProfile()
      if (res.ok && res.profile) {
        setProfile({
          ...profile,
          ...res.profile,
          skills: Array.isArray(res.profile.skills)
            ? res.profile.skills
            : (res.profile.skills || '').split(',').map(s => s.trim()).filter(Boolean)
        })
      }
    }
    load()
  }, [user])

  if (!user) return (
    <div className="text-center py-20">
      <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
      <h3 className="text-xl font-semibold">Access Denied</h3>
      <p className="text-muted-foreground mt-2">Please login as a freelancer to edit your profile.</p>
    </div>
  )

  const onChange = (k, v) => {
    setProfile(prev => ({ ...prev, [k]: v }))
    if (message.text) setMessage({ type: '', text: '' })
  }

  async function save(e) {
    if (e) e.preventDefault()
    setSaving(true)
    setMessage({ type: '', text: '' })

    const skillsArray = Array.isArray(profile.skills)
      ? profile.skills
      : String(profile.skills || '').split(',').map(s => s.trim()).filter(Boolean)

    const payload = { ...profile, skills: skillsArray }

    try {
      const res = await saveMyProfile(payload)
      if (res.ok) {
        setMessage({ type: 'success', text: 'Profile updated successfully!' })
      } else {
        setMessage({ type: 'error', text: res.message || 'Failed to save profile' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'An unexpected error occurred' })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Profile Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your professional presence and availability</p>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
          <TabsTrigger value="general">General Info</TabsTrigger>
          <TabsTrigger value="details">Professional Details</TabsTrigger>
        </TabsList>

        <form onSubmit={save}>
          <TabsContent value="general">
            <Card className="border-none shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5 text-primary" />
                  Personal Information
                </CardTitle>
                <CardDescription>Basic details shown on your public profile</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="space-y-2 flex-1">
                    <Label htmlFor="title">Professional Title</Label>
                    <Input
                      id="title"
                      placeholder="e.g. Senior Full-Stack Developer"
                      value={profile.title}
                      onChange={e => onChange('title', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2 flex-1">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      placeholder="e.g. New York, USA"
                      value={profile.location || ''}
                      onChange={e => onChange('location', e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Professional Bio</Label>
                  <Textarea
                    id="bio"
                    placeholder="Tell clients about your background and what you can do..."
                    value={profile.bio}
                    onChange={e => onChange('bio', e.target.value)}
                    className="min-h-[120px] resize-none"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="phone"
                        className="pl-9"
                        placeholder="+1 (555) 000-0000"
                        value={profile.phone || ''}
                        onChange={e => onChange('phone', e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="website">Website / Portfolio</Label>
                    <div className="relative">
                      <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="website"
                        className="pl-9"
                        placeholder="https://yourportfolio.com"
                        value={profile.website || ''}
                        onChange={e => onChange('website', e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="details">
            <Card className="border-none shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5 text-primary" />
                  Work & Skills
                </CardTitle>
                <CardDescription>Setup your rates and showcase your expertise</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="hourlyRate">Hourly Rate ($)</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                      <Input
                        id="hourlyRate"
                        type="number"
                        className="pl-7"
                        placeholder="50"
                        value={profile.hourlyRate || ''}
                        onChange={e => onChange('hourlyRate', e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="flex items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <Label className="text-base">Availability</Label>
                      <p className="text-sm text-muted-foreground">Open to new project inquiries</p>
                    </div>
                    <Switch
                      checked={!!profile.available}
                      onCheckedChange={checked => onChange('available', checked)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="skills">Skills (Comma separated)</Label>
                  <Input
                    id="skills"
                    placeholder="React, TypeScript, Node.js, UI/UX"
                    value={Array.isArray(profile.skills) ? profile.skills.join(', ') : profile.skills}
                    onChange={e => onChange('skills', e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">Add your top skills so clients can find you.</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="avatar">Profile Picture URL</Label>
                  <div className="relative">
                    <Camera className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="avatar"
                      className="pl-10"
                      placeholder="https://example.com/photo.jpg"
                      value={profile.avatar || ''}
                      onChange={e => onChange('avatar', e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <div className="mt-8 flex items-center justify-between bg-muted/30 p-4 rounded-xl border border-dashed">
            <div className="flex items-center gap-2">
              {message.text && (
                <div className={`flex items-center gap-2 text-sm font-medium ${message.type === 'success' ? 'text-green-600' : 'text-destructive'}`}>
                  {message.type === 'success' ? <ShieldCheck className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
                  {message.text}
                </div>
              )}
            </div>
            <div className="flex gap-4">
              <Button type="submit" disabled={saving} className="min-w-[120px]">
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </div>
        </form>
      </Tabs>
    </div>
  )
}
