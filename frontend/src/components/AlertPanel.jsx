import { motion } from 'framer-motion'
import { AlertTriangle, CheckCircle, Info, X } from 'lucide-react'
import { clsx } from 'clsx'
import { formatDate } from '../utils/api'

const ICONS = {
  severe: { icon: AlertTriangle, cls: 'alert-severe', iconCls: 'text-red-500' },
  warning: { icon: AlertTriangle, cls: 'alert-warning', iconCls: 'text-amber-500' },
  info: { icon: Info, cls: 'alert-info', iconCls: 'text-sky-500' },
  normal: { icon: CheckCircle, cls: 'alert-info', iconCls: 'text-green-500' },
}

export default function AlertPanel({ alerts = [], onAck, loading }) {
  if (loading) return (
    <div className="glass-card p-5 space-y-3">
      <div className="skeleton h-5 w-32 rounded" />
      {[1,2,3].map(i => <div key={i} className="skeleton h-16 w-full rounded-xl" />)}
    </div>
  )

  return (
    <div className="glass-card p-5">
      <h3 className="chart-title flex items-center gap-2 mb-4">
        <AlertTriangle size={14} /> Alert History
        {alerts.length > 0 && (
          <span className="ml-auto text-xs px-2 py-0.5 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 font-semibold">
            {alerts.filter(a => !a.acknowledged).length} unread
          </span>
        )}
      </h3>

      {alerts.length === 0 ? (
        <div className="text-center py-8 text-slate-400">
          <CheckCircle size={32} className="mx-auto mb-3 text-green-400 opacity-60" />
          <p className="text-sm">No alerts — all systems normal</p>
        </div>
      ) : (
        <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
          {alerts.map((alert) => {
            const { icon: Icon, cls, iconCls } = ICONS[alert.severity] || ICONS.info
            return (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                className={clsx(cls, alert.acknowledged ? 'opacity-50' : '')}
              >
                <Icon size={18} className={clsx(iconCls, 'flex-shrink-0 mt-0.5')} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                      {alert.alert_type}
                    </p>
                    <span className={clsx(
                      'text-[10px] font-bold uppercase px-2 py-0.5 rounded-full flex-shrink-0',
                      alert.severity === 'severe' ? 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400' :
                      alert.severity === 'warning' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400' :
                      'bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-400'
                    )}>
                      {alert.severity}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">{alert.message}</p>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-[11px] text-slate-400">{alert.site_name} · {alert.timestamp?.split('T')[0]}</span>
                    {!alert.acknowledged && onAck && (
                      <button
                        onClick={() => onAck(alert.id)}
                        className="text-[11px] text-sky-600 dark:text-sky-400 hover:underline flex items-center gap-1"
                      >
                        <X size={11} /> Dismiss
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      )}
    </div>
  )
}
