import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card"
import { RadioGroup, RadioGroupItem } from "../components/ui/radio-group"
import { UserPlus, AlertCircle } from "lucide-react"

export default function Signup() {
  const { signup } = useApp()
  const nav = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('client')
  const [err, setErr] = useState('')
  const [loading, setLoading] = useState(false)

  async function submit(e) {
    e.preventDefault()
    setLoading(true)
    setErr('')
    try {
      const res = await signup({ name, email, password, role })
      if (res.ok) {
        if (role === 'freelancer') nav('/profile')
        else nav('/jobs')
      }
      else setErr(res.message || 'Signup failed')
    } catch (error) {
      setErr('Connection error. Please check your internet.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md border-none shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1.5 bg-primary" />
        <CardHeader className="space-y-1 text-center pt-8">
          <div className="flex justify-center mb-4 text-primary">
            <UserPlus className="h-10 w-10" />
          </div>
          <CardTitle className="text-3xl font-bold">Create an account</CardTitle>
          <CardDescription>
            Join our community of professionals and clients
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={submit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                placeholder="John Doe"
                value={name}
                onChange={e => setName(e.target.value)}
                required
                className="h-11"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="h-11"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                className="h-11"
              />
            </div>

            <div className="space-y-3 pt-2">
              <Label>I want to...</Label>
              <RadioGroup value={role} onValueChange={setRole} className="grid grid-cols-2 gap-4">
                <div>
                  <RadioGroupItem value="client" id="client" className="sr-only" />
                  <Label
                    htmlFor="client"
                    className={`flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer transition-all ${role === 'client' ? 'border-primary ring-1 ring-primary' : ''}`}
                  >
                    <span className="text-sm font-semibold text-center w-full">Hire Talent</span>
                  </Label>
                </div>
                <div>
                  <RadioGroupItem value="freelancer" id="freelancer" className="sr-only" />
                  <Label
                    htmlFor="freelancer"
                    className={`flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer transition-all ${role === 'freelancer' ? 'border-primary ring-1 ring-primary' : ''}`}
                  >
                    <span className="text-sm font-semibold text-center w-full">Find Work</span>
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {err && (
              <div className="flex items-center gap-2 rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                <AlertCircle className="h-4 w-4" />
                <p>{err}</p>
              </div>
            )}
            <Button type="submit" className="w-full h-11 text-base shadow-lg shadow-primary/20 mt-4" disabled={loading}>
              {loading ? 'Creating account...' : 'Create Account'}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4 pb-8">
          <div className="relative w-full">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground font-medium">Already have an account?</span>
            </div>
          </div>
          <Link to="/login" className="w-full">
            <Button variant="outline" className="w-full h-11">
              Sign In
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}
