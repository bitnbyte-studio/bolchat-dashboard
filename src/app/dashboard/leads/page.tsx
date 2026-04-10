"use client";

import { useState } from "react";
import { 
  ChevronRight, Search, Plus, TrendingUp, ChevronDown, ListFilter, 
  Download, MapPin, Mail, Eye, UserCheck, CheckCircle, Archive, Grid
} from "lucide-react";
import { cn } from "@/lib/utils";

// Mock Data
const MOCK_LEADS: any[] = [];

export default function LeadCapturePage() {
  const [selectedLeads, setSelectedLeads] = useState<number[]>([]);

  const toggleLead = (id: number) => {
    setSelectedLeads(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const toggleAll = () => {
    if (selectedLeads.length === MOCK_LEADS.length) {
      setSelectedLeads([]);
    } else {
      setSelectedLeads(MOCK_LEADS.map(l => l.id));
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-20">
      {/* Stats Section */}
      <section className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {/* Total Leads */}
        <div className="bg-white dark:bg-white/[0.03] backdrop-blur-[12px] p-4 rounded-xl border border-slate-200 dark:border-white/[0.08] shadow-sm hover:border-slate-300 dark:hover:border-rose-500/30 transition-all">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Total Leads</p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">0</h3>
            <span className="text-slate-400 text-[10px] font-bold flex items-center gap-0.5">--</span>
          </div>
        </div>

        {/* New Leads */}
        <div className="bg-white dark:bg-white/[0.03] backdrop-blur-[12px] p-4 rounded-xl border border-slate-200 dark:border-white/[0.08] border-l-4 border-l-rose-500 dark:border-l-rose-500 shadow-sm hover:border-slate-300 dark:hover:border-rose-500/30 transition-all">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">New Leads</p>
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">0</h3>
            <span className="px-2 py-0.5 bg-slate-100 dark:bg-white/5 text-slate-500 text-[8px] font-bold rounded uppercase tracking-tighter">No Action</span>
          </div>
        </div>

        {/* Contacted */}
        <div className="bg-white dark:bg-white/[0.03] backdrop-blur-[12px] p-4 rounded-xl border border-slate-200 dark:border-white/[0.08] shadow-sm hover:border-slate-300 dark:hover:border-rose-500/30 transition-all">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Contacted</p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">0</h3>
            <span className="text-slate-400 dark:text-slate-500 text-[10px] font-bold">0% of total</span>
          </div>
        </div>

        {/* Converted */}
        <div className="bg-white dark:bg-white/[0.03] backdrop-blur-[12px] p-4 rounded-xl border border-slate-200 dark:border-white/[0.08] border-l-4 border-l-green-500 dark:border-l-green-500 shadow-sm hover:border-slate-300 dark:hover:border-rose-500/30 transition-all">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Converted</p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">0</h3>
            <span className="text-slate-400 text-[10px] font-bold">--</span>
          </div>
        </div>

        {/* Avg Score */}
        <div className="bg-white dark:bg-white/[0.03] backdrop-blur-[12px] p-4 rounded-xl border border-slate-200 dark:border-white/[0.08] shadow-sm hover:border-slate-300 dark:hover:border-rose-500/30 transition-all">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Avg. Lead Score</p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">--</h3>
            <span className="text-slate-400 text-[10px] font-bold uppercase">No Data</span>
          </div>
        </div>
      </section>

      {/* Main Table Container */}
      <section className="bg-white dark:bg-white/[0.03] backdrop-blur-[12px] border border-slate-200 dark:border-white/[0.08] shadow-sm rounded-2xl overflow-hidden transition-all duration-300">
        
        {/* Table Filters */}
        <div className="p-4 md:p-5 border-b border-slate-100 dark:border-white/5 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center bg-slate-50 dark:bg-white/5 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-white/5 text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-widest gap-2">
              Status: <span className="text-slate-900 dark:text-white">All</span> <ChevronDown className="w-3 h-3"/>
            </div>
            <div className="flex items-center bg-slate-50 dark:bg-white/5 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-white/5 text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-widest gap-2">
              Interest: <span className="text-slate-900 dark:text-white">Any</span> <ChevronDown className="w-3 h-3"/>
            </div>
            <div className="flex items-center bg-slate-50 dark:bg-white/5 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-white/5 text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-widest gap-2">
              Score: <span className="text-slate-900 dark:text-white">High (80+)</span> <ChevronDown className="w-3 h-3"/>
            </div>
            <button className="text-[10px] font-bold text-rose-500 uppercase tracking-widest hover:underline cursor-pointer ml-2">Clear Filters</button>
          </div>
          
          <div className="flex items-center gap-3">
            <button className="p-1.5 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all cursor-pointer">
              <ListFilter className="w-4 h-4" />
            </button>
            <button className="p-1.5 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all hidden sm:block cursor-pointer">
               <Grid className="w-4 h-4"/>
            </button>
            <div className="w-px h-5 bg-slate-200 dark:bg-white/5 mx-1"></div>
            <button className="flex items-center gap-1.5 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/5 px-3 py-1.5 rounded-lg text-[10px] font-bold text-slate-700 dark:text-white uppercase tracking-widest hover:bg-slate-50 dark:hover:bg-white/10 transition-all cursor-pointer">
              <Download className="w-3 h-3"/> Export CSV
            </button>
          </div>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto scrollbar-hide">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead className="bg-slate-50/50 dark:bg-white/[0.02] text-[10px] text-slate-500 uppercase tracking-widest font-bold border-b border-slate-100 dark:border-white/5">
              <tr className="text-left">
                <th className="py-4 px-5 w-12">
                  <input 
                    type="checkbox" 
                    className="w-3.5 h-3.5 rounded border-slate-300 dark:border-white/10 bg-white/5 accent-rose-500 cursor-pointer"
                    checked={selectedLeads.length === MOCK_LEADS.length && MOCK_LEADS.length > 0}
                    onChange={toggleAll}
                  />
                </th>
                <th className="py-4 px-5">Lead Details</th>
                <th className="py-4 px-5">Company</th>
                <th className="py-4 px-5">Location</th>
                <th className="py-4 px-5">Interest</th>
                <th className="py-4 px-5">Lead Score</th>
                <th className="py-4 px-5">Status</th>
                <th className="py-4 px-5 text-right w-24">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-white/5">
              {MOCK_LEADS.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center border-none">
                    <div className="flex flex-col items-center justify-center text-slate-400">
                      <Archive className="w-6 h-6 mb-2 opacity-50" />
                      <p className="font-medium text-xs">No leads captured yet.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                MOCK_LEADS.map(lead => (
                  <tr key={lead.id} onClick={() => toggleLead(lead.id)} className="hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors group cursor-pointer">
                    <td className="py-4 px-5" onClick={(e) => e.stopPropagation()}>
                       <input 
                        type="checkbox" 
                        className="w-3.5 h-3.5 rounded border-slate-300 dark:border-white/10 bg-white/5 accent-rose-500 cursor-pointer"
                        checked={selectedLeads.includes(lead.id)}
                        onChange={() => toggleLead(lead.id)}
                      />
                    </td>
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-3">
                        <div className={cn("w-8 h-8 rounded-full flex items-center justify-center font-bold text-[10px] shrink-0", lead.bgClass)}>
                          {lead.initials}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-slate-900 dark:text-white">{lead.name}</span>
                          <span className="text-xs text-slate-500">{lead.email}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-5">
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{lead.company}</span>
                    </td>
                    <td className="py-4 px-5 text-xs text-slate-500">
                      <div className="flex items-center gap-1.5 whitespace-nowrap">
                        <MapPin className={cn("w-3 h-3 text-slate-400", lead.statusColor.replace('bg-', 'text-'))} /> 
                        {lead.location}
                      </div>
                    </td>
                    <td className="py-4 px-5">
                      <span className={cn("text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full whitespace-nowrap", lead.interestBg)}>
                        {lead.interest}
                      </span>
                    </td>
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-2">
                        <div className="w-20 h-1.5 rounded-full bg-slate-100 dark:bg-white/10 flex-shrink-0 overflow-hidden">
                          <div className={cn("h-full", lead.scoreColor)} style={{ width: `${lead.score}%` }}></div>
                        </div>
                        <span className={cn("textxs font-bold", lead.scoreColor.replace('bg-', 'text-'))}>{lead.score}</span>
                      </div>
                    </td>
                    <td className="py-4 px-5">
                      <span className={cn("flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest whitespace-nowrap", lead.statusColor.replace('bg-', 'text-'))}>
                        <div className={cn("w-1.5 h-1.5 rounded-full shadow-[0_0_10px_currentColor]", lead.statusColor)}></div> 
                        {lead.statusText}
                      </span>
                    </td>
                    <td className="py-4 px-5 text-right">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                        <button onClick={(e) => {e.stopPropagation()}} title="Email" className="w-8 h-8 rounded-lg bg-slate-50 dark:bg-white/10 flex items-center justify-center text-slate-400 dark:text-slate-300 hover:text-white dark:hover:text-white hover:bg-rose-500 dark:hover:bg-rose-500 transition-all cursor-pointer">
                          <Mail className="w-4 h-4" />
                        </button>
                        <button onClick={(e) => {e.stopPropagation()}} title="View" className="w-8 h-8 rounded-lg bg-slate-50 dark:bg-white/10 flex items-center justify-center text-slate-400 dark:text-slate-300 hover:text-white dark:hover:text-white hover:bg-slate-900 dark:hover:bg-slate-700 transition-all cursor-pointer">
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Foot */}
        <div className="p-4 border-t border-slate-100 dark:border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-500 font-medium text-center">Showing <span className="text-slate-900 dark:text-white font-bold">0</span> of 0 leads</p>
          <div className="flex items-center gap-1 sm:gap-2">
            <button className="w-8 h-8 rounded-lg bg-white/5 border border-slate-200 dark:border-transparent flex items-center justify-center text-slate-500 hover:text-slate-900 dark:hover:text-white transition-all cursor-pointer">
              <ChevronRight className="w-4 h-4 rotate-180" />
            </button>
            <button className="w-8 h-8 rounded-lg bg-gradient-to-r from-rose-500 to-pink-500 text-white font-bold text-xs shadow-lg shadow-rose-500/20 cursor-pointer border-none">1</button>
            <button className="w-8 h-8 rounded-lg bg-white/5 border border-slate-200 dark:border-transparent flex items-center justify-center text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-all text-xs font-bold cursor-pointer">2</button>
            <button className="w-8 h-8 rounded-lg bg-white/5 border border-slate-200 dark:border-transparent flex items-center justify-center text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-all text-xs font-bold cursor-pointer hidden sm:flex">3</button>
            <span className="text-slate-400 dark:text-slate-600 px-1 sm:px-2">...</span>
            <button className="w-8 h-8 rounded-lg bg-white/5 border border-slate-200 dark:border-transparent flex items-center justify-center text-slate-500 hover:text-slate-900 dark:hover:text-white transition-all cursor-pointer">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Floating Bulk Action Bar */}
      <div className={cn(
        "fixed bottom-10 left-[max(50%,theme(spacing.20))] -translate-x-1/2 z-50 transition-transform duration-500 ease-[cubic-bezier(0.175,0.885,0.32,1.275)]",
        selectedLeads.length > 0 ? "translate-y-0" : "translate-y-[150%]"
      )}>
        <div className="bg-white/95 dark:bg-[#0d1425]/95 backdrop-blur-[12px] border border-slate-200 dark:border-rose-500/30 p-3 px-4 md:px-6 rounded-2xl flex flex-wrap items-center justify-center md:justify-start gap-3 md:gap-6 shadow-2xl dark:shadow-rose-500/10 ring-1 ring-slate-200 dark:ring-white/10">
          
          <div className="flex items-center gap-3 pr-6 md:border-r border-slate-200 dark:border-white/10">
            <div className="w-6 h-6 rounded-lg bg-rose-500 flex items-center justify-center text-white text-[10px] font-bold shrink-0 shadow-lg shadow-rose-500/30">
              {selectedLeads.length}
            </div>
            <span className="text-sm font-bold text-slate-900 dark:text-white whitespace-nowrap">Leads Selected</span>
          </div>
          
          <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6">
            <button className="flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-rose-500 transition-colors uppercase tracking-widest cursor-pointer">
              <Mail className="w-4 h-4"/> <span className="hidden sm:inline">Send Email</span>
            </button>
            <button className="flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-blue-500 transition-colors uppercase tracking-widest cursor-pointer">
              <UserCheck className="w-4 h-4"/> <span className="hidden sm:inline">Assign</span>
            </button>
            <button className="flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-green-500 transition-colors uppercase tracking-widest cursor-pointer">
              <CheckCircle className="w-4 h-4"/> <span className="hidden sm:inline">Set Status</span>
            </button>
            <button className="flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 transition-colors uppercase tracking-widest cursor-pointer">
              <Archive className="w-4 h-4"/> <span className="hidden sm:inline">Archive</span>
            </button>
          </div>
          
          <div className="pl-4 md:pl-8 border-l border-slate-200 dark:border-white/10 hidden sm:block">
            <button 
              onClick={() => setSelectedLeads([])}
              className="text-[10px] font-bold text-slate-400 dark:text-slate-500 hover:text-rose-500 dark:hover:text-rose-500 uppercase tracking-[0.1em] cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
