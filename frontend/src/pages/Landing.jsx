import React from 'react'
import { Link } from 'react-router-dom'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Zap, Shield, Globe, ArrowRight, Star } from 'lucide-react'

export default function Landing() {
    return (
        <div className="flex flex-col gap-20 pb-20">
            {/* Hero Section */}
            <section className="relative overflow-hidden pt-16 pb-24 lg:pt-32 lg:pb-40">
                <div className="container relative z-10 flex flex-col items-center text-center">
                    <div className="inline-flex items-center rounded-full border bg-background px-3 py-1 text-sm font-medium mb-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
                        <Star className="mr-2 h-4 w-4 text-primary fill-primary" />
                        <span className="text-muted-foreground font-medium">Trusted by 10,000+ freelancers worldwide</span>
                    </div>
                    <h1 className="max-w-4xl text-5xl font-extrabold tracking-tight sm:text-7xl mb-6 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                        Find the best <span className="text-primary">freelance talent</span> for your next big project
                    </h1>
                    <p className="max-w-2xl text-xl text-muted-foreground mb-10 leading-relaxed">
                        Connect with top-tier professionals or find high-paying remote work.
                        The most secure, efficient, and transparent platform for the modern workforce.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <Link to="/signup">
                            <Button size="lg" className="h-12 px-8 text-lg rounded-full shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95">
                                Get Started Now <ArrowRight className="ml-2 h-5 w-5" />
                            </Button>
                        </Link>
                        <Link to="/jobs">
                            <Button size="lg" variant="outline" className="h-12 px-8 text-lg rounded-full transition-all hover:bg-accent">
                                Browse All Jobs
                            </Button>
                        </Link>
                    </div>

                    {/* Decorative background blur */}
                    <div className="absolute top-1/2 left-1/2 -z-10 h-[600px] w-[800px] -translate-x-1/2 -translate-y-1/2 opacity-20 blur-[120px] bg-gradient-to-tr from-primary to-blue-400 rounded-full" />
                </div>
            </section>

            {/* Stats Section */}
            <section className="container">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-12 border-y">
                    {[
                        { label: "Active Jobs", value: "2.5k+" },
                        { label: "Freelancers", value: "15k+" },
                        { label: "Projects Completed", value: "45k+" },
                        { label: "Success Rate", value: "98%" },
                    ].map((stat, i) => (
                        <div key={i} className="text-center">
                            <p className="text-3xl font-bold">{stat.value}</p>
                            <p className="text-sm text-muted-foreground uppercase tracking-widest mt-1">{stat.label}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Features Section */}
            <section className="container">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold sm:text-5xl mb-4">Everything you need to grow</h2>
                    <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                        We provide all the tools and security you need to focus on what you do best.
                    </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[
                        {
                            title: "Lightning Fast",
                            description: "Our platform is optimized for speed. Find work or hire talent in minutes, not days.",
                            icon: <Zap className="h-10 w-10 text-primary" />,
                        },
                        {
                            title: "Secure Payments",
                            description: "Every transaction is protected. We use industry-standard encryption and escrow services.",
                            icon: <Shield className="h-10 w-10 text-primary" />,
                        },
                        {
                            title: "Global Network",
                            description: "Access a worldwide pool of talent and opportunities across every time zone.",
                            icon: <Globe className="h-10 w-10 text-primary" />,
                        },
                    ].map((feature, i) => (
                        <Card key={i} className="border-none shadow-none bg-accent/30 hover:bg-accent/50 transition-colors">
                            <CardHeader>
                                <div className="mb-4">{feature.icon}</div>
                                <CardTitle className="text-2xl">{feature.title}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <CardDescription className="text-base text-muted-foreground">
                                    {feature.description}
                                </CardDescription>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </section>

            {/* CTA Section */}
            <section className="container">
                <div className="rounded-3xl bg-foreground text-background p-12 md:p-20 text-center relative overflow-hidden">
                    <div className="relative z-10">
                        <h2 className="text-4xl md:text-6xl font-bold mb-6">Ready to start your journey?</h2>
                        <p className="text-background/70 text-lg mb-10 max-w-xl mx-auto">
                            Join thousands of professionals who are redefining the future of work.
                            Sign up today and get your first project started.
                        </p>
                        <Link to="/signup">
                            <Button size="lg" variant="secondary" className="h-12 px-8 text-lg rounded-full">
                                Join FreelanceHub for Free
                            </Button>
                        </Link>
                    </div>
                    {/* Decorative elements */}
                    <div className="absolute top-0 right-0 h-40 w-40 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />
                    <div className="absolute bottom-0 left-0 h-40 w-40 bg-primary/20 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl" />
                </div>
            </section>
        </div>
    )
}
