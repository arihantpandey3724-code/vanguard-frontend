import React, { useState } from 'react';

export default function ClimateReporter() {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchReport = async (loc) => {
    setLoading(true);
    const res = await fetch('http://127.0.0.1:8000/api/generate-report', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ location: loc })
    });
    setReport(await res.json());
    setLoading(false);
  };

  return (
    <div className="p-6 text-white">
      <h2 className="text-2xl mb-4">Climate Intelligence Dashboard</h2>
      {/* Input trigger here */}
      <button onClick={() => fetchReport("Jaunpur")} className="bg-brand-cyan p-2 rounded">Get Report</button>
      
      {report && (
        <div className="grid grid-cols-1 gap-4 mt-6">
          <div className="bg-slate-800 p-4 rounded-xl"> {/* Trend Window */}
            <h3>Trend: {report.trend_analysis.summary}</h3>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-700 p-4 rounded-xl"> {/* Individual */}
              <h4>Individual Actions</h4>
              {report.individual_actions.map(a => <p>• {a}</p>)}
            </div>
            <div className="bg-slate-700 p-4 rounded-xl"> {/* Authority */}
              <h4>Authority Actions</h4>
              {report.authority_actions.map(a => <p>• {a}</p>)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}