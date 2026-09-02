import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Home() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="relative min-h-screen bg-[#0f131d] overflow-x-hidden">
      {/* Precision Grid Overlay */}
      <div className="absolute inset-0 bg-grid-mesh opacity-20 pointer-events-none"></div>
      
      {/* Animated Scanline */}
      <div className="scanline"></div>

      {/* Hero Ambient Glows */}
      <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-[#4edea3]/10 rounded-full blur-[150px] animate-pulse-soft"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-[#d0bcff]/5 rounded-full blur-[150px]"></div>

      <div className="relative z-10 max-w-[1440px] mx-auto px-6 lg:px-12 pt-44 pb-32">
        <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
          
          {/* Text Content */}
          <div className={`flex-1 transition-all duration-1000 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="inline-flex items-center space-x-3 px-3 py-1 hud-glass border-[#4edea3]/30 rounded-full mb-8">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#4edea3] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#4edea3]"></span>
              </span>
              <span className="text-hud text-[#4edea3]">V.02 NEURAL OPTIMIZATION ENGINE ACTIVE</span>
            </div>

            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold leading-[0.9] mb-8 font-['Space_Grotesk'] tracking-tight">
              NEURAL <span className="text-[#4edea3]">MAPPING</span> FOR <br />
              RESILIENT <span className="italic font-light">CITIES.</span>
            </h1>

            <p className="text-lg md:text-xl text-[#bbcabf] max-w-2xl mb-12 leading-relaxed">
              Dismantle urban heat islands through algorithmic biomass injection. Our platform utilizes high-cadence satellite telemetry to mathematically restructure metropolitan ecological grids.
            </p>

            <div className="flex flex-wrap gap-6">
              <Link to="/upload" className="btn-primary flex items-center space-x-3 px-8 py-4">
                <span>INITIALIZE OPTIMIZATION</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
            </div>

            {/* Performance Metrics */}
            <div className="mt-16 pt-12 border-t border-white/5 grid grid-cols-3 gap-8">
              <StatBlock label="Analysis Accuracy" value="99.4%" />
              <StatBlock label="Neural Confidence" value="High-Sigma" />
              <StatBlock label="Response Latency" value="12ms" />
            </div>
          </div>

          {/* Visual Element / Hero Mockup */}
          <div className={`flex-1 relative transition-all duration-1000 delay-300 ${mounted ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
            <div className="hud-card border-[#4edea3]/20 aspect-[4/3] w-full max-w-[600px] overflow-hidden group">
              <div className="absolute inset-0 bg-[#0f131d]">
                <img 
                  src="https://images.unsplash.com/photo-1449824913935-59a10b8d2000?auto=format&fit=crop&q=80&w=1200" 
                  alt="Urban Grid"
                  className="w-full h-full object-cover opacity-40 grayscale group-hover:scale-110 transition-transform duration-[20s]"
                />
              </div>
              
              {/* HUD Overlays */}
              <div className="absolute inset-0 pointer-events-none p-6 flex flex-col justify-between">
                <div className="flex justify-between">
                  <div className="hud-glass px-3 py-1.5 rounded-md border-[#4edea3]/20">
                    <span className="text-[10px] font-mono text-[#4edea3]">LIVE_TELEMETRY // FEED_07</span>
                  </div>
                  <div className="flex flex-col items-end">
                    <div className="w-12 h-1 bg-[#4edea3]/30 rounded-full mb-1">
                      <div className="w-[60%] h-full bg-[#4edea3] rounded-full animate-pulse"></div>
                    </div>
                    <span className="text-[8px] font-mono text-[#bbcabf]">SYNC: 102.4ms</span>
                  </div>
                </div>

                <div className="relative h-24 overflow-hidden">
                   {/* Scanning line for the image */}
                   <div className="w-full h-1 bg-[#4edea3] opacity-40 absolute top-0 animate-[scan_4s_linear_infinite]"></div>
                </div>

                <div className="flex items-end justify-between">
                  <div className="space-y-2">
                    <div className="flex space-x-1">
                      {[1, 2, 3, 4, 5].map(i => (
                        <div key={i} className={`w-1 h-${i * 2 + 2} bg-[#4edea3]/40 rounded-full`}></div>
                      ))}
                    </div>
                    <span className="text-hud text-[#bbcabf]">Frequency Spectrum</span>
                  </div>
                  <div className="text-right">
                    <span className="text-3xl font-bold font-['Space_Grotesk'] text-[#dfe2f1] leading-none">NX-90</span>
                    <p className="text-[10px] text-[#4edea3] font-mono tracking-widest mt-1">OPTIMIZATION PROTOCOL</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Decorative Floating Elements */}
            <div className="absolute -top-6 -right-6 w-32 h-32 hud-glass border-[#d0bcff]/20 rounded-2xl flex items-center justify-center p-4 animate-float">
               <div className="w-full aspect-square border-2 border-dashed border-[#d0bcff]/30 rounded-full flex items-center justify-center">
                  <div className="w-4 h-4 bg-[#d0bcff] rotate-45"></div>
               </div>
            </div>
          </div>
        </div>

        {/* Feature Grid Section */}
        <div className="mt-48">
          <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-white/5 pb-8 mb-16">
            <div className="max-w-xl">
              <span className="text-hud text-[#4edea3] mb-4 block">Core Capabilities</span>
              <h2 className="text-4xl md:text-5xl font-bold font-['Space_Grotesk']">SCIENTIFIC <span className="italic font-thin">BENCHMARKS.</span></h2>
            </div>
            <p className="text-[#bbcabf] max-w-sm mt-6 md:mt-0">
               Every metric is parsed through our proprietary multi-spectral engine to ensure 99%+ accuracy in biomass prediction.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard 
              num="01"
              title="Spectral Analysis"
              desc="Calibrated HSV thresholding specifically tuned for urban concrete/vegetation isolation."
            />
            <FeatureCard 
              num="02"
              title="Thermal Isolation"
              desc="Isolate heat islands through pixel-density albedo calculations and material signatures."
            />
            <FeatureCard 
              num="03"
              title="Adaptive Growth"
              desc="AI-driven tree deployment patterns designed to maximize localized transpiration-cooling."
            />
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes scan {
          0% { top: 0%; opacity: 0; }
          10% { opacity: 0.5; }
          90% { opacity: 0.5; }
          100% { top: 100%; opacity: 0; }
        }
      `}} />
    </div>
  );
}

function StatBlock({ label, value }) {
  return (
    <div className="flex flex-col">
      <span className="text-hud text-[#bbcabf] mb-1">{label}</span>
      <span className="text-2xl font-bold font-['Space_Grotesk'] text-[#4edea3]">{value}</span>
    </div>
  );
}

function FeatureCard({ num, title, desc }) {
  return (
    <div className="hud-card p-10 group hover:border-[#4edea3]/40 transition-colors duration-500">
      <span className="text-4xl font-light text-[#4edea3]/20 mb-6 block font-['Space_Grotesk']">{num}</span>
      <h3 className="text-2xl font-bold mb-4 font-['Space_Grotesk']">{title}</h3>
      <p className="text-[#bbcabf] leading-relaxed">{desc}</p>
      
      <div className="mt-8 h-[1px] w-full bg-white/5 relative overflow-hidden">
        <div className="absolute inset-0 bg-[#4edea3] w-0 group-hover:w-full transition-all duration-700"></div>
      </div>
    </div>
  );
}
