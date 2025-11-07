import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'


export default function Signup(){
const { signup } = useApp()
const nav = useNavigate()
const [name,setName] = useState('')
const [email,setEmail] = useState('')
const [password,setPassword] = useState('')
const [role,setRole] = useState('client')
const [err,setErr] = useState('')


async function submit(e){
e.preventDefault()
const res = await signup({ name, email, password, role })
if(res.ok) nav('/jobs')
else setErr(res.message || 'Signup failed')
}


return (
<div className="max-w-md mx-auto bg-white p-6 rounded shadow">
<h2 className="text-2xl font-semibold text-blue-600">Create an account</h2>
<form onSubmit={submit} className="mt-4 space-y-3">
<input className="w-full p-2 border rounded" placeholder="Full name" value={name} onChange={e=>setName(e.target.value)} />
<input className="w-full p-2 border rounded" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
<input className="w-full p-2 border rounded" placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
<div className="flex items-center gap-4">
<label className="flex items-center gap-2"><input type="radio" name="role" checked={role==='client'} onChange={()=>setRole('client')} /> Client</label>
<label className="flex items-center gap-2"><input type="radio" name="role" checked={role==='freelancer'} onChange={()=>setRole('freelancer')} /> Freelancer</label>
</div>
{err && <p className="text-red-500">{err}</p>}
<button className="w-full px-4 py-2 rounded bg-blue-600 text-white">Sign up</button>
</form>
</div>
)
}