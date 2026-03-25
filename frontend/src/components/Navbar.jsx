import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Moon, Sun, Waves, LayoutDashboard, Upload, MapPin, TrendingUp, BookOpen, Menu, X } from 'lucide-react'
import { useState } from 'react'

const navItems = [
  { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { label: 'Upload & Analyze', path: '/upload', icon: Upload },
  { label: 'Site Monitor', path: '/sites', icon: MapPin },
  { label: 'Forecast & Alerts', path: '/forecast', icon: TrendingUp },
  { label: 'Methodology', path: '/methodology', icon: BookOpen },
]

export default function Navbar({ darkMode, setDarkMode }) {
  const location = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 font-bold text-lg">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-sky-500 to-cyan-400 flex items-center justify-center">
              <Waves size={16} className="text-white" />
            </div>
            <span className="font-display text-slate-800 dark:text-white">AquaWatch</span>
            <span className="hidden sm:block text-xs px-2 py-0.5 rounded-full bg-sky-100 dark:bg-sky-900/40 text-sky-600 dark:text-sky-400 font-medium">v1.0</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map(({ label, path, icon: Icon }) => (
              <Link
                key={path}
                to={path}
                className={`nav-link ${location.pathname === path ? 'active' : ''}`}
              >
                <Icon size={16} />
                {label}
              </Link>
            ))}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Toggle dark mode"
            >
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button
              className="md:hidden p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden py-3 border-t border-slate-200 dark:border-slate-800"
          >
            {navItems.map(({ label, path, icon: Icon }) => (
              <Link
                key={path}
                to={path}
                className={`nav-link ${location.pathname === path ? 'active' : ''}`}
                onClick={() => setMobileOpen(false)}
              >
                <Icon size={16} />
                {label}
              </Link>
            ))}
          </motion.div>
        )}
      </div>
    </header>
  )
}
