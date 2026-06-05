import React, { useState } from 'react';
import { generateReport } from '../apiClient';

export default function ClimateReporter() {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState("");

  const fetchReport = async () => {
    if (!location) return;
    setLoading(true);
    try {
      const data = await generateReport(location);
      setReport(data);
    } catch (err) {
      console.error("Report error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 text-white">
      <h2 className="text-2xl mb-4">Climate Intelligence Dashboard</h2>
      <div className="flex gap-2 mb-4">
        <input 
          type="text"
          placeholder="Enter location..."
          className="bg-slate-800 p-2 rounded text-white border border-slate-600"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
        <button 
          onClick={fetchReport} 
          className="bg-brand-cyan text-black px-4 py-2 rounded font-bold"
        >
          {loading ? "Analyzing..." : "Get Report"}
        </button>
      </div>
      
      {report && report.trend_analysis && (
        <div className="grid grid-cols-1 gap-4 mt-6">
          <div className="bg-slate-800 p-4 rounded-xl">
            <h3>Trend: {report.trend_analysis?.summary}</h3>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-700 p-4 rounded-xl">
              <h4>Individual Actions</h4>
              {report.individual_actions?.map((a, i) => <p key={i}>• {a}</p>)}
            </div>
            <div className="bg-slate-700 p-4 rounded-xl">
              <h4>Authority Actions</h4>
              {report.authority_actions?.map((a, i) => <p key={i}>• {a}</p>)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}