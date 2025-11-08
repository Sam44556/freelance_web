import React, { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'

export default function NavBar() {
  const { user, ready, logout } = useApp()
  const [isOpen, setIsOpen] = useState(false)
  const nav = useNavigate()
  if (!ready) return null

  const homePath = user ? '/jobs' : '/'
  const navClass = ({ isActive }) =>
    'text-sm px-2 ' +
    (isActive
      ? 'text-blue-700 font-semibold border-b-2 border-blue-600'
      : 'text-gray-700 hover:text-blue-600')

  const toggleMenu = () => setIsOpen(!isOpen)

  return (
    <header className="bg-white border-b">
      <div className="container mx-auto flex items-center justify-between px-4 py-3">
        {/* Left: Brand */}
        <Link to={homePath} className="text-xl font-bold text-blue-600">
          Freelance<span className="text-blue-800">Hub</span>
        </Link>

        {/* Right: Nav + Burger */}
        <nav className="flex items-center">
          {/* Desktop nav (more spacing) */}
          <div className="hidden md:flex items-center gap-6 mr-4">
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
              <div className="flex items-center gap-4">
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
          </div>

          {/* Mobile overlay */}
          {isOpen && (
            <div
              className="fixed inset-0 bg-black/50 z-40 md:hidden"
              onClick={() => setIsOpen(false)}
            />
          )}

          {/* Mobile drawer */}
          <div className="md:hidden">
            <ul
              className={`fixed top-0 right-0 h-full w-3/4 bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${
                isOpen ? 'translate-x-0' : 'translate-x-full'
              } z-50 flex flex-col items-start p-8 space-y-8`}
            >
              <button
                aria-label="Close"
                className="self-end text-gray-600"
                onClick={() => setIsOpen(false)}
              >
                ✕
              </button>

              <li>
                <NavLink to="/jobs" className={navClass} end onClick={() => setIsOpen(false)}>
                  Jobs
                </NavLink>
              </li>

              {user?.role === 'freelancer' && (
                <li>
                  <NavLink to="/proposals/me" className={navClass} onClick={() => setIsOpen(false)}>
                    My Proposals
                  </NavLink>
                </li>
              )}
              {user?.role === 'freelancer' && (
                <li>
                  <NavLink to="/profile/edit" className={navClass} onClick={() => setIsOpen(false)}>
                    My Profile
                  </NavLink>
                </li>
              )}

              {user?.role === 'client' && (
                <li>
                  <NavLink to="/freelancers" className={navClass} onClick={() => setIsOpen(false)}>
                    Freelancers
                  </NavLink>
                </li>
              )}
              {user?.role === 'client' && (
                <li>
                  <NavLink to="/jobs/create" className={navClass} onClick={() => setIsOpen(false)}>
                    Post Job
                  </NavLink>
                </li>
              )}

              {user?.role === 'freelancer' && (
                <li>
                  <NavLink to="/notifications" className={navClass} onClick={() => setIsOpen(false)}>
                    Notifications
                  </NavLink>
                </li>
              )}
              {user?.role === 'client' && (
                <li>
                  <NavLink to="/notifications/sent" className={navClass} onClick={() => setIsOpen(false)}>
                    Notifications
                  </NavLink>
                </li>
              )}

              {user ? (
                <li className="w-full">
                  <button
                    onClick={() => {
                      setIsOpen(false)
                      logout()
                      nav('/')
                    }}
                    className="px-3 py-2 rounded bg-blue-600 text-white text-sm w-full text-left"
                  >
                    Logout
                  </button>
                </li>
              ) : (
                <div className="flex flex-col gap-4">
                  <li>
                    <NavLink to="/login" className={navClass} onClick={() => setIsOpen(false)}>
                      Login
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/signup"
                      className="px-3 py-2 rounded bg-blue-600 text-white text-sm inline-block"
                      onClick={() => setIsOpen(false)}
                    >
                      Sign up
                    </NavLink>
                  </li>
                </div>
              )}
            </ul>
          </div>

          {/* Burger at far right (mobile only) */}
          <button
            onClick={toggleMenu}
            className="ml-2 block md:hidden text-gray-700 focus:outline-none"
            aria-label="Open menu"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </nav>
      </div>
    </header>
  )
}