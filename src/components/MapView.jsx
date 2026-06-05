import { useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet'
import L from 'leaflet'
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png'
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'

delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
})

const redIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
})

const blueIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
})

function ClickHandler({ onClickMap }) {
  useMapEvents({
    click: (e) => {
      onClickMap(e.latlng.lat, e.latlng.lng)
    }
  })
  return null
}

export default function MapView({ onLocationSelect, currentPin, stories = [] }) {
  const [hoveredStory, setHoveredStory] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleMapClick = async (lat, lng) => {
    setIsLoading(true)
    await onLocationSelect?.(lat, lng)
    setIsLoading(false)
  }

  return (
    <section className="rounded-[30px] border border-white/10 bg-[linear-gradient(145deg,rgba(8,15,32,0.98),rgba(2,6,23,0.98))] p-6 text-slate-100 shadow-[0_24px_60px_rgba(8,15,32,0.55)] backdrop-blur-xl h-full flex flex-col">

      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-cyan-300">Map view</p>
          <h2 className="mt-2 text-2xl font-semibold text-white">Interactive climate map</h2>
          <p className="mt-2 max-w-xl text-sm leading-6 text-slate-300">
            Click anywhere on India to inspect the local climate exposure profile and get a full habitability report.
          </p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <div className="rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-xs text-cyan-100 whitespace-nowrap animate-pulse">
            ● Live pulse
          </div>
          {isLoading && (
            <div className="rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-1 text-xs text-amber-100 whitespace-nowrap">
              ⏳ Analysing...
            </div>
          )}
        </div>
      </div>

      <div className="mt-6 flex-1 rounded-[28px] border border-white/10 bg-[#0f172a] shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] relative flex flex-col overflow-hidden">
        
        <div className="relative flex-1 min-h-[400px]">
          <style>{`
            .leaflet-container { background: #0f172a !important; }
            .leaflet-tile-pane { filter: brightness(0.85) saturate(0.9); }
            .leaflet-control-zoom a {
              background: #1e293b !important;
              color: #94a3b8 !important;
              border-color: #334155 !important;
            }
            .leaflet-control-zoom a:hover {
              background: #334155 !important;
              color: #e2e8f0 !important;
            }
            .leaflet-popup-content-wrapper {
              background: #1e293b !important;
              color: #e2e8f0 !important;
              border: 1px solid rgba(255,255,255,0.1) !important;
              border-radius: 12px !important;
            }
            .leaflet-popup-tip {
              background: #1e293b !important;
            }
            .leaflet-attribution-flag { display: none !important; }
            .leaflet-control-attribution {
              background: rgba(15,23,42,0.8) !important;
              color: #475569 !important;
              font-size: 9px !important;
            }
          `}</style>

          <MapContainer
            center={[20.5937, 78.9629]}
            zoom={5}
            minZoom={4}
            maxZoom={12}
            style={{ height: '100%', width: '100%', minHeight: '400px' }}
            zoomControl={true}
          >
            <TileLayer
              url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
              attribution='&copy; <a href="https://carto.com/">CARTO</a>'
            />

            <ClickHandler onClickMap={handleMapClick} />

            {currentPin && (
              <Marker position={currentPin} icon={redIcon}>
                <Popup>
                  <div className="text-xs">
                    <div className="font-bold text-rose-300 mb-1">📍 Selected Location</div>
                    <div>Lat: {currentPin[0].toFixed(4)}</div>
                    <div>Lng: {currentPin[1].toFixed(4)}</div>
                  </div>
                </Popup>
              </Marker>
            )}

            {stories.map((story, i) => (
              <Marker
                key={i}
                position={[story.latitude, story.longitude]}
                icon={blueIcon}
                eventHandlers={{
                  mouseover: () => setHoveredStory(story),
                  mouseout: () => setHoveredStory(null),
                }}
              >
                <Popup>
                  <div className="text-xs max-w-[200px]">
                    <div className="font-bold text-cyan-300 mb-1">
                      👤 {story.author_name}
                    </div>
                    <div className="text-slate-400 mb-1">📍 {story.location}</div>
                    <div className="text-slate-200 leading-4">{story.story_text}</div>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>

          {currentPin && (
            <div className="absolute bottom-4 left-4 z-[1000] rounded-2xl border border-rose-400/30 bg-rose-400/10 px-3 py-2 text-xs text-rose-100 backdrop-blur-sm pointer-events-none">
              📍 {currentPin[0].toFixed(4)}, {currentPin[1].toFixed(4)}
            </div>
          )}

          {hoveredStory && (
            <div className="absolute top-4 right-4 z-[1000] rounded-2xl border border-cyan-400/30 bg-cyan-400/10 px-3 py-2 text-xs text-cyan-100 backdrop-blur-sm max-w-[200px] pointer-events-none">
              💬 {hoveredStory.author_name} — {hoveredStory.location}
            </div>
          )}

          {!currentPin && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[1000] rounded-full border border-white/10 bg-slate-900/80 px-4 py-2 text-xs text-slate-400 backdrop-blur-sm pointer-events-none whitespace-nowrap">
              🖱️ Click anywhere on the map to analyse
            </div>
          )}
        </div>

        <div className="p-4 grid grid-cols-2 gap-3 sm:grid-cols-4 text-xs text-slate-200 border-t border-white/5">
          <div className="flex items-center gap-2 rounded-lg border border-rose-400/20 bg-rose-400/5 p-2">
            <div className="h-2 w-2 rounded-full bg-rose-400" />
            <span>Selected pin</span>
          </div>
          <div className="flex items-center gap-2 rounded-lg border border-cyan-400/20 bg-cyan-400/5 p-2">
            <div className="h-2 w-2 rounded-full bg-cyan-400" />
            <span>Community story</span>
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