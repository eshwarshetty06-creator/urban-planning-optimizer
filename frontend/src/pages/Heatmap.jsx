import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Heatmap() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHeatmap = async () => {
      try {
        setLoading(true);
        setError("");
        const fileId = localStorage.getItem('file_id');
        if (!fileId) {
          throw new Error("S_SESSION_MISSING: No map session found. Please establish uplink.");
        }
        const response = await fetch(`http://127.0.0.1:8000/heatmap?file_id=${fileId}`);

        if (!response.ok) {
          throw new Error("H_ARRAY_FAILURE: Remote node failed to return thermal feed.");
        }

        const data = await response.json();
        setUrl(data.heatmap_url);
      } catch (err) {
        setError(err.message || "E_PROTOCOL_ERROR: Infrared spectral parsing failed.");
      } finally {
        setLoading(false);
      }
    };

    fetchHeatmap();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f131d] flex flex-col items-center justify-center p-6">
        <div className="absolute inset-0 bg-grid-mesh opacity-10 pointer-events-none"></div>
        <div className="relative">
           <div className="w-24 h-24 border-2 border-orange-500/20 rounded-full animate-spin border-t-orange-500"></div>
           <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
           </div>
        </div>
        <p className="mt-8 text-hud text-orange-400 animate-pulse">GENERATING THERMAL ISOLATION MAP...</p>
        <p className="mt-2 text-[10px] font-mono text-[#bbcabf]">INFRARED_CORE // RADIANCE_CALIBRATION</p>
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
          <h2 className="text-2xl font-bold font-['Space_Grotesk'] mb-4 uppercase tracking-tight text-[#dfe2f1]">Thermal Link Failure</h2>
          <p className="text-[#bbcabf] text-sm mb-8 font-mono">{error}</p>
          <div className="grid grid-cols-2 gap-4">
             <button onClick={() => navigate("/upload")} className="btn-secondary text-xs">UPLINK MAP</button>
             <button onClick={() => navigate("/analyze")} className="btn-secondary text-xs">RE-ANALYZE</button>
          </div>
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
              <div className="inline-flex items-center space-x-2 px-3 py-1 bg-orange-500/10 border border-orange-500/30 rounded-md mb-4">
                 <span className="text-[10px] font-mono text-orange-400 font-bold uppercase tracking-widest">Infrared Spectrum Feed</span>
              </div>
              <h1 className="text-5xl md:text-6xl font-bold font-['Space_Grotesk'] tracking-tight">THERMAL <br /> <span className="text-orange-500">ISOLATION.</span></h1>
           </div>
           <div className="mt-6 md:mt-0 text-right">
              <span className="text-hud text-[#bbcabf]">Radiance Index</span>
              <p className="text-lg font-bold font-['Space_Grotesk'] text-orange-500">ACTIVE // SPECTRAL_LOCK</p>
           </div>
        </div>

        {/* Main Feed Panel */}
        <div className="hud-card p-1 border-white/5 mb-12">
           <div className="bg-[#0a0e18] p-8 rounded-md relative overflow-hidden">
              <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-6 border-b border-white/5 pb-6">
                 <div className="flex flex-col">
                    <h3 className="text-xl font-bold font-['Space_Grotesk'] text-[#dfe2f1] uppercase">Infrared Array Output</h3>
                    <p className="text-[10px] font-mono text-[#bbcabf] mt-1 tracking-widest">Feed_ID: HX-88-THRM</p>
                 </div>
                 <div className="flex flex-wrap items-center gap-6">
                    <LegendItem color="#ef4444" label="Extreme Heat" glow="rgba(239, 68, 68, 0.5)" />
                    <LegendItem color="#f97316" label="Surface Warmth" glow="rgba(249, 115, 22, 0.5)" />
                    <LegendItem color="#3b82f6" label="Biomass Cooling" glow="rgba(59, 130, 246, 0.5)" />
                 </div>
              </div>

              {/* The Heatmap Display */}
              <div className="relative group cursor-crosshair">
                 <div className="absolute inset-0 border border-orange-500/20 rounded-xl overflow-hidden pointer-events-none z-20">
                    <div className="w-full h-[1px] bg-orange-500 absolute top-0 animate-[scan_6s_linear_infinite] opacity-40"></div>
                 </div>
                 <div className="bg-black/40 rounded-xl overflow-hidden border border-white/5 p-2 shadow-2xl relative">
                    {url && <img src={url} alt="Infrared Feed" className="w-full h-auto rounded-lg grayscale-0 group-hover:brightness-125 transition-all duration-700" />}
                    
                    {/* HUD Metadata Overlay on Image */}
                    <div className="absolute top-6 left-6 text-hud text-white/40 font-mono text-[9px] pointer-events-none">
                       LAT: 40.7128° N <br />
                       LNG: 74.0060° W <br />
                       ALT: 12.4 KM
                    </div>
                    <div className="absolute bottom-6 right-6 text-right pointer-events-none">
                       <span className="text-hud text-orange-400">CALIBRATED</span>
                    </div>
                 </div>
              </div>
           </div>
        </div>

        {/* Intelligence Briefing */}
        <div className="grid lg:grid-cols-2 gap-12 mb-16">
           <div className="hud-glass p-8 border-orange-500/10 rounded-2xl relative overflow-hidden">
              <div className="absolute left-0 top-0 w-1 h-full bg-orange-500/30"></div>
              <span className="text-hud text-orange-400 mb-4 block tracking-widest">Thermal Intelligence</span>
              <p className="text-[#bbcabf] font-light leading-relaxed mb-6">
                 Our neural engine has identified significant albedo-traps within the concrete infrastructure blocks. These regions exhibit 15-20% higher radiance than neighboring vegetation zones.
              </p>
              <div className="flex gap-4">
                 <div className="flex-1 bg-white/2 p-4 rounded-lg border border-white/5">
                    <span className="text-hud text-white/30 text-[9px]">Peak Intensity</span>
                    <p className="text-xl font-bold font-['Space_Grotesk'] text-red-500">42.4°C</p>
                 </div>
                 <div className="flex-1 bg-white/2 p-4 rounded-lg border border-white/5">
                    <span className="text-hud text-white/30 text-[9px]">Average Variance</span>
                    <p className="text-xl font-bold font-['Space_Grotesk'] text-orange-500">+8.2°C</p>
                 </div>
              </div>
           </div>

           <div className="flex flex-col justify-center space-y-6">
              <button 
                onClick={() => navigate("/optimize")} 
                className="btn-primary py-5 bg-purple-600 hover:bg-purple-500 text-white hover:shadow-purple-500/40"
              >
                 RUN NEURAL OPTIMIZER PROTOCOL
              </button>
              <button 
                onClick={() => navigate("/results")} 
                className="btn-secondary py-5 text-sm"
              >
                 ACCESS ENVIRONMENTAL DATABASE
              </button>
           </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes scan {
          0% { top: 0%; opacity: 0; }
          10% { opacity: 0.8; }
          90% { opacity: 0.8; }
          100% { top: 100%; opacity: 0; }
        }
      `}} />
    </div>
  );
}

function LegendItem({ color, label, glow }) {
  return (
    <div className="flex items-center space-x-3">
       <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color, boxShadow: `0 0 12px ${glow}` }}></div>
       <span className="text-hud text-[#bbcabf]">{label}</span>
    </div>
  );
}
