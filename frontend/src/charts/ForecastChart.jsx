import { ResponsiveContainer, ComposedChart, Area, Line, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine, Legend } from 'recharts'

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3 shadow-lg text-xs">
      <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">{label}</p>
      {payload.map(p => (
        <div key={p.dataKey} className="flex items-center gap-2 mb-1">
          <span style={{ background: p.color || p.fill }} className="w-2 h-2 rounded-full inline-block" />
          <span className="text-slate-500 dark:text-slate-400 capitalize">{p.name}:</span>
          <span className="font-medium text-slate-700 dark:text-slate-200">{Number(p.value).toFixed(0)}</span>
        </div>
      ))}
    </div>
  )
}

export default function ForecastChart({ forecast = {} }) {
  if (!forecast.forecast_dates?.length) return (
    <div className="glass-card p-5 flex items-center justify-center h-64 text-slate-400 text-sm">Select a site to view forecast</div>
  )

  const data = forecast.forecast_dates.map((date, i) => ({
    date,
    discharge: forecast.discharge_forecast?.[i] ?? 0,
    lower: forecast.discharge_lower?.[i] ?? 0,
    upper: forecast.discharge_upper?.[i] ?? 0,
    floodRisk: (forecast.flood_risk_forecast?.[i] ?? 0) * 1000,
  }))

  const threshold = forecast.flood_alert_threshold ?? 30000

  return (
    <div className="glass-card p-5">
      <div className="flex items-center justify-between mb-1">
        <h3 className="chart-title flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-purple-500 inline-block" />
          7-Day Discharge Forecast
        </h3>
        <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 font-medium">
          ±15% confidence band
        </span>
      </div>
      <p className="text-[10px] text-slate-400 dark:text-slate-500 mb-3">Demo Approximation — moving average projection</p>
      <ResponsiveContainer width="100%" height={240}>
        <ComposedChart data={data} margin={{ top: 5, right: 10, bottom: 0, left: 0 }}>
          <defs>
            <linearGradient id="forecastBand" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#a855f7" stopOpacity={0.25} />
              <stop offset="95%" stopColor="#a855f7" stopOpacity={0.05} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.15)" />
          <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#94a3b8' }} tickLine={false} />
          <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} tickLine={false} axisLine={false} />
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ fontSize: 11 }} />
          <ReferenceLine y={threshold} stroke="#ef4444" strokeDasharray="5 4" strokeWidth={1.5}
            label={{ value: '⚠ Flood Threshold', position: 'insideTopRight', fontSize: 9, fill: '#ef4444' }} />
          <Area type="monotone" dataKey="upper" name="Upper Bound" fill="url(#forecastBand)" stroke="transparent" legendType="none" />
          <Area type="monotone" dataKey="lower" name="Lower Bound" fill="#fff" stroke="transparent" legendType="none" />
          <Line type="monotone" dataKey="discharge" name="Forecast Discharge" stroke="#a855f7" strokeWidth={2.5} dot={{ r: 4, fill: '#a855f7' }} activeDot={{ r: 6 }} />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  )
}
