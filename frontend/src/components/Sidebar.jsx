import React from 'react';
import { 
  ShieldAlert, 
  ScanLine, 
  Calculator, 
  CalendarRange, 
  Bot, 
  CloudSun, 
  BookOpen, 
  ArrowRight,
  TrendingUp,
  Cpu
} from 'lucide-react';

export default function Sidebar({ currentTab, setTab }) {
  const navItems = [
    {
      id: 'safety',
      label: 'Site Safety Monitoring',
      sublabel: 'PPE & Hazard Vision AI',
      icon: ShieldAlert,
      badge: 'Vision AI',
      color: 'amber'
    },
    {
      id: 'cracks',
      label: 'Crack Detection & Risk',
      sublabel: 'Structural Classification',
      icon: ScanLine,
      badge: 'Multimodal',
      color: 'cyan'
    },
    {
      id: 'valuation',
      label: 'Valuation & Cost Estimator',
      sublabel: 'Financial & Cashflow ROI',
      icon: Calculator,
      badge: 'S-Curve',
      color: 'emerald'
    },
    {
      id: 'scheduling',
      label: 'Planning & Scheduling',
      sublabel: 'Gantt & Critical Path',
      icon: CalendarRange,
      badge: 'CPM',
      color: 'blue'
    },
    {
      id: 'chat',
      label: 'Daily Site Assistant',
      sublabel: 'Code & Log AI Copilot',
      icon: Bot,
      badge: 'Copilot',
      color: 'purple'
    },
    {
      id: 'weather',
      label: 'Weather-Aware Advisory',
      sublabel: 'Concrete & Crane Risks',
      icon: CloudSun,
      badge: 'Real-time',
      color: 'yellow'
    },
    {
      id: 'knowledge',
      label: 'Knowledge Base',
      sublabel: 'OSHA, ACI, IBC Standards',
      icon: BookOpen,
      badge: 'Codes',
      color: 'slate'
    }
  ];

  return (
    <aside className="w-full lg:w-72 bg-slate-900/50 backdrop-blur-md border-b lg:border-b-0 lg:border-r border-slate-800/80 p-3 lg:p-4 flex flex-row lg:flex-col justify-between overflow-x-auto lg:overflow-visible gap-2 select-none">
      
      {/* Top Section / Nav Tabs */}
      <div className="flex flex-row lg:flex-col gap-1.5 w-full">
        <div className="hidden lg:block px-3 py-2 text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold">
          Platform Modules
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setTab(item.id)}
              className={`group flex items-center justify-between px-3 py-2.5 rounded-xl transition-all text-left whitespace-nowrap cursor-pointer ${
                isActive 
                  ? 'bg-gradient-to-r from-amber-500/20 via-amber-500/10 to-transparent border-l-4 border-amber-500 text-white font-semibold shadow-sm' 
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg transition-colors ${
                  isActive 
                    ? 'bg-amber-500 text-slate-950 font-bold' 
                    : 'bg-slate-800 text-slate-300 group-hover:text-amber-400'
                }`}>
                  <Icon className="w-4 h-4 stroke-[2]" />
                </div>
                <div>
                  <div className="text-xs lg:text-sm font-medium tracking-tight">
                    {item.label}
                  </div>
                  <div className="hidden lg:block text-[11px] text-slate-400 font-normal">
                    {item.sublabel}
                  </div>
                </div>
              </div>

              <span className={`hidden xl:inline-block text-[10px] font-mono px-1.5 py-0.5 rounded border transition-colors ${
                isActive 
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/30' 
                  : 'bg-slate-800 text-slate-400 border-slate-700/60'
              }`}>
                {item.badge}
              </span>
            </button>
          );
        })}
      </div>

      {/* Bottom Card: Construction Intelligence Status */}
      <div className="hidden lg:block mt-6 p-3.5 rounded-2xl bg-gradient-to-br from-slate-800/60 to-slate-900/90 border border-slate-700/60 shadow-inner">
        <div className="flex items-center gap-2 mb-2">
          <Cpu className="w-4 h-4 text-amber-400 animate-pulse" />
          <span className="text-xs font-bold text-slate-200 font-display">Neural Model Health</span>
        </div>
        <p className="text-[11px] text-slate-300 leading-relaxed mb-3">
          Multimodal vision weights loaded with zero latency inference for PPE & crack segmentation.
        </p>
        <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 pt-2 border-t border-slate-800">
          <span>LATENCY: 42ms</span>
          <span className="text-emerald-400 font-semibold">99.8% READY</span>
        </div>
      </div>

    </aside>
  );
}
