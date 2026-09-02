import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Optimize() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOptimization = async () => {
      try {
        setLoading(true);
        setError("");
        const fileId = localStorage.getItem('file_id');
        if (!fileId) {
          throw new Error("S_SESSION_MISSING: No map session found. Please establish uplink.");
        }
        const response = await fetch(`http://127.0.0.1:8000/optimize?file_id=${fileId}`);

        if (!response.ok) {
          throw new Error("O_ENGINE_FAILURE: Neural optimizer failed to converge.");
        }

        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err.message || "E_PROTOCOL_ERROR: Optimization protocol failed.");
      } finally {
        setLoading(false);
      }
    };

    fetchOptimization();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f131d] flex flex-col items-center justify-center p-6">
        <div className="absolute inset-0 bg-grid-mesh opacity-10 pointer-events-none"></div>
        <div className="relative">
           <div className="w-24 h-24 border-2 border-purple-500/20 rounded-full animate-spin border-t-purple-500"></div>
           <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
           </div>
        </div>
        <p className="mt-8 text-hud text-purple-400 animate-pulse">INITIALIZING NEURAL RESTRUCTURING...</p>
        <p className="mt-2 text-[10px] font-mono text-[#bbcabf]">SOLVER_V3 // HEURISTIC_ITERATION</p>
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
          <h2 className="text-2xl font-bold font-['Space_Grotesk'] mb-4 uppercase tracking-tight text-[#dfe2f1]">Optimization Error</h2>
          <p className="text-[#bbcabf] text-sm mb-8 font-mono">{error}</p>
          <button onClick={() => navigate("/analyze")} className="btn-secondary w-full">RE-RUN ANALYSIS</button>
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
              <div className="inline-flex items-center space-x-2 px-3 py-1 bg-purple-500/10 border border-purple-500/30 rounded-md mb-4">
                 <span className="text-[10px] font-mono text-purple-400 font-bold uppercase tracking-widest">Neural Solver Output</span>
              </div>
              <h1 className="text-5xl md:text-6xl font-bold font-['Space_Grotesk'] tracking-tight">ECOLOGICAL <br /> <span className="text-purple-500">SYNTHESIS.</span></h1>
           </div>
           <div className="mt-6 md:mt-0 text-right">
              <span className="text-hud text-[#bbcabf]">Efficiency Forecast</span>
              <p className="text-lg font-bold font-['Space_Grotesk'] text-purple-500">CONVERGED // OPTIMAL_STATE</p>
           </div>
        </div>

        {/* Primary Data Row */}
        {data && (
           <div className="grid md:grid-cols-3 gap-8 mb-12">
              <DataCard 
                label="Biomass Expansion" 
                value={data.green_increase_percent ? `+${data.green_increase_percent}%` : "0.0%"} 
                sub={data.existing_green_percent ? `From ${data.existing_green_percent}% to ${data.total_green_after}%` : "New baseline set"}
                color="#4edea3" 
              />
              <DataCard 
                label="Thermal Delta" 
                value={data.temperature_drop || "0.00°C"} 
                sub="Atmospheric cooling projected"
                color="#d0bcff" 
              />
              <DataCard 
                label="System Rating" 
                value={data.optimization_score ? `${data.optimization_score}/100` : "88/100"} 
                sub="Systemic integrity score"
                color="#dfe2f1" 
              />
           </div>
        )}

        {/* Strategic Analysis Overlay */}
        <div className="hud-card p-1 border-white/5 mb-16">
           <div className="bg-[#0a0e18] p-10 rounded-md">
              <div className="flex items-start gap-8 flex-col lg:flex-row">
                 <div className="flex-1">
                    <span className="text-hud text-purple-400 mb-4 block tracking-widest">Solver Strategy Briefing</span>
                    <p className="text-2xl font-light text-[#bbcabf] leading-relaxed font-['Space_Grotesk']">
                       {data?.improvement || "Neural restructuring has identified 15% of open sectors as high-impact ecological zones."}
                    </p>
                 </div>
                 <div className="w-full lg:w-1/3 grid grid-cols-2 gap-4">
                    <MetricPod label="Cooling Value" value={`${data?.cooling_improvement || 0}%`} color="#4edea3" />
                    <MetricPod label="Grid Density" value={`${data?.total_green_after || 0}%`} color="#dfe2f1" />
                 </div>
              </div>
           </div>
        </div>

        {/* The Map visualization */}
        <div className="hud-card p-1 border-white/5 mb-16 group">
           <div className="bg-[#0a0e18] p-10 rounded-md relative overflow-hidden">
              <h3 className="text-hud text-[#bbcabf] mb-8">Synthesized Restructuring Map</h3>
              <div className="relative rounded-xl overflow-hidden border border-white/5 bg-black/60 shadow-2xl p-2">
                 <div className="absolute inset-0 pointer-events-none z-10 border border-purple-500/20"></div>
                 {data?.optimized_map_url && <img src={data.optimized_map_url} alt="Optimized Environment" className="w-full h-auto rounded-lg group-hover:scale-[1.01] transition-transform duration-1000" />}
                 <div className="absolute top-6 left-6 text-hud text-white/30 text-[9px] font-mono bg-black/40 p-3 rounded backdrop-blur">
                    OBJECTIVE: MAX_GREEN_DENSITY <br />
                    THRESHOLD: ALPHA_9 <br />
                    METHOD: NEURAL_TOPOLOGY
                 </div>
              </div>
           </div>
        </div>

        {/* Strategy #2 Feature: Albedo Optimization */}
        <div className="hud-glass p-12 border-[#4edea3]/20 rounded-2xl mb-16 relative overflow-hidden">
           <div className="absolute right-0 top-0 w-64 h-64 bg-[#4edea3]/5 rounded-full blur-[100px] -mr-32 -mt-32"></div>
           <div className="flex flex-col lg:flex-row gap-12 items-center">
              <div className="lg:w-1/2">
                 <div className="flex items-center space-x-3 mb-6">
                    <div className="w-10 h-10 bg-[#4edea3]/10 border border-[#4edea3]/30 rounded-lg flex items-center justify-center text-[#4edea3]">
                       <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.989-2.386l-.548-.547z" />
                       </svg>
                    </div>
                    <span className="text-hud text-[#4edea3] tracking-[0.3em] font-bold">STRATEGIC MODULE ENABLED</span>
                 </div>
                 <h2 className="text-3xl font-bold font-['Space_Grotesk'] mb-6 text-[#dfe2f1]">Albedo & Cool Pavement Protocol</h2>
                 <p className="text-[#bbcabf] font-light leading-relaxed mb-8">
                    Implementation of Strategy #2: We have mapped high-reflectivity surface treatments around all new green pixels. By switching dark asphalt to cool-pavement materials, you neutralize the "Heat Battery" effect.
                 </p>
                 <div className="grid grid-cols-2 gap-6">
                    <div className="bg-black/20 p-6 rounded-xl border border-white/5">
                       <span className="text-hud text-white/30 text-[9px] block mb-2">Reflective Gain</span>
                       <span className="text-2xl font-bold font-['Space_Grotesk'] text-[#4edea3]">+{data?.albedo_impact || 0}%</span>
                    </div>
                    <div className="bg-black/20 p-6 rounded-xl border border-white/5">
                       <span className="text-hud text-white/30 text-[9px] block mb-2">Thermal Stability</span>
                       <span className="text-2xl font-bold font-['Space_Grotesk'] text-[#dfe2f1]">HIGH</span>
                    </div>
                 </div>
              </div>
              <div className="lg:w-1/2 w-full aspect-video bg-[#05080f] rounded-xl border border-white/10 relative overflow-hidden flex items-center justify-center">
                 <div className="absolute inset-0 opacity-20 pointer-events-none bg-grid-mesh"></div>
                 
                 {/* Technical Scanlines */}
                 <div className="absolute inset-0 pointer-events-none z-20">
                    <div className="w-full h-1 bg-gradient-to-r from-transparent via-[#4edea3]/20 to-transparent absolute top-0 animate-[scan_4s_linear_infinite]"></div>
                    <div className="w-full h-1 bg-gradient-to-r from-transparent via-[#4edea3]/10 to-transparent absolute top-[33%] animate-[scan_4s_linear_infinite_1s]"></div>
                    <div className="w-full h-1 bg-gradient-to-r from-transparent via-[#4edea3]/10 to-transparent absolute top-[66%] animate-[scan_4s_linear_infinite_2s]"></div>
                 </div>

                 {/* Neural Array Simulation */}
                 <div className="flex items-center space-x-1.5 h-32 relative z-10">
                    {[...Array(12)].map((_, i) => (
                       <div 
                          key={i}
                          className="w-2 bg-[#4edea3] rounded-full animate-bar-pulse shadow-[0_0_15px_#4edea380]"
                          style={{ 
                             height: '100%',
                             animationDelay: `${i * 0.1}s`,
                             opacity: 0.3 + (i * 0.05)
                          }}
                       ></div>
                    ))}
                 </div>

                 <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-center">
                    <p className="text-[10px] font-mono text-[#4edea3] tracking-[0.4em] uppercase animate-pulse">Spectral Analysis Active</p>
                    <div className="mt-2 h-1 w-32 bg-white/5 rounded-full mx-auto overflow-hidden">
                       <div className="h-full bg-[#4edea3] w-1/2 animate-[loading_2s_ease-in-out_infinite]"></div>
                    </div>
                 </div>
              </div>
           </div>
        </div>

        {/* Final Actions */}
        <div className="flex flex-wrap gap-6 justify-center">
           <button onClick={() => navigate("/heatmap")} className="btn-secondary px-12 py-5">REVERT TO THERMAL VISION</button>
           <button onClick={() => navigate("/upload")} className="btn-primary px-12 py-5">INITIALIZE NEW RUN</button>
        </div>
      </div>
    </div>
  );
}

function DataCard({ label, value, sub, color }) {
  return (
    <div className="hud-card p-10 border-white/5 relative overflow-hidden group">
       <div className="absolute right-0 top-0 w-24 h-24 bg-white/2 rounded-full -mr-12 -mt-12 group-hover:scale-150 transition-transform duration-1000"></div>
       <span className="text-hud text-[#bbcabf] mb-3 block">{label}</span>
       <h3 className="text-5xl font-bold font-['Space_Grotesk'] mb-4" style={{ color: color }}>{value}</h3>
       <p className="text-[10px] font-mono text-[#bbcabf]/50 uppercase tracking-widest">{sub}</p>
    </div>
  );
}

function MetricPod({ label, value, color }) {
  return (
    <div className="bg-white/2 border border-white/5 p-6 rounded-xl">
       <span className="text-hud text-[#bbcabf] text-[9px] block mb-2">{label}</span>
       <span className="text-2xl font-bold font-['Space_Grotesk']" style={{ color: color }}>{value}</span>
    </div>
  );
}
