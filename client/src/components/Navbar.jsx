import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Navbar = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-900 border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <span className="text-2xl">₿</span>
            <span className="text-xl font-bold text-white">
              Crypto<span className="text-blue-500">Tracker</span>
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/" className="text-gray-300 hover:text-white transition-colors duration-200">
              Home
            </Link>
            {user && (
              <>
                <Link to="/watchlist" className="text-gray-300 hover:text-white transition-colors duration-200">
                  Watchlist
                </Link>
                <Link to="/portfolio" className="text-gray-300 hover:text-white transition-colors duration-200">
                  Portfolio
                </Link>
              </>
            )}
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3">
                <span className="text-gray-400 text-sm">
                  👋 <span className="text-white font-medium">{user.username}</span>
                </span>
                <button onClick={handleLogout} className="btn-secondary text-sm">
                  Logout
                </button>
              </div>
            ) : (
              <>
                <Link to="/login" className="btn-secondary text-sm">Login</Link>
                <Link to="/register" className="btn-primary text-sm">Register</Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-gray-300 hover:text-white"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-gray-900 border-t border-gray-800 px-4 py-4 flex flex-col gap-4">
          <Link to="/" className="text-gray-300 hover:text-white" onClick={() => setMenuOpen(false)}>Home</Link>
          {user && (
            <>
              <Link to="/watchlist" className="text-gray-300 hover:text-white" onClick={() => setMenuOpen(false)}>Watchlist</Link>
              <Link to="/portfolio" className="text-gray-300 hover:text-white" onClick={() => setMenuOpen(false)}>Portfolio</Link>
            </>
          )}
          {user ? (
            <button onClick={() => { handleLogout(); setMenuOpen(false) }} className="btn-secondary text-sm w-fit">
              Logout
            </button>
          ) : (
            <div className="flex gap-3">
              <Link to="/login" className="btn-secondary text-sm" onClick={() => setMenuOpen(false)}>Login</Link>
              <Link to="/register" className="btn-primary text-sm" onClick={() => setMenuOpen(false)}>Register</Link>
            </div>
          )}
        </div>
      )}
    </nav>
  )
}

export default Navbar