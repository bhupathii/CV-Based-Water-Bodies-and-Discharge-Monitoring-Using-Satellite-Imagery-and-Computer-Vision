import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine, Legend } from 'recharts'

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3 shadow-lg text-xs">
      <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">{label}</p>
      {payload.map(p => (
        <div key={p.dataKey} className="flex items-center gap-2 mb-1">
          <span style={{ background: p.color }} className="w-2 h-2 rounded-full inline-block" />
          <span className="text-slate-500 dark:text-slate-400">{p.name}:</span>
          <span className="font-medium text-slate-700 dark:text-slate-200">{Number(p.value).toFixed(0)}</span>
        </div>
      ))}
    </div>
  )
}

export default function DischargeChart({ data = [], anomalyFlags = [] }) {
  const chartData = data.map((d, i) => ({
    ...d,
    anomaly: anomalyFlags[i] ? d.discharge : null,
  }))

  return (
    <div className="glass-card p-5">
      <h3 className="chart-title flex items-center gap-2 mb-4">
        <span className="w-3 h-3 rounded-full bg-sky-500 inline-block" />
        Discharge History (m³/s)
      </h3>
      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={chartData} margin={{ top: 5, right: 10, bottom: 0, left: 0 }}>
          <defs>
            <linearGradient id="dischargeGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.2} />
              <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.15)" />
          <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#94a3b8' }} tickLine={false} interval="preserveStartEnd" />
          <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} tickLine={false} axisLine={false} />
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ fontSize: 11 }} />
          <Area type="monotone" dataKey="discharge" name="Discharge" stroke="#0ea5e9" strokeWidth={2} fill="url(#dischargeGrad)" dot={false} />
          <Area type="monotone" dataKey="water_area" name="Water Area" stroke="#06b6d4" strokeWidth={1.5} fill="url(#areaGrad)" dot={false} strokeDasharray="4 2" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
