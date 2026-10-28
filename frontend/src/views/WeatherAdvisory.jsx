import React, { useState, useEffect } from 'react';
import { 
  CloudSun, 
  Wind, 
  Droplets, 
  Thermometer, 
  Sun, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  Calendar, 
  ShieldAlert, 
  Layers,
  MapPin,
  RefreshCw,
  Flame,
  CloudRain
} from 'lucide-react';
import { api } from '../services/api';

export default function WeatherAdvisory() {
  const [locations, setLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState('Austin, TX');
  const [advisory, setAdvisory] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchLocations = async () => {
      const locs = await api.getWeatherLocations();
      setLocations(locs);
    };
    fetchLocations();
  }, []);

  useEffect(() => {
    const fetchAdvisory = async () => {
      setLoading(true);
      const data = await api.getWeatherAdvisory(selectedLocation);
      setAdvisory(data);
      setLoading(false);
    };
    fetchAdvisory();
  }, [selectedLocation]);

  const metrics = advisory?.current_metrics;
  const isHighRisk = advisory?.overall_site_risk?.includes('High');
  const isModRisk = advisory?.overall_site_risk?.includes('Moderate');

  return (
    <div className="space-y-6">
      
      {/* Page Header & Location Picker */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-yellow-500/10 text-yellow-400 border border-yellow-500/20">
              <CloudSun className="w-5 h-5" />
            </div>
            <h2 className="text-xl lg:text-2xl font-black text-white font-display tracking-tight">
              Weather-Aware Construction Risk Advisory
            </h2>
          </div>
          <p className="text-xs lg:text-sm text-slate-400 mt-1">
            Real-time meteorology correlated with ACI 305/306 concrete limits, tower crane wind cutoffs, and OSHA heat stress standards.
          </p>
        </div>

        {/* Location Dropdown */}
        <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl">
          <MapPin className="w-4 h-4 text-amber-400" />
          <span className="text-xs text-slate-400 font-mono">Job Site:</span>
          <select
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
            className="bg-transparent text-slate-200 text-xs font-semibold focus:outline-none cursor-pointer"
          >
            {locations.map((loc) => (
              <option key={loc} value={loc} className="bg-slate-900 text-slate-100">
                {loc}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Real-time Environmental Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 text-center space-y-1">
          <span className="text-[10px] font-mono uppercase text-slate-400 flex items-center justify-center gap-1">
            <Thermometer className="w-3.5 h-3.5 text-amber-400" /> Temp
          </span>
          <div className="text-xl font-bold text-white font-mono">
            {metrics?.temperature_c || 0}°C
          </div>
          <span className="text-[10px] text-slate-400">({metrics?.temperature_f || 0}°F)</span>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 text-center space-y-1">
          <span className="text-[10px] font-mono uppercase text-slate-400 flex items-center justify-center gap-1">
            <Flame className="w-3.5 h-3.5 text-red-400" /> Heat Index
          </span>
          <div className="text-xl font-bold text-red-400 font-mono">
            {metrics?.feels_like_c || 0}°C
          </div>
          <span className="text-[10px] text-slate-400">Apparent Temp</span>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 text-center space-y-1">
          <span className="text-[10px] font-mono uppercase text-slate-400 flex items-center justify-center gap-1">
            <Wind className="w-3.5 h-3.5 text-cyan-400" /> Wind Velocity
          </span>
          <div className="text-xl font-bold text-cyan-300 font-mono">
            {metrics?.wind_speed_kph || 0} km/h
          </div>
          <span className="text-[10px] text-slate-400">Gusts: {metrics?.wind_gusts_kph || 0} km/h</span>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 text-center space-y-1">
          <span className="text-[10px] font-mono uppercase text-slate-400 flex items-center justify-center gap-1">
            <Droplets className="w-3.5 h-3.5 text-blue-400" /> Humidity
          </span>
          <div className="text-xl font-bold text-blue-300 font-mono">
            {metrics?.humidity_pct || 0}%
          </div>
          <span className="text-[10px] text-slate-400">Relative RH</span>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 text-center space-y-1">
          <span className="text-[10px] font-mono uppercase text-slate-400 flex items-center justify-center gap-1">
            <CloudRain className="w-3.5 h-3.5 text-indigo-400" /> Rain Prob.
          </span>
          <div className="text-xl font-bold text-indigo-300 font-mono">
            {metrics?.rain_probability_pct || 0}%
          </div>
          <span className="text-[10px] text-slate-400">Precipitation</span>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 text-center space-y-1">
          <span className="text-[10px] font-mono uppercase text-slate-400 flex items-center justify-center gap-1">
            <Sun className="w-3.5 h-3.5 text-yellow-400" /> Solar UV
          </span>
          <div className="text-xl font-bold text-yellow-300 font-mono">
            Index {metrics?.uv_index || 0}
          </div>
          <span className="text-[10px] text-slate-400">Very High Radiation</span>
        </div>
      </div>

      {/* Critical Hazards Alert Callout */}
      <div className={`p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xl ${
        isHighRisk 
          ? 'bg-red-500/15 border-red-500/40 text-red-200' 
          : (isModRisk ? 'bg-amber-500/15 border-amber-500/40 text-amber-200' : 'bg-emerald-500/15 border-emerald-500/40 text-emerald-200')
      }`}>
        <div className="flex items-start gap-3">
          <div className={`p-2 rounded-xl mt-0.5 ${
            isHighRisk ? 'bg-red-500 text-white' : (isModRisk ? 'bg-amber-500 text-slate-950' : 'bg-emerald-500 text-white')
          }`}>
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono uppercase font-black tracking-wider">
                Overall Site Status: {advisory?.overall_site_risk}
              </span>
            </div>
            <ul className="mt-1 space-y-1 text-xs text-slate-300">
              {advisory?.critical_alerts?.map((alert, idx) => (
                <li key={idx} className="flex items-center gap-1.5 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                  <span>{alert}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <span className="text-xs font-mono text-slate-400 self-end sm:self-center">
          Station: {advisory?.location}
        </span>
      </div>

      {/* Trade Feasibility Matrix */}
      <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-2xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-bold text-white font-display">
              Site Trade Feasibility & Environmental Restriction Matrix
            </h3>
          </div>
          <span className="text-xs font-mono text-slate-400">
            Real-Time Assessment
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {advisory?.trade_advisories?.map((trade, idx) => {
            const isHalt = trade.status.includes('Halt');
            const isCaution = trade.status === 'Caution';
            const badgeColor = isHalt 
              ? 'bg-red-500/20 text-red-300 border-red-500/40' 
              : (isCaution ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40');

            return (
              <div 
                key={idx}
                className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2.5 hover:border-slate-700 transition"
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="text-xs font-bold text-white leading-tight">
                    {trade.trade_name}
                  </span>
                  <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded border font-bold flex-shrink-0 ${badgeColor}`}>
                    {trade.status}
                  </span>
                </div>

                <p className="text-[11px] text-slate-400 leading-snug">
                  {trade.restriction_reason}
                </p>

                <div className="pt-2 border-t border-slate-800/80 space-y-1">
                  <span className="text-[10px] font-mono uppercase text-slate-500 font-semibold block">
                    Protective Mitigations:
                  </span>
                  {trade.protective_measures.map((pm, i) => (
                    <div key={i} className="text-[11px] text-slate-300 flex items-start gap-1.5">
                      <span className="text-amber-400 mt-0.5">•</span>
                      <span>{pm}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 7-Day Day-by-Day Site Task Feasibility Forecast */}
      <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-2xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-blue-400" />
            <h3 className="text-sm font-bold text-white font-display">
              7-Day Predictive Construction Outlook
            </h3>
          </div>
          <span className="text-xs font-mono text-slate-400">
            Day-by-Day Trade Feasibility
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2.5">
          {advisory?.forecast_7day?.map((day, idx) => {
            const isStop = day.overall_site_status === 'Stop Work Warning';
            const isCaut = day.overall_site_status === 'Weather Caution';
            const pillColor = isStop ? 'bg-red-500/20 text-red-300' : (isCaut ? 'bg-amber-500/20 text-amber-300' : 'bg-emerald-500/20 text-emerald-300');

            return (
              <div 
                key={idx}
                className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 text-center space-y-2 hover:border-slate-700 transition"
              >
                <div>
                  <span className="text-xs font-bold text-white block">{day.day_name}</span>
                  <span className="text-[10px] text-slate-400 font-mono">{day.condition}</span>
                </div>

                <div className="text-sm font-black text-amber-400 font-mono">
                  {day.high_temp_c}° <span className="text-xs text-slate-500 font-normal">/ {day.low_temp_c}°</span>
                </div>

                <div className="text-[10px] font-mono text-slate-400 space-y-0.5 pt-1 border-t border-slate-800">
                  <div>Rain: {day.precipitation_chance}%</div>
                  <div>Wind: {day.wind_max_kph}kph</div>
                </div>

                <div className={`text-[9px] font-mono uppercase px-1 py-0.5 rounded font-bold ${pillColor}`}>
                  {day.overall_site_status.split(' ')[0]}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Concrete Curing & OSHA Protocol Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
          <span className="text-xs font-bold text-white font-display flex items-center gap-2">
            <Thermometer className="w-4 h-4 text-amber-400" />
            ACI 305R Hot Weather Concrete Directives
          </span>
          <ul className="space-y-1.5 text-xs text-slate-300">
            {advisory?.concrete_curing_guidelines?.map((item, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 flex-shrink-0"></span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
          <span className="text-xs font-bold text-white font-display flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-red-400" />
            OSHA National Emphasis Program Heat Protocols
          </span>
          <ul className="space-y-1.5 text-xs text-slate-300">
            {advisory?.osha_heat_cold_protocols?.map((item, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-red-400 mt-1.5 flex-shrink-0"></span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

    </div>
  );
}
