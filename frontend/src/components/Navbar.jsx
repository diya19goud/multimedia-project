import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  ShieldCheck, 
  AlertTriangle, 
  Activity, 
  Wifi, 
  WifiOff, 
  Bell, 
  HardHat, 
  Layers,
  ChevronDown,
  Sun,
  Clock
} from 'lucide-react';

export default function Navbar({ activeProject, setActiveProject, onTabSelect }) {
  const [apiOnline, setApiOnline] = useState(false);
  const [timeStr, setTimeStr] = useState('');

  const projects = [
    { id: 'skyline', name: 'Skyline Corporate Center - Tower B', zone: 'Zone A - High-Rise Core', phase: 'Level 12 Slab Pour' },
    { id: 'harborview', name: 'Harborview Mixed-Use Terminal', zone: 'Sector 3 - Deep Foundations', phase: 'Secant Piling' },
    { id: 'apex_logistics', name: 'Apex Logistics Mega-Hub', zone: 'Warehouse Bay 4', phase: 'Precast Erection' },
  ];

  useEffect(() => {
    // Check backend health
    const checkHealth = async () => {
      try {
        const res = await fetch('http://127.0.0.1:8000/api/health');
        if (res.ok) setApiOnline(true);
        else setApiOnline(false);
      } catch {
        setApiOnline(false);
      }
    };
    checkHealth();
    const interval = setInterval(checkHealth, 15000);

    // Live clock
    const clockInterval = setInterval(() => {
      const now = new Date();
      setTimeStr(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    }, 1000);

    return () => {
      clearInterval(interval);
      clearInterval(clockInterval);
    };
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-[#0B0F19]/90 backdrop-blur-md border-b border-slate-800/80 px-4 lg:px-8 py-3 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        
        {/* Brand Logo & Platform Title */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 shadow-glow-amber text-slate-950 font-black">
            <Building2 className="w-5 h-5 text-slate-950 stroke-[2.5]" />
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg lg:text-xl font-black tracking-tight text-white font-display">
                BUILD<span className="text-amber-400">VISION</span> <span className="text-xs px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono font-semibold border border-amber-500/30">AI</span>
              </h1>
            </div>
            <p className="text-[11px] font-medium text-slate-400 tracking-wide hidden sm:block">
              Multimodal Construction Intelligence Platform
            </p>
          </div>
        </div>

        {/* Center: Active Job Site Selector */}
        <div className="hidden md:flex items-center gap-2 bg-slate-900/90 border border-slate-700/60 rounded-xl px-3 py-1.5 shadow-inner">
          <HardHat className="w-4 h-4 text-amber-400" />
          <div className="text-left text-xs">
            <span className="text-slate-400 block text-[10px] font-mono uppercase tracking-wider">Active Site</span>
            <select 
              value={activeProject.id}
              onChange={(e) => {
                const found = projects.find(p => p.id === e.target.value);
                if (found) setActiveProject(found);
              }}
              className="bg-transparent text-slate-200 font-semibold focus:outline-none cursor-pointer pr-2"
            >
              {projects.map(p => (
                <option key={p.id} value={p.id} className="bg-slate-900 text-slate-100">
                  {p.name}
                </option>
              ))}
            </select>
          </div>
          <span className="hidden lg:inline-flex items-center gap-1 ml-2 px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
            {activeProject.phase}
          </span>
        </div>

        {/* Right Actions: Clock, Health Status, Live Alert */}
        <div className="flex items-center gap-3">
          
          {/* Live Shift Clock */}
          <div className="hidden xl:flex items-center gap-1.5 text-xs font-mono text-slate-300 bg-slate-900/60 px-3 py-1.5 rounded-lg border border-slate-800">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span>{timeStr || 'LIVE SHIFT'}</span>
          </div>

          {/* Backend API Status Pill */}
          <div 
            title={apiOnline ? "FastAPI Backend is Online & Connected" : "Local Mock Simulation Active (Backend starting)"}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono font-medium border transition-all ${
              apiOnline 
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' 
                : 'bg-amber-500/10 text-amber-300 border-amber-500/30'
            }`}
          >
            {apiOnline ? (
              <>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>FastAPI 3.12</span>
              </>
            ) : (
              <>
                <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                <span>Local AI Engine</span>
              </>
            )}
          </div>

          {/* Quick HSE Action Button */}
          <button 
            onClick={() => onTabSelect('safety')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold text-xs transition shadow-glow-amber cursor-pointer"
          >
            <ShieldCheck className="w-3.5 h-3.5 stroke-[2.5]" />
            <span className="hidden sm:inline">Site Safety Audit</span>
          </button>
        </div>

      </div>
    </header>
  );
}
