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
    // OUTER FRAME: Light Blue gradient for a fresh, bright water look
    <section className="rounded-[30px] border border-[#90CAF9]/50 bg-gradient-to-br from-[#E3F2FD] to-[#BBDEFB] p-6 text-[#0D47A1] shadow-xl h-full flex flex-col">

      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-[#0288D1] font-bold">Map view</p>
          <h2 className="mt-2 text-2xl font-semibold text-[#08306B]">Interactive climate map</h2>
          <p className="mt-2 max-w-xl text-sm leading-6 text-[#1565C0]">
            Click anywhere on India to inspect the local climate exposure profile and get a full habitability report.
          </p>
        </div>
        <div className="flex flex-col items-end gap-2">
          {/* Live Pulse in vibrant Sky Blue */}
          <div className="rounded-full border border-[#0288D1]/40 bg-[#0288D1]/10 px-3 py-1 text-xs font-bold text-[#0288D1] whitespace-nowrap animate-pulse">
            ● Live pulse
          </div>
          {/* Loading Badge in Deep Orange for contrast */}
          {isLoading && (
            <div className="rounded-full border border-[#D84315]/40 bg-[#D84315]/10 px-3 py-1 text-xs font-bold text-[#D84315] whitespace-nowrap">
              ⏳ Analysing...
            </div>
          )}
        </div>
      </div>

      {/* INNER MAP CANVAS: Clean Ice Blue acting as the "water" base */}
      <div className="mt-6 flex-1 rounded-[28px] border border-[#90CAF9] bg-[#F4FAFF] shadow-[inset_0_4px_15px_rgba(0,0,0,0.05)] relative flex flex-col overflow-hidden">
        
        <div className="relative flex-1 min-h-[400px]">
          <style>{`
            .leaflet-container { background: #F4FAFF !important; }
            .leaflet-tile-pane { 
              mix-blend-mode: multiply; 
              filter: contrast(1.05) brightness(0.98);
            }
            .leaflet-control-zoom a {
              background: #ffffff !important;
              color: #0288D1 !important;
              border-color: #BBDEFB !important;
            }
            .leaflet-control-zoom a:hover {
              background: #E3F2FD !important;
              color: #08306B !important;
            }
            /* Popups match the clean, bright aesthetic */
            .leaflet-popup-content-wrapper {
              background: #ffffff !important;
              color: #08306B !important;
              border: 1px solid #90CAF9 !important;
              border-radius: 12px !important;
              box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1) !important;
            }
            .leaflet-popup-tip {
              background: #ffffff !important;
            }
            .leaflet-attribution-flag { display: none !important; }
            .leaflet-control-attribution {
              background: rgba(244, 250, 255, 0.8) !important;
              color: #1565C0 !important;
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
              url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
              attribution='&copy; <a href="https://carto.com/">CARTO</a>'
            />

            <ClickHandler onClickMap={handleMapClick} />

            {currentPin && (
              <Marker position={currentPin} icon={redIcon}>
                <Popup>
                  <div className="text-xs">
                    <div className="font-bold text-[#D84315] mb-1">📍 Selected Location</div>
                    <div className="font-medium text-[#0D47A1]">Lat: {currentPin[0].toFixed(4)}</div>
                    <div className="font-medium text-[#0D47A1]">Lng: {currentPin[1].toFixed(4)}</div>
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
                    <div className="font-bold text-[#0288D1] mb-1">
                      👤 {story.author_name}
                    </div>
                    <div className="text-[#D84315] font-semibold mb-1 uppercase tracking-wider text-[10px]">📍 {story.location}</div>
                    <div className="text-[#1565C0] font-medium leading-4 mt-2">{story.story_text}</div>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>

          {/* Floating Overlays */}
          {currentPin && (
            <div className="absolute bottom-4 left-4 z-[1000] rounded-2xl border border-[#D84315]/40 bg-white/95 px-3 py-2 text-xs font-bold text-[#D84315] backdrop-blur-sm pointer-events-none shadow-md">
              📍 {currentPin[0].toFixed(4)}, {currentPin[1].toFixed(4)}
            </div>
          )}

          {hoveredStory && (
            <div className="absolute top-4 right-4 z-[1000] rounded-2xl border border-[#0288D1]/40 bg-white/95 px-3 py-2 text-xs font-bold text-[#0288D1] backdrop-blur-sm max-w-[200px] pointer-events-none shadow-md">
              💬 {hoveredStory.author_name} — {hoveredStory.location}
            </div>
          )}

          {!currentPin && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[1000] rounded-full border border-[#90CAF9] bg-white/95 px-4 py-2 text-xs font-bold text-[#1565C0] backdrop-blur-sm pointer-events-none whitespace-nowrap shadow-md">
              🖱️ Click anywhere on the map to analyse
            </div>
          )}
        </div>

        {/* Legend */}
        <div className="p-4 grid grid-cols-2 gap-3 sm:grid-cols-4 text-xs font-bold text-[#1565C0] border-t border-[#90CAF9]/50 bg-[#E3F2FD]">
          <div className="flex items-center gap-2 rounded-lg border border-[#D84315]/20 bg-[#D84315]/10 p-2">
            <div className="h-2 w-2 rounded-full bg-[#D84315]" />
            <span>Selected pin</span>
          </div>
          <div className="flex items-center gap-2 rounded-lg border border-[#0288D1]/40 bg-[#0288D1]/10 p-2">
            <div className="h-2 w-2 rounded-full bg-[#0288D1]" />
            <span>Community story</span>
          </div>
          <div className="flex items-center gap-2 rounded-lg border border-[#6B8E23]/30 bg-[#6B8E23]/10 p-2">
            <div className="h-2 w-2 rounded-full bg-[#6B8E23]" />
            <span>Safe zone</span>
          </div>
          <div className="flex items-center gap-2 rounded-lg border border-[#F4A261]/20 bg-[#F4A261]/10 p-2">
            <div className="h-2 w-2 rounded-full bg-[#F4A261]" />
            <span>Caution zone</span>
          </div>
        </div>
      </div>
    </section>
  )
}