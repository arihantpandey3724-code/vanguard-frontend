import React, { useState, useEffect } from 'react';
import 'leaflet/dist/leaflet.css';
import MetricsPanel from './components/MetricsPanel';
import MapView from './components/MapView';
import StoryForm from './components/StoryForm';
import StoryList from './components/StoryList';
import { analyzeLocation, getStories } from './apiClient';
import ClimateReporter from './components/ClimateReporter';
import LiveWeatherWidget from './components/LiveWeatherWidget';

export default function App() {
  const [climateData, setClimateData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedPosition, setSelectedPosition] = useState(null);
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [selectedStoryId, setSelectedStoryId] = useState(null);
  const [stories, setStories] = useState([]);

  // --- NEW: Dashboard Geolocation States ---
  const [isLocating, setIsLocating] = useState(false);
  const [geoError, setGeoError] = useState(null);

  useEffect(() => {
    handleLocationSelect(28.6139, 77.2090);
    fetchStories();
  }, []);

  const fetchStories = async () => {
    try {
      const res = await getStories();
      setStories(res.stories || []);
    } catch {
      setStories([]);
    }
  };

  const handleLocationSelect = async (lat, lng) => {
    setSelectedPosition([lat, lng]);
    setLoading(true);
    setError(null);
    try {
      const data = await analyzeLocation(lat, lng);
      setClimateData(data);
    } catch (err) {
      setError("Failed to connect to the Vanguard Engine. Ensure the backend is running.");
    } finally {
      setLoading(false);
    }
  };

  const handleStorySubmitted = () => {
    fetchStories();
  };

  // --- NEW: HTML5 Geolocation Logic for the Dashboard ---
  const handleLiveLocation = () => {
    setGeoError(null);

    if (!navigator.geolocation) {
      setGeoError("Geolocation is not supported by your browser.");
      return;
    }

    setIsLocating(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setIsLocating(false);
        // This single call updates the Weather Widget, the Map, and the Metrics Panel!
        handleLocationSelect(position.coords.latitude, position.coords.longitude);
      },
      (error) => {
        setIsLocating(false);
        setGeoError("Location permission denied. Please allow access.");
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const renderContent = () => {
   if (activeTab === 'Dashboard') {
      return (
        <div className="w-full px-8 animate-fade-in pb-12 space-y-6">
          
          {/* --- NEW: Dashboard Header & Live Button --- */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-2">
            <div>
              <h2 className="text-2xl font-bold text-[#2C1E16]">Command Center</h2>
              <p className="text-sm font-medium text-stone-600 mt-1">Real-time local climate telemetry</p>
            </div>
            
            <div className="flex flex-col items-end">
              <button
                onClick={handleLiveLocation}
                disabled={isLocating}
                className="flex items-center gap-2 text-xs uppercase tracking-widest font-bold px-4 py-2 rounded-full border-2 border-emerald-700/30 bg-emerald-700/10 text-emerald-800 hover:bg-emerald-700/20 transition-all active:scale-95 disabled:opacity-50 shadow-sm"
              >
                {isLocating ? (
                  <>
                    <div className="w-2 h-2 bg-emerald-700 rounded-full animate-ping"></div>
                    SCANNING GPS...
                  </>
                ) : (
                  '📍 DETECT LOCAL METRICS'
                )}
              </button>
              {geoError && <p className="text-[10px] text-rose-600 font-bold mt-2 uppercase">{geoError}</p>}
            </div>
          </div>

          {/* LIVE WEATHER WIDGET */}
          <LiveWeatherWidget 
            latitude={selectedPosition?.[0]} 
            longitude={selectedPosition?.[1]} 
          />

          {/* HARDCODED FACT SECTION */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
            <div className="bg-stone-50 border border-stone-200 p-6 rounded-3xl shadow-sm hover:shadow-md transition-shadow">
              <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Displacement Reality</p>
              <p className="text-stone-700 mt-3 text-sm leading-relaxed">Up to 40 Million people in South Asia could be forced to relocate internally by 2050 as rural livelihoods unravel.</p>
            </div>
            <div className="bg-stone-50 border border-stone-200 p-6 rounded-3xl shadow-sm hover:shadow-md transition-shadow">
              <p className="text-[10px] font-bold text-rose-600 uppercase tracking-widest">Lethal Thresholds</p>
              <p className="text-stone-700 mt-3 text-sm leading-relaxed">Global temperatures have risen 1.2°C - 1.4°C. When daytime temperatures breach 45°C and humidity spikes, the human body cannot cool itself.</p>
            </div>
            <div className="bg-stone-50 border border-stone-200 p-6 rounded-3xl shadow-sm hover:shadow-md transition-shadow">
              <p className="text-[10px] font-bold text-amber-600 uppercase tracking-widest">Water Crisis</p>
              <p className="text-stone-700 mt-3 text-sm leading-relaxed">The deepest catalyst for displacement is water scarcity. India is drawing down aquifers at unsustainable rates.</p>
            </div>
          </div>

        </div>
      );
    }

    if (activeTab === 'Map') {
      return (
        <div className="animate-fade-in space-y-6 flex flex-col items-center">
          
          <div className="text-center w-full">
            <h2 className="text-2xl font-semibold text-stone-900">Global Radar</h2>
            <p className="text-stone-500 text-sm mt-1">
              Select any point on India to run a real-time Vanguard Engine analysis.
            </p>
            {selectedPosition && (
              <div className="inline-block mt-3 bg-white border border-stone-300 px-4 py-2 rounded-xl text-sm font-mono text-emerald-700 shadow-sm">
                LAT: {selectedPosition[0].toFixed(4)} | LNG: {selectedPosition[1].toFixed(4)}
              </div>
            )}
          </div>

          {(climateData || loading || error) && (
            <div className="w-full max-w-4xl">
              <MetricsPanel data={climateData} isLoading={loading} error={error} />
            </div>
          )}

          <div className="h-[65vh] w-full max-w-6xl rounded-3xl overflow-hidden border border-stone-300 shadow-xl">
            <MapView
              onLocationSelect={handleLocationSelect}
              currentPin={selectedPosition}
              stories={stories}
            />
          </div>
        </div>
      );
    }

    if (activeTab === 'Stories') {
      return (
        <div className="animate-fade-in max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="bg-white border border-stone-200 p-6 rounded-3xl shadow-sm">
              <h2 className="text-xl font-semibold text-stone-900 mb-2">Submit Intel</h2>
              <p className="text-stone-500 text-sm mb-6">
                Your survival strategies are verified by AI before joining the global database.
              </p>
              <StoryForm
                latitude={selectedPosition?.[0] || null}
                longitude={selectedPosition?.[1] || null}
                onSubmitted={handleStorySubmitted}
                onLocationSelect={handleLocationSelect} 
              />
            </div>
          </div>
          <div>
            <StoryList
              selectedStoryId={selectedStoryId}
              onSelectStory={setSelectedStoryId}
            />
          </div>
        </div>
      );
    }

    if (activeTab === 'Reports') {
      return <ClimateReporter />;
    }
  };

  return (
    <div className="min-h-screen bg-amber-700 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-amber-200 via-amber-500 to-amber-700 text-amber-950 selection:bg-emerald-600 selection:text-white transition-colors duration-500 relative overflow-hidden">
      
      <div 
        className="absolute inset-0 opacity-[0.08] pointer-events-none mix-blend-multiply" 
        style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/wood-pattern.png')" }}
      ></div>

      <div className="relative z-10 p-4 md:p-8">
        <header className="text-center mb-10 border-b border-amber-950/10 pb-6">
          <h1 className="text-5xl font-extrabold tracking-tighter text-[#2C1E16] animate-fade-in drop-shadow-sm">
            VanGuard Earth
          </h1>
          <nav className="flex justify-center gap-1.5 mt-8 bg-[#2C1E16]/5 backdrop-blur-md p-1 rounded-full border border-amber-950/10 w-fit mx-auto shadow-sm">
            {['Dashboard', 'Reports', 'Map', 'Stories'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-2 text-xs font-mono uppercase tracking-wider rounded-full transition duration-300 ${
                  activeTab === tab
                    ? 'bg-[#2C1E16] text-amber-50 shadow-inner scale-105 font-bold'
                    : 'hover:bg-[#2C1E16]/10 hover:text-[#2C1E16] text-[#5C4B3C] font-semibold'
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </header>

        <main>
          {renderContent()}
        </main>
      </div>
    </div>
  );
}