import React, { useState, useEffect } from 'react';
import { 
  Calculator, 
  DollarSign, 
  TrendingUp, 
  Building, 
  MapPin, 
  Layers, 
  PieChart as PieIcon, 
  BarChart3, 
  Calendar,
  Sparkles,
  RefreshCw,
  CheckSquare
} from 'lucide-react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Tooltip, 
  Legend, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid,
  AreaChart,
  Area
} from 'recharts';
import { api } from '../services/api';

const COLORS = ['#F59E0B', '#3B82F6', '#10B981', '#8B5CF6', '#EC4899', '#06B6D4', '#F97316', '#64748B'];

export default function ValuationEstimator() {
  const [options, setOptions] = useState(null);
  const [params, setParams] = useState({
    location: 'Austin, TX - Metro Corridor',
    project_type: 'Commercial Office',
    built_up_area_sqft: 28000,
    floors_count: 5,
    construction_quality: 'Premium / Grade A',
    structural_system: 'Reinforced Concrete (RCC)',
    finishes_grade: 'Executive',
    amenities: ['Underground Parking', 'Central HVAC VRF', 'Smart Building BMS', 'Rooftop Solar PV'],
    site_topography: 'Flat / Level'
  });
  
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeChartTab, setActiveChartTab] = useState('breakdown'); // 'breakdown', 'scenarios', 'scurve'

  useEffect(() => {
    const fetchOptions = async () => {
      const opts = await api.getValuationOptions();
      setOptions(opts);
    };
    fetchOptions();
  }, []);

  useEffect(() => {
    const runCalculation = async () => {
      setLoading(true);
      const res = await api.calculateValuation(params);
      setResult(res);
      setLoading(false);
    };
    runCalculation();
  }, [params]);

  const toggleAmenity = (amenity) => {
    setParams(prev => {
      const exists = prev.amenities.includes(amenity);
      return {
        ...prev,
        amenities: exists 
          ? prev.amenities.filter(a => a !== amenity)
          : [...prev.amenities, amenity]
      };
    });
  };

  return (
    <div className="space-y-6">
      
      {/* Page Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Calculator className="w-5 h-5" />
            </div>
            <h2 className="text-xl lg:text-2xl font-black text-white font-display tracking-tight">
              Real Estate Valuation & Construction Cost Estimator
            </h2>
          </div>
          <p className="text-xs lg:text-sm text-slate-400 mt-1">
            Dynamic algorithmic modeling based on RSMeans indices, structural framing differentials, specification tiers, and market capitalization rates.
          </p>
        </div>

        {/* Live Calculation Indicator */}
        <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1.5 rounded-xl">
          <Sparkles className="w-3.5 h-3.5 animate-spin text-emerald-400" />
          <span>Real-time Capital Model</span>
        </div>
      </div>

      {/* Main Grid: Parameters on Left, Financials & Charts on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Interactive Parametric Controls */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-4">
            <h3 className="text-sm font-bold text-white font-display flex items-center gap-2 pb-2 border-b border-slate-800">
              <Building className="w-4 h-4 text-amber-400" />
              Project Specifications & Site Parameters
            </h3>

            {/* Location & Asset Type */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Project Market Location</label>
                <select
                  value={params.location}
                  onChange={(e) => setParams({ ...params, location: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500"
                >
                  {options?.locations?.map(l => (
                    <option key={l} value={l}>{l}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Asset Class / Type</label>
                <select
                  value={params.project_type}
                  onChange={(e) => setParams({ ...params, project_type: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500"
                >
                  {options?.project_types?.map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Built-up Area Slider & Number */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-slate-300">Gross Built-Up Area (sq.ft)</span>
                <span className="font-mono font-bold text-amber-400">{params.built_up_area_sqft.toLocaleString()} sq.ft</span>
              </div>
              <input
                type="range"
                min="2000"
                max="150000"
                step="1000"
                value={params.built_up_area_sqft}
                onChange={(e) => setParams({ ...params, built_up_area_sqft: parseFloat(e.target.value) })}
                className="w-full accent-amber-500 bg-slate-800 h-2 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] font-mono text-slate-500">
                <span>2,000</span>
                <span>75,000</span>
                <span>150,000 sq.ft</span>
              </div>
            </div>

            {/* Stories / Floors & Structural System */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <div className="flex justify-between text-xs font-medium text-slate-400 mb-1">
                  <span>Number of Stories</span>
                  <span className="font-mono text-white">{params.floors_count} Fl</span>
                </div>
                <input
                  type="number"
                  min="1"
                  max="40"
                  value={params.floors_count}
                  onChange={(e) => setParams({ ...params, floors_count: parseInt(e.target.value) || 1 })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Structural Framing</label>
                <select
                  value={params.structural_system}
                  onChange={(e) => setParams({ ...params, structural_system: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500"
                >
                  {options?.structural_systems?.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Quality Tier & Topography */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Specification Tier</label>
                <select
                  value={params.construction_quality}
                  onChange={(e) => setParams({ ...params, construction_quality: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500"
                >
                  {options?.qualities?.map(q => (
                    <option key={q} value={q}>{q}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Site Topography & Soil</label>
                <select
                  value={params.site_topography}
                  onChange={(e) => setParams({ ...params, site_topography: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500"
                >
                  {options?.topographies?.map(top => (
                    <option key={top} value={top}>{top}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* High-Performance Amenity Packages */}
            <div className="space-y-2 pt-2 border-t border-slate-800">
              <span className="text-xs font-mono uppercase text-slate-400 font-semibold block">
                Integrated Systems & Capital Upgrades ({params.amenities.length})
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 max-h-[170px] overflow-y-auto pr-1">
                {options?.amenities?.map((amenity) => {
                  const isChecked = params.amenities.includes(amenity);
                  return (
                    <button
                      key={amenity}
                      type="button"
                      onClick={() => toggleAmenity(amenity)}
                      className={`flex items-center gap-2 p-2 rounded-lg text-left text-[11px] transition border cursor-pointer ${
                        isChecked 
                          ? 'bg-amber-500/15 border-amber-500/40 text-amber-300 font-semibold' 
                          : 'bg-slate-950/60 border-slate-800/80 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <span className={`w-3.5 h-3.5 rounded flex items-center justify-center text-[10px] font-bold ${
                        isChecked ? 'bg-amber-500 text-slate-950' : 'border border-slate-700'
                      }`}>
                        {isChecked && '✓'}
                      </span>
                      <span className="truncate">{amenity}</span>
                    </button>
                  );
                })}
              </div>
            </div>

          </div>
        </div>

        {/* Right Column: Key Financial Metrics & Dynamic Recharts */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* Financial KPI Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            
            {/* Total Delivery Cost */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 shadow-xl space-y-1">
              <span className="text-[10px] font-mono uppercase text-slate-400 block font-semibold">
                Est. Construction Cost
              </span>
              <div className="text-xl sm:text-2xl font-black text-amber-400 font-display">
                ${(result?.total_estimated_cost_usd || 0).toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </div>
              <span className="text-[10px] font-mono text-slate-400 block">
                ${result?.cost_per_sqft || 0}/sq.ft delivered
              </span>
            </div>

            {/* Stabilized Valuation */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 shadow-xl space-y-1">
              <span className="text-[10px] font-mono uppercase text-slate-400 block font-semibold">
                Stabilized Market Valuation
              </span>
              <div className="text-xl sm:text-2xl font-black text-emerald-400 font-display">
                ${(result?.estimated_market_valuation_usd || 0).toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </div>
              <span className="text-[10px] font-mono text-emerald-400/80 block">
                ${result?.valuation_per_sqft?.toFixed(2) || 0}/sq.ft yield
              </span>
            </div>

            {/* Projected Margin / Duration */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 shadow-xl space-y-1 col-span-2 sm:col-span-1">
              <span className="text-[10px] font-mono uppercase text-slate-400 block font-semibold">
                Developer Margin & Timeline
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-xl sm:text-2xl font-black text-cyan-400 font-display">
                  +{result?.developer_margin_pct || 0}%
                </span>
                <span className="text-xs font-mono text-slate-400 font-medium">ROI</span>
              </div>
              <span className="text-[10px] font-mono text-slate-400 block">
                Duration: {result?.estimated_duration_months || 0} Months
              </span>
            </div>

          </div>

          {/* Interactive Charts Container */}
          <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-2xl space-y-4">
            
            {/* Chart Subnav Buttons */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800">
                <button
                  onClick={() => setActiveChartTab('breakdown')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                    activeChartTab === 'breakdown'
                      ? 'bg-amber-500 text-slate-950 font-bold shadow-glow-amber'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Cost Breakdown
                </button>
                <button
                  onClick={() => setActiveChartTab('scenarios')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                    activeChartTab === 'scenarios'
                      ? 'bg-amber-500 text-slate-950 font-bold shadow-glow-amber'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Valuation Scenarios
                </button>
                <button
                  onClick={() => setActiveChartTab('scurve')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                    activeChartTab === 'scurve'
                      ? 'bg-amber-500 text-slate-950 font-bold shadow-glow-amber'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Cashflow S-Curve
                </button>
              </div>

              <span className="text-[11px] font-mono text-slate-400 hidden sm:inline">
                Recharts Analytics
              </span>
            </div>

            {/* Chart 1: Donut Cost Breakdown */}
            {activeChartTab === 'breakdown' && (
              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={result?.cost_breakdown || []}
                      dataKey="amount_usd"
                      nameKey="category"
                      cx="50%"
                      cy="50%"
                      innerRadius={65}
                      outerRadius={105}
                      paddingAngle={3}
                    >
                      {result?.cost_breakdown?.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload;
                          return (
                            <div className="bg-slate-950 border border-slate-700 p-2.5 rounded-xl shadow-xl text-xs space-y-1">
                              <span className="font-bold text-white block">{data.category}</span>
                              <div className="text-amber-400 font-mono font-semibold">
                                ${data.amount_usd.toLocaleString()} ({data.percentage}%)
                              </div>
                              <p className="text-[10px] text-slate-400 max-w-[200px] leading-tight">
                                {data.description}
                              </p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Legend 
                      verticalAlign="bottom" 
                      height={36}
                      formatter={(val) => <span className="text-[11px] text-slate-300">{val}</span>} 
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* Chart 2: Valuation Sensitivity Scenarios */}
            {activeChartTab === 'scenarios' && (
              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={result?.scenarios || []} margin={{ top: 10, right: 20, left: 20, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                    <XAxis dataKey="scenario" tick={{ fill: '#94A3B8', fontSize: 11 }} />
                    <YAxis 
                      tick={{ fill: '#94A3B8', fontSize: 11 }}
                      tickFormatter={(val) => `$${(val / 1000000).toFixed(1)}M`}
                    />
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const sc = payload[0].payload;
                          return (
                            <div className="bg-slate-950 border border-slate-700 p-3 rounded-xl shadow-xl text-xs space-y-1">
                              <span className="font-bold text-white block">{sc.scenario}</span>
                              <div className="text-emerald-400 font-mono">
                                Valuation: ${sc.valuation_usd.toLocaleString()}
                              </div>
                              <div className="text-slate-400 font-mono">
                                Cost: ${sc.cost_usd.toLocaleString()}
                              </div>
                              <div className="text-cyan-400 font-mono font-semibold">
                                Net Gain: +${sc.net_equity_gain.toLocaleString()} ({sc.roi_percentage}%)
                              </div>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Bar dataKey="cost_usd" name="Construction Cost" fill="#64748B" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="valuation_usd" name="Market Valuation" fill="#10B981" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* Chart 3: Monthly Cashflow S-Curve */}
            {activeChartTab === 'scurve' && (
              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={result?.cashflow_curve || []} margin={{ top: 10, right: 20, left: 10, bottom: 20 }}>
                    <defs>
                      <linearGradient id="spendGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#F59E0B" stopOpacity={0.0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                    <XAxis 
                      dataKey="month" 
                      tick={{ fill: '#94A3B8', fontSize: 11 }}
                      label={{ value: 'Project Months', position: 'insideBottom', offset: -10, fill: '#64748B', fontSize: 11 }}
                    />
                    <YAxis 
                      tick={{ fill: '#94A3B8', fontSize: 11 }}
                      tickFormatter={(val) => `$${(val / 1000000).toFixed(1)}M`}
                    />
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const cf = payload[0].payload;
                          return (
                            <div className="bg-slate-950 border border-slate-700 p-3 rounded-xl shadow-xl text-xs space-y-1">
                              <span className="font-bold text-white block">Month {cf.month}: {cf.phase_name}</span>
                              <div className="text-amber-400 font-mono">
                                Monthly Outlay: ${cf.monthly_expense_usd.toLocaleString()}
                              </div>
                              <div className="text-slate-300 font-mono">
                                Cumulative Spend: ${cf.cumulative_spend_usd.toLocaleString()}
                              </div>
                              <div className="text-emerald-400 font-mono font-semibold">
                                Project Completion: {cf.cumulative_progress_pct}%
                              </div>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Area type="monotone" dataKey="cumulative_spend_usd" stroke="#F59E0B" strokeWidth={2.5} fillOpacity={1} fill="url(#spendGradient)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* Drivers list */}
            <div className="pt-2 border-t border-slate-800 text-xs text-slate-400 space-y-1">
              <span className="font-semibold text-slate-300 block font-mono text-[10px] uppercase">
                Underwriting Assumptions & Key Drivers:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-[11px]">
                {result?.key_drivers?.map((driver, i) => (
                  <div key={i} className="flex items-center gap-1.5 text-slate-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                    <span>{driver}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
