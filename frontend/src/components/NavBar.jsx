import React from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'

export default function NavBar() {
  const { user, ready, logout } = useApp()
  const nav = useNavigate()
  if (!ready) return null

  const homePath = user ? '/jobs' : '/'
  const navClass = ({ isActive }) =>
    'text-sm px-1 ' +
    (isActive
      ? 'text-blue-700 font-semibold border-b-2 border-blue-600'
      : 'text-gray-700 hover:text-blue-600')

  return (
    <header className="bg-white border-b">
      <div className="container mx-auto flex items-center justify-between px-4 py-3">
        <Link to={homePath} className="text-xl font-bold text-blue-600">
          Freelance<span className="text-blue-800">Hub</span>
        </Link>

        <nav className="flex gap-4 items-center">
          <NavLink to="/jobs" className={navClass} end>
            Jobs
          </NavLink>

            {user?.role === 'freelancer' && (
              <NavLink to="/proposals/me" className={navClass}>
                My Proposals
              </NavLink>
            )}
            {user?.role === 'freelancer' && (
              <NavLink to="/profile/edit" className={navClass}>
                My Profile
              </NavLink>
            )}

            {user?.role === 'client' && (
              <NavLink to="/freelancers" className={navClass}>
                Freelancers
              </NavLink>
            )}
            {user?.role === 'client' && (
              <NavLink to="/jobs/create" className={navClass}>
                Post Job
              </NavLink>
            )}

            {user?.role === 'freelancer' && (
              <NavLink to="/notifications" className={navClass}>
                Notifications
              </NavLink>
            )}
            {user?.role === 'client' && (
              <NavLink to="/notifications/sent" className={navClass}>
                Notifications
              </NavLink>
            )}

          {user ? (
            <div className="flex items-center gap-3">
              <span className="text-sm">Hi, {user.name}</span>
              <button
                onClick={() => {
                  logout()
                  nav('/')
                }}
                className="px-3 py-1 rounded bg-blue-600 text-white text-sm"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex gap-2">
              <NavLink to="/login" className={navClass}>
                Login
              </NavLink>
              <NavLink
                to="/signup"
                className="px-3 py-1 rounded bg-blue-600 text-white text-sm"
              >
                Sign up
              </NavLink>
            </div>
          )}
        </nav>
      </div>
    </header>
  )
}