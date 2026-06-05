import React, { useState, useEffect } from 'react';
import 'leaflet/dist/leaflet.css';
import MetricsPanel from './components/MetricsPanel';
import MapView from './components/MapView';
import StoryForm from './components/StoryForm';
import StoryList from './components/StoryList';
import { analyzeLocation, getStories } from './apiClient';
import ClimateReporter from './components/ClimateReporter';

export default function App() {
  const [climateData, setClimateData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedPosition, setSelectedPosition] = useState(null);
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [selectedStoryId, setSelectedStoryId] = useState(null);
  const [stories, setStories] = useState([]);

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

  const renderContent = () => {
    if (activeTab === 'Dashboard') {
      return (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 animate-fade-in">
          <div className="lg:col-span-3 space-y-8">
            <MetricsPanel data={climateData} isLoading={loading} error={error} />
            {/* Added a light border and shadow here for the map container */}
            <div className="h-[500px] w-full rounded-3xl overflow-hidden border border-stone-300 shadow-md">
              <MapView
                onLocationSelect={handleLocationSelect}
                currentPin={selectedPosition}
                stories={stories}
              />
            </div>
          </div>
          <div className="space-y-8 lg:col-span-1">
            <StoryList
              selectedStoryId={selectedStoryId}
              onSelectStory={setSelectedStoryId}
            />
            <StoryForm
              latitude={selectedPosition?.[0] || null}
              longitude={selectedPosition?.[1] || null}
              onSubmitted={handleStorySubmitted}
            />
          </div>
        </div>
      );
    }

    if (activeTab === 'Map') {
      return (
        <div className="animate-fade-in space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-stone-900">Global Radar</h2>
              <p className="text-stone-500 text-sm mt-1">
                Select any point on India to run a real-time Vanguard Engine analysis.
              </p>
            </div>
            {selectedPosition && (
              <div className="bg-white border border-stone-300 px-4 py-2 rounded-xl text-sm font-mono text-emerald-700 shadow-sm">
                LAT: {selectedPosition[0].toFixed(4)} | LNG: {selectedPosition[1].toFixed(4)}
              </div>
            )}
          </div>

          {(climateData || loading || error) && (
            <MetricsPanel data={climateData} isLoading={loading} error={error} />
          )}

          <div className="h-[65vh] rounded-3xl overflow-hidden border border-stone-300 shadow-xl">
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
    // Gradient remains anchored at amber-700 for the earthy depth.
    <div className="min-h-screen bg-amber-700 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-amber-200 via-amber-500 to-amber-700 text-amber-950 selection:bg-emerald-600 selection:text-white transition-colors duration-500 relative overflow-hidden">
      
      {/* Wood Grain Overlay: Reduced to 0.08—barely a suggestion of texture for maximum visual clarity */}
      <div 
        className="absolute inset-0 opacity-[0.08] pointer-events-none mix-blend-multiply" 
        style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/wood-pattern.png')" }}
      ></div>

      {/* Main Content Container */}
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