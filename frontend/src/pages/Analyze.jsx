import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Analyze() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError("");
        const fileId = localStorage.getItem('file_id');
        if (!fileId) {
          throw new Error("S_SESSION_MISSING: No map session found. Please establish uplink.");
        }
        const response = await fetch(`http://127.0.0.1:8000/analyze?file_id=${fileId}`);

        if (!response.ok) {
          throw new Error("A_DATA_REJECTION: Remote node failed to return telemetry.");
        }

        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err.message || "E_PROTOCOL_ERROR: Land usage parsing failed.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f131d] flex flex-col items-center justify-center p-6">
        <div className="absolute inset-0 bg-grid-mesh opacity-10 pointer-events-none"></div>
        <div className="relative">
           <div className="w-24 h-24 border-2 border-[#4edea3]/20 rounded-full animate-spin border-t-[#4edea3]"></div>
           <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-2 h-2 bg-[#4edea3] rounded-full animate-pulse"></div>
           </div>
        </div>
        <p className="mt-8 text-hud text-[#4edea3] animate-pulse">PARSING SECTOR TELEMETRY...</p>
        <p className="mt-2 text-[10px] font-mono text-[#bbcabf]">NEURAL_ENGINE // THRESHOLD_CALIBRATION</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0f131d] flex items-center justify-center p-6">
        <div className="hud-glass p-12 max-w-md w-full border-red-500/20 text-center rounded-2xl">
          <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6 text-red-500">
             <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
             </svg>
          </div>
          <span className="text-hud text-red-400 mb-2 block">System Alert</span>
          <h2 className="text-2xl font-bold font-['Space_Grotesk'] mb-4 uppercase tracking-tight text-[#dfe2f1]">Operation Failed</h2>
          <p className="text-[#bbcabf] text-sm mb-8 font-mono">{error}</p>
          <button onClick={() => navigate("/upload")} className="btn-secondary w-full">RE-ESTABLISH UPLINK</button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-[#0f131d] pt-32 pb-20 px-6 lg:px-12">
      <div className="absolute inset-0 bg-grid-mesh opacity-10 pointer-events-none"></div>
      <div className="scanline"></div>

      <div className="max-w-[1440px] mx-auto relative z-10">
        {/* Header */}
        <div className="mb-16 flex flex-col md:flex-row md:items-end justify-between border-b border-white/5 pb-8">
           <div className="max-w-2xl">
              <div className="inline-flex items-center space-x-2 px-3 py-1 bg-[#4edea3]/10 border border-[#4edea3]/30 rounded-md mb-4">
                 <span className="text-[10px] font-mono text-[#4edea3] font-bold uppercase tracking-widest">Analysis Protocol Active</span>
              </div>
              <h1 className="text-5xl md:text-6xl font-bold font-['Space_Grotesk'] tracking-tight">LAND-USE <br /> <span className="text-[#4edea3]">TAXONOMY.</span></h1>
           </div>
           <div className="mt-6 md:mt-0 text-right">
              <span className="text-hud text-[#bbcabf]">Status Update</span>
              <p className="text-lg font-bold font-['Space_Grotesk'] text-[#4edea3]">SUCCESSFUL // FINAL_PARSE</p>
           </div>
        </div>

        {/* Metrics Grid */}
        {data && (
           <div className="grid md:grid-cols-3 gap-8 mb-16">
              <DataGauge 
                label="Biomass Density" 
                value={data.green_cover || "0%"} 
                color="#4edea3" 
                sub="Active Photosynthesis" 
              />
              <DataGauge 
                label="Structure Volume" 
                value={data.buildings || "0%"} 
                color="#dfe2f1" 
                sub="Concrete Infrastructure" 
              />
              <DataGauge 
                label="Transportation Grid" 
                value={data.roads || "0%"} 
                color="#d0bcff" 
                sub="Asphalt / Connectivity" 
              />
           </div>
        )}

        {/* Neural Note */}
        {data?.note && (
           <div className="hud-glass p-8 border-[#4edea3]/20 rounded-2xl mb-16 flex items-start gap-6">
              <div className="w-12 h-12 bg-[#4edea3]/10 rounded-lg flex items-center justify-center flex-shrink-0 text-[#4edea3]">
                 <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.989-2.386l-.548-.547z" />
                 </svg>
              </div>
              <div className="pt-1">
                 <span className="text-hud text-[#4edea3] mb-2 block tracking-widest">Neural Observation</span>
                 <p className="text-[#bbcabf] font-light leading-relaxed max-w-4xl text-lg">
                    {data.note}
                 </p>
              </div>
           </div>
        )}

        {/* Module Controls */}
        <div className="hud-card p-1 border-white/5">
           <div className="bg-[#0a0e18] p-8 rounded-md flex flex-wrap justify-between items-center gap-6">
              <div className="space-y-1">
                 <span className="text-hud text-[#bbcabf]">Available Sub-Systems</span>
                 <h3 className="text-xl font-bold font-['Space_Grotesk'] text-[#dfe2f1]">Initialize Operation Modules</h3>
              </div>
              <div className="flex flex-wrap gap-4">
                 <button onClick={() => navigate("/heatmap")} className="btn-secondary px-8 border-orange-500/40 text-orange-400 hover:bg-orange-500/10 hover:shadow-orange-500/20">THERMAL VISION</button>
                 <button onClick={() => navigate("/optimize")} className="btn-secondary px-8 border-purple-500/40 text-purple-400 hover:bg-purple-500/10 hover:shadow-purple-500/20">NEURAL OPTIMIZER</button>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}

function DataGauge({ label, value, color, sub }) {
  // Convert percentage string to number for the bar
  const pct = parseInt(value) || 0;

  return (
    <div className="hud-card p-10 border-white/5 group hover:border-white/20 transition-all duration-500">
       <div className="flex justify-between items-start mb-8">
          <div className="space-y-1">
             <span className="text-hud text-[#bbcabf]">{label}</span>
             <p className="text-xs text-[#bbcabf]/50 font-mono">{sub}</p>
          </div>
          <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center p-2">
             <div className="w-full h-full rounded-full border-2 border-dashed border-white/10 animate-spin-slow"></div>
          </div>
       </div>

       <div className="mb-6">
          <span className="text-6xl font-bold font-['Space_Grotesk']" style={{ color: color }}>{value}</span>
       </div>

       {/* Visual indicator bar */}
       <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden relative">
          <div 
             className="h-full transition-all duration-1000 ease-out" 
             style={{ width: `${pct}%`, backgroundColor: color, boxShadow: `0 0 10px ${color}80` }}
          ></div>
       </div>
    </div>
  );
}
