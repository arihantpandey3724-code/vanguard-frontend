import { useState, useEffect } from 'react'
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

function AnimatedNumber({ value, duration = 1500 }) {
  const [displayValue, setDisplayValue] = useState(0)

  useEffect(() => {
    let start = 0
    const increment = value / (duration / 50)
    const interval = setInterval(() => {
      start += increment
      if (start >= value) {
        setDisplayValue(value)
        clearInterval(interval)
      } else {
        setDisplayValue(Math.floor(start))
      }
    }, 50)
    return () => clearInterval(interval)
  }, [value, duration])

  return displayValue
}

export default function MetricsPanel({ data, isLoading, error }) {
  const habitability = data?.habitability_score ?? 72
  const wetBulb = data?.wet_bulb_temp ?? 31
  const waterStress = data?.water_stress ?? 58
  const collapseYear = data?.collapse_year ?? 2045
  const cropLoss = data?.crop_yield_loss ?? 36
  const migrationPressure = data?.migration_pressure ?? 64
  const trend = data?.status || 'SAFE'
  const utility = data?.destination_utility_surge ?? 68

  const trendData = [
    { month: 'Now', habitability, stress: waterStress },
    { month: '+1d', habitability: Math.max(40, habitability - 2), stress: Math.min(100, waterStress + 3) },
    { month: '+3d', habitability: Math.max(38, habitability - 5), stress: Math.min(100, waterStress + 6) },
    { month: '+7d', habitability: Math.max(35, habitability - 8), stress: Math.min(100, waterStress + 9) },
    { month: '+14d', habitability: Math.max(30, habitability - 12), stress: Math.min(100, waterStress + 12) },
  ]

  const metricsData = [
    { name: 'Wet Bulb', value: wetBulb },
    { name: 'Water Stress', value: waterStress },
    { name: 'Utility Surge', value: utility },
  ]

  const tone =
    trend === 'CRITICAL'
      ? 'from-rose-500 via-red-600 to-rose-800'
      : trend === 'WARNING'
        ? 'from-amber-400 via-orange-500 to-rose-500'
        : 'from-emerald-400 via-teal-500 to-cyan-500'

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-lg border border-white/20 bg-slate-950/90 p-2 backdrop-blur">
          <p className="text-xs text-cyan-300">{payload[0].payload.month || payload[0].payload.name}</p>
          <p className="text-sm font-semibold text-white">{payload[0].value}</p>
        </div>
      )
    }
    return null
  }

  return (
    <section className="rounded-[30px] border border-white/10 bg-[linear-gradient(145deg,rgba(15,23,42,0.96),rgba(2,6,23,0.98))] p-6 text-slate-100 shadow-[0_22px_55px_rgba(8,15,32,0.55)] backdrop-blur-xl animate-fade-in">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[11px] uppercase tracking-[0.35em] text-cyan-300">Analytics</p>
          <h2 className="mt-2 text-2xl font-black tracking-tight text-white">Resilience overview</h2>
          <p className="mt-2 text-sm text-slate-400">Graphical signals from the latest backend analysis.</p>
        </div>
        <span className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-[11px] uppercase tracking-[0.25em] text-emerald-100">Updated live</span>
      </div>

      {error ? <div className="mt-5 rounded-2xl border border-rose-400/30 bg-rose-400/10 p-4 text-sm text-rose-100">{error}</div> : null}
      {isLoading ? <div className="mt-5 rounded-2xl border border-cyan-400/30 bg-cyan-400/10 p-4 text-sm text-cyan-100">Analyzing the selected location from the backend…</div> : null}

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <article className={`rounded-[28px] border border-white/10 bg-gradient-to-br ${tone} p-5 text-white shadow-[0_18px_45px_rgba(15,23,42,0.45)] transition-all duration-300 hover:scale-[1.02]`}>
          <p className="text-xs uppercase tracking-[0.35em] text-white/80">Total status</p>
          <h3 className="mt-3 text-4xl font-black tracking-tight md:text-5xl"><AnimatedNumber value={habitability} />%</h3>
          <p className="mt-2 text-sm text-white/85">Habitability score</p>
          <div className="mt-5 h-2 w-full rounded-full bg-white/20">
            <div className="h-2 rounded-full bg-white transition-all duration-1000" style={{ width: `${habitability}%` }} />
          </div>
          <p className="mt-3 text-xs uppercase tracking-[0.25em] text-white/80">Status: {trend}</p>
        </article>

        <article className="grid gap-4 sm:grid-cols-2 xl:grid-cols-2">
          {[
            { label: 'Wet Bulb Temp', value: `${wetBulb}°C`, badge: '+8% vs last year', tone: 'text-emerald-300' },
            { label: 'Water Stress', value: `${waterStress}%`, badge: '+5% pressure', tone: 'text-amber-300' },
            { label: 'Collapse Year', value: collapseYear, badge: 'Projected trend', tone: 'text-cyan-300' },
            { label: 'Utility Surge', value: `${utility}%`, badge: 'Peak demand', tone: 'text-violet-300' },
          ].map((item) => (
            <div key={item.label} className="rounded-[24px] border border-white/10 bg-white/5 p-4 shadow-[0_12px_30px_rgba(15,23,42,0.35)] transition-all duration-300 hover:scale-[1.02] hover:border-cyan-400/30 hover:bg-white/8">
              <p className="text-xs uppercase tracking-[0.25em] text-slate-400">{item.label}</p>
              <p className="mt-3 text-2xl font-black text-white">{item.value}</p>
              <span className={`mt-3 inline-flex rounded-full border border-slate-800 bg-slate-800/80 px-3 py-1 text-[11px] ${item.tone}`}>{item.badge}</span>
            </div>
          ))}
        </article>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <article className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-[0_10px_30px_rgba(15,23,42,0.35)]">
          <p className="text-xs uppercase tracking-[0.35em] text-slate-400">Habitability trend</p>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="habitability" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.6} />
                    <stop offset="95%" stopColor="#22d3ee" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                <XAxis dataKey="month" stroke="#64748b" />
                <YAxis stroke="#64748b" domain={[60, 80]} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="habitability" stroke="#22d3ee" strokeWidth={2} fillOpacity={1} fill="url(#habitability)" isAnimationActive={true} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </article>

        <article className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-[0_10px_30px_rgba(15,23,42,0.35)]">
          <p className="text-xs uppercase tracking-[0.35em] text-slate-400">Stress indicators</p>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                <XAxis dataKey="month" stroke="#64748b" />
                <YAxis stroke="#64748b" domain={[40, 65]} />
                <Tooltip content={<CustomTooltip />} />
                <Line type="monotone" dataKey="stress" stroke="#f97316" strokeWidth={2} dot={{ fill: '#f97316', r: 4 }} isAnimationActive={true} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </article>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <article className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-[0_10px_30px_rgba(15,23,42,0.35)]">
          <p className="text-xs uppercase tracking-[0.35em] text-slate-400">Climate metrics</p>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={metricsData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                <XAxis dataKey="name" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="value" fill="#06b6d4" radius={[8, 8, 0, 0]} isAnimationActive={true} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </article>

        <article className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-[0_10px_30px_rgba(15,23,42,0.35)]">
          <p className="text-xs uppercase tracking-[0.35em] text-slate-400">Domino effect</p>
          <div className="mt-5 space-y-5">
            {[
              { label: 'Crop Yield Loss', value: cropLoss, color: 'from-emerald-400 to-cyan-500' },
              { label: 'Migration Pressure', value: migrationPressure, color: 'from-rose-400 to-orange-500' },
            ].map((item) => (
              <div key={item.label}>
                <div className="mb-2 flex items-center justify-between text-sm text-slate-200">
                  <span>{item.label}</span>
                  <strong><AnimatedNumber value={item.value} />%</strong>
                </div>
                <div className="h-3 w-full rounded-full bg-slate-800 overflow-hidden">
                  <div className={`h-3 rounded-full bg-gradient-to-r ${item.color} transition-all duration-1000`} style={{ width: `${item.value}%` }} />
                </div>
              </div>
            ))}
          </div>
        </article>
      </div>

      <div className="mt-6 rounded-3xl border border-white/10 bg-white/5 p-5 shadow-[0_10px_30px_rgba(15,23,42,0.35)]">
        <p className="text-xs uppercase tracking-[0.35em] text-slate-400">Prevention blueprints</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {['Shaded water systems', 'Cool corridor design', 'Migration routing', 'Crop resilience'].map((tag) => (
            <span key={tag} className="rounded-full border border-slate-700 bg-slate-800/80 px-3 py-1 text-xs text-slate-200">{tag}</span>
          ))}
        </div>
      </div>
    </section>
  )
}
