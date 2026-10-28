import React, { useState, useEffect } from 'react';
import { 
  CalendarRange, 
  Milestone, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  ChevronRight, 
  Layers, 
  Zap, 
  Sparkles,
  Filter,
  TrendingDown
} from 'lucide-react';
import { api } from '../services/api';

export default function ProjectScheduling() {
  const [schedule, setSchedule] = useState(null);
  const [filterMode, setFilterMode] = useState('all'); // 'all', 'critical', 'active'
  const [selectedPhase, setSelectedPhase] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchSchedule = async () => {
      setLoading(true);
      const data = await api.getSchedule();
      setSchedule(data);
      if (data?.phases?.length > 0) {
        setSelectedPhase(data.phases[3]); // Default select Superstructure
      }
      setLoading(false);
    };
    fetchSchedule();
  }, []);

  const totalDays = schedule?.total_planned_days || 540;
  const currentDay = schedule?.current_day || 226;

  // Filter phases
  const filteredPhases = schedule?.phases?.filter(p => {
    if (filterMode === 'critical') return p.is_critical_path;
    if (filterMode === 'active') return p.status === 'In Progress' || p.delay_risk === 'High';
    return true;
  }) || [];

  return (
    <div className="space-y-6">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <CalendarRange className="w-5 h-5" />
            </div>
            <h2 className="text-xl lg:text-2xl font-black text-white font-display tracking-tight">
              Construction Project Planning & Scheduling
            </h2>
          </div>
          <p className="text-xs lg:text-sm text-slate-400 mt-1">
            Gantt-style lifecycle phases, Critical Path Method (CPM) dependencies, milestone sign-offs, and automated delay mitigations.
          </p>
        </div>

        {/* Milestone Badge Pill */}
        <div className="flex items-center gap-2 text-xs font-mono text-blue-400 bg-blue-500/10 border border-blue-500/30 px-3 py-1.5 rounded-xl">
          <Clock className="w-3.5 h-3.5" />
          <span>Day {currentDay} of {totalDays} ({schedule?.overall_progress_pct || 0}% Complete)</span>
        </div>
      </div>

      {/* Top Level Metric Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-1">
          <span className="text-[10px] font-mono uppercase text-slate-400 block font-semibold">Active Project</span>
          <span className="text-sm font-bold text-white truncate block">{schedule?.project_name}</span>
          <span className="text-[10px] font-mono text-emerald-400">Target Duration: {totalDays} Days</span>
        </div>
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-1">
          <span className="text-[10px] font-mono uppercase text-slate-400 block font-semibold">Overall Progress</span>
          <span className="text-2xl font-black text-amber-400 font-display">{schedule?.overall_progress_pct}%</span>
          <span className="text-[10px] font-mono text-slate-400">Day {currentDay} Baseline</span>
        </div>
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-1">
          <span className="text-[10px] font-mono uppercase text-slate-400 block font-semibold">Critical Path</span>
          <span className="text-2xl font-black text-red-400 font-display">{schedule?.critical_path_phases?.length || 0} Phases</span>
          <span className="text-[10px] font-mono text-red-400/80">0 Free Float Buffer</span>
        </div>
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-1">
          <span className="text-[10px] font-mono uppercase text-slate-400 block font-semibold">Projected Float Variance</span>
          <span className="text-2xl font-black text-amber-400 font-display">+{schedule?.projected_delay_days || 0} Days</span>
          <span className="text-[10px] font-mono text-amber-400/80">Weather/Supply delta</span>
        </div>
      </div>

      {/* Main Gantt Timeline View */}
      <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-2xl space-y-4">
        
        {/* Timeline Header Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold">
              Gantt Lifecycle Breakdown
            </span>
            <span className="text-xs font-mono text-slate-500">
              ({filteredPhases.length} Phases Shown)
            </span>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
            <button
              onClick={() => setFilterMode('all')}
              className={`px-3 py-1 rounded-lg transition cursor-pointer ${
                filterMode === 'all' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              All Phases
            </button>
            <button
              onClick={() => setFilterMode('critical')}
              className={`px-3 py-1 rounded-lg transition cursor-pointer ${
                filterMode === 'critical' ? 'bg-red-500 text-white font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Critical Path Only
            </button>
            <button
              onClick={() => setFilterMode('active')}
              className={`px-3 py-1 rounded-lg transition cursor-pointer ${
                filterMode === 'active' ? 'bg-blue-500 text-white font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              In Progress / Risks
            </button>
          </div>
        </div>

        {/* Gantt Bar Rows */}
        <div className="space-y-3 overflow-x-auto">
          {/* Day Axis Scale */}
          <div className="min-w-[650px] flex items-center justify-between text-[10px] font-mono text-slate-500 px-2 pb-1 border-b border-slate-800/60">
            <span>DAY 0 (Groundbreak)</span>
            <span>DAY 90 (Piling)</span>
            <span>DAY 180 (Substructure)</span>
            <span>DAY 270 (Topping Out)</span>
            <span>DAY 360 (Envelope)</span>
            <span>DAY 450 (Finishes)</span>
            <span>DAY 540 (Handover)</span>
          </div>

          <div className="min-w-[650px] space-y-2">
            {filteredPhases.map((phase) => {
              const startPct = (phase.start_day / totalDays) * 100;
              const widthPct = Math.max(5, (phase.duration_days / totalDays) * 100);
              const isSelected = selectedPhase?.id === phase.id;

              const statusColor = phase.status === 'Completed' 
                ? 'bg-emerald-500' 
                : (phase.status === 'In Progress' ? 'bg-amber-500' : 'bg-slate-700');

              return (
                <div
                  key={phase.id}
                  onClick={() => setSelectedPhase(phase)}
                  className={`p-3 rounded-xl transition cursor-pointer border ${
                    isSelected 
                      ? 'bg-slate-800/90 border-amber-500/60 shadow-md' 
                      : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-bold border border-slate-700">
                        {phase.id}
                      </span>
                      <span className="font-semibold text-white">
                        {phase.phase_name}
                      </span>
                      {phase.is_critical_path && (
                        <span className="text-[9px] font-mono uppercase bg-red-500/20 text-red-400 border border-red-500/30 px-1.5 py-0.5 rounded font-bold">
                          Critical Path (CPM)
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-3 font-mono text-[11px]">
                      <span className="text-slate-400">Day {phase.start_day} - {phase.end_day} ({phase.duration_days}d)</span>
                      <span className={`font-bold ${
                        phase.progress_pct === 100 ? 'text-emerald-400' : (phase.progress_pct > 0 ? 'text-amber-400' : 'text-slate-500')
                      }`}>
                        {phase.progress_pct}%
                      </span>
                    </div>
                  </div>

                  {/* Gantt Bar Visual Track */}
                  <div className="relative w-full h-4 bg-slate-900 rounded-lg overflow-hidden border border-slate-800">
                    {/* Current Day Baseline Vertical Marker */}
                    <div 
                      style={{ left: `${(currentDay / totalDays) * 100}%` }}
                      className="absolute top-0 bottom-0 w-0.5 bg-cyan-400 z-10 opacity-75"
                      title={`Today: Day ${currentDay}`}
                    />

                    {/* Phase Duration Span */}
                    <div
                      style={{ left: `${startPct}%`, width: `${widthPct}%` }}
                      className={`absolute top-0 bottom-0 rounded transition-all duration-500 flex items-center overflow-hidden ${
                        phase.is_critical_path ? 'bg-red-500/30 border border-red-500/60' : 'bg-slate-700/40 border border-slate-600/50'
                      }`}
                    >
                      {/* Inner Progress Fill */}
                      <div
                        style={{ width: `${phase.progress_pct}%` }}
                        className={`h-full ${statusColor} opacity-90 transition-all duration-500`}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

        </div>

      </div>

      {/* Bottom Grid: Phase Inspector & Milestone Deliverables */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Selected Phase Detail Drawer */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase text-slate-400">Phase Inspector</span>
                <h3 className="text-base font-bold text-white font-display mt-0.5">
                  {selectedPhase?.phase_name || 'Select a phase'}
                </h3>
              </div>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                selectedPhase?.delay_risk === 'High' ? 'bg-red-500/20 text-red-400' : 'bg-emerald-500/20 text-emerald-400'
              }`}>
                {selectedPhase?.delay_risk} Delay Risk
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs pt-1">
              <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
                <span className="text-[10px] font-mono text-slate-400 block">Subcontractor</span>
                <span className="font-semibold text-slate-200">{selectedPhase?.contractor}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
                <span className="text-[10px] font-mono text-slate-400 block">Category</span>
                <span className="font-semibold text-amber-400">{selectedPhase?.category}</span>
              </div>
            </div>

            {/* Risk Factors */}
            <div className="space-y-1.5 pt-2 border-t border-slate-800">
              <span className="text-xs font-mono uppercase text-slate-400 font-semibold block">
                Field Observations & Watch Items
              </span>
              <ul className="space-y-1 text-xs text-slate-300">
                {selectedPhase?.risk_factors?.map((rf, i) => (
                  <li key={i} className="flex items-start gap-2 bg-slate-950/40 p-2 rounded-lg border border-slate-800/80">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-400 flex-shrink-0 mt-0.5" />
                    <span>{rf}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* AI Schedule Optimization Advisories */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 shadow-xl space-y-3">
            <span className="text-xs font-mono uppercase tracking-wider text-amber-400 font-bold flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              AI Schedule Optimization Advisories
            </span>
            <div className="space-y-2">
              {schedule?.ai_schedule_advisories?.map((adv, idx) => (
                <div key={idx} className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 text-xs text-slate-300 leading-relaxed">
                  {adv}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Milestone Tracker Column */}
        <div className="lg:col-span-7 space-y-4">
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Milestone className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm font-bold text-white font-display">
                  Project Milestones & Deliverables Sign-off
                </h3>
              </div>
              <span className="text-xs font-mono text-slate-400">
                {schedule?.milestones?.filter(m => m.status === 'Completed').length} / {schedule?.milestones?.length} Done
              </span>
            </div>

            <div className="space-y-2.5">
              {schedule?.milestones?.map((m) => {
                const isDone = m.status === 'Completed';
                const isRisk = m.status === 'At Risk';
                return (
                  <div
                    key={m.id}
                    className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-between gap-3 hover:border-slate-700 transition"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${
                        isDone ? 'bg-emerald-500/20 text-emerald-400' : (isRisk ? 'bg-red-500/20 text-red-400' : 'bg-slate-800 text-slate-400')
                      }`}>
                        {isDone ? <CheckCircle2 className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white">{m.title}</div>
                        <div className="text-[11px] text-slate-400">{m.deliverable}</div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                        isDone ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : (isRisk ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-blue-500/20 text-blue-400 border border-blue-500/30')
                      }`}>
                        {m.status}
                      </div>
                      <span className="text-[10px] font-mono text-slate-500 block mt-1">Due Day {m.due_day}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
