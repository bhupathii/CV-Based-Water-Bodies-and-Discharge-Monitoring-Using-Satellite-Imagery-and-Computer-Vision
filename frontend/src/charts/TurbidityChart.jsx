import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine, Legend } from 'recharts'

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3 shadow-lg text-xs">
      <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">{label}</p>
      {payload.map(p => (
        <div key={p.dataKey} className="flex items-center gap-2 mb-1">
          <span style={{ background: p.color }} className="w-2 h-2 rounded-full inline-block" />
          <span className="text-slate-500 dark:text-slate-400">{p.name}:</span>
          <span className="font-medium text-slate-700 dark:text-slate-200">{Number(p.value).toFixed(1)}</span>
        </div>
      ))}
    </div>
  )
}

export default function TurbidityChart({ data = [] }) {
  return (
    <div className="glass-card p-5">
      <h3 className="chart-title flex items-center gap-2 mb-4">
        <span className="w-3 h-3 rounded-full bg-amber-500 inline-block" />
        Turbidity & Flood Risk Index
      </h3>
      <p className="text-[10px] text-slate-400 dark:text-slate-500 mb-3">⚠ Simulated turbidity proxy from image color analysis</p>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={data} margin={{ top: 5, right: 10, bottom: 0, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.15)" />
          <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#94a3b8' }} tickLine={false} interval="preserveStartEnd" />
          <YAxis yAxisId="turb" tick={{ fontSize: 10, fill: '#94a3b8' }} tickLine={false} axisLine={false} />
          <YAxis yAxisId="risk" orientation="right" tick={{ fontSize: 10, fill: '#94a3b8' }} tickLine={false} axisLine={false} domain={[0, 1]} />
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ fontSize: 11 }} />
          <ReferenceLine yAxisId="turb" y={70} stroke="#ef4444" strokeDasharray="4 4" strokeWidth={1} label={{ value: 'High Turb.', position: 'right', fontSize: 9, fill: '#ef4444' }} />
          <Line yAxisId="turb" type="monotone" dataKey="turbidity" name="Turbidity" stroke="#f59e0b" strokeWidth={2} dot={false} />
          <Line yAxisId="risk" type="monotone" dataKey="flood_risk" name="Flood Risk" stroke="#ef4444" strokeWidth={1.5} dot={false} strokeDasharray="3 2" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
