import React from 'react'
import { Link } from 'react-router-dom'


export default function Landing(){
return (
<section className="text-center py-20">
<h1 className="text-4xl font-bold text-blue-600">Find great talent or work remotely</h1>
<p className="mt-4 max-w-2xl mx-auto">Post jobs, submit proposals, and hire freelancers — fast and reliable.</p>
<div className="mt-8 flex justify-center gap-4">
<Link to="/signup" className="px-6 py-3 rounded border border-blue-600 text-blue-600">Get Started</Link>
</div>
</section>
)
}