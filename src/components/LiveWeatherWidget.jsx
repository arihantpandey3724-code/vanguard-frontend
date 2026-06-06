import React, { useState, useEffect } from 'react';

export default function LiveWeatherWidget({ latitude, longitude }) {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Only fetch if we have valid coordinates
    if (!latitude || !longitude) return;

    const fetchLiveWeather = async () => {
      setLoading(true);
      try {
        // UPGRADED API URL: Added apparent_temperature and cloud_cover
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,cloud_cover,wind_speed_10m`;
        const res = await fetch(url);
        const data = await res.json();
        setWeather(data.current);
      } catch (error) {
        console.error("Failed to fetch live weather telemetry.", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLiveWeather();
  }, [latitude, longitude]);

  // Loading State
  if (loading || !weather) {
    return (
      <div className="w-full bg-stone-50/80 border border-stone-200/60 rounded-3xl p-6 min-h-[140px] flex items-center justify-center shadow-sm">
        <div className="flex items-center gap-3 text-stone-500 font-medium text-sm">
          <div className="w-4 h-4 border-2 border-stone-400 border-t-emerald-600 rounded-full animate-spin"></div>
          SYNCING SATELLITE TELEMETRY...
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-stone-50 border border-stone-200 rounded-3xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-5 border-b border-stone-200/80 pb-4">
        <h3 className="text-sm font-bold text-[#162B22] uppercase tracking-widest flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          Live Atmospheric Data
        </h3>
        <p className="text-[10px] font-mono text-stone-400 uppercase">
          LAT: {latitude.toFixed(4)} | LNG: {longitude.toFixed(4)}
        </p>
      </div>

      {/* UPGRADED GRID: 3 Columns for 6 Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        
        {/* Actual Temperature */}
        <div className="bg-white rounded-2xl p-4 border border-stone-100 shadow-sm transition-transform hover:scale-[1.02]">
          <p className="text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-1">Temperature</p>
          <p className="text-3xl font-extrabold text-[#2C1E16]">
            {weather.temperature_2m}<span className="text-lg text-stone-400 ml-0.5">°C</span>
          </p>
        </div>

        {/* Apparent (Feels Like) Temperature */}
        <div className="bg-white rounded-2xl p-4 border border-stone-100 shadow-sm transition-transform hover:scale-[1.02]">
          <p className="text-[10px] font-bold text-rose-500/70 uppercase tracking-wider mb-1">Feels Like</p>
          <p className="text-3xl font-extrabold text-rose-900">
            {weather.apparent_temperature}<span className="text-lg text-rose-400 ml-0.5">°C</span>
          </p>
        </div>

        {/* Humidity */}
        <div className="bg-white rounded-2xl p-4 border border-stone-100 shadow-sm transition-transform hover:scale-[1.02]">
          <p className="text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-1">Humidity</p>
          <p className="text-3xl font-extrabold text-[#162B22]">
            {weather.relative_humidity_2m}<span className="text-lg text-stone-400 ml-0.5">%</span>
          </p>
        </div>

        {/* Precipitation */}
        <div className="bg-white rounded-2xl p-4 border border-stone-100 shadow-sm transition-transform hover:scale-[1.02]">
          <p className="text-[10px] font-bold text-sky-600/70 uppercase tracking-wider mb-1">Precipitation</p>
          <p className="text-3xl font-extrabold text-[#006064]">
            {weather.precipitation}<span className="text-lg text-sky-600/50 ml-0.5">mm</span>
          </p>
        </div>

        {/* Cloud Cover */}
        <div className="bg-white rounded-2xl p-4 border border-stone-100 shadow-sm transition-transform hover:scale-[1.02]">
          <p className="text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-1">Cloud Cover</p>
          <p className="text-3xl font-extrabold text-stone-600">
            {weather.cloud_cover}<span className="text-lg text-stone-400 ml-0.5">%</span>
          </p>
        </div>

        {/* Wind Speed */}
        <div className="bg-white rounded-2xl p-4 border border-stone-100 shadow-sm transition-transform hover:scale-[1.02]">
          <p className="text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-1">Wind Speed</p>
          <p className="text-3xl font-extrabold text-stone-700">
            {weather.wind_speed_10m}<span className="text-lg text-stone-400 ml-0.5">km/h</span>
          </p>
        </div>

      </div>
    </div>
  );
}