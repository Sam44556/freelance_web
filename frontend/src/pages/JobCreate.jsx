import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'


export default function JobCreate(){
const { createJob, user } = useApp()
const nav = useNavigate()
const [title,setTitle] = useState('')
const [description,setDescription] = useState('')
const [budget,setBudget] = useState('')
const [category,setCategory] = useState('')
const [err,setErr] = useState('')


async function submit(e){
e.preventDefault()
if(!user) return setErr('Login as client to post a job')
const payload = { title, description, budget, category, createdBy: user._id }
const res = await createJob(payload)
if(res.ok) nav('/jobs')
else setErr(res.message)
}


return (
<div className="max-w-xl mx-auto bg-white p-6 rounded shadow">
<h2 className="text-xl font-semibold text-blue-600">Post a Job</h2>
<form onSubmit={submit} className="mt-4 space-y-3">
<input className="w-full p-2 border rounded" placeholder="Title" value={title} onChange={e=>setTitle(e.target.value)} />
<textarea className="w-full p-2 border rounded" placeholder="Description" value={description} onChange={e=>setDescription(e.target.value)} />
<input className="w-full p-2 border rounded" placeholder="Budget" value={budget} onChange={e=>setBudget(e.target.value)} />
<input className="w-full p-2 border rounded" placeholder="Category" value={category} onChange={e=>setCategory(e.target.value)} />
{err && <p className="text-red-500">{err}</p>}
<button className="px-4 py-2 rounded bg-blue-600 text-white">Create Job</button>
</form>
</div>
)
}