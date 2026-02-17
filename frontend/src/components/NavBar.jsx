import React from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { Button } from './ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet'
import { Menu, Bell, User, LogOut, Briefcase } from 'lucide-react'
import { cn } from '../lib/utils'

export default function NavBar() {
  const { user, ready, logout } = useApp()
  const nav = useNavigate()

  if (!ready) return null

  const navClass = ({ isActive }) =>
    cn(
      "text-sm font-medium transition-colors hover:text-primary",
      isActive ? "text-primary" : "text-muted-foreground"
    )

  const NavItems = () => (
    <>
      {user?.role === 'freelancer' && (
        <NavLink to="/jobs" className={navClass} end>
          Jobs
        </NavLink>
      )}
      {user?.role === 'client' && (
        <NavLink to="/myjobs" className={navClass}>
          My Jobs
        </NavLink>
      )}
      {user?.role === 'client' && (
        <NavLink to="/freelancers" className={navClass}>
          Freelancers
        </NavLink>
      )}
      {user?.role === 'freelancer' && (
        <NavLink to="/proposals/me" className={navClass}>
          My Proposals
        </NavLink>
      )}
      {user?.role === 'client' && (
        <NavLink to="/jobs/create" className={navClass}>
          Post Job
        </NavLink>
      )}
    </>
  )

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-8">
          <Link to={user ? '/jobs' : '/'} className="flex items-center space-x-2">
            <Briefcase className="h-6 w-6 text-primary" />
            <span className="inline-block font-bold text-xl tracking-tight">
              Freelance<span className="text-primary">Hub</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <NavItems />
          </nav>
        </div>

        <div className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-4">
              <Link to={user.role === 'client' ? '/notifications/sent' : '/notifications'}>
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="h-5 w-5" />
                  <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-destructive" />
                </Button>
              </Link>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                    <Avatar className="h-9 w-9 border">
                      <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`} alt={user.name} />
                      <AvatarFallback>{user.name?.charAt(0)}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user.name}</p>
                      <p className="text-xs leading-none text-muted-foreground uppercase">
                        {user.role}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {user.role === 'freelancer' && (
                    <DropdownMenuItem onClick={() => nav('/profile')}>
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </DropdownMenuItem>
                  )}
                  {user.role === 'freelancer' && (
                    <DropdownMenuItem onClick={() => nav('/myjobs')}>
                      <Briefcase className="mr-2 h-4 w-4" />
                      <span>My Jobs</span>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => {
                    logout()
                    nav('/')
                  }} className="text-destructive focus:text-destructive">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-4">
              <Link to="/login">
                <Button variant="ghost">Login</Button>
              </Link>
              <Link to="/signup">
                <Button>Sign up</Button>
              </Link>
            </div>
          )}

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <nav className="flex flex-col gap-4 mt-8">
                <NavItems />
                {!user && (
                  <>
                    <DropdownMenuSeparator />
                    <Link to="/login">
                      <Button variant="ghost" className="w-full justify-start">Login</Button>
                    </Link>
                    <Link to="/signup">
                      <Button className="w-full justify-start">Sign up</Button>
                    </Link>
                  </>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
