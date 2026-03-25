import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { motion, AnimatePresence } from 'framer-motion'
import { Upload, Image, Zap, Download, FlaskConical, CheckCircle, AlertTriangle } from 'lucide-react'
import { api, formatNumber, turbidityColor } from '../utils/api'
import ImageViewer from '../components/ImageViewer'
import MetricCard from '../components/MetricCard'
import toast from 'react-hot-toast'

const DEMO_IMAGES = [
  { name: 'river_ganga_sample.jpg', label: 'Ganga River (Synthetic)' },
  { name: 'lake_chennai_sample.jpg', label: 'Chennai Lake (Synthetic)' },
  { name: 'flood_event_sample.jpg', label: 'Flood Event (Synthetic)' },
  { name: 'reservoir_sample.jpg', label: 'Reservoir (Synthetic)' },
  { name: 'river_upstream_sample.jpg', label: 'Upstream River (Synthetic)' },
]

export default function UploadAnalysis() {
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [previewUrl, setPreviewUrl] = useState(null)

  const runAnalysis = async (apiFn) => {
    setLoading(true)
    setResult(null)
    try {
      const res = await apiFn()
      setResult(res.data)
      toast.success('Analysis complete!')
    } catch (e) {
      toast.error(e.response?.data?.detail || 'Analysis failed. Is the backend running?')
    } finally {
      setLoading(false)
    }
  }

  const onDrop = useCallback((files) => {
    if (!files[0]) return
    const url = URL.createObjectURL(files[0])
    setPreviewUrl(url)
    const fd = new FormData()
    fd.append('file', files[0])
    runAnalysis(() => api.analyzeImage(fd))
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpg', '.jpeg', '.png', '.webp'] },
    maxFiles: 1,
    disabled: loading,
  })

  const loadDemo = (name) => {
    setPreviewUrl(null)
    runAnalysis(() => api.loadDemo(name))
  }

  const m = result?.metrics || {}
  const d = result?.discharge || {}
  const t = result?.turbidity || {}
  const a = result?.anomaly || {}

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold text-slate-800 dark:text-white">Upload & Analyze</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Upload a river/lake image for instant CV-based water body analysis</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Left: Upload panel */}
        <div className="lg:col-span-2 space-y-5">
          {/* Drop zone */}
          <div className="glass-card p-5">
            <h3 className="chart-title mb-4"><Upload size={14} className="inline mr-1" /> Upload Image</h3>
            <div {...getRootProps()} className={`drop-zone ${isDragActive ? 'active' : ''}`}>
              <input {...getInputProps()} />
              <div className="flex flex-col items-center gap-3 pointer-events-none">
                <div className="w-14 h-14 rounded-2xl bg-sky-50 dark:bg-sky-900/30 flex items-center justify-center">
                  <Image size={28} className="text-sky-500" />
                </div>
                <div>
                  <p className="font-semibold text-slate-700 dark:text-slate-200 text-sm">
                    {isDragActive ? 'Drop image here…' : 'Drag & drop or click to upload'}
                  </p>
                  <p className="text-xs text-slate-400 mt-1">JPG, PNG, WebP · Any river or lake photo</p>
                </div>
              </div>
            </div>

            {previewUrl && (
              <div className="mt-4 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700">
                <img src={previewUrl} alt="preview" className="w-full h-40 object-cover" />
              </div>
            )}
          </div>

          {/* Demo images */}
          <div className="glass-card p-5">
            <h3 className="chart-title mb-4"><Zap size={14} className="inline mr-1" /> Demo Dataset</h3>
            <p className="text-xs text-slate-400 mb-3">Pre-bundled synthetic water body images</p>
            <div className="space-y-2">
              {DEMO_IMAGES.map(({ name, label }) => (
                <button
                  key={name}
                  onClick={() => loadDemo(name)}
                  disabled={loading}
                  className="w-full flex items-center gap-3 p-3 rounded-xl text-left text-sm font-medium text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800 hover:bg-sky-50 dark:hover:bg-sky-900/20 hover:text-sky-600 dark:hover:text-sky-400 transition-all border border-transparent hover:border-sky-200 dark:hover:border-sky-800 disabled:opacity-50"
                >
                  <Image size={16} className="flex-shrink-0 text-slate-400" />
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Export */}
          <a href="/api/download-report" target="_blank"
            className="btn-secondary w-full justify-center py-3 text-sm">
            <Download size={16} /> Download HTML Report
          </a>
        </div>

        {/* Right: Results */}
        <div className="lg:col-span-3 space-y-5">
          {/* Image viewer */}
          <ImageViewer images={result?.images || {}} loading={loading} />

          {/* Metrics */}
          <AnimatePresence>
            {(result || loading) && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <MetricCard title="Water Area" value={m.area_km2 != null ? formatNumber(m.area_km2 * 100, 1) : '—'} unit="ha" icon={CheckCircle} color="sky" loading={loading} />
                <MetricCard title="Avg Width" value={m.avg_width_m != null ? formatNumber(m.avg_width_m, 0) : '—'} unit="m" icon={CheckCircle} color="teal" loading={loading} />
                <MetricCard title="Coverage" value={m.coverage_pct != null ? formatNumber(m.coverage_pct, 1) : '—'} unit="%" icon={CheckCircle} color="green" loading={loading} />
                <MetricCard title="Discharge" value={d.discharge_m3s != null ? formatNumber(d.discharge_m3s, 0) : '—'} unit="m³/s" icon={CheckCircle} color="purple" subtitle="Hybrid estimate" loading={loading} />
                <MetricCard title="Turbidity" value={t.turbidity_score != null ? formatNumber(t.turbidity_score, 1) : '—'} unit="/100" icon={CheckCircle} color="amber" subtitle={t.turbidity_level} loading={loading} />
                <MetricCard title="Flood Risk" value={d.flood_risk || '—'} icon={AlertTriangle} color={d.flood_risk === 'High' ? 'red' : d.flood_risk === 'Moderate' ? 'amber' : 'green'} loading={loading} />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Spectral indices */}
          {result && !loading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card p-5">
              <h3 className="chart-title mb-3 flex items-center gap-2">
                <FlaskConical size={14} /> Simulated Spectral Indices
                <span className="ml-auto badge badge-demo">Prototype Approximation</span>
              </h3>
              <p className="text-xs text-slate-400 mb-4">
                True multispectral bands (NIR, SWIR) unavailable from standard RGB images. 
                These values are derived from pseudo-band channel proxies for demonstration purposes only.
              </p>
              <div className="grid grid-cols-3 gap-4">
                {[
                  { label: 'NDWI (Sim.)', key: 'ndwi_simulated', desc: 'Normalized Difference Water Index' },
                  { label: 'MNDWI (Sim.)', key: 'mndwi_simulated', desc: 'Modified NDWI' },
                  { label: 'AWEI (Sim.)', key: 'awei_simulated', desc: 'Automated Water Extraction Index' },
                ].map(({ label, key, desc }) => (
                  <div key={key} className="text-center p-3 rounded-xl bg-slate-50 dark:bg-slate-800">
                    <p className="text-xs text-slate-400 mb-1">{label}</p>
                    <p className="text-xl font-bold font-display text-sky-600 dark:text-sky-400">
                      {m[key] != null ? m[key].toFixed(3) : '—'}
                    </p>
                    <p className="text-[10px] text-slate-400 mt-1">{desc}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Discharge breakdown */}
          {result && !loading && d.discharge_m3s != null && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card p-5">
              <h3 className="chart-title mb-3">Discharge Estimation Breakdown</h3>
              <div className="grid grid-cols-3 gap-4 mb-4">
                {[
                  { label: 'Manning Physics', val: d.discharge_physics, color: '#0ea5e9' },
                  { label: 'ML Estimate', val: d.discharge_ml, color: '#a855f7' },
                  { label: 'Hybrid Final', val: d.discharge_m3s, color: '#22c55e' },
                ].map(({ label, val, color }) => (
                  <div key={label} className="text-center p-3 rounded-xl bg-slate-50 dark:bg-slate-800">
                    <p className="text-xs text-slate-400 mb-1">{label}</p>
                    <p className="text-xl font-bold font-display" style={{ color }}>{formatNumber(val, 0)}</p>
                    <p className="text-[10px] text-slate-400">m³/s</p>
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-500">
                <span>Range: {formatNumber(d.discharge_low, 0)} – {formatNumber(d.discharge_high, 0)} m³/s</span>
                <span className="ml-auto">Confidence: <strong className="text-sky-600 dark:text-sky-400">{d.confidence_pct}%</strong></span>
              </div>
              {/* Confidence bar */}
              <div className="mt-2 h-2 rounded-full bg-slate-200 dark:bg-slate-700">
                <div className="progress-bar h-full" style={{ width: `${d.confidence_pct}%` }} />
              </div>
            </motion.div>
          )}

          {/* Anomaly result */}
          {result && !loading && a.anomaly_detected && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className={`glass-card p-5 border-2 ${a.severity === 'severe' ? 'border-red-300 dark:border-red-800 bg-red-50/50 dark:bg-red-900/10' : 'border-amber-300 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-900/10'}`}
            >
              <div className="flex items-center gap-3 mb-3">
                <AlertTriangle size={20} className={a.severity === 'severe' ? 'text-red-500' : 'text-amber-500'} />
                <h3 className="font-semibold text-slate-800 dark:text-slate-200">Anomaly Detected — {a.severity.toUpperCase()}</h3>
              </div>
              <div className="space-y-2">
                {a.flags?.map((f, i) => (
                  <div key={i} className="text-sm text-slate-600 dark:text-slate-400 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-400 flex-shrink-0" />
                    {f.type}: <strong>{Number(f.value).toFixed(2)}</strong>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}
