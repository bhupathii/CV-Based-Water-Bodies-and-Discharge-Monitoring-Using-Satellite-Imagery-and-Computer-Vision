import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Waves, Satellite, Brain, BarChart3, AlertTriangle, MapPin, Upload, ChevronRight, 
         Droplets, Activity, FlaskConical, Sun, Moon } from 'lucide-react'

const features = [
  { icon: Satellite, title: 'Satellite Image Analysis', desc: 'Upload river/lake imagery for instant CV-based water body segmentation using OpenCV.' },
  { icon: Brain, title: 'Hybrid Discharge Estimation', desc: 'Manning physics + Random Forest ML = smarter discharge prediction with confidence intervals.' },
  { icon: BarChart3, title: 'Time-Series Monitoring', desc: 'Historical trend charts, 7-day forecasts, and seasonal pattern analysis.' },
  { icon: AlertTriangle, title: 'Anomaly Detection', desc: 'Isolation Forest algorithm detects flood surges, turbidity spikes, and unusual patterns.' },
  { icon: MapPin, title: 'Multi-Site Dashboard', desc: 'Monitor Patna, Varanasi, Haridwar and more from an interactive Leaflet map.' },
  { icon: FlaskConical, title: 'Simulated Spectral Indices', desc: 'Demo-friendly NDWI, MNDWI, AWEI approximations simulated from RGB imagery.' },
]

const steps = [
  { num: '01', title: 'Upload Image', desc: 'Satellite or river photo uploaded via drag-and-drop.' },
  { num: '02', title: 'Preprocess', desc: 'Resize, denoise, normalize using OpenCV.' },
  { num: '03', title: 'Segment Water', desc: 'HSV + pseudo-NDWI thresholding + morphology cleanup.' },
  { num: '04', title: 'Extract Metrics', desc: 'Area, width, turbidity, spectral indices computed.' },
  { num: '05', title: 'Estimate Discharge', desc: 'Manning physics + RF ML hybrid with confidence band.' },
  { num: '06', title: 'Alert & Report', desc: 'Anomaly detection, flood risk score, downloadable report.' },
]

const stats = [
  { value: '5+', label: 'Monitoring Sites' },
  { value: '365', label: 'Days of History' },
  { value: '7-Day', label: 'Forecast Window' },
  { value: '100%', label: 'Zero Cost APIs' },
]

export default function LandingPage({ darkMode, setDarkMode }) {
  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-hidden">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-4 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800">
        <div className="flex items-center gap-2.5 font-bold text-lg">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-sky-500 to-cyan-400 flex items-center justify-center">
            <Waves size={16} className="text-white" />
          </div>
          <span className="font-display">AquaWatch</span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-sky-900/60 text-sky-400 font-medium">Demo</span>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={() => setDarkMode(!darkMode)} className="p-2 rounded-lg text-slate-400 hover:text-white transition-colors">
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <Link to="/dashboard" className="btn-primary text-sm py-2.5">
            Launch Dashboard <ChevronRight size={16} />
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-32 pb-24 px-6 text-center overflow-hidden">
        {/* Animated background circles */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-sky-600/5 animate-pulse-slow pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-sky-500/8 animate-pulse-slow pointer-events-none" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full bg-cyan-400/10 animate-pulse-slow pointer-events-none" style={{ animationDelay: '2s' }} />

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative max-w-4xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-sm font-medium mb-8">
            <Activity size={14} className="animate-pulse" />
            Academic Prototype · CV-Based Hydrology
          </div>

          <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight mb-6 bg-gradient-to-b from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
            AI-Powered Water Body
            <br />
            <span className="bg-gradient-to-r from-sky-400 via-cyan-400 to-teal-400 bg-clip-text text-transparent">
              Monitoring System
            </span>
          </h1>

          <p className="text-lg text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            A smart environmental monitoring platform using Computer Vision and Machine Learning
            to analyze water bodies, estimate discharge, detect anomalies, and forecast flood risks
            — 100% local, zero-cost.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/dashboard" className="btn-primary text-base px-8 py-4">
              <LayoutDashboard size={18} /> Launch Dashboard
            </Link>
            <Link to="/upload" className="btn-secondary text-base px-8 py-4 !bg-white/10 !border-slate-700 !text-white hover:!bg-white/15">
              <Upload size={18} /> Try Demo Upload
            </Link>
          </div>
        </motion.div>

        {/* Stats bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="relative mt-16 max-w-2xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-6"
        >
          {stats.map(({ value, label }) => (
            <div key={label} className="text-center">
              <div className="text-3xl font-display font-bold bg-gradient-to-r from-sky-400 to-cyan-400 bg-clip-text text-transparent">{value}</div>
              <div className="text-sm text-slate-500 mt-1">{label}</div>
            </div>
          ))}
        </motion.div>
      </section>

      {/* Features */}
      <section className="py-24 px-6 bg-slate-900/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl sm:text-4xl font-bold mb-4">Platform Features</h2>
            <p className="text-slate-400 max-w-xl mx-auto">End-to-end pipeline from raw image to actionable insights</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map(({ icon: Icon, title, desc }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-6 rounded-2xl bg-slate-800/60 border border-slate-700/60 hover:border-sky-500/40 hover:bg-slate-800 transition-all duration-300 group"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-sky-500/20 to-cyan-500/20 border border-sky-500/20 flex items-center justify-center mb-4 group-hover:from-sky-500/30 group-hover:to-cyan-500/30 transition-all">
                  <Icon size={22} className="text-sky-400" />
                </div>
                <h3 className="font-semibold text-white mb-2">{title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pipeline */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl sm:text-4xl font-bold mb-4">System Pipeline</h2>
            <p className="text-slate-400">How AquaWatch processes satellite imagery to deliver insights</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {steps.map(({ num, title, desc }) => (
              <motion.div
                key={num}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="relative p-5 rounded-2xl border border-slate-800 bg-slate-900/40 hover:border-sky-800 transition-colors"
              >
                <span className="text-5xl font-display font-black text-sky-900/60 absolute top-3 right-4 select-none">{num}</span>
                <div className="relative">
                  <h3 className="font-semibold text-sky-400 mb-2">{title}</h3>
                  <p className="text-sm text-slate-400">{desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 text-center">
        <div className="max-w-2xl mx-auto">
          <div className="p-12 rounded-3xl bg-gradient-to-br from-sky-900/40 via-slate-900 to-cyan-900/30 border border-sky-500/20">
            <Droplets size={48} className="text-sky-400 mx-auto mb-6 animate-bounce" />
            <h2 className="font-display text-3xl font-bold mb-4">Ready to Explore?</h2>
            <p className="text-slate-400 mb-8">Launch the dashboard to explore demo monitoring sites, upload images, and see real-time analysis.</p>
            <Link to="/dashboard" className="btn-primary text-base px-10 py-4">
              Open AquaWatch Dashboard <ChevronRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-slate-800 text-center text-sm text-slate-600">
        <p>AquaWatch — CV-Based Water Monitoring System &nbsp;·&nbsp; Academic Prototype v1.0 &nbsp;·&nbsp; Zero paid APIs</p>
        <p className="mt-1 text-slate-700">⚠ Educational simulation — not a production satellite analytics system</p>
      </footer>
    </div>
  )
}

function LayoutDashboard({ size, className }) {
  return <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
}
