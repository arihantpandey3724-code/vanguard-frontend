import { useState, useEffect } from 'react'

function PulsingDot({ x, y, color, label, onClick }) {
  return (
    <g onClick={onClick} style={{ cursor: 'pointer' }}>
      <circle cx={x} cy={y} r="8" fill={color} opacity="0.3" className="animate-pulse" />
      <circle cx={x} cy={y} r="5" fill={color} className="drop-shadow-lg" />
      <title>{label}</title>
    </g>
  )
}

function AnimatedWave({ cx, cy, delay }) {
  return (
    <circle
      cx={cx}
      cy={cy}
      r="0"
      fill="none"
      stroke="#22d3ee"
      strokeWidth="2"
      opacity="0.8"
      style={{
        animation: `wave 2s ease-out infinite`,
        animationDelay: `${delay}s`,
      }}
    />
  )
}

export default function MapView({ onLocationSelect, currentPin }) {
  const [hoveredPin, setHoveredPin] = useState(null)
  const zonePoints = [
    { x: 240, y: 140, color: '#22d3ee', label: 'Primary zone', coords: [31.1471, 75.3412] },
    { x: 150, y: 90, color: '#ec4899', label: 'Risk zone', coords: [28.6139, 77.2090] },
    { x: 480, y: 100, color: '#10b981', label: 'Safe zone', coords: [40.7128, -74.0060] },
    { x: 650, y: 200, color: '#f59e0b', label: 'Caution zone', coords: [19.0760, 72.8777] },
    { x: 120, y: 240, color: '#8b5cf6', label: 'Data point', coords: [13.0827, 80.2707] },
  ]

  return (
    <section className="rounded-[30px] border border-white/10 bg-[linear-gradient(145deg,rgba(8,15,32,0.98),rgba(2,6,23,0.98))] p-6 text-slate-100 shadow-[0_24px_60px_rgba(8,15,32,0.55)] backdrop-blur-xl animate-slide-up">
      <style>{`
        @keyframes wave {
          0% { r: 0; opacity: 0.8; }
          100% { r: 60px; opacity: 0; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-3px); }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>

      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-cyan-300">Map view</p>
          <h2 className="mt-2 text-2xl font-semibold text-white">Interactive climate map</h2>
          <p className="mt-2 max-w-xl text-sm leading-6 text-slate-300">Click any point to inspect the local exposure profile, then submit a story tied to that exact location.</p>
        </div>
        <div className="rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-xs text-cyan-100 animate-float">Live pulse</div>
      </div>

      <div className="mt-6 rounded-[28px] border border-white/10 bg-[linear-gradient(145deg,#0f172a_0%,#111827_45%,#020617_100%)] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.04),0_18px_40px_rgba(2,6,23,0.45)]">
        <div className="relative rounded-[24px] border border-white/10 bg-[radial-gradient(circle_at_top,_#172554_0%,_#0f172a_45%,_#020617_100%)] shadow-[0_18px_40px_rgba(15,23,42,0.45)] overflow-hidden">
          <svg width="100%" height="288" viewBox="0 0 800 288" preserveAspectRatio="xMidYMid slice" className="w-full">
            <defs>
              <pattern id="grid" width="32" height="32" patternUnits="userSpaceOnUse">
                <path d="M 32 0 L 0 0 0 32" fill="none" stroke="#38bdf8" strokeWidth="0.5" opacity="0.1" />
              </pattern>
              <radialGradient id="mapGradient" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#172554" />
                <stop offset="100%" stopColor="#020617" />
              </radialGradient>
            </defs>

            <rect width="800" height="288" fill="url(#mapGradient)" />
            <rect width="800" height="288" fill="url(#grid)" />

            <circle cx="100" cy="80" r="50" fill="#22d3ee" opacity="0.1" />
            <circle cx="700" cy="220" r="60" fill="#a855f7" opacity="0.08" />

            <path d="M 100 100 Q 300 50, 500 100 T 900 100" stroke="#38bdf8" strokeWidth="1" fill="none" opacity="0.3" strokeDasharray="5,5" />

            <AnimatedWave cx="240" cy="140" delay="0" />
            <AnimatedWave cx="240" cy="140" delay="0.7" />
            <AnimatedWave cx="480" cy="100" delay="0" />
            <AnimatedWave cx="480" cy="100" delay="0.7" />

            {zonePoints.map((point) => (
              <g key={point.label} onMouseEnter={() => setHoveredPin(point.label)} onMouseLeave={() => setHoveredPin(null)} onClick={() => onLocationSelect?.(point.coords[0], point.coords[1])} style={{ cursor: 'pointer' }}>
                <circle cx={point.x} cy={point.y} r="8" fill={point.color} opacity="0.25" className="animate-pulse" />
                <circle cx={point.x} cy={point.y} r="5" fill={point.color} className="drop-shadow-lg" />
                <title>{point.label}</title>
              </g>
            ))}

            {currentPin && (
              <>
                <circle cx="240" cy="140" r="20" fill="none" stroke="#ef4444" strokeWidth="2" opacity="0.6" style={{ animation: 'wave 2s ease-out infinite' }} />
                <circle cx="240" cy="140" r="15" fill="none" stroke="#ef4444" strokeWidth="1" opacity="0.4" style={{ animation: 'wave 2s ease-out infinite 0.3s' }} />
              </>
            )}
          </svg>

          {currentPin ? (
            <div className="absolute bottom-4 left-4 rounded-2xl border border-rose-400/30 bg-rose-400/10 px-3 py-2 text-xs text-rose-100 backdrop-blur-sm">
              Selected: {currentPin.lat.toFixed(4)}, {currentPin.lng.toFixed(4)}
            </div>
          ) : null}
          {hoveredPin ? (
            <div className="absolute right-4 top-4 rounded-2xl border border-cyan-400/30 bg-cyan-400/10 px-3 py-2 text-xs text-cyan-100 backdrop-blur-sm">Hover: {hoveredPin}</div>
          ) : null}
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4 text-xs text-slate-200">
          <div className="flex items-center gap-2 rounded-lg border border-cyan-400/20 bg-cyan-400/5 p-2">
            <div className="h-2 w-2 rounded-full bg-cyan-400" />
            <span>Primary zone</span>
          </div>
          <div className="flex items-center gap-2 rounded-lg border border-rose-400/20 bg-rose-400/5 p-2">
            <div className="h-2 w-2 rounded-full bg-rose-400" />
            <span>Risk zone</span>
          </div>
          <div className="flex items-center gap-2 rounded-lg border border-emerald-400/20 bg-emerald-400/5 p-2">
            <div className="h-2 w-2 rounded-full bg-emerald-400" />
            <span>Safe zone</span>
          </div>
          <div className="flex items-center gap-2 rounded-lg border border-amber-400/20 bg-amber-400/5 p-2">
            <div className="h-2 w-2 rounded-full bg-amber-400" />
            <span>Caution zone</span>
          </div>
        </div>
      </div>
    </section>
  )
}
