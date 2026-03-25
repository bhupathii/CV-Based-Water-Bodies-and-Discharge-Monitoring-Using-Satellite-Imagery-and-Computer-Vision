import { motion } from 'framer-motion'
import { clsx } from 'clsx'

export default function MetricCard({ title, value, unit, icon: Icon, color = 'sky', trend, badge, subtitle, loading }) {
  const colorMap = {
    sky: { bg: 'from-sky-500 to-cyan-500', light: 'bg-sky-50 dark:bg-sky-900/20', text: 'text-sky-600 dark:text-sky-400', icon: 'text-sky-500' },
    green: { bg: 'from-green-500 to-emerald-500', light: 'bg-green-50 dark:bg-green-900/20', text: 'text-green-600 dark:text-green-400', icon: 'text-green-500' },
    amber: { bg: 'from-amber-500 to-orange-400', light: 'bg-amber-50 dark:bg-amber-900/20', text: 'text-amber-600 dark:text-amber-400', icon: 'text-amber-500' },
    red: { bg: 'from-red-500 to-rose-500', light: 'bg-red-50 dark:bg-red-900/20', text: 'text-red-600 dark:text-red-400', icon: 'text-red-500' },
    purple: { bg: 'from-purple-500 to-violet-500', light: 'bg-purple-50 dark:bg-purple-900/20', text: 'text-purple-600 dark:text-purple-400', icon: 'text-purple-500' },
    teal: { bg: 'from-teal-500 to-cyan-500', light: 'bg-teal-50 dark:bg-teal-900/20', text: 'text-teal-600 dark:text-teal-400', icon: 'text-teal-500' },
  }
  const c = colorMap[color] || colorMap.sky

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="metric-card"
    >
      <div className="flex items-start justify-between mb-3">
        <div className={clsx('w-10 h-10 rounded-xl flex items-center justify-center', c.light)}>
          {Icon && <Icon size={20} className={c.icon} />}
        </div>
        {badge && (
          <span className={clsx('text-xs px-2 py-1 rounded-full font-medium', badge.className)}>
            {badge.label}
          </span>
        )}
      </div>

      {loading ? (
        <div className="space-y-2">
          <div className="skeleton h-8 w-24 rounded" />
          <div className="skeleton h-4 w-32 rounded" />
        </div>
      ) : (
        <>
          <div className="flex items-baseline gap-1.5 mb-1">
            <span className="text-2xl font-bold font-display text-slate-800 dark:text-white">{value ?? '—'}</span>
            {unit && <span className="text-sm text-slate-500 dark:text-slate-400 font-medium">{unit}</span>}
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">{title}</p>
          {subtitle && <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">{subtitle}</p>}
          {trend != null && (
            <div className={clsx('flex items-center gap-1 mt-2 text-xs font-medium', trend >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-500')}>
              <span>{trend >= 0 ? '↑' : '↓'}</span>
              <span>{Math.abs(trend).toFixed(1)}% vs last week</span>
            </div>
          )}
        </>
      )}

      {/* Gradient accent line */}
      <div className={clsx('absolute bottom-0 left-0 right-0 h-0.5 rounded-b-2xl bg-gradient-to-r', c.bg)} />
    </motion.div>
  )
}
