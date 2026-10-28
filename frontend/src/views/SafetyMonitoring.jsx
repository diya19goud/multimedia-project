import React, { useState, useEffect, useRef } from 'react';
import { 
  ShieldAlert, 
  Upload, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Camera, 
  RefreshCw, 
  FileText, 
  Eye, 
  EyeOff, 
  Download,
  Users,
  HardHat,
  Sparkles,
  ClipboardCheck
} from 'lucide-react';
import { api } from '../services/api';

export default function SafetyMonitoring() {
  const [activeSubTab, setActiveSubTab] = useState('vision'); // 'vision' or 'checklist'
  const [samples, setSamples] = useState([]);
  const [selectedSample, setSelectedSample] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [showBoxes, setShowBoxes] = useState(true);
  const [boxFilter, setBoxFilter] = useState('all'); // 'all', 'violation', 'compliant'
  
  // Checklist state
  const [checklist, setChecklist] = useState({
    site_zone: 'Zone A - High Rise Sector',
    worker_count: 14,
    hard_hats_checked: true,
    hi_vis_checked: true,
    safety_boots_checked: true,
    eye_protection_checked: false,
    fall_harnesses_checked: false,
    scaffolding_inspected: true,
    fire_extinguishers_accessible: true,
    first_aid_station_ready: true,
    hot_work_permit_valid: true,
    notes: 'Morning wind gusts around 20 kph. Slab edge deck work ongoing.'
  });
  const [checklistResult, setChecklistResult] = useState(null);
  const [evaluatingChecklist, setEvaluatingChecklist] = useState(false);

  const fileInputRef = useRef(null);

  useEffect(() => {
    // Load pre-configured site samples
    const loadSamples = async () => {
      const data = await api.getSafetySamples();
      setSamples(data);
      if (data && data.length > 0) {
        handleSelectSample(data[0]);
      }
    };
    loadSamples();
  }, []);

  const handleSelectSample = async (sample) => {
    setSelectedSample(sample);
    setPreviewImage(sample.preview_url);
    setLoading(true);

    const formData = new FormData();
    formData.append('preset', sample.preset);
    const data = await api.analyzeSafetyImage(formData);
    setResult(data);
    setLoading(false);
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedSample(null);
    const objectUrl = URL.createObjectURL(file);
    setPreviewImage(objectUrl);
    setLoading(true);

    const formData = new FormData();
    formData.append('file', file);
    const data = await api.analyzeSafetyImage(formData);
    setResult(data);
    setLoading(false);
  };

  const handleChecklistSubmit = async (e) => {
    e.preventDefault();
    setEvaluatingChecklist(true);
    const res = await api.evaluateSafetyChecklist(checklist);
    setChecklistResult(res);
    setEvaluatingChecklist(false);
  };

  const downloadAuditReport = () => {
    const activeData = activeSubTab === 'vision' ? result : checklistResult;
    if (!activeData) return;
    const blob = new Blob([JSON.stringify(activeData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Safety_Audit_${activeData.analysis_id}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Filter bounding boxes
  const visibleBoxes = result?.bounding_boxes?.filter(b => {
    if (boxFilter === 'all') return true;
    if (boxFilter === 'violation') return b.status === 'violation' || b.status === 'hazard';
    if (boxFilter === 'compliant') return b.status === 'compliant';
    return true;
  }) || [];

  return (
    <div className="space-y-6">
      
      {/* Header and Subtab Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <h2 className="text-xl lg:text-2xl font-black text-white font-display tracking-tight">
              Construction Site Safety Monitoring
            </h2>
          </div>
          <p className="text-xs lg:text-sm text-slate-400 mt-1">
            Multimodal computer vision for real-time PPE compliance, OSHA violation detection, and hazard perimeter tracking.
          </p>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex items-center gap-2 bg-slate-900 p-1 rounded-xl border border-slate-800 self-start md:self-auto">
          <button
            onClick={() => setActiveSubTab('vision')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
              activeSubTab === 'vision'
                ? 'bg-amber-500 text-slate-950 shadow-glow-amber'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Camera className="w-3.5 h-3.5" />
            <span>AI Vision Inspector</span>
          </button>
          <button
            onClick={() => {
              setActiveSubTab('checklist');
              if (!checklistResult) handleChecklistSubmit({ preventDefault: () => {} });
            }}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
              activeSubTab === 'checklist'
                ? 'bg-amber-500 text-slate-950 shadow-glow-amber'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <ClipboardCheck className="w-3.5 h-3.5" />
            <span>Shift Pre-Checklist</span>
          </button>
        </div>
      </div>

      {activeSubTab === 'vision' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column: Image Viewer with Interactive Bounding Boxes */}
          <div className="lg:col-span-7 space-y-4">
            
            {/* Quick Sample Selector */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-mono uppercase text-slate-400 font-semibold flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-400" /> Samples:
              </span>
              {samples.map((s) => (
                <button
                  key={s.id}
                  onClick={() => handleSelectSample(s)}
                  className={`px-2.5 py-1 rounded-lg text-xs transition border cursor-pointer ${
                    selectedSample?.id === s.id
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 font-semibold'
                      : 'bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {s.name.split(' (')[0]}
                </button>
              ))}

              <button
                onClick={() => fileInputRef.current?.click()}
                className="ml-auto flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition border border-slate-700 cursor-pointer"
              >
                <Upload className="w-3.5 h-3.5 text-amber-400" />
                <span>Upload Site Photo</span>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>

            {/* Main Interactive Canvas / Image Display */}
            <div className="relative rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 aspect-[16/10] flex items-center justify-center group shadow-2xl">
              {loading && (
                <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm z-30 flex flex-col items-center justify-center gap-3">
                  <div className="relative w-12 h-12">
                    <RefreshCw className="w-12 h-12 text-amber-500 animate-spin" />
                  </div>
                  <p className="text-xs font-mono text-amber-300 uppercase tracking-widest animate-pulse">
                    Running YOLO-v11 PPE & Perimeter Inference...
                  </p>
                </div>
              )}

              {previewImage ? (
                <div className="relative w-full h-full">
                  <img
                    src={previewImage}
                    alt="Site Safety Scan"
                    className="w-full h-full object-cover"
                  />

                  {/* Bounding Box SVG Layer */}
                  {showBoxes && (
                    <div className="absolute inset-0 pointer-events-none">
                      {visibleBoxes.map((box, idx) => {
                        const isViolation = box.status === 'violation';
                        const isHazard = box.status === 'hazard';
                        const borderColor = isViolation 
                          ? 'border-red-500 bg-red-500/15 text-red-300' 
                          : (isHazard ? 'border-amber-500 bg-amber-500/15 text-amber-300' : 'border-emerald-400 bg-emerald-500/15 text-emerald-300');
                        const labelBg = isViolation 
                          ? 'bg-red-600 text-white' 
                          : (isHazard ? 'bg-amber-600 text-slate-950 font-bold' : 'bg-emerald-600 text-white font-medium');

                        return (
                          <div
                            key={idx}
                            style={{
                              left: `${box.x}%`,
                              top: `${box.y}%`,
                              width: `${box.width}%`,
                              height: `${box.height}%`,
                            }}
                            className={`absolute border-2 ${borderColor} rounded-sm transition-all duration-300 flex flex-col justify-start`}
                          >
                            <span className={`text-[9px] font-mono uppercase px-1 py-0.5 rounded-br w-max tracking-tight ${labelBg} shadow-sm`}>
                              {box.label} ({Math.round(box.confidence * 100)}%)
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Canvas Controls Overlay */}
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between pointer-events-auto">
                    <div className="flex items-center gap-1.5 bg-slate-950/80 backdrop-blur-md px-2.5 py-1 rounded-lg border border-slate-700/60 text-xs">
                      <button
                        onClick={() => setShowBoxes(!showBoxes)}
                        className="flex items-center gap-1 text-slate-300 hover:text-white transition cursor-pointer"
                      >
                        {showBoxes ? <Eye className="w-3.5 h-3.5 text-amber-400" /> : <EyeOff className="w-3.5 h-3.5 text-slate-500" />}
                        <span>{showBoxes ? 'Boxes ON' : 'Boxes OFF'}</span>
                      </button>
                      <span className="text-slate-600">|</span>
                      <select
                        value={boxFilter}
                        onChange={(e) => setBoxFilter(e.target.value)}
                        className="bg-transparent text-slate-300 text-xs focus:outline-none cursor-pointer"
                      >
                        <option value="all" className="bg-slate-900">Show All</option>
                        <option value="violation" className="bg-slate-900">Violations Only</option>
                        <option value="compliant" className="bg-slate-900">Compliant Only</option>
                      </select>
                    </div>

                    <span className="text-[11px] font-mono text-slate-300 bg-slate-950/80 backdrop-blur-md px-2.5 py-1 rounded-lg border border-slate-700/60">
                      Detected: {result?.bounding_boxes?.length || 0} objects
                    </span>
                  </div>
                </div>
              ) : (
                <div className="text-center p-8 text-slate-500">
                  <Camera className="w-12 h-12 mx-auto mb-2 text-slate-600" />
                  <p className="text-sm">Select a sample or upload a construction site photo</p>
                </div>
              )}
            </div>

            {/* PPE Inventory Compliance Pills */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-2">
              {result?.ppe_items?.map((item, i) => (
                <div key={i} className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
                  <div>
                    <div className="text-[11px] font-semibold text-slate-300 truncate max-w-[130px]">
                      {item.item_name.split(' (')[0]}
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono">
                      {item.detected} / {item.required} verified
                    </div>
                  </div>
                  <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
                    item.status === 'Compliant'
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'bg-red-500/20 text-red-400 border border-red-500/30'
                  }`}>
                    {item.compliance_rate}%
                  </span>
                </div>
              ))}
            </div>

          </div>

          {/* Right Column: Safety Score, Violations & Action Plan */}
          <div className="lg:col-span-5 space-y-4">
            
            {/* Score & Health Card */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block font-semibold">
                    Overall Site HSE Index
                  </span>
                  <div className="flex items-baseline gap-2 mt-0.5">
                    <span className={`text-4xl font-black font-display ${
                      (result?.overall_safety_score || 0) >= 85 
                        ? 'text-emerald-400' 
                        : ((result?.overall_safety_score || 0) >= 70 ? 'text-amber-400' : 'text-red-400')
                    }`}>
                      {result?.overall_safety_score || '--'}
                    </span>
                    <span className="text-slate-500 text-sm font-mono font-semibold">/ 100</span>
                  </div>
                </div>

                <div className={`px-3 py-1.5 rounded-xl border text-xs font-bold font-mono ${
                  result?.status === 'Safe' 
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' 
                    : (result?.status === 'Caution Needed' ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' : 'bg-red-500/20 text-red-300 border-red-500/40 animate-pulse')
                }`}>
                  {result?.status || 'ANALYZING'}
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-700 ${
                    (result?.overall_safety_score || 0) >= 85 
                      ? 'bg-emerald-500' 
                      : ((result?.overall_safety_score || 0) >= 70 ? 'bg-amber-500' : 'bg-red-500')
                  }`}
                  style={{ width: `${result?.overall_safety_score || 0}%` }}
                />
              </div>

              {/* Quick Stat Tiles */}
              <div className="grid grid-cols-3 gap-2 pt-1 border-t border-slate-800/80 text-center">
                <div className="p-2 rounded-lg bg-slate-950/50">
                  <span className="text-[10px] text-slate-400 block font-mono">WORKERS</span>
                  <span className="text-sm font-bold text-white">{result?.workers_detected || 0}</span>
                </div>
                <div className="p-2 rounded-lg bg-slate-950/50">
                  <span className="text-[10px] text-slate-400 block font-mono">VIOLATIONS</span>
                  <span className="text-sm font-bold text-red-400">{result?.violations?.length || 0}</span>
                </div>
                <div className="p-2 rounded-lg bg-slate-950/50">
                  <span className="text-[10px] text-slate-400 block font-mono">PPE RATE</span>
                  <span className="text-sm font-bold text-emerald-400">{result?.ppe_compliance_rate || 0}%</span>
                </div>
              </div>

              {/* Executive Summary */}
              {result?.executive_summary && (
                <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 text-xs text-slate-300 leading-relaxed">
                  <span className="font-semibold text-amber-400 block mb-1">AI Executive Summary:</span>
                  {result.executive_summary}
                </div>
              )}
            </div>

            {/* Violations List */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                  Identified Infractions ({result?.violations?.length || 0})
                </h3>
                <button
                  onClick={downloadAuditReport}
                  className="flex items-center gap-1 text-[11px] font-mono text-slate-400 hover:text-amber-400 transition cursor-pointer"
                >
                  <Download className="w-3 h-3" />
                  Export JSON
                </button>
              </div>

              {result?.violations && result.violations.length > 0 ? (
                <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1">
                  {result.violations.map((v) => (
                    <div 
                      key={v.id}
                      className="p-3 rounded-xl bg-slate-900/80 border border-red-500/30 hover:border-red-500/60 transition space-y-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white flex items-center gap-1.5">
                          <XCircle className="w-3.5 h-3.5 text-red-400 flex-shrink-0" />
                          {v.category}
                        </span>
                        <div className="flex items-center gap-1.5">
                          {v.osha_reference && (
                            <span className="text-[10px] font-mono bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded border border-slate-700">
                              {v.osha_reference}
                            </span>
                          )}
                          <span className={`text-[10px] font-mono uppercase font-bold px-1.5 py-0.5 rounded ${
                            v.severity === 'Critical' 
                              ? 'bg-red-500/20 text-red-300 border border-red-500/40' 
                              : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                          }`}>
                            {v.severity}
                          </span>
                        </div>
                      </div>
                      <p className="text-[11px] text-slate-300 leading-snug">
                        {v.description}
                      </p>
                      <div className="text-[11px] text-amber-300/90 font-medium pt-1 border-t border-slate-800/80">
                        <span className="font-semibold text-amber-400">Action:</span> {v.recommendation}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-slate-900/40 border border-emerald-500/20 text-center text-xs text-emerald-400 flex items-center justify-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>No active safety violations detected. Site in compliance.</span>
                </div>
              )}
            </div>

            {/* Corrective Actions Checklist */}
            {result?.corrective_actions && result.corrective_actions.length > 0 && (
              <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
                <span className="text-xs font-bold text-slate-200 block font-display">
                  Immediate Corrective Directives
                </span>
                <ul className="space-y-1.5">
                  {result.corrective_actions.map((act, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 flex-shrink-0"></span>
                      <span>{act}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

          </div>

        </div>
      ) : (
        /* Daily Shift Pre-Checklist Tab */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <form onSubmit={handleChecklistSubmit} className="lg:col-span-7 space-y-4">
            <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <h3 className="text-sm font-bold text-white font-display">
                  Daily Shift Safety & Hazard Verification Form
                </h3>
                <span className="text-xs font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                  OSHA 1926 General Provisions
                </span>
              </div>

              {/* Zone and Worker count */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Active Site Zone</label>
                  <input
                    type="text"
                    value={checklist.site_zone}
                    onChange={(e) => setChecklist({ ...checklist, site_zone: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Active Worker Count</label>
                  <input
                    type="number"
                    min="1"
                    value={checklist.worker_count}
                    onChange={(e) => setChecklist({ ...checklist, worker_count: parseInt(e.target.value) || 1 })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              {/* Checklist Toggles */}
              <div className="space-y-2 pt-2">
                <span className="text-xs font-mono uppercase text-slate-400 font-semibold block">
                  Mandatory Pre-Shift Verification Items
                </span>

                {[
                  { key: 'hard_hats_checked', label: '100% Hard Hats ANSI Z89.1 Inspected & Issued' },
                  { key: 'hi_vis_checked', label: 'High-Visibility Retroreflective Vests Worn by All Trades' },
                  { key: 'safety_boots_checked', label: 'ASTM F2413 Steel/Composite Safety Footwear Verified' },
                  { key: 'fall_harnesses_checked', label: 'Full Body Harness & SRL Lanyards Tagged for Work >6ft' },
                  { key: 'scaffolding_inspected', label: 'Scaffolding Green-Tag Signed by Competent Person' },
                  { key: 'fire_extinguishers_accessible', label: '10lb ABC Fire Extinguishers Charged & Unobstructed' },
                  { key: 'first_aid_station_ready', label: 'Site First Aid Station Stocked & Eyewash Operational' },
                  { key: 'hot_work_permit_valid', label: 'Hot Work Cutting/Welding Permits Signed with Fire Watch' }
                ].map((item) => (
                  <label 
                    key={item.key}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:border-slate-700 cursor-pointer transition"
                  >
                    <span className="text-xs text-slate-200 font-medium">{item.label}</span>
                    <input
                      type="checkbox"
                      checked={checklist[item.key]}
                      onChange={(e) => setChecklist({ ...checklist, [item.key]: e.target.checked })}
                      className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
                    />
                  </label>
                ))}
              </div>

              <button
                type="submit"
                disabled={evaluatingChecklist}
                className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition shadow-glow-amber flex items-center justify-center gap-2 cursor-pointer"
              >
                {evaluatingChecklist ? <RefreshCw className="w-4 h-4 animate-spin" /> : <ShieldAlert className="w-4 h-4" />}
                <span>Evaluate Shift Safety Score</span>
              </button>
            </div>
          </form>

          {/* Checklist Result View */}
          <div className="lg:col-span-5 space-y-4">
            {checklistResult ? (
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-mono uppercase text-slate-400">Shift Safety Rating</span>
                    <div className="text-3xl font-black text-white font-display mt-0.5">
                      {checklistResult.overall_safety_score} <span className="text-sm text-slate-500 font-mono">/ 100</span>
                    </div>
                  </div>
                  <div className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold ${
                    checklistResult.overall_safety_score >= 85 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-300'
                  }`}>
                    {checklistResult.status}
                  </div>
                </div>

                <p className="text-xs text-slate-300 bg-slate-950/60 p-3 rounded-xl border border-slate-800 leading-relaxed">
                  {checklistResult.executive_summary}
                </p>

                {checklistResult.violations.length > 0 && (
                  <div className="space-y-2">
                    <span className="text-xs font-mono uppercase text-red-400 font-semibold block">
                      Discrepancies to Resolve ({checklistResult.violations.length})
                    </span>
                    {checklistResult.violations.map((v) => (
                      <div key={v.id} className="p-2.5 rounded-lg bg-red-500/10 border border-red-500/30 text-xs text-slate-300">
                        <span className="font-bold text-red-300 block">{v.category}</span>
                        {v.description}
                      </div>
                    ))}
                  </div>
                )}

                <button
                  onClick={downloadAuditReport}
                  className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition border border-slate-700 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5 text-amber-400" />
                  <span>Download Signed Safety Checklist PDF / JSON</span>
                </button>
              </div>
            ) : (
              <div className="p-8 rounded-2xl bg-slate-900/40 border border-slate-800/80 text-center text-slate-500 text-xs">
                Submit checklist form to calculate instant shift compliance score.
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
