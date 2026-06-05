import React, { useState, useEffect } from 'react';
import MetricsPanel from './components/MetricsPanel';
import MapView from './components/MapView';
import StoryForm from './components/StoryForm';
import StoryList from './components/StoryList';
import { analyzeLocation } from './apiClient';

export default function App() {
  const [climateData, setClimateData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedPosition, setSelectedPosition] = useState(null);
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [selectedStoryId, setSelectedStoryId] = useState(null);

  useEffect(() => {
    handleLocationSelect(28.6139, 77.2090);
  }, []);

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

  // --- UPGRADED TAB LOGIC ---
  const renderContent = () => {
    
    // 1. DASHBOARD TAB
    if (activeTab === 'Dashboard') {
      return (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 animate-fade-in">
          <div className="lg:col-span-3 space-y-8">
            <MetricsPanel data={climateData} isLoading={loading} error={error} />
            <div className="min-h-[400px]">
               <MapView onLocationSelect={handleLocationSelect} currentPin={selectedPosition} />
            </div>
          </div>

          <div className="space-y-8 lg:col-span-1">
            <StoryList 
              selectedStoryId={selectedStoryId} 
              onSelectStory={setSelectedStoryId} 
            />
            <StoryForm 
              latitude={selectedPosition ? selectedPosition[0] : null} 
              longitude={selectedPosition ? selectedPosition[1] : null} 
            />
          </div>
        </div>
      );
    }

    // 2. MAP TAB (Full Screen View)
    if (activeTab === 'Map') {
      return (
        <div className="animate-fade-in space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-white">Global Radar</h2>
              <p className="text-slate-400 text-sm mt-1">Select any point on Earth to run a real-time Vanguard Engine analysis.</p>
            </div>
            {selectedPosition && (
               <div className="bg-slate-800/50 border border-slate-700 px-4 py-2 rounded-xl text-sm font-mono text-brand-cyan">
                 LAT: {selectedPosition[0].toFixed(4)} | LNG: {selectedPosition[1].toFixed(4)}
               </div>
            )}
          </div>
          <div className="h-[65vh] rounded-3xl overflow-hidden border border-slate-700 shadow-2xl">
             <MapView onLocationSelect={handleLocationSelect} currentPin={selectedPosition} />
          </div>
        </div>
      );
    }

    // 3. STORIES TAB (Dedicated Feed)
    if (activeTab === 'Stories') {
      return (
        <div className="animate-fade-in max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
           <div className="space-y-6">
              <div className="bg-brand-cyan/10 border border-brand-cyan/30 p-6 rounded-3xl">
                <h2 className="text-xl font-semibold text-white mb-2">Submit Intel</h2>
                <p className="text-slate-400 text-sm mb-6">Your survival strategies are verified by AI before joining the global database.</p>
                <StoryForm 
                  latitude={selectedPosition ? selectedPosition[0] : null} 
                  longitude={selectedPosition ? selectedPosition[1] : null} 
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

    // 4. REPORTS TAB (Holding space for the AI Chatbot)
    if (activeTab === 'Reports') {
      return (
        <div className="flex flex-col items-center justify-center h-[50vh] border border-slate-800 border-dashed rounded-3xl animate-fade-in bg-bg-card/50">
          <div className="h-3 w-3 rounded-full bg-brand-cyan mb-4 animate-ping"></div>
          <p className="text-slate-400 font-mono uppercase tracking-widest">
            AI Assistant Module offline. Awaiting Chatbot connection...
          </p>
        </div>
      );
    }
  };

  return (
    <div className="min-h-screen bg-bg-panel text-slate-200 selection:bg-brand-cyan/20 selection:text-white p-4 md:p-8">
      <header className="text-center mb-10 border-b border-slate-800 pb-6">
        <h1 className="text-5xl font-extrabold tracking-tighter text-white animate-fade-in">
          Climate OS
        </h1>
        <p className="text-xs font-mono uppercase tracking-widest text-slate-500 mt-2">
          Vanguard Earth: Premium analytics for survival intelligence
        </p>
        
        <nav className="flex justify-center gap-1.5 mt-8 bg-bg-card p-1 rounded-full border border-slate-800 w-fit mx-auto shadow-sm">
          {['Dashboard', 'Reports', 'Map', 'Stories'].map(tab => (
            <button 
              key={tab} 
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2 text-xs font-mono uppercase tracking-wider rounded-full transition duration-300 ${
                activeTab === tab 
                  ? 'bg-slate-700 text-white shadow-inner scale-105' 
                  : 'hover:bg-slate-800 hover:text-white text-slate-500'
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
  );
}