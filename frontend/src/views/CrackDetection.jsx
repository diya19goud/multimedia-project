import React, { useState, useEffect, useRef } from 'react';
import { 
  ScanLine, 
  Upload, 
  AlertTriangle, 
  Wrench, 
  Layers, 
  CheckCircle2, 
  Clock, 
  DollarSign, 
  FileText, 
  RefreshCw,
  Sparkles,
  Maximize2,
  Bookmark
} from 'lucide-react';
import { api } from '../services/api';

export default function CrackDetection() {
  const [samples, setSamples] = useState([]);
  const [selectedSample, setSelectedSample] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [showOverlay, setShowOverlay] = useState(true);

  const fileInputRef = useRef(null);

  useEffect(() => {
    const loadSamples = async () => {
      const data = await api.getCrackSamples();
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
    formData.append('preset_severity', sample.severity);
    const data = await api.analyzeCrackImage(formData);
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
    const data = await api.analyzeCrackImage(formData);
    setResult(data);
    setLoading(false);
  };

  const isSevere = result?.severity_level === 'Severe';
  const isModerate = result?.severity_level === 'Moderate';

  const severityColor = isSevere 
    ? 'text-red-400 border-red-500/40 bg-red-500/10' 
    : (isModerate ? 'text-amber-400 border-amber-500/40 bg-amber-500/10' : 'text-cyan-400 border-cyan-500/40 bg-cyan-500/10');

  return (
    <div className="space-y-6">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <ScanLine className="w-5 h-5" />
            </div>
            <h2 className="text-xl lg:text-2xl font-black text-white font-display tracking-tight">
              Structural Crack Detection & Risk Classification
            </h2>
          </div>
          <p className="text-xs lg:text-sm text-slate-400 mt-1">
            Multimodal deep learning evaluation of concrete fissures, shear fractures, width estimation, and structural remediation protocols.
          </p>
        </div>

        {/* Sample selection / Upload buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition shadow-glow-amber cursor-pointer"
          >
            <Upload className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Upload Crack Photo</span>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
          />
        </div>
      </div>

      {/* Preset Quick Chips */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-mono uppercase text-slate-400 font-semibold flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-cyan-400" /> Presets:
        </span>
        {samples.map((s) => (
          <button
            key={s.id}
            onClick={() => handleSelectSample(s)}
            className={`px-3 py-1.5 rounded-xl text-xs transition border flex items-center gap-2 cursor-pointer ${
              selectedSample?.id === s.id
                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50 font-bold'
                : 'bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700'
            }`}
          >
            <span>{s.name}</span>
            <span className={`text-[10px] font-mono px-1 rounded ${
              s.severity === 'Severe' ? 'bg-red-500/20 text-red-300' : (s.severity === 'Moderate' ? 'bg-amber-500/20 text-amber-300' : 'bg-cyan-500/20 text-cyan-300')
            }`}>
              {s.width}
            </span>
          </button>
        ))}
      </div>

      {/* Main Analysis Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Image with Vector Crack Visualization */}
        <div className="lg:col-span-6 space-y-4">
          <div className="relative rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 aspect-[4/3] flex items-center justify-center shadow-2xl">
            {loading && (
              <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm z-30 flex flex-col items-center justify-center gap-3">
                <RefreshCw className="w-10 h-10 text-cyan-400 animate-spin" />
                <p className="text-xs font-mono text-cyan-300 uppercase tracking-widest animate-pulse">
                  Performing Photogrammetric Crack Metrology...
                </p>
              </div>
            )}

            {previewImage && (
              <div className="relative w-full h-full">
                <img
                  src={previewImage}
                  alt="Crack Inspection Preview"
                  className="w-full h-full object-cover"
                />

                {/* Vector SVG Overlay for Cracks */}
                {showOverlay && result?.annotations && (
                  <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="crackGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#EF4444" stopOpacity="0.9" />
                        <stop offset="100%" stopColor="#F59E0B" stopOpacity="0.9" />
                      </linearGradient>
                      <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                        <feGaussianBlur stdDeviation="1.5" result="blur" />
                        <feComposite in="SourceGraphic" in2="blur" operator="over" />
                      </filter>
                    </defs>

                    {result.annotations.map((ann) => (
                      <g key={ann.id}>
                        {/* Bounding Box */}
                        <rect
                          x={ann.box_x}
                          y={ann.box_y}
                          width={ann.box_width}
                          height={ann.box_height}
                          fill="rgba(239, 68, 68, 0.12)"
                          stroke={isSevere ? '#EF4444' : (isModerate ? '#F59E0B' : '#06B6D4')}
                          strokeWidth="0.8"
                          strokeDasharray="2 1"
                        />
                        {/* Crack Rupture Polyline */}
                        <line
                          x1={ann.start_point.x}
                          y1={ann.start_point.y}
                          x2={ann.end_point.x}
                          y2={ann.end_point.y}
                          stroke="url(#crackGradient)"
                          strokeWidth="2.2"
                          strokeLinecap="round"
                          filter="url(#glow)"
                        />
                      </g>
                    ))}
                  </svg>
                )}

                {/* Overlaid HUD Controls */}
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                  <button
                    onClick={() => setShowOverlay(!showOverlay)}
                    className="bg-slate-950/80 backdrop-blur-md px-3 py-1 rounded-lg border border-slate-700/60 text-xs font-mono text-slate-200 hover:text-white transition cursor-pointer"
                  >
                    Overlay: {showOverlay ? 'Active (Vector Mesh)' : 'Hidden'}
                  </button>

                  <span className="bg-slate-950/80 backdrop-blur-md px-3 py-1 rounded-lg border border-slate-700/60 text-xs font-mono text-cyan-300">
                    Est. Width: {result?.estimated_max_width_mm || '--'} mm
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Physical Metric Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <div className="p-3 rounded-xl bg-slate-900/70 border border-slate-800 text-center">
              <span className="text-[10px] font-mono uppercase text-slate-400 block">Max Width</span>
              <span className="text-sm font-bold text-white font-mono">{result?.estimated_max_width_mm || 0} mm</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/70 border border-slate-800 text-center">
              <span className="text-[10px] font-mono uppercase text-slate-400 block">Estimated Depth</span>
              <span className="text-sm font-bold text-white font-mono">{result?.estimated_depth_mm || 0} mm</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/70 border border-slate-800 text-center">
              <span className="text-[10px] font-mono uppercase text-slate-400 block">Orientation</span>
              <span className="text-xs font-bold text-slate-200 truncate block">{result?.orientation || 'Unknown'}</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/70 border border-slate-800 text-center">
              <span className="text-[10px] font-mono uppercase text-slate-400 block">Element</span>
              <span className="text-xs font-bold text-amber-400 truncate block">{result?.element_type || 'RC Member'}</span>
            </div>
          </div>

          {/* Standards & Citations Card */}
          <div className="p-3.5 rounded-xl bg-slate-900/40 border border-slate-800/80 space-y-2">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold flex items-center gap-1.5">
              <Bookmark className="w-3.5 h-3.5 text-cyan-400" />
              Structural Concrete Code References
            </span>
            <div className="flex flex-wrap gap-1.5">
              {result?.building_code_citations?.map((cite, idx) => (
                <span key={idx} className="text-[11px] font-mono bg-slate-950 px-2 py-1 rounded border border-slate-800 text-slate-300">
                  {cite}
                </span>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column: Classification, Urgency & Remedial Protocol */}
        <div className="lg:col-span-6 space-y-4">
          
          {/* Risk Classification Header Card */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 shadow-xl space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
                  Structural Diagnosis
                </span>
                <h3 className="text-lg font-bold text-white font-display mt-0.5">
                  {result?.crack_type || 'Processing...'}
                </h3>
              </div>

              <div className={`px-3 py-1 rounded-xl text-xs font-bold font-mono border ${severityColor}`}>
                {result?.severity_level || 'ANALYZING'}
              </div>
            </div>

            {/* Risk Gauge */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-slate-400">Structural Vulnerability Score:</span>
                <span className={`font-bold ${isSevere ? 'text-red-400' : 'text-amber-400'}`}>
                  {result?.structural_risk_score || 0} / 100 ({result?.risk_classification})
                </span>
              </div>
              <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-700 ${
                    (result?.structural_risk_score || 0) > 75 
                      ? 'bg-red-500' 
                      : ((result?.structural_risk_score || 0) > 40 ? 'bg-amber-500' : 'bg-cyan-500')
                  }`}
                  style={{ width: `${result?.structural_risk_score || 0}%` }}
                />
              </div>
            </div>

            {/* Urgency Callout */}
            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 text-xs text-slate-300">
              <Clock className="w-4 h-4 text-amber-400 flex-shrink-0" />
              <span>
                <span className="font-semibold text-white">Recommended Intervention Window: </span>
                <span className="font-mono text-amber-300">{result?.urgency}</span>
              </span>
            </div>

            {/* Engineering Assessment */}
            <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/40 p-3 rounded-xl border border-slate-800/80">
              {result?.engineering_assessment}
            </p>
          </div>

          {/* Step-by-Step Remedial Action Engineering Plan */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold flex items-center gap-1.5">
                <Wrench className="w-4 h-4 text-amber-400" />
                Structural Remediation Engineering Sequence
              </h3>
              <span className="text-[11px] font-mono text-slate-400">
                Est. Total: ${result?.remedial_actions?.reduce((acc, curr) => acc + curr.estimated_cost_usd, 0).toLocaleString()} USD
              </span>
            </div>

            <div className="space-y-3 max-h-[360px] overflow-y-auto pr-1">
              {result?.remedial_actions?.map((step) => (
                <div
                  key={step.step_number}
                  className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-amber-500 text-slate-950 font-black text-[11px] flex items-center justify-center">
                        {step.step_number}
                      </span>
                      {step.title}
                    </span>
                    <span className="text-xs font-mono font-semibold text-emerald-400">
                      ${step.estimated_cost_usd.toLocaleString()}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-300 leading-relaxed pl-7">
                    {step.procedure}
                  </p>

                  <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800 text-[10px] font-mono text-slate-400 pl-7">
                    <div className="flex items-center gap-1.5">
                      <Layers className="w-3 h-3 text-cyan-400" />
                      <span>{step.materials_required.join(', ')}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-amber-400" />
                      <span>{step.labor_estimate_hours} hrs labor</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
