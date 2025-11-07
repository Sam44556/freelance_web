import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useApp } from '../context/AppContext'


export default function JobDetails(){
const { id } = useParams()
const { jobs, applyToJob, user } = useApp()
const [job, setJob] = useState(null)
const [msg, setMsg] = useState('')


useEffect(()=>{
const found = jobs.find(j=> j._id === id)
if(found) setJob(found)
},[jobs,id])


async function handleApply(){
const res = await applyToJob(id)
if(res.ok) setMsg('Applied successfully')
else setMsg(res.message)
}


if(!job) return <p>Job not found</p>


return (
<div className="max-w-2xl mx-auto p-4 border rounded">
<h2 className="text-2xl font-semibold text-blue-600">{job.title}</h2>
<p className="mt-2">{job.description}</p>
<p className="mt-2 font-medium">Budget: ${job.budget}</p>
<p className="mt-1 text-sm">Category: {job.category}</p>
<p className="mt-1 text-xs">Posted by: {job.createdBy?.name} ({job.createdBy?.role})</p>


<div className="mt-4 flex gap-2">
{user?.role === 'freelancer' ? (
<button onClick={handleApply} className="px-4 py-2 rounded bg-blue-600 text-white">Apply</button>
) : (
<p className="text-sm">Login as freelancer to apply</p>
)}
{user?.role === 'client' && user._id === job.createdBy?._id && (
<Link to={`/proposals/job/${job._id}`} className="px-4 py-2 rounded border">View Proposals</Link>
)}
</div>
{msg && <p className="mt-2 text-green-600">{msg}</p>}
</div>
)
}