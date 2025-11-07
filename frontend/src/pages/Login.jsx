import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useApp } from "../context/AppContext"
export default function Login(){
const { login } = useApp()
const nav = useNavigate()
const [email,setEmail] = useState('')
const [password,setPassword] = useState('')
const [err,setErr] = useState('')


async function submit(e){
e.preventDefault()
const res = await login({ email, password })
if(res.ok) nav('/jobs')
else setErr(res.message || 'Login failed')
}


return (
<div className="max-w-md mx-auto bg-white p-6 rounded shadow">
<h2 className="text-2xl font-semibold text-blue-600">Login</h2>
<form onSubmit={submit} className="mt-4 space-y-4">
<input className="w-full p-2 border rounded" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
<input className="w-full p-2 border rounded" placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
{err && <p className="text-red-500">{err}</p>}
<button className="w-full px-4 py-2 rounded bg-blue-600 text-white">Login</button>
</form>
</div>
)
}