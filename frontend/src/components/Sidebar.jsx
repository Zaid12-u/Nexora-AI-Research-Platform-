import { useNavigate, useLocation } from 'react-router-dom'
import { Search, History, LogOut, Sparkles, X } from 'lucide-react'
import NexoraLogo from '../assets/nexora-logo.svg?react'

export default function Sidebar({ isOpen, onClose }) {
  const navigate = useNavigate()
  const location = useLocation()
  const user = JSON.parse(localStorage.getItem('user') || '{}')

  const initials = user.username
    ? user.username.slice(0, 2).toUpperCase()
    : 'U'

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    localStorage.removeItem('lastQuery')
    localStorage.removeItem('lastResults')
    localStorage.removeItem('lastDeepResult')
    navigate('/login')
    onClose()
  }

  const navItems = [
    { icon: Search, label: 'Search', path: '/search' },
    { icon: Sparkles, label: 'Gap Finder', path: '/gap-finder' },
    { icon: History, label: 'History', path: '/history' },
  ]

  const handleNav = (path) => {
    navigate(path)
    onClose()
  }

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 backdrop-blur-sm"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-72 bg-[#111111] border-r border-[#1e1e1e] z-50 flex flex-col transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#1e1e1e]">
          <NexoraLogo className="w-32 h-auto" />
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-white transition-colors p-1 rounded-lg hover:bg-[#1a1a1a]"
          >
            <X size={20} />
          </button>
        </div>

        {/* Nav Items */}
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map(({ icon: Icon, label, path }) => (
            <button
              key={path}
              onClick={() => handleNav(path)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-left
                ${location.pathname === path
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                  : 'text-gray-400 hover:bg-[#1a1a1a] hover:text-white'
                }`}
            >
              <Icon size={18} />
              <span className="font-medium">{label}</span>
            </button>
          ))}
        </nav>

        {/* User Info + Logout */}
        <div className="p-4 border-t border-[#1e1e1e] space-y-3">
          <div className="flex items-center gap-3 px-3 py-3">
            <div className="w-9 h-9 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center flex-shrink-0">
              <span className="text-emerald-400 text-sm font-bold">{initials}</span>
            </div>
            <div className="overflow-hidden">
              <p className="text-white text-sm font-medium truncate">{user.username || 'User'}</p>
              <p className="text-gray-600 text-xs truncate">{user.email || ''}</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-500 hover:bg-red-500/10 hover:text-red-400 transition-all duration-200"
          >
            <LogOut size={18} />
            <span className="font-medium text-sm">Logout</span>
          </button>
        </div>
      </div>
    </>
  )
}