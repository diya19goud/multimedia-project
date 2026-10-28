import React, { useState, useEffect, useRef } from 'react';
import { 
  Bot, 
  Send, 
  Sparkles, 
  Bookmark, 
  Copy, 
  Check, 
  FileText, 
  Terminal, 
  User, 
  RefreshCw,
  HelpCircle,
  HardHat
} from 'lucide-react';
import { api } from '../services/api';

export default function SiteAssistantChat({ activeProject }) {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: `### Welcome to BuildVision AI Site Copilot\n\nI am connected to your active site **${activeProject.name}** (*${activeProject.phase}*).\n\nAsk me any technical question, structural calculation, code reference (ACI, OSHA, IBC, Eurocode), or ask me to draft today's daily site supervisor log!`,
      cited_standards: ['ACI 318-19', 'OSHA 1926', 'IBC 2024'],
      suggested_followups: [
        'Calculate rebar lap length for 25mm bars in M30 concrete',
        'What are mandatory OSHA tie-off guidelines for scaffolding above 10ft?',
        'Draft today\'s site supervisor daily log',
        'What are concrete curing protocols for 35°C ambient weather?'
      ]
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [quickPrompts, setQuickPrompts] = useState([]);
  const [copiedIdx, setCopiedIdx] = useState(null);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    const fetchPrompts = async () => {
      const data = await api.getChatQuickPrompts();
      setQuickPrompts(data || []);
    };
    fetchPrompts();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSend = async (textToSend) => {
    const query = textToSend || input;
    if (!query.trim() || loading) return;

    const userMsg = { role: 'user', content: query };
    const newHistory = [...messages, userMsg];
    setMessages(newHistory);
    setInput('');
    setLoading(true);

    try {
      const siteContext = {
        active_project: activeProject.name,
        current_phase: activeProject.phase,
        ambient_temp_c: 33.5,
        wind_speed_kph: 16.0
      };

      const res = await api.sendChatMessage(query, newHistory, siteContext);
      setMessages([...newHistory, {
        role: 'assistant',
        content: res.reply,
        cited_standards: res.cited_standards || [],
        suggested_followups: res.suggested_followups || []
      }]);
    } catch (err) {
      setMessages([...newHistory, {
        role: 'assistant',
        content: 'Apologies, I encountered a temporary connection issue. Please retry your request.',
        cited_standards: [],
        suggested_followups: []
      }]);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text, idx) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  return (
    <div className="space-y-6">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <Bot className="w-5 h-5" />
            </div>
            <h2 className="text-xl lg:text-2xl font-black text-white font-display tracking-tight">
              Daily Site Assistant & Engineering Copilot
            </h2>
          </div>
          <p className="text-xs lg:text-sm text-slate-400 mt-1">
            Multimodal conversational agent for site supervisors, structural code queries, material calculations, and automated daily logs.
          </p>
        </div>

        {/* Active Project pill */}
        <div className="flex items-center gap-2 text-xs font-mono text-purple-300 bg-purple-500/10 border border-purple-500/30 px-3 py-1.5 rounded-xl">
          <HardHat className="w-3.5 h-3.5 text-amber-400" />
          <span className="truncate max-w-[220px]">{activeProject.name}</span>
        </div>
      </div>

      {/* Quick Prompt Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
        {quickPrompts.map((p, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(p.prompt)}
            className="p-3 rounded-xl bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800 hover:border-purple-500/50 text-left transition space-y-1 group cursor-pointer"
          >
            <span className="text-[10px] font-mono uppercase tracking-wider text-purple-400 font-bold block">
              {p.category}
            </span>
            <span className="text-xs font-bold text-white block group-hover:text-purple-300 transition">
              {p.title}
            </span>
            <p className="text-[11px] text-slate-400 truncate">
              {p.prompt}
            </p>
          </button>
        ))}
      </div>

      {/* Chat Messages Window */}
      <div className="p-4 sm:p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-2xl flex flex-col h-[520px]">
        
        {/* Messages Stream */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-2">
          {messages.map((m, idx) => {
            const isUser = m.role === 'user';
            return (
              <div
                key={idx}
                className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isUser && (
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center flex-shrink-0 text-white font-bold text-xs shadow-md mt-1">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 text-xs sm:text-sm space-y-3 ${
                  isUser 
                    ? 'bg-amber-500 text-slate-950 font-medium rounded-tr-none' 
                    : 'bg-slate-950/80 border border-slate-800 text-slate-200 rounded-tl-none shadow-lg'
                }`}>
                  {/* Content formatting */}
                  <div className="prose prose-invert prose-xs max-w-none space-y-2 whitespace-pre-wrap leading-relaxed">
                    {m.content}
                  </div>

                  {/* Cited Standards Pills */}
                  {!isUser && m.cited_standards && m.cited_standards.length > 0 && (
                    <div className="pt-2 border-t border-slate-800/80 space-y-1.5">
                      <span className="text-[10px] font-mono uppercase text-slate-400 font-bold flex items-center gap-1">
                        <Bookmark className="w-3 h-3 text-purple-400" />
                        Regulatory Citations
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {m.cited_standards.map((st, i) => (
                          <span key={i} className="text-[10px] font-mono bg-slate-900 px-2 py-0.5 rounded border border-slate-700 text-slate-300">
                            {st}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Suggested Followups */}
                  {!isUser && m.suggested_followups && m.suggested_followups.length > 0 && (
                    <div className="pt-2 border-t border-slate-800/80 space-y-1.5">
                      <span className="text-[10px] font-mono uppercase text-slate-400 font-bold flex items-center gap-1">
                        <HelpCircle className="w-3 h-3 text-amber-400" />
                        Suggested Probing Follow-ups
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {m.suggested_followups.map((f, i) => (
                          <button
                            key={i}
                            onClick={() => handleSend(f)}
                            className="text-[11px] bg-slate-900/90 hover:bg-purple-950/40 text-purple-300 border border-purple-500/30 hover:border-purple-500/60 px-2.5 py-1 rounded-lg transition text-left cursor-pointer"
                          >
                            + {f}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Copy Button */}
                  {!isUser && (
                    <div className="flex justify-end pt-1">
                      <button
                        onClick={() => copyToClipboard(m.content, idx)}
                        className="text-[10px] font-mono text-slate-400 hover:text-white flex items-center gap-1 transition cursor-pointer"
                      >
                        {copiedIdx === idx ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedIdx === idx ? 'Copied!' : 'Copy markdown'}</span>
                      </button>
                    </div>
                  )}
                </div>

                {isUser && (
                  <div className="w-8 h-8 rounded-xl bg-amber-500 flex items-center justify-center flex-shrink-0 text-slate-950 font-bold text-xs shadow-md mt-1">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            );
          })}

          {loading && (
            <div className="flex gap-3 items-center text-xs font-mono text-purple-400 bg-purple-500/10 p-3 rounded-2xl w-max border border-purple-500/20 animate-pulse">
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Querying Multimodal Construction Intelligence Knowledge Graphs...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="mt-4 pt-3 border-t border-slate-800 flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about ACI lap length, OSHA rules, concrete curing, or daily site diary..."
            className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 shadow-inner"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="p-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white font-bold transition shadow-glow-amber cursor-pointer"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

      </div>

    </div>
  );
}
