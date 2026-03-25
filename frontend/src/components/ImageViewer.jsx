import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Eye, Layers, Blend, GitBranch } from 'lucide-react'
import { clsx } from 'clsx'

const TABS = [
  { id: 'original', label: 'Original', icon: Eye },
  { id: 'segmented_mask', label: 'Water Mask', icon: Layers },
  { id: 'overlay', label: 'Overlay', icon: Blend },
  { id: 'contour', label: 'Contours', icon: GitBranch },
]

export default function ImageViewer({ images = {}, loading = false }) {
  const [active, setActive] = useState('original')

  return (
    <div className="glass-card p-5">
      <h3 className="chart-title flex items-center gap-2">
        <Eye size={14} /> Image Analysis View
      </h3>

      {/* Tab bar */}
      <div className="flex gap-1 mb-4 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActive(id)}
            className={clsx(
              'flex-1 flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg text-xs font-medium transition-all duration-200',
              active === id
                ? 'bg-white dark:bg-slate-700 text-sky-600 dark:text-sky-400 shadow-sm'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
            )}
          >
            <Icon size={13} />
            <span className="hidden sm:inline">{label}</span>
          </button>
        ))}
      </div>

      {/* Image panel */}
      <div className="image-viewer aspect-video bg-slate-100 dark:bg-slate-800">
        {loading ? (
          <div className="w-full h-full flex items-center justify-center">
            <div className="flex flex-col items-center gap-3 text-slate-400">
              <div className="w-8 h-8 border-2 border-sky-500 border-t-transparent rounded-full animate-spin" />
              <span className="text-sm">Processing image…</span>
            </div>
          </div>
        ) : images[active] ? (
          <AnimatePresence mode="wait">
            <motion.img
              key={active}
              src={images[active]}
              alt={active}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="w-full h-full object-contain"
            />
          </AnimatePresence>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-center text-slate-400">
              <Layers size={40} className="mx-auto mb-3 opacity-30" />
              <p className="text-sm">Upload an image to see analysis</p>
            </div>
          </div>
        )}
      </div>

      {/* Labels */}
      {images[active] && (
        <p className="text-xs text-slate-400 dark:text-slate-500 mt-2 text-center">
          {active === 'segmented_mask' && '⚠ Simulated segmentation mask — demo approximation'}
          {active === 'overlay' && 'Blue overlay indicates detected water regions'}
          {active === 'contour' && 'Green contours trace detected water body boundaries'}
          {active === 'original' && 'Original preprocessed input image (resized + denoised)'}
        </p>
      )}
    </div>
  )
}
