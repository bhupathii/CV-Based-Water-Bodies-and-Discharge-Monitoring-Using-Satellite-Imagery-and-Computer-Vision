import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { useState, useEffect } from 'react'
import Navbar from './components/Navbar'
import LandingPage from './pages/LandingPage'
import Dashboard from './pages/Dashboard'
import UploadAnalysis from './pages/UploadAnalysis'
import SiteMonitoring from './pages/SiteMonitoring'
import ForecastAlerts from './pages/ForecastAlerts'
import Methodology from './pages/Methodology'

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('theme')
    if (saved !== null) {
      return saved === 'dark'
    }
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
  })

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }, [darkMode])

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: darkMode ? '#1e293b' : '#fff',
              color: darkMode ? '#f1f5f9' : '#0f172a',
              border: `1px solid ${darkMode ? '#334155' : '#e2e8f0'}`,
              borderRadius: '12px',
              fontSize: '14px',
            },
          }}
        />
        <Routes>
          <Route path="/" element={<LandingPage darkMode={darkMode} setDarkMode={setDarkMode} />} />
          <Route
            path="/*"
            element={
              <>
                <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />
                <main className="min-h-screen">
                  <Routes>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/upload" element={<UploadAnalysis />} />
                    <Route path="/sites" element={<SiteMonitoring />} />
                    <Route path="/forecast" element={<ForecastAlerts />} />
                    <Route path="/methodology" element={<Methodology />} />
                  </Routes>
                </main>
              </>
            }
          />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
