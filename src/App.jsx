import React, { useState, useEffect } from 'react';
import MetricsPanel from './components/MetricsPanel';
import MapView from './components/MapView';
import { analyzeLocation } from './apiClient';

export default function App() {
  // --- CORE STATE & LOGIC ---
  const [climateData, setClimateData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedPosition, setSelectedPosition] = useState(null);

  // Auto-load Delhi coordinates on startup
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

  // --- UI RENDER ---
  return (
    <div className="min-h-screen bg-bg-panel text-slate-200 selection:bg-brand-cyan/20 selection:text-white p-4 md:p-8">
      
      {/* Centered Main Header */}
      <header className="text-center mb-10 border-b border-slate-800 pb-6">
        <h1 className="text-5xl font-extrabold tracking-tighter text-white animate-fade-in">
          Climate OS
        </h1>
        <p className="text-xs font-mono uppercase tracking-widest text-slate-500 mt-2">
          Vanguard Earth: Premium analytics for survival intelligence
        </p>
        
        {/* Futuristic Tab Navigation */}
        <nav className="flex justify-center gap-1.5 mt-8 bg-bg-card p-1 rounded-full border border-slate-800 w-fit mx-auto shadow-sm">
          {['Dashboard', 'Reports', 'Map', 'Stories'].map(tab => (
            <button key={tab} className="px-5 py-2 text-xs font-mono uppercase tracking-wider rounded-full hover:bg-slate-700/50 hover:text-white transition">
              {tab}
            </button>
          ))}
        </nav>
      </header>

      {/* Main Grid Layout */}
      <main className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Left Column (Main Metrics & Map) */}
        <div className="lg:col-span-3 space-y-8">
          {/* Passed the live data props to MetricsPanel */}
          <MetricsPanel data={climateData} isLoading={loading} error={error} />
          
          {/* Map view component hooked up to state */}
          <div className="min-h-[400px]">
             <MapView onLocationSelect={handleLocationSelect} currentPin={selectedPosition} />
          </div>
        </div>

        {/* Right Sidebar (Forms / Chat / Feeds) */}
        <div className="space-y-8 lg:col-span-1">
          {/* Component for Live Story Feed */}
          <section className="p-6 bg-bg-card border border-slate-800 rounded-2xl animate-fade-in shadow-sm">
            <h3 className="text-sm font-semibold tracking-wider font-mono text-brand-amber flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-brand-amber animate-pulse"></div>
              Live Story Feed
            </h3>
            <div className="mt-5 space-y-4 text-xs text-slate-400 font-mono">
              <p>Backend driven: Failed to fetch (Placeholder)</p>
            </div>
          </section>

          {/* Component for Story Submission Form */}
          <section className="p-6 bg-bg-card border border-slate-800 rounded-2xl animate-fade-in shadow-sm">
            <h3 className="text-sm font-semibold tracking-wider font-mono text-slate-300">Submit a Story</h3>
            <form className="mt-5 space-y-3">
              <input type="text" placeholder="Author name" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-brand-cyan" />
              <input type="text" placeholder="Location" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-brand-cyan" />
              <textarea placeholder="Share your survival story..." rows="3" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-brand-cyan"></textarea>
              <button type="submit" className="w-full bg-brand-cyan/10 hover:bg-brand-cyan/20 text-brand-cyan border border-brand-cyan/30 text-xs uppercase tracking-wider py-2 rounded-lg transition active:scale-95">Submit intelligence</button>
            </form>
          </section>
        </div>
      </main>
    </div>
  );
}