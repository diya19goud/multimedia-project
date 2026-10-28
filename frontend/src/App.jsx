import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import SafetyMonitoring from './views/SafetyMonitoring';
import CrackDetection from './views/CrackDetection';
import ValuationEstimator from './views/ValuationEstimator';
import ProjectScheduling from './views/ProjectScheduling';
import SiteAssistantChat from './views/SiteAssistantChat';
import WeatherAdvisory from './views/WeatherAdvisory';
import KnowledgeBase from './views/KnowledgeBase';

export default function App() {
  const [currentTab, setTab] = useState('safety');
  const [activeProject, setActiveProject] = useState({
    id: 'skyline',
    name: 'Skyline Corporate Center - Tower B',
    zone: 'Zone A - High-Rise Core',
    phase: 'Level 12 Slab Pour'
  });

  return (
    <div className="min-h-screen bg-[#0B0F19] text-slate-100 flex flex-col blueprint-grid selection:bg-amber-500 selection:text-slate-950">
      
      {/* Top Navigation */}
      <Navbar 
        activeProject={activeProject} 
        setActiveProject={setActiveProject} 
        onTabSelect={setTab} 
      />

      {/* Main App Body */}
      <div className="flex-1 max-w-7xl w-full mx-auto flex flex-col lg:flex-row">
        
        {/* Navigation Sidebar */}
        <Sidebar currentTab={currentTab} setTab={setTab} />

        {/* Dynamic Content View Container */}
        <main className="flex-1 p-4 lg:p-8 min-w-0 overflow-hidden">
          {currentTab === 'safety' && <SafetyMonitoring />}
          {currentTab === 'cracks' && <CrackDetection />}
          {currentTab === 'valuation' && <ValuationEstimator />}
          {currentTab === 'scheduling' && <ProjectScheduling />}
          {currentTab === 'chat' && <SiteAssistantChat activeProject={activeProject} />}
          {currentTab === 'weather' && <WeatherAdvisory />}
          {currentTab === 'knowledge' && <KnowledgeBase />}
        </main>

      </div>

      {/* Production Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950/90 backdrop-blur-md py-4 px-6 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span className="font-semibold text-slate-300">BuildVision AI v1.0.0 (Production Ready)</span>
            <span className="hidden sm:inline text-slate-600">|</span>
            <span className="hidden sm:inline">Pydantic 2.14 Data Contracts • React 19 • Tailwind CSS</span>
          </div>

          <div className="flex items-center gap-4 text-[11px] font-mono">
            <span className="text-slate-400">OSHA 1926 & ACI 318-19 Compliant</span>
            <span className="text-amber-400">FastAPI Engine</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
