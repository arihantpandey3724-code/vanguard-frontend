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
    <div className="mx-auto max-w-5xl animate-fade-in">
      {/* Main Report Container */}
      <div className="rounded-[30px] border border-[#162B22]/15 bg-[#F4F3EE] p-6 md:p-10 shadow-lg backdrop-blur-md">
        
        {/* Header Section */}
        <div className="mb-8">
          <p className="text-xs uppercase tracking-[0.35em] text-[#6B8E23] font-bold">Vanguard Intelligence</p>
          <h2 className="mt-2 text-3xl font-semibold text-[#162B22]">Climate Reporter</h2>
          <p className="mt-2 text-sm font-medium text-[#162B22]/70">
            Generate a comprehensive habitability and action report for any specified region.
          </p>
        </div>

        {/* Input & Action Section */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <input 
            type="text"
            placeholder="Enter location (e.g., Coastal Kerala)..."
            className="flex-1 rounded-xl border border-[#162B22]/20 bg-white px-4 py-3 text-sm font-medium text-[#2C1E16] placeholder-[#162B22]/40 transition-colors focus:border-[#6B8E23] focus:outline-none focus:ring-2 focus:ring-[#6B8E23]/20"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && fetchReport()}
          />
          <button 
            onClick={fetchReport} 
            disabled={loading || !location}
            className="whitespace-nowrap rounded-xl bg-[#162B22] px-8 py-3 text-sm font-bold text-white transition-all hover:bg-[#006064] hover:shadow-md active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" opacity="0.25" />
                  <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
                Analyzing...
              </span>
            ) : (
              "Generate Report"
            )}
          </button>
        </div>
        
        {/* Generated Report Data */}
        {report && report.trend_analysis && (
          <div className="mt-8 flex flex-col gap-6 animate-slide-up">
            
            {/* Trend Summary Card - Terracotta Accent */}
            <div className="rounded-2xl border border-[#E07A5F]/30 bg-white p-6 shadow-sm">
              <h3 className="mb-2 text-xs font-bold uppercase tracking-wider text-[#E07A5F]">Trend Analysis</h3>
              <p className="text-lg font-semibold leading-relaxed text-[#2C1E16]">
                {report.trend_analysis?.summary}
              </p>
            </div>

            {/* Actions Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Individual Actions List - Soft Sage Accent */}
              <div className="rounded-2xl border border-[#6B8E23]/30 bg-[#E9EED9] p-6 shadow-sm">
                <h4 className="mb-4 text-sm font-bold uppercase tracking-wider text-[#162B22]">Individual Actions</h4>
                <ul className="space-y-3">
                  {report.individual_actions?.map((action, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm font-medium text-[#2C1E16]">
                      <span className="mt-1.5 flex h-1.5 w-1.5 shrink-0 rounded-full bg-[#6B8E23]"></span>
                      <span className="leading-relaxed">{action}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Authority Actions List - Icy Blue/Oceanic Teal Accent */}
              <div className="rounded-2xl border border-[#006064]/30 bg-[#E0F7FA] p-6 shadow-sm">
                <h4 className="mb-4 text-sm font-bold uppercase tracking-wider text-[#006064]">Authority Actions</h4>
                <ul className="space-y-3">
                  {report.authority_actions?.map((action, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm font-medium text-[#006064]">
                      <span className="mt-1.5 flex h-1.5 w-1.5 shrink-0 rounded-full bg-[#006064]"></span>
                      <span className="leading-relaxed">{action}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
            </div>
          </div>
        )}
      </div>
    </div>
  );
}