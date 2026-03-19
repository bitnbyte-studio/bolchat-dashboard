"use client";

import { useState } from "react";
import { 
  Bot, Plus, Sparkles, Calendar, Layers, Globe, 
  ChevronDown, Info, Palette, Code, History, Eye
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function BotManagerPage() {
  const [activeTab, setActiveTab] = useState("Basic Info");

  const tabs = [
    "Basic Info", 
    "Knowledge", 
    "Model Settings", 
    "Branding & UI", 
    "Language Scope", 
    "Integrations"
  ];

  return (
    <div className="flex flex-col lg:flex-row h-full min-h-[calc(100vh-10rem)] bg-white dark:bg-[#0d1425]/40 backdrop-blur-md border border-slate-200 dark:border-white/5 rounded-[2.5rem] overflow-hidden shadow-sm">
      
      {/* Left Column: My Chatbots List */}
      <section className="w-full lg:w-80 border-b lg:border-b-0 lg:border-r border-slate-200 dark:border-white/5 p-6 flex flex-col gap-6 bg-slate-50/50 dark:bg-transparent overflow-y-auto scrollbar-hide shrink-0 z-10">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white font-cabinet">My Chatbots</h3>
          <button className="w-8 h-8 rounded-lg bg-rose-500 text-white flex items-center justify-center hover:bg-rose-600 transition-all cursor-pointer">
            <Plus className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-3">
          {/* Active Bot */}
          <div className="p-4 rounded-2xl bg-white dark:bg-white/[0.03] border-2 border-rose-500 dark:border-rose-500 shadow-[0_0_20px_rgba(244,63,94,0.15)] cursor-pointer">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-500 to-pink-500 flex items-center justify-center text-white shrink-0">
                <Bot className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-bold text-slate-900 dark:text-white truncate">Luxe Assistant v2.1</p>
                <span className="flex items-center gap-1.5 mt-0.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                  <p className="text-[10px] font-bold text-slate-500 uppercase">Online</p>
                </span>
              </div>
            </div>
          </div>

          {/* Inactive Bot 1 */}
          <div className="p-4 rounded-2xl bg-white dark:bg-white/[0.03] border border-slate-200 dark:border-transparent cursor-pointer opacity-70 hover:opacity-100 transition-opacity">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 shrink-0">
                <Bot className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-bold text-slate-600 dark:text-slate-300 truncate">Support Hero</p>
                <span className="flex items-center gap-1.5 mt-0.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-400 dark:bg-slate-600"></div>
                  <p className="text-[10px] font-bold text-slate-500 uppercase">Offline</p>
                </span>
              </div>
            </div>
          </div>

          {/* Inactive Bot 2 */}
          <div className="p-4 rounded-2xl bg-white dark:bg-white/[0.03] border border-slate-200 dark:border-transparent cursor-pointer opacity-70 hover:opacity-100 transition-opacity">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 shrink-0">
                <Bot className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-bold text-slate-600 dark:text-slate-300 truncate">Sales Copilot</p>
                <span className="flex items-center gap-1.5 mt-0.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-orange-500"></div>
                  <p className="text-[10px] font-bold text-slate-500 uppercase">In Draft</p>
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-auto pt-8">
          <div className="bg-rose-50 dark:bg-rose-500/5 p-5 rounded-[2rem] border border-rose-100 dark:border-rose-500/20 relative overflow-hidden">
            <div className="absolute -right-4 -top-4 w-16 h-16 bg-rose-500/10 rounded-full blur-xl"></div>
            <Sparkles className="w-6 h-6 text-rose-500 mb-3" />
            <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-1">Auto-Optimize</h4>
            <p className="text-[10px] text-slate-500 leading-relaxed mb-4">Improve accuracy based on recent conversation history analysis.</p>
            <button className="w-full py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-rose-500 dark:hover:bg-rose-500 hover:text-white transition-all cursor-pointer">
              Launch AI Audit
            </button>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="flex-1 flex flex-col relative overflow-hidden bg-white/50 dark:bg-transparent">
        
        {/* Scrollable Container */}
        <div className="flex-1 overflow-y-auto scrollbar-hide p-6 lg:p-8 space-y-8">
          
          {/* Hero Card */}
          <div className="bg-white dark:bg-white/[0.03] border border-slate-200 dark:border-white/5 p-6 lg:p-8 rounded-[2.5rem] flex flex-col xl:flex-row justify-between items-start xl:items-center gap-8 shadow-sm relative z-20">
            <div className="flex items-center gap-6 lg:gap-8 w-full xl:w-auto">
              <div className="w-20 h-20 lg:w-24 lg:h-24 rounded-[2rem] bg-gradient-to-tr from-rose-500 to-pink-500 flex items-center justify-center shadow-lg lg:shadow-2xl shadow-rose-500/30 ring-4 ring-white dark:ring-white/5 shrink-0">
                <Bot className="w-10 h-10 lg:w-12 lg:h-12 text-white" />
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <h3 className="text-2xl lg:text-3xl font-bold text-slate-900 dark:text-white tracking-tight font-cabinet">Luxe Assistant v2.1</h3>
                  <span className="px-3 py-1 rounded-lg bg-green-100 dark:bg-green-500/10 text-green-600 dark:text-green-500 text-[10px] font-bold uppercase tracking-widest hidden sm:block">Active Agent</span>
                </div>
                <div className="flex flex-wrap gap-3 lg:gap-4 text-[10px] lg:text-xs font-bold text-slate-500 uppercase tracking-widest">
                  <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5"/> Oct 12, 2024</span>
                  <span className="flex items-center gap-1.5"><Layers className="w-3.5 h-3.5"/> v2.1.4 Build</span>
                  <span className="flex items-center gap-1.5 text-rose-500"><Globe className="w-3.5 h-3.5"/> 52 Languages</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 w-full xl:w-auto overflow-x-auto pb-2 xl:pb-0">
              <div className="flex flex-col items-end mr-2 lg:mr-4 shrink-0">
                <p className="text-[9px] lg:text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Agent Status</p>
                <label className="relative inline-flex items-center cursor-pointer group">
                  <input type="checkbox" defaultChecked className="sr-only peer" />
                  <div className="w-11 h-6 bg-slate-300 dark:bg-slate-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-rose-500"></div>
                </label>
              </div>
              <button className="px-5 lg:px-6 h-11 lg:h-12 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:bg-slate-200 dark:hover:bg-white/10 rounded-xl font-bold text-sm transition-all text-slate-900 dark:text-white cursor-pointer shrink-0">
                Deploy
              </button>
              <button className="px-6 lg:px-8 h-11 lg:h-12 bg-rose-500 text-white rounded-xl font-bold text-sm shadow-xl shadow-rose-500/20 hover:scale-105 transition-all cursor-pointer shrink-0">
                Save Changes
              </button>
            </div>
          </div>

          {/* Sticky Tabs Navigation */}
          <div className="flex border-b border-slate-200 dark:border-white/5 px-2 overflow-x-auto whitespace-nowrap scrollbar-hide">
            {tabs.map((tab) => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "px-6 py-4 text-sm font-bold transition-colors cursor-pointer relative",
                  activeTab === tab 
                    ? "text-rose-500" 
                    : "text-slate-500 hover:text-slate-900 dark:hover:text-slate-300"
                )}
              >
                {tab}
                {activeTab === tab && (
                  <div className="absolute bottom-[-1px] left-0 right-0 h-0.5 bg-rose-500" />
                )}
              </button>
            ))}
          </div>

          {/* Tab Content (Basic Info) */}
          <div className="grid lg:grid-cols-3 gap-8 pb-10">
            
            {/* Forms Column */}
            <div className="lg:col-span-2 space-y-8">
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest ml-1">Chatbot Display Name</label>
                  <input 
                    type="text" 
                    defaultValue="Luxe Assistant v2.1" 
                    className="w-full h-14 px-6 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10 outline-none transition-all"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest ml-1">Primary Language</label>
                  <div className="relative">
                    <select className="w-full h-14 px-6 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10 outline-none transition-all appearance-none cursor-pointer">
                      <option>English (US)</option>
                      <option>Spanish (Global)</option>
                      <option>French (European)</option>
                      <option>German</option>
                    </select>
                    <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none w-4 h-4" />
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest ml-1">Bot Description / System Prompt Tagline</label>
                <textarea 
                  rows={4} 
                  defaultValue="Your premium concierge for all things Mode Luxe. Specializing in sizing, international shipping, and luxury style recommendations. Maintain a sophisticated, helpful, and eloquent tone at all times."
                  className="w-full p-6 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10 outline-none transition-all resize-none leading-relaxed"
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-12 pt-4">
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Confidence Threshold</label>
                    <span className="text-sm font-bold text-rose-500 bg-rose-50 dark:bg-rose-500/10 px-2 py-0.5 rounded-lg border border-rose-100 dark:border-transparent">85%</span>
                  </div>
                  <input type="range" min="0" max="100" defaultValue="85" className="w-full h-2 bg-slate-200 dark:bg-white/10 rounded-lg appearance-none cursor-pointer accent-rose-500" />
                  <div className="flex justify-between text-[10px] font-bold text-slate-500 uppercase">
                    <span>Creative</span>
                    <span>Precise</span>
                  </div>
                </div>
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Max Tokens per Resolve</label>
                    <span className="text-sm font-bold text-rose-500 bg-rose-50 dark:bg-rose-500/10 px-2 py-0.5 rounded-lg border border-rose-100 dark:border-transparent">450</span>
                  </div>
                  <input type="range" min="100" max="2048" defaultValue="450" className="w-full h-2 bg-slate-200 dark:bg-white/10 rounded-lg appearance-none cursor-pointer accent-rose-500" />
                  <div className="flex justify-between text-[10px] font-bold text-slate-500 uppercase">
                    <span>Concise</span>
                    <span>Elaborate</span>
                  </div>
                </div>
              </div>

              <div className="p-6 rounded-3xl bg-rose-50 dark:bg-rose-500/5 border border-rose-100 dark:border-rose-500/20 flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-white dark:bg-rose-500/20 border border-rose-100 dark:border-transparent flex items-center justify-center text-rose-500 shrink-0">
                  <Info className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <h5 className="text-sm font-bold text-slate-900 dark:text-white">Model Tuning Alert</h5>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mt-1">A threshold of 85% is optimal for luxury retail. Setting this higher (90%+) may increase the frequency of human agent handovers for complex multi-region shipping queries.</p>
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <button className="px-10 py-4 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-2xl font-bold text-sm shadow-xl shadow-rose-500/20 hover:scale-[1.02] active:scale-95 transition-all cursor-pointer">
                  Save & Continue
                </button>
              </div>
            </div>

            {/* Quick Actions Column */}
            <div className="space-y-6">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1 mb-4 hidden lg:block">Quick Customization</h4>
              
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
                <button className="bg-white dark:bg-white/[0.03] border border-slate-200 dark:border-white/5 p-6 rounded-3xl text-left flex items-center gap-5 group hover:border-rose-500/50 dark:hover:border-rose-500/50 transition-colors shadow-sm cursor-pointer">
                  <div className="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-500/10 text-rose-500 flex items-center justify-center group-hover:scale-110 transition-transform shrink-0">
                    <Palette className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">Widget Customizer</p>
                    <p className="text-[10px] text-slate-500 uppercase mt-0.5 tracking-widest">Colors, Icons, Avatars</p>
                  </div>
                </button>

                <button className="bg-white dark:bg-white/[0.03] border border-slate-200 dark:border-white/5 p-6 rounded-3xl text-left flex items-center gap-5 group hover:border-blue-500/50 dark:hover:border-blue-500/50 transition-colors shadow-sm cursor-pointer">
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-500/10 text-blue-500 flex items-center justify-center group-hover:scale-110 transition-transform shrink-0">
                    <Code className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">API & SDK Settings</p>
                    <p className="text-[10px] text-slate-500 uppercase mt-0.5 tracking-widest">Access Bot Tokens</p>
                  </div>
                </button>

                <button className="bg-white dark:bg-white/[0.03] border border-slate-200 dark:border-white/5 p-6 rounded-3xl text-left flex items-center gap-5 group hover:border-orange-500/50 dark:hover:border-orange-500/50 transition-colors shadow-sm cursor-pointer sm:col-span-2 lg:col-span-1">
                  <div className="w-12 h-12 rounded-2xl bg-orange-50 dark:bg-orange-500/10 text-orange-500 flex items-center justify-center group-hover:scale-110 transition-transform shrink-0">
                    <History className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">Version Control</p>
                    <p className="text-[10px] text-slate-500 uppercase mt-0.5 tracking-widest">Restore previous states</p>
                  </div>
                </button>
              </div>

              {/* Sync Loader Box */}
              <div className="bg-white dark:bg-white/[0.03] border border-slate-200 dark:border-white/5 p-8 rounded-[2.5rem] mt-8 lg:mt-10 text-center shadow-sm">
                <div className="w-16 h-16 rounded-full border-4 border-rose-500 border-t-transparent animate-spin mx-auto mb-6"></div>
                <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-2 font-cabinet">Syncing Intelligence</h4>
                <p className="text-xs text-slate-500 leading-relaxed px-4">Currently indexing 142 documents from your Knowledge Base into this agent's brain.</p>
              </div>

            </div>
          </div>
        </div>

        {/* Floating Preview Button */}
        <div className="absolute bottom-6 right-6 lg:bottom-8 lg:right-8 z-50">
          <button className="w-16 h-16 rounded-full bg-slate-900 border border-slate-700 text-white shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all group relative cursor-pointer shadow-slate-900/20">
            <Eye className="w-7 h-7" />
            <div className="absolute bottom-full right-0 mb-4 bg-slate-900 text-white text-[10px] font-bold px-4 py-2 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
              Live Bot Preview
            </div>
          </button>
        </div>

      </section>
    </div>
  );
}
