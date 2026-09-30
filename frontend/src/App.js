import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import UploadMap from "./pages/UploadMap";
import Analyze from "./pages/Analyze";
import Heatmap from "./pages/Heatmap";
import Optimize from "./pages/Optimize";
import Results from "./pages/Results";

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[#05080f] bg-grid-pattern relative">
        <div className="absolute inset-0 bg-[#05080f]/80 pointer-events-none z-0"></div>
        <div className="relative z-10 text-white">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/upload" element={<UploadMap />} />
            <Route path="/analyze" element={<Analyze />} />
            <Route path="/heatmap" element={<Heatmap />} />
            <Route path="/optimize" element={<Optimize />} />
            <Route path="/results" element={<Results />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}
