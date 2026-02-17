import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Textarea } from '../components/ui/textarea'
import { Label } from '../components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { AlertCircle, PlusCircle } from 'lucide-react'

export default function JobCreate() {
    const { createJob, user } = useApp()
    const nav = useNavigate()
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [budget, setBudget] = useState('')
    const [category, setCategory] = useState('')
    const [err, setErr] = useState('')
    const [loading, setLoading] = useState(false)

    async function submit(e) {
        e.preventDefault()
        if (!user) return setErr('Login as client to post a job')
        setLoading(true)
        setErr('')

        const payload = { title, description, budget: Number(budget), category, createdBy: user._id }
        try {
            const res = await createJob(payload)
            if (res.ok) nav('/jobs')
            else setErr(res.message || 'Failed to create job')
        } catch (error) {
            setErr('Something went wrong. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="max-w-2xl mx-auto py-10 px-4">
            <Card className="border-none shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1.5 bg-primary" />
                <CardHeader className="text-center pt-8">
                    <div className="flex justify-center mb-4 text-primary">
                        <PlusCircle className="h-12 w-12" />
                    </div>
                    <CardTitle className="text-3xl font-bold">Post a New Job</CardTitle>
                    <CardDescription>
                        Fill in the details below to attract the best talent
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={submit} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="title">Job Title</Label>
                            <Input
                                id="title"
                                placeholder="e.g. Modern React Developer for E-commerce"
                                value={title}
                                onChange={e => setTitle(e.target.value)}
                                required
                                className="h-11 shadow-sm"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="category">Category</Label>
                            <Input
                                id="category"
                                placeholder="e.g. Web Development, Design, Writing"
                                value={category}
                                onChange={e => setCategory(e.target.value)}
                                required
                                className="h-11 shadow-sm"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Job Description</Label>
                            <Textarea
                                id="description"
                                placeholder="Describe the project goals, requirements, and deliverables..."
                                value={description}
                                onChange={e => setDescription(e.target.value)}
                                required
                                className="min-h-[150px] shadow-sm resize-none"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="budget">Budget ($)</Label>
                            <Input
                                id="budget"
                                type="number"
                                placeholder="e.g. 500"
                                value={budget}
                                onChange={e => setBudget(e.target.value)}
                                required
                                className="h-11 shadow-sm"
                            />
                            <p className="text-xs text-muted-foreground">Estimate the total cost for this project.</p>
                        </div>

                        {err && (
                            <div className="flex items-center gap-2 rounded-md bg-destructive/10 p-4 text-sm text-destructive">
                                <AlertCircle className="h-4 w-4" />
                                <p>{err}</p>
                            </div>
                        )}

                        <div className="pt-4 flex gap-4">
                            <Button type="submit" size="lg" className="flex-1 h-12 text-lg shadow-lg shadow-primary/20" disabled={loading}>
                                {loading ? 'Creating...' : 'Post Job Now'}
                            </Button>
                            <Button type="button" variant="outline" size="lg" className="h-12" onClick={() => nav(-1)}>
                                Cancel
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
