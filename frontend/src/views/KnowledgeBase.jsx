import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Search, 
  Filter, 
  Bookmark, 
  ExternalLink, 
  CheckCircle2, 
  AlertTriangle, 
  FileText, 
  X,
  Layers,
  Sparkles,
  Tag
} from 'lucide-react';
import { api } from '../services/api';

export default function KnowledgeBase() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedJurisdiction, setSelectedJurisdiction] = useState('All');
  const [selectedTag, setSelectedTag] = useState(null);
  
  const [articles, setArticles] = useState([]);
  const [categories, setCategories] = useState(['All']);
  const [jurisdictions, setJurisdictions] = useState(['All']);
  const [loading, setLoading] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState(null);

  useEffect(() => {
    const doSearch = async () => {
      setLoading(true);
      const res = await api.searchKnowledge({
        query: searchQuery,
        category: selectedCategory,
        jurisdiction: selectedJurisdiction,
        tag: selectedTag
      });
      setArticles(res.articles || []);
      if (res.available_categories) setCategories(res.available_categories);
      if (res.available_jurisdictions) setJurisdictions(res.available_jurisdictions);
      setLoading(false);
    };
    doSearch();
  }, [searchQuery, selectedCategory, selectedJurisdiction, selectedTag]);

  return (
    <div className="space-y-6">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-slate-800 text-amber-400 border border-slate-700">
              <BookOpen className="w-5 h-5" />
            </div>
            <h2 className="text-xl lg:text-2xl font-black text-white font-display tracking-tight">
              Construction Knowledge Base & Building Codes
            </h2>
          </div>
          <p className="text-xs lg:text-sm text-slate-400 mt-1">
            Searchable regulatory repository for ACI structural concrete, OSHA 1926 standards, IBC 2024, ASTM specifications, and Eurocodes.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-slate-400 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl">
          <Bookmark className="w-3.5 h-3.5 text-amber-400" />
          <span>{articles.length} Standards Indexed</span>
        </div>
      </div>

      {/* Search Bar & Filters */}
      <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by code (ACI 318, OSHA 1926, ASTM C94), keyword (rebar lap, scaffold tie-off, curing), or standard..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 shadow-inner"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
          <span className="text-[10px] font-mono uppercase text-slate-500 font-bold">Category:</span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-2.5 py-1 rounded-lg transition cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-glow-amber'
                  : 'bg-slate-950 text-slate-400 border border-slate-800 hover:border-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}

          {selectedTag && (
            <div className="ml-auto flex items-center gap-1.5 bg-purple-500/20 text-purple-300 border border-purple-500/30 px-2 py-0.5 rounded-lg text-[11px] font-mono">
              <Tag className="w-3 h-3" />
              <span>Tag: #{selectedTag}</span>
              <button onClick={() => setSelectedTag(null)} className="hover:text-white cursor-pointer ml-1">×</button>
            </div>
          )}
        </div>
      </div>

      {/* Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {articles.map((art) => (
          <div
            key={art.id}
            onClick={() => setSelectedArticle(art)}
            className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-amber-500/50 hover:bg-slate-900/90 transition shadow-lg flex flex-col justify-between space-y-3 cursor-pointer group"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  {art.code_id}
                </span>
                <span className="text-[10px] font-mono text-slate-400 truncate max-w-[140px]">
                  {art.jurisdiction}
                </span>
              </div>

              <h3 className="text-sm font-bold text-white group-hover:text-amber-300 transition line-clamp-2">
                {art.title}
              </h3>

              <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">
                {art.summary}
              </p>
            </div>

            <div className="space-y-2 pt-2 border-t border-slate-800/80">
              <div className="flex flex-wrap gap-1">
                {art.tags.slice(0, 3).map((t) => (
                  <span
                    key={t}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedTag(t);
                    }}
                    className="text-[10px] font-mono bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800 text-slate-400 hover:text-amber-300 transition"
                  >
                    #{t}
                  </span>
                ))}
              </div>

              <div className="flex items-center justify-between text-[11px] font-mono text-amber-400 font-semibold pt-1">
                <span>View Full Standard & Checklists</span>
                <ExternalLink className="w-3 h-3 group-hover:translate-x-0.5 transition" />
              </div>
            </div>
          </div>
        ))}

        {articles.length === 0 && (
          <div className="col-span-full p-12 text-center rounded-2xl bg-slate-900/40 border border-slate-800 text-slate-400 text-xs">
            No building standards matching "{searchQuery}". Try searching "rebar", "OSHA", or "concrete".
          </div>
        )}
      </div>

      {/* Article Detail Drawer / Modal */}
      {selectedArticle && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto p-6 space-y-4 shadow-2xl relative">
            <button
              onClick={() => setSelectedArticle(null)}
              className="absolute top-4 right-4 p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  {selectedArticle.code_id}
                </span>
                <span className="text-xs font-mono text-slate-400">
                  {selectedArticle.jurisdiction} • {selectedArticle.category}
                </span>
              </div>
              <h3 className="text-lg font-bold text-white font-display">
                {selectedArticle.title}
              </h3>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-3 rounded-xl border border-slate-800">
              {selectedArticle.summary}
            </p>

            {/* Key Clauses */}
            <div className="space-y-2">
              <span className="text-xs font-mono uppercase text-slate-400 font-bold block">
                Key Regulatory Clauses & Design Formulations
              </span>
              <div className="space-y-1.5">
                {selectedArticle.key_clauses.map((clause, idx) => (
                  <div key={idx} className="p-2.5 rounded-lg bg-slate-950/40 border border-slate-800/80 text-xs text-slate-300 leading-snug">
                    {clause}
                  </div>
                ))}
              </div>
            </div>

            {/* Mandatory Tolerances */}
            <div className="space-y-2">
              <span className="text-xs font-mono uppercase text-amber-400 font-bold block">
                Mandatory Execution Tolerances
              </span>
              <ul className="space-y-1 text-xs text-slate-300">
                {selectedArticle.mandatory_tolerances.map((tol, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0"></span>
                    <span>{tol}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Field Inspection Checklist */}
            <div className="space-y-2">
              <span className="text-xs font-mono uppercase text-emerald-400 font-bold block">
                Site QA/QC Inspection Checklist
              </span>
              <ul className="space-y-1 text-xs text-slate-300">
                {selectedArticle.inspection_checklist.map((chk, idx) => (
                  <li key={idx} className="flex items-start gap-2 bg-slate-950/40 p-2 rounded-lg border border-slate-800/60">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span>{chk}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Risk callout */}
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-300 leading-snug">
              <span className="font-bold block text-red-200">Non-Compliance Risk:</span>
              {selectedArticle.risk_level_if_violated}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
