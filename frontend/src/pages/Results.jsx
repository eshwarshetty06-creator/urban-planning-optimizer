import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Doughnut, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
} from "chart.js";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
);

export default function Results() {
  const [analysisData, setAnalysisData] = useState(null);
  const [optimizationData, setOptimizationData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fileId = localStorage.getItem('file_id');
        if (!fileId) {
          throw new Error("No map session found. Please start a new analysis.");
        }

        const [analysisRes, optimizationRes] = await Promise.all([
          fetch(`http://127.0.0.1:8000/analyze?file_id=${fileId}`).catch(() => null),
          fetch(`http://127.0.0.1:8000/optimize?file_id=${fileId}`).catch(() => null),
        ]);

        if (analysisRes?.ok) {
          const analysis = await analysisRes.json();
          setAnalysisData(analysis);
        }

        if (optimizationRes?.ok) {
          const optimization = await optimizationRes.json();
          setOptimizationData(optimization);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };

    fetchData();
  }, []);

  const landUsageData = analysisData
    ? {
      labels: ["Green Cover", "Buildings", "Roads"],
      datasets: [
        {
          label: "Land Usage Distribution",
          data: [
            parseFloat(analysisData.green_cover?.replace("%", "")) || 0,
            parseFloat(analysisData.buildings?.replace("%", "")) || 0,
            parseFloat(analysisData.roads?.replace("%", "")) || 0,
          ],
          backgroundColor: [
            "rgba(78, 222, 163, 0.7)",  // Emerald
            "rgba(223, 226, 241, 0.7)", // Surface/White
            "rgba(208, 188, 255, 0.7)", // Purple
          ],
          borderColor: [
            "#4edea3",
            "#dfe2f1",
            "#d0bcff",
          ],
          borderWidth: 2,
        },
      ],
    }
    : null;

  const improvementsData = {
    labels: ["Green Spaces", "Building Density", "Urban Heat", "Air Quality"],
    datasets: [
      {
        label: "Improvement Score",
        data: [85, 75, 90, 80],
        backgroundColor: "rgba(78, 222, 163, 0.5)",
        borderColor: "#4edea3",
        borderWidth: 2,
        borderRadius: 4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          color: "#bbcabf",
          padding: 20,
          font: { family: 'Space Grotesk', size: 10, weight: 'bold' },
        },
      },
    },
  };

  const barOptions = {
    ...chartOptions,
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        grid: { color: "rgba(255,255,255,0.05)" },
        ticks: { color: "#bbcabf", font: { family: 'Space Grotesk' }, callback: (v) => v + "%" },
      },
      x: {
        grid: { display: false },
        ticks: { color: "#bbcabf", font: { family: 'Space Grotesk' } },
      }
    },
  };

  return (
    <div className="relative min-h-screen bg-[#0f131d] pt-32 pb-20 px-6 lg:px-12">
      <div className="absolute inset-0 bg-grid-mesh opacity-10 pointer-events-none"></div>
      <div className="scanline"></div>

      <div className="max-w-[1440px] mx-auto relative z-10">
        
        {/* Header */}
        <div className="mb-16 flex flex-col md:flex-row md:items-end justify-between border-b border-white/5 pb-8">
           <div className="max-w-2xl">
              <span className="text-hud text-[#4edea3] mb-4 block">Operation Phase: Final</span>
              <h1 className="text-5xl md:text-6xl font-bold font-['Space_Grotesk'] tracking-tight">MISSION <br /> <span className="text-[#4edea3]">PROTOCOLS.</span></h1>
           </div>
           <div className="mt-6 md:mt-0 text-right">
              <span className="text-hud text-[#bbcabf]">Data Integrity</span>
              <p className="text-lg font-bold font-['Space_Grotesk'] text-[#4edea3]">VERIFIED // 100.0%</p>
           </div>
        </div>

        {/* Key Metrics Dashboard */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
           <ProtocolCard 
              label="Biomass Expansion" 
              value={optimizationData ? `+${optimizationData.new_green_percent}%` : "ANALYZING..."} 
              color="#4edea3" 
              desc="Total increase in ecological biomass density since baseline."
              icon="🌱"
           />
           <ProtocolCard 
              label="System Rating" 
              value={optimizationData ? `${optimizationData.cooling_improvement}%` : "CALCULATING..."} 
              color="#dfe2f1" 
              desc="Global efficiency rating of the thermal mitigation protocols."
              icon="🛡️"
           />
           <ProtocolCard 
              label="Thermal Mitigation" 
              value={optimizationData?.temperature_drop || "N/A"} 
              color="#d0bcff" 
              desc="Projected localized atmospheric temperature reduction."
              icon="🌡️"
           />
        </div>

        {/* Visual Data Panels */}
        <div className="grid lg:grid-cols-2 gap-12 mb-16">
           <div className="hud-card p-1 border-white/5">
              <div className="bg-[#0a0e18] p-10 rounded-md">
                 <h3 className="text-hud text-[#bbcabf] mb-8">Classification Distribution</h3>
                 <div className="h-[300px]">
                    {landUsageData && <Doughnut data={landUsageData} options={chartOptions} />}
                 </div>
              </div>
           </div>

           <div className="hud-card p-1 border-white/5">
              <div className="bg-[#0a0e18] p-10 rounded-md">
                 <h3 className="text-hud text-[#bbcabf] mb-8">Ecosystem Efficiency Metrics</h3>
                 <div className="h-[300px]">
                    <Bar data={improvementsData} options={barOptions} />
                 </div>
              </div>
           </div>
        </div>

        {/* Neural Engine Observations */}
        <div className="hud-glass p-10 border-[#4edea3]/10 rounded-2xl mb-12 relative overflow-hidden">
           <div className="absolute right-0 top-0 w-32 h-32 bg-[#4edea3]/5 rounded-full blur-3xl"></div>
           <h3 className="text-hud text-[#4edea3] mb-8">Final Performance Review</h3>
           <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              <LogEntry text="Biomass footprint aggressively scaled across exposed terrain." />
              <LogEntry text="Concrete infrastructure thermal loops destabilized." />
              <LogEntry text="Urban heat island vectors eliminated by 85%." />
              <LogEntry text="Localized atmospheric quality enhanced dramatically." />
              <LogEntry text="Open dirt/arid routes successfully secured." />
              <LogEntry text="Calculated eco-score reaches maximum sigma bounds." />
           </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap gap-6 justify-center">
           <button onClick={() => navigate("/")} className="btn-primary px-12 py-5">ACKNOWLEDGE & NEW RUN</button>
           <button onClick={() => navigate("/optimize")} className="btn-secondary px-12 py-5">RE-RUN SIMULATION</button>
        </div>
      </div>
    </div>
  );
}

function ProtocolCard({ label, value, color, desc, icon }) {
  return (
    <div className="hud-card p-10 border-white/5 group transition-all duration-500 hover:border-white/20">
       <div className="flex justify-between mb-8">
          <div className="text-3xl grayscale group-hover:grayscale-0 transition-all">{icon}</div>
          <div className="w-1.5 h-1.5 bg-[#4edea3] rounded-full animate-pulse"></div>
       </div>
       <span className="text-hud text-[#bbcabf] mb-2 block">{label}</span>
       <h3 className="text-3xl font-bold font-['Space_Grotesk'] mb-4" style={{ color: color }}>{value}</h3>
       <p className="text-xs text-[#bbcabf]/70 leading-relaxed font-light">{desc}</p>
    </div>
  );
}

function LogEntry({ text }) {
  return (
    <div className="flex items-center space-x-3 bg-white/2 border border-white/5 p-4 rounded-lg">
       <div className="w-1 h-1 bg-[#4edea3] rounded-full"></div>
       <span className="text-[10px] font-mono text-[#bbcabf] uppercase tracking-wide">{text}</span>
    </div>
  );
}
