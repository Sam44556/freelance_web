import React, { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import { Skeleton } from '../components/ui/skeleton'
import { Search, Briefcase, DollarSign, Tag, User, Clock } from 'lucide-react'

export default function JobsPage() {
  const { jobs, fetchJobs, loading, user } = useApp()
  const [q, setQ] = useState('')

  useEffect(() => { fetchJobs() }, [])

  const visibleJobs = useMemo(() => {
    const s = q.trim().toLowerCase()
    if (!s) return jobs
    return jobs.filter(j => {
      const fields = [
        j.title,
        j.description,
        j.category,
        j.createdBy?.name
      ]
      return fields.some(v => String(v || '').toLowerCase().includes(s))
    })
  }, [jobs, q])

  const JobSkeleton = () => (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <Card key={i} className="w-full">
          <CardHeader className="pb-2">
            <Skeleton className="h-6 w-1/3" />
            <Skeleton className="h-4 w-1/4" />
          </CardHeader>
          <CardContent className="pb-2">
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-5/6" />
          </CardContent>
          <CardFooter>
            <Skeleton className="h-9 w-24 rounded-md" />
          </CardFooter>
        </Card>
      ))}
    </div>
  )

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Available Jobs</h1>
          <p className="text-muted-foreground mt-1">Explore opportunities and build your career</p>
        </div>
        {user?.role === 'client' && (
          <Link to="/jobs/create">
            <Button className="shadow-lg shadow-primary/20">Post a New Job</Button>
          </Link>
        )}
      </div>

      <div className="relative group">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground transition-colors group-focus-within:text-primary" />
        <Input
          type="text"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search jobs by title, description, category, or client..."
          className="pl-10 h-12 text-lg shadow-sm border-muted-foreground/20 focus-visible:ring-primary"
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
          <Badge variant="secondary" className="hidden sm:inline-flex font-normal">
            {visibleJobs.length} results
          </Badge>
        </div>
      </div>

      {loading ? (
        <JobSkeleton />
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {visibleJobs.map(j => (
            <Card key={j._id} className="group overflow-hidden transition-all hover:border-primary/50 hover:shadow-md">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <CardTitle className="text-xl group-hover:text-primary transition-colors">
                      <Link to={`/jobs/${j._id}`}>{j.title}</Link>
                    </CardTitle>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1.5">
                        <User className="h-3.5 w-3.5" /> {j.createdBy?.name || 'Anonymous Client'}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Tag className="h-3.5 w-3.5" /> {j.category}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5" /> Posted recently
                      </span>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-lg font-bold text-primary flex items-center justify-end">
                      <DollarSign className="h-4 w-4" />
                      {j.budget}
                    </div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Budget</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pb-4">
                <p className="text-muted-foreground line-clamp-3 leading-relaxed">
                  {j.description}
                </p>
              </CardContent>
              <CardFooter className="bg-muted/30 pt-4 flex justify-between items-center">
                <div className="flex gap-2">
                  <Badge variant="outline" className="bg-background">Remote</Badge>
                  <Badge variant="outline" className="bg-background">Full-time</Badge>
                </div>
                <div className="flex items-center gap-3">
                  {user?.role === 'client' ? (
                    <Link to={`/proposals/job/${j._id}`}>
                      <Button variant="outline" size="sm">View Proposals</Button>
                    </Link>
                  ) : (
                    <Link to={`/proposals/create/${j._id}`}>
                      <Button size="sm">Apply Now</Button>
                    </Link>
                  )}
                  <Link to={`/jobs/${j._id}`}>
                    <Button variant="ghost" size="sm">Details</Button>
                  </Link>
                </div>
              </CardFooter>
            </Card>
          ))}

          {visibleJobs.length === 0 && (
            <div className="text-center py-20 bg-muted/20 rounded-xl border-2 border-dashed">
              <Briefcase className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold">No jobs found</h3>
              <p className="text-muted-foreground mt-2">Try adjusting your search filters to find what you're looking for.</p>
              <Button variant="link" onClick={() => setQ('')} className="mt-2">Clear search</Button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
