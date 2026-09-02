import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function UploadMap() {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const base = "http://127.0.0.1:8000";
  const navigate = useNavigate();

  const handleUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("INVALID_FILE_TYPE: Telemetry requires high-resolution imagery.");
      return;
    }

    setImage(file);
    setError("");
    setStatus("");

    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result);
    reader.readAsDataURL(file);
  };

  const sendToBackend = async () => {
    if (!image) {
      setError("LINK_FAILURE: No data stream selected.");
      return;
    }

    setLoading(true);
    setError("");
    setStatus("");

    try {
      let formData = new FormData();
      formData.append("file", image);

      const response = await fetch(base + "/upload-map", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("UPLINK_TIMEOUT: Remote server rejected the payload.");
      }

      const data = await response.json();
      setStatus(data.message);

      if (data.file_id) {
        localStorage.setItem('file_id', data.file_id);
      }

    } catch (err) {
      setError(err.message || "PROTOCOL_ERROR: Check backend connectivity.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#0f131d] pt-32 pb-20 px-6 lg:px-12">
      <div className="absolute inset-0 bg-grid-mesh opacity-10 pointer-events-none"></div>
      <div className="scanline"></div>

      <div className="max-w-[1200px] mx-auto relative z-10">
        <div className="flex flex-col lg:flex-row gap-12 items-start">
          
          {/* Left Panel: Instructions & Meta */}
          <div className="lg:w-1/3">
             <div className="hud-glass p-8 border-[#4edea3]/20 rounded-2xl mb-8">
                <span className="text-hud text-[#4edea3] mb-4 block">Operation: Uplink</span>
                <h1 className="text-4xl font-bold font-['Space_Grotesk'] mb-6 uppercase tracking-tight">Telemetry <br /> <span className="text-[#4edea3]">Upload.</span></h1>
                <p className="text-[#bbcabf] text-sm leading-relaxed mb-8">
                  Establish a neural link with our orbital processing node. Upload high-resolution multispectral imagery for infrastructure parsing.
                </p>
                <div className="space-y-4 pt-8 border-t border-white/5">
                   <MetricRow label="Protocol" value="V.02_LAND_SAT" />
                   <MetricRow label="Bandwidth" value="Adaptive" />
                   <MetricRow label="Security" value="Encrypted" />
                </div>
             </div>
          </div>

          {/* Right Panel: The Upload Zone */}
          <div className="lg:w-2/3 w-full">
            <div className="hud-card p-1 border-white/5">
               <div className="bg-[#0a0e18] p-10 rounded-md">
                   
                   {/* Custom File Input Zone */}
                   <div className="mb-10">
                      <label className="text-hud text-[#bbcabf] mb-4 block">Target Data Stream</label>
                      <div className="relative group">
                         <input type="file" accept="image/*" onChange={handleUpload} className="hidden" id="file-upload" />
                         <label htmlFor="file-upload" className="flex flex-col items-center justify-center w-full h-80 bg-white/2 border-2 border-dashed border-white/10 rounded-xl cursor-pointer hover:border-[#4edea3]/50 hover:bg-[#4edea3]/5 transition-all duration-500 overflow-hidden relative">
                            {preview ? (
                               <div className="absolute inset-0">
                                  <img src={preview} alt="Telemetry" className="w-full h-full object-cover opacity-30 grayscale" />
                                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 backdrop-blur-[2px]">
                                     <span className="text-hud text-[#4edea3] mb-2">Payload Loaded</span>
                                     <span className="text-xl font-bold font-['Space_Grotesk'] text-[#dfe2f1]">{image?.name}</span>
                                     <div className="mt-4 px-4 py-2 bg-[#4edea3]/10 border border-[#4edea3]/30 rounded-md">
                                        <span className="text-[10px] font-mono text-[#4edea3]">CHANGE_LINK</span>
                                     </div>
                                  </div>
                               </div>
                            ) : (
                               <div className="flex flex-col items-center justify-center">
                                  <div className="w-16 h-16 border border-white/10 rounded-full flex items-center justify-center mb-6 text-[#bbcabf] group-hover:text-[#4edea3] group-hover:border-[#4edea3]/50 transition-all">
                                     <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                                     </svg>
                                  </div>
                                  <p className="text-[#dfe2f1] font-bold font-['Space_Grotesk'] mb-2">INITIALIZE UPLINK</p>
                                  <p className="text-[10px] text-hud text-[#bbcabf]">Drag Image Files or Click to Select</p>
                               </div>
                            )}
                         </label>
                      </div>
                   </div>

                   {/* Messaging Area */}
                   {(error || status) && (
                      <div className={`mb-8 p-6 rounded-xl border ${error ? 'bg-red-500/5 border-red-500/20 text-red-400' : 'bg-[#4edea3]/5 border-[#4edea3]/20 text-[#4edea3]'} animate-pulse-soft`}>
                         <div className="flex items-center space-x-4">
                            <div className={`w-2 h-2 rounded-full ${error ? 'bg-red-500' : 'bg-[#4edea3]'}`}></div>
                            <span className="font-mono text-xs font-bold tracking-widest">{error ? 'SYSTEM_ALERT' : 'STATUS_NOMINAL'}</span>
                         </div>
                         <p className="mt-2 text-sm ml-6">{error || status}</p>
                      </div>
                   )}

                   {/* Main Action */}
                   <button 
                      onClick={sendToBackend} 
                      disabled={!image || loading} 
                      className={`w-full btn-primary py-5 text-xl relative overflow-hidden group disabled:opacity-30 disabled:cursor-not-allowed`}
                   >
                       {loading ? (
                          <div className="flex items-center justify-center space-x-3">
                             <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                             <span>ESTABLISHING LINK...</span>
                          </div>
                       ) : (
                          <span>INITIALIZE PROCESSING</span>
                       )}
                   </button>

                   {/* Ready States */}
                   {status && status.includes("successfully") && (
                      <div className="mt-12 pt-12 border-t border-white/5 animate-in fade-in slide-in-from-bottom-6 duration-700">
                         <span className="text-hud text-[#bbcabf] mb-8 block">Ready for Operation Modules</span>
                         <div className="grid md:grid-cols-3 gap-6">
                            <ActionCard icon="📊" label="Analysis" path="/analyze" />
                            <ActionCard icon="🔥" label="Heat Engine" path="/heatmap" />
                            <ActionCard icon="🌱" label="Ecological" path="/results" />
                         </div>
                      </div>
                   )}
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MetricRow({ label, value }) {
  return (
    <div className="flex justify-between items-center py-2">
      <span className="text-hud text-[#bbcabf]">{label}</span>
      <span className="text-[10px] font-mono text-[#4edea3]">{value}</span>
    </div>
  );
}

function ActionCard({ icon, label, path }) {
  const navigate = useNavigate();
  return (
    <button 
      onClick={() => navigate(path)}
      className="hud-glass p-6 border-white/10 rounded-xl text-left group hover:border-[#4edea3]/40 transition-all duration-500"
    >
      <div className="text-2xl mb-4 group-hover:scale-110 transition-transform">{icon}</div>
      <div className="text-[10px] text-hud text-[#bbcabf] mb-1">Module</div>
      <div className="font-bold font-['Space_Grotesk'] text-[#dfe2f1] group-hover:text-[#4edea3] transition-colors">{label}</div>
    </button>
  );
}
