import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

export default function Navbar() {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isActive = (path) => location.pathname === path;

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 border-b ${
        scrolled 
          ? "bg-[#0f131d]/90 backdrop-blur-xl border-[#4edea3]/20 py-2 shadow-[0_10px_30px_rgba(0,0,0,0.5)]" 
          : "bg-transparent border-transparent py-4"
      }`}
    >
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
        <div className="flex justify-between items-center">
          {/* Logo / Brand */}
          <Link to="/" className="flex items-center space-x-4 group">
            <div className="relative w-12 h-12 flex items-center justify-center">
              <div className="absolute inset-0 bg-[#4edea3]/10 rounded-lg blur-md group-hover:bg-[#4edea3]/20 transition-all duration-500"></div>
              <div className="relative w-10 h-10 border-2 border-[#4edea3]/40 rounded-lg flex items-center justify-center transform rotate-45 group-hover:rotate-0 transition-transform duration-500">
                <div className="w-4 h-4 bg-[#4edea3] rounded-sm animate-pulse-soft transform -rotate-45 group-hover:rotate-0 transition-transform duration-500"></div>
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-[0.15em] text-[#dfe2f1] font-['Space_Grotesk'] leading-none">
                URBAN PLAN <span className="text-[#4edea3]">OPTIMIZER</span>
              </span>
              <div className="flex items-center space-x-2 mt-1">
                <span className="text-[9px] uppercase tracking-widest text-[#bbcabf] font-bold">Orbital Analytics Node</span>
                <div className="w-1.5 h-1.5 bg-[#4edea3] rounded-full animate-pulse"></div>
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-2 hud-glass py-1.5 px-2 rounded-full border-white/5">
            <NavLink to="/" isActive={isActive("/")}>Dashboard</NavLink>
            <NavLink to="/upload" isActive={isActive("/upload")}>Telemetry</NavLink>
            <NavLink to="/analyze" isActive={isActive("/analyze")}>Analysis</NavLink>
            <NavLink to="/heatmap" isActive={isActive("/heatmap")}>Heatmap</NavLink>
            <NavLink to="/optimize" isActive={isActive("/optimize")}>Optimize</NavLink>
            <NavLink to="/results" isActive={isActive("/results")}>Analytics</NavLink>
          </div>

          {/* System Status / CTA */}
          <div className="hidden md:flex items-center space-x-6">
            <div className="flex flex-col items-end">
              <span className="text-hud text-[#bbcabf]">System Integrity</span>
              <span className="text-[10px] font-mono text-[#4edea3]">OPTIMAL // 99.4%</span>
            </div>
            <Link to="/upload" className="btn-primary flex items-center space-x-2">
              <span className="text-sm">INITIALIZE</span>
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-[#4edea3] focus:outline-none"
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 8h16M4 16h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation Panel */}
        {mobileMenuOpen && (
          <div className="lg:hidden mt-4 hud-glass rounded-2xl p-6 border-[#4edea3]/20 animate-in fade-in zoom-in duration-300">
            <div className="flex flex-col space-y-4">
              <MobileNavLink to="/" isActive={isActive("/")} onClick={() => setMobileMenuOpen(false)}>Dashboard</MobileNavLink>
              <MobileNavLink to="/upload" isActive={isActive("/upload")} onClick={() => setMobileMenuOpen(false)}>Telemetry Upload</MobileNavLink>
              <MobileNavLink to="/analyze" isActive={isActive("/analyze")} onClick={() => setMobileMenuOpen(false)}>Land Analysis</MobileNavLink>
              <MobileNavLink to="/heatmap" isActive={isActive("/heatmap")} onClick={() => setMobileMenuOpen(false)}>Heatmap Engine</MobileNavLink>
              <MobileNavLink to="/optimize" isActive={isActive("/optimize")} onClick={() => setMobileMenuOpen(false)}>Optimizer</MobileNavLink>
              <MobileNavLink to="/results" isActive={isActive("/results")} onClick={() => setMobileMenuOpen(false)}>Analytics</MobileNavLink>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

function NavLink({ to, isActive, children }) {
  return (
    <Link
      to={to}
      className={`px-5 py-2 rounded-full text-xs font-bold tracking-widest uppercase transition-all duration-300 font-['Space_Grotesk'] ${
        isActive
          ? "bg-[#4edea3] text-[#003824] shadow-[0_0_15px_rgba(78,222,163,0.3)]"
          : "text-[#bbcabf] hover:text-[#dfe2f1] hover:bg-white/5"
      }`}
    >
      {children}
    </Link>
  );
}

function MobileNavLink({ to, isActive, children, onClick }) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className={`px-4 py-3 rounded-xl text-sm font-bold tracking-widest uppercase transition-all duration-300 font-['Space_Grotesk'] ${
        isActive
          ? "bg-[#4edea3]/10 text-[#4edea3] border border-[#4edea3]/30"
          : "text-[#bbcabf] hover:bg-white/5"
      }`}
    >
      {children}
    </Link>
  );
}
