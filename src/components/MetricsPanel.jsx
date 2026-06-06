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

// 1. NEW: Added onDetectLocation to the props
export default function MetricsPanel({ data, isLoading, error, onDetectLocation }) {
  const habitability = data?.habitability_score ?? 72
  const wetBulb = data?.metrics?.current_wet_bulb_celsius ?? 31
  const waterStress = data?.domino_effect?.water_stress_index ?? 58
  const collapseYear = data?.timeline?.collapse_year ?? 2045
  const cropLoss = data?.domino_effect?.crop_yield_loss_percent ?? 36
  const migrationPressure = data?.domino_effect?.migration_pressure_score ?? 64
  const trend = data?.status || 'SAFE'
  const utility = data?.migration_pipeline?.destination_utility_surge_percent ?? 68

 const trendData = data?.timeline?.decadal_trend?.map(item => ({
    label: item.decade, // Maps to '0y', '10y', etc.
    habitability: item.score,
    stress: Math.max(0, 100 - item.score) // Derived inverse stress
  })) || [];

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

  const envImages = {
    SAFE: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=1200", 
    WARNING: "https://images.unsplash.com/photo-1544866635-f093a2019ea4?auto=format&fit=crop&q=80&w=1200", 
    CRITICAL: "https://images.unsplash.com/photo-1519999482648-25049ddd37b1?auto=format&fit=crop&q=80&w=1200", 
  };

  const currentImage = envImages[trend] || envImages.SAFE;

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-lg border border-stone-200 bg-white/90 p-2 backdrop-blur shadow-md">
          <p className="text-xs text-stone-500 font-medium">{payload[0].payload.month || payload[0].payload.name}</p>
          <p className="text-sm font-bold text-stone-800">{payload[0].value}</p>
        </div>
      )
    }
    return null
  }

  return (
    <section className="rounded-[30px] border border-stone-200 bg-stone-50 p-6 text-stone-800 shadow-[0_22px_55px_rgba(0,0,0,0.08)] backdrop-blur-xl animate-fade-in w-full max-w-4xl">
      
      {/* HEADER SECTION */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[11px] uppercase tracking-[0.35em] text-emerald-600 font-bold">Analytics</p>
          <h2 className="mt-2 text-2xl font-black tracking-tight text-stone-900">Resilience overview</h2>
          <p className="mt-2 text-sm text-stone-500">Graphical signals from the latest backend analysis.</p>
        </div>
        <span className="rounded-full border border-emerald-600/30 bg-emerald-100 px-3 py-1 text-[11px] uppercase tracking-[0.25em] text-emerald-800 font-bold">Updated live</span>
      </div>

      <div className="mt-6 w-full h-48 sm:h-64 rounded-[24px] overflow-hidden shadow-md border border-stone-200 relative">
        <img 
          src={currentImage} 
          alt={`Environmental state: ${trend}`} 
          className="w-full h-full object-cover transition-opacity duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        
        <div className="absolute bottom-4 left-4 right-4 text-white">
           <p className="text-sm md:text-base font-medium italic drop-shadow-md">
             "We are the first generation to feel the effect of climate change and the last generation who can do something about it."
           </p>
           <p className="text-xs mt-1 opacity-80 uppercase tracking-widest drop-shadow-md">— Barack Obama</p>
        </div>
      </div>

      {error ? <div className="mt-5 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800 font-medium">{error}</div> : null}
      {isLoading ? <div className="mt-5 rounded-2xl border border-cyan-200 bg-cyan-50 p-4 text-sm text-cyan-800 font-medium">Analyzing the selected location from the backend…</div> : null}
        
      <div className="mt-6 grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        
        {/* --- 2. UPGRADED: Total Status Card with Detect Location Button --- */}
        <article className={`rounded-[28px] border border-stone-200 bg-gradient-to-br ${tone} p-5 text-white shadow-lg transition-all duration-300 hover:scale-[1.02]`}>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-white/90 font-medium">Total status</p>
              <h3 className="mt-3 text-4xl font-black tracking-tight md:text-5xl"><AnimatedNumber value={habitability} />%</h3>
              <p className="mt-2 text-sm text-white/90">Habitability score</p>
            </div>
            
            <button 
              onClick={onDetectLocation} 
              className="mt-1 flex items-center gap-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/30 transition-all active:scale-95 text-white px-4 py-2 rounded-full text-xs font-bold tracking-wider uppercase shadow-sm"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                <path fillRule="evenodd" d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 00-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 002.682 2.282 16.975 16.975 0 001.145.742zM12 13.5a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
              </svg>
              Detect Location
            </button>
          </div>

          <div className="mt-5 h-2 w-full rounded-full bg-black/20">
            <div className="h-2 rounded-full bg-white transition-all duration-1000" style={{ width: `${habitability}%` }} />
          </div>
          <p className="mt-3 text-xs uppercase tracking-[0.25em] text-white/90 font-medium">Status: {trend}</p>
        </article>
        {/* --- END UPGRADED CARD --- */}

        <article className="grid gap-4 sm:grid-cols-2 xl:grid-cols-2">
          {[
            { label: 'Wet Bulb Temp', value: `${wetBulb}°C`, badge: 'Live reading', tone: 'text-emerald-700 bg-emerald-50 border-emerald-200' },
            { label: 'Water Stress', value: `${waterStress}%`, badge: 'Domino effect', tone: 'text-amber-700 bg-amber-50 border-amber-200' },
            { label: 'Collapse Year', value: collapseYear, badge: 'Projected trend', tone: 'text-cyan-700 bg-cyan-50 border-cyan-200' },
            { label: 'Utility Surge', value: `${utility}%`, badge: 'Peak demand', tone: 'text-violet-700 bg-violet-50 border-violet-200' },
          ].map((item) => (
            <div key={item.label} className="rounded-[24px] border border-stone-200 bg-white p-4 shadow-sm transition-all duration-300 hover:scale-[1.02] hover:border-emerald-300 hover:shadow-md">
              <p className="text-xs uppercase tracking-[0.25em] text-stone-500 font-medium">{item.label}</p>
              <p className="mt-3 text-2xl font-black text-stone-800">{item.value}</p>
              <span className={`mt-3 inline-flex rounded-full border px-3 py-1 text-[11px] font-semibold ${item.tone}`}>{item.badge}</span>
            </div>
          ))}
        </article>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-2">
       {/* --- UPDATED CHARTS --- */}
        <article className="rounded-3xl border border-stone-200 bg-white p-5 shadow-sm">
          <p className="text-xs uppercase tracking-[0.35em] text-stone-500 font-medium">Habitability trend</p>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="habitability" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="label" stroke="#6b7280" /> {/* Changed from month to label */}
                <YAxis stroke="#6b7280" domain={[0, 100]} /> {/* Updated domain to 0-100 for better decadal visibility */}
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="habitability" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#habitability)" isAnimationActive={true} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </article>

        <article className="rounded-3xl border border-stone-200 bg-white p-5 shadow-sm">
          <p className="text-xs uppercase tracking-[0.35em] text-stone-500 font-medium">Stress indicators</p>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="label" stroke="#6b7280" /> {/* Changed from month to label */}
                <YAxis stroke="#6b7280" domain={[0, 100]} /> {/* Updated domain to 0-100 */}
                <Tooltip content={<CustomTooltip />} />
                <Line type="monotone" dataKey="stress" stroke="#f59e0b" strokeWidth={3} dot={{ fill: '#f59e0b', r: 4 }} isAnimationActive={true} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </article>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <article className="rounded-3xl border border-stone-200 bg-white p-5 shadow-sm">
          <p className="text-xs uppercase tracking-[0.35em] text-stone-500 font-medium">Climate metrics</p>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={metricsData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="name" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="value" fill="#0ea5e9" radius={[8, 8, 0, 0]} isAnimationActive={true} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </article>

        <article className="rounded-3xl border border-stone-200 bg-white p-5 shadow-sm">
          <p className="text-xs uppercase tracking-[0.35em] text-stone-500 font-medium">Domino effect</p>
          <div className="mt-5 space-y-6">
            {[
              { label: 'Crop Yield Loss', value: cropLoss, color: 'from-emerald-400 to-teal-500' },
              { label: 'Migration Pressure', value: migrationPressure, color: 'from-amber-400 to-orange-500' },
            ].map((item) => (
              <div key={item.label}>
                <div className="mb-2 flex items-center justify-between text-sm text-stone-700">
                  <span className="font-medium">{item.label}</span>
                  <strong className="text-stone-900"><AnimatedNumber value={item.value} />%</strong>
                </div>
                <div className="h-3 w-full rounded-full bg-stone-200 overflow-hidden shadow-inner">
                  <div className={`h-3 rounded-full bg-gradient-to-r ${item.color} transition-all duration-1000`} style={{ width: `${item.value}%` }} />
                </div>
              </div>
            ))}
          </div>
        </article>
      </div>

      <div className="mt-6 rounded-3xl border border-stone-200 bg-white p-5 shadow-sm">
        <p className="text-xs uppercase tracking-[0.35em] text-stone-500 font-medium">Prevention blueprints</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {(data?.prevention_blueprints || ['Shaded water systems', 'Cool corridor design', 'Migration routing', 'Crop resilience']).map((tag) => (
            <span key={tag} className="rounded-full border border-stone-300 bg-stone-100 px-3 py-1 text-xs font-medium text-stone-700">{tag}</span>
          ))}
        </div>
      </div>
    </section>
  )
}