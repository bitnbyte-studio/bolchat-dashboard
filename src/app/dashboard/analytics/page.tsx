"use client";

import { 
  Zap, TrendingUp, Users, Minus, Clock, TrendingDown,
  CheckCircle, Expand, Cpu, Star, AlertCircle, HelpCircle,
  Package, Ruler, CreditCard, Activity
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function AnalyticsPage() {
  return (
    <div className="space-y-8 animate-fade-in pb-24">
      
      {/* Real-time Stats Header */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Total Queries */}
        <div className="bg-white dark:bg-white/[0.03] backdrop-blur-[12px] p-5 rounded-2xl border border-slate-200 dark:border-white/[0.08] shadow-sm hover:border-slate-300 dark:hover:border-rose-500/30 transition-all group">
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-500/10 text-rose-500 flex items-center justify-center">
              <Zap className="w-5 h-5" />
            </div>
            <div className="text-right">
              <span className="flex items-center justify-end gap-1 text-slate-400 text-[10px] font-bold">
                --
              </span>
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter mt-1">vs prev. week</p>
            </div>
          </div>
          <p className="text-slate-500 text-[9px] font-bold uppercase tracking-widest">Total Queries</p>
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1 tracking-tight">0</h3>
          <div className="mt-4 h-6 w-full opacity-20 flex items-center justify-center text-[9px] font-bold text-slate-400 uppercase tracking-widest">
            Insufficient Data
          </div>
        </div>

        {/* Active Chats */}
        <div className="bg-white dark:bg-white/[0.03] backdrop-blur-[12px] p-5 rounded-2xl border border-slate-200 dark:border-white/[0.08] shadow-sm hover:border-slate-300 dark:hover:border-rose-500/30 transition-all group">
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-500/10 text-blue-500 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <div className="text-right">
              <span className="flex items-center justify-end gap-1 text-slate-400 dark:text-blue-400 text-[10px] font-bold">
                <Minus className="w-3 h-3"/> Stable
              </span>
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter mt-1">Current Load</p>
            </div>
          </div>
          <p className="text-slate-500 text-[9px] font-bold uppercase tracking-widest">Active Chats</p>
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1 tracking-tight">0</h3>
          <div className="mt-4 flex items-center gap-3">
            <div className="flex-1 h-1.5 bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
              <div className="h-full bg-slate-300 w-[0%] rounded-full"></div>
            </div>
            <span className="text-[9px] font-bold text-slate-400">0%</span>
          </div>
        </div>

        {/* Avg Response */}
        <div className="bg-white dark:bg-white/[0.03] backdrop-blur-[12px] p-5 rounded-2xl border border-slate-200 dark:border-white/[0.08] shadow-sm hover:border-slate-300 dark:hover:border-rose-500/30 transition-all group">
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 rounded-xl bg-orange-50 dark:bg-orange-500/10 text-orange-500 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
            <div className="text-right">
              <span className="flex items-center justify-end gap-1 text-slate-400 text-[10px] font-bold">
                --
              </span>
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter mt-1">Latency</p>
            </div>
          </div>
          <p className="text-slate-500 text-[9px] font-bold uppercase tracking-widest">Avg. Response</p>
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1 tracking-tight">--</h3>
          <div className="mt-4 flex gap-1.5">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-1 flex-1 rounded-full bg-slate-100 dark:bg-white/5"></div>
            ))}
          </div>
        </div>

        {/* Resolution Rate */}
        <div className="bg-white dark:bg-white/[0.03] backdrop-blur-[12px] p-5 rounded-2xl border border-slate-200 dark:border-white/[0.08] shadow-sm hover:border-slate-300 dark:hover:border-rose-500/30 transition-all group">
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 rounded-xl bg-green-50 dark:bg-green-500/10 text-green-500 flex items-center justify-center">
              <CheckCircle className="w-5 h-5" />
            </div>
            <div className="text-right">
              <span className="flex items-center justify-end gap-1 text-slate-400 text-[10px] font-bold">
                --
              </span>
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter mt-1">Success Rate</p>
            </div>
          </div>
          <p className="text-slate-500 text-[9px] font-bold uppercase tracking-widest">Resolution Rate</p>
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1 tracking-tight">--</h3>
          <div className="mt-4 h-1 w-full bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
            <div className="h-full bg-slate-300 w-[0%] rounded-full"></div>
          </div>
        </div>

      </section>

      {/* Main Charts */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Trends Chart */}
        <div className="col-span-1 lg:col-span-2 bg-white dark:bg-white/[0.03] backdrop-blur-[12px] p-5 rounded-2xl border border-slate-200 dark:border-white/[0.08] shadow-sm relative overflow-hidden">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Query Trends</h3>
              <p className="text-xs text-slate-500">Volume of multilingual support conversations across last 7 days</p>
            </div>
            <div className="flex gap-2">
              <button className="px-3 py-1.5 bg-slate-50 dark:bg-white/5 rounded-lg text-[10px] font-bold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer">Day</button>
              <button className="px-3 py-1.5 bg-rose-50 dark:bg-rose-500/20 text-rose-500 border border-rose-200 dark:border-rose-500/30 rounded-lg text-[10px] font-bold cursor-pointer">Week</button>
              <button className="px-3 py-1.5 bg-slate-50 dark:bg-white/5 rounded-lg text-[10px] font-bold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer">Month</button>
            </div>
          </div>

          <div className="h-72 w-full flex flex-col items-center justify-center bg-slate-50 dark:bg-white/5 border border-dashed border-slate-200 dark:border-white/10 rounded-2xl">
             <TrendingUp className="w-8 h-8 text-slate-300 mb-2" />
             <p className="text-sm font-medium text-slate-400">No trend data available yet.</p>
          </div>
        </div>

        {/* Query Distribution */}
        <div className="bg-white dark:bg-white/[0.03] backdrop-blur-[12px] p-5 rounded-2xl border border-slate-200 dark:border-white/[0.08] shadow-sm">
          <div className="mb-6">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Query Distribution</h3>
            <p className="text-xs text-slate-500 mt-1">Intent classification distribution</p>
          </div>
          <div className="flex flex-col items-center justify-center h-full pb-10">
             <Package className="w-10 h-10 text-slate-300 mb-4" />
             <p className="text-sm font-medium text-slate-400">Classifications not running.</p>
          </div>
        </div>

      </section>

      {/* Model Tech Stats Section */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white dark:bg-white/[0.03] backdrop-blur-[12px] p-5 rounded-2xl border border-slate-200 dark:border-white/[0.08] shadow-sm">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-10 h-10 rounded-lg bg-slate-50 dark:bg-white/5 text-slate-500 flex items-center justify-center"><TrendingUp className="w-5 h-5"/></div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">Input Tokens</h4>
          </div>
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">0</h3>
          <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-4">
            <span>Daily Avg: 0</span>
            <span className="text-slate-900 dark:text-slate-400 font-bold">$0.00 EST.</span>
          </div>
          <div className="h-1.5 w-full bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
            <div className="h-full bg-slate-300 w-[0%] rounded-full"></div>
          </div>
          <p className="text-[10px] text-slate-500 mt-3">0% of monthly quota used</p>
        </div>

        <div className="bg-white dark:bg-white/[0.03] backdrop-blur-[12px] p-5 rounded-2xl border border-slate-200 dark:border-white/[0.08] shadow-sm">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-10 h-10 rounded-lg bg-slate-50 dark:bg-white/5 text-slate-500 flex items-center justify-center"><CheckCircle className="w-5 h-5"/></div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">Output Tokens</h4>
          </div>
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">0</h3>
          <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-4">
            <span>Daily Avg: 0</span>
            <span className="text-slate-900 dark:text-slate-400 font-bold">$0.00 EST.</span>
          </div>
          <div className="h-1.5 w-full bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
            <div className="h-full bg-slate-300 w-[0%] rounded-full"></div>
          </div>
          <p className="text-[10px] text-slate-500 mt-3">0% of monthly quota used</p>
        </div>

        <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-5 rounded-2xl border-none shadow-xl relative overflow-hidden">
          <div className="absolute -right-4 -top-4 w-20 h-20 bg-green-500/10 rounded-full blur-2xl"></div>
          <div className="flex items-center gap-4 mb-6">
            <div className="w-10 h-10 rounded-lg bg-white/10 text-rose-400 flex items-center justify-center"><Cpu className="w-5 h-5"/></div>
            <h4 className="text-sm font-bold text-white">AI Performance</h4>
          </div>
          <div className="space-y-4 mb-6">
            <div className="flex justify-between items-center"><span className="text-xs text-slate-400">Model Quality</span><span className="text-xs font-bold text-white">--</span></div>
            <div className="flex justify-between items-center"><span className="text-xs text-slate-400">Context Recall</span><span className="text-xs font-bold text-white">--</span></div>
            <div className="flex justify-between items-center"><span className="text-xs text-slate-400">Reasoning Speed</span><span className="text-xs font-bold text-white">--</span></div>
          </div>
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-3 mt-auto">
            <div className="w-2 h-2 rounded-full bg-slate-500"></div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Awaiting Traffic</p>
          </div>
        </div>
      </section>

      {/* Complex Heatmap & Quality Section */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Heatmap */}
        <div className="bg-white dark:bg-white/[0.03] backdrop-blur-[12px] p-5 sm:p-6 rounded-2xl border border-slate-200 dark:border-white/[0.08] shadow-sm overflow-hidden">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Hourly Activity Heatmap</h3>
              <p className="text-xs text-slate-500">Historical query intensity by hour</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-[9px] font-bold text-slate-500 uppercase">Low</span>
                <div className="flex gap-1">
                  <div className="w-3 h-3 rounded bg-rose-500/10"></div>
                  <div className="w-3 h-3 rounded bg-rose-500/30"></div>
                  <div className="w-3 h-3 rounded bg-rose-500/60"></div>
                  <div className="w-3 h-3 rounded bg-rose-500"></div>
                </div>
                <span className="text-[9px] font-bold text-slate-500 uppercase">High</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-[30px_1fr] sm:grid-cols-[40px_1fr] gap-2 sm:gap-4 overflow-x-auto scrollbar-hide">
            <div className="flex flex-col justify-between py-2 text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase">
              <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
            </div>
            {/* Generate random heatmap grid - pure visual representation */}
            <div className="grid grid-cols-24 gap-1 sm:gap-1.5 min-w-[500px]">
              {Array.from({length: 168}).map((_, i) => {
                const opacity = Math.floor(Math.random() * 90) + 10;
                return (
                  <div 
                    key={i} 
                    className="w-full aspect-square rounded-[2px] cursor-crosshair transition-all hover:scale-[1.5] hover:z-10 hover:outline hover:outline-1 hover:outline-black/10 dark:hover:outline-white/20"
                    style={{ backgroundColor: `rgba(244, 63, 94, ${opacity / 100})` }}
                  />
                )
              })}
            </div>
          </div>
          <div className="flex justify-between mt-4 pl-8 sm:pl-10 pr-2 text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest overflow-x-auto min-w-[500px]">
            <span>00:00</span><span>04:00</span><span>08:00</span><span>12:00</span><span>16:00</span><span>20:00</span><span>23:59</span>
          </div>
        </div>

        {/* Quality Metrics */}
        <div className="space-y-6 flex flex-col">
          <div className="bg-white dark:bg-white/[0.03] backdrop-blur-[12px] p-5 sm:p-6 rounded-2xl border border-slate-200 dark:border-white/[0.08] shadow-sm flex-1">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Response Quality Metrics</h3>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5">
                <div className="flex justify-between items-start mb-4">
                  <p className="text-[10px] font-bold text-slate-500 uppercase">CSAT Score</p>
                  <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-500/10 text-slate-500 text-[9px] font-bold">No Data</span>
                </div>
                <div className="flex flex-col sm:flex-row items-baseline sm:items-center gap-2 sm:gap-3">
                  <span className="text-2xl font-bold text-slate-900 dark:text-white">--</span>
                  <div className="flex text-slate-300 dark:text-slate-600 text-xs sm:text-sm">
                    <Star className="fill-current w-3 h-3 sm:w-4 sm:h-4"/><Star className="fill-current w-3 h-3 sm:w-4 sm:h-4"/><Star className="fill-current w-3 h-3 sm:w-4 sm:h-4"/><Star className="fill-current w-3 h-3 sm:w-4 sm:h-4"/><Star className="fill-current w-3 h-3 sm:w-4 sm:h-4"/>
                  </div>
                </div>
                <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-2">-- vs last period</p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5">
                <div className="flex justify-between items-start mb-4">
                  <p className="text-[10px] font-bold text-slate-500 uppercase">Escalation Rate</p>
                  <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-500/10 text-slate-500 text-[9px] font-bold">No Data</span>
                </div>
                <div className="flex flex-col sm:flex-row items-baseline sm:items-center gap-2 sm:gap-3">
                  <span className="text-2xl font-bold text-slate-900 dark:text-white">--</span>
                </div>
                <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-2">-- trend</p>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 mt-auto">
              <div className="flex justify-between items-center mb-6">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Sentiment Breakdown</p>
                <div className="flex gap-4 text-[10px] font-bold opacity-50">
                  <span className="text-green-500">Pos: --</span>
                  <span className="text-slate-500 dark:text-slate-400">Neu: --</span>
                  <span className="text-rose-500">Neg: --</span>
                </div>
              </div>
              <div className="flex items-center justify-center h-12 w-full rounded-full mb-4 bg-transparent border border-dashed border-slate-200 dark:border-white/10 text-slate-400 text-xs font-medium">
                Not enough data
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Top Features */}
      <section className="bg-white dark:bg-white/[0.03] backdrop-blur-[12px] p-5 sm:p-6 rounded-2xl border border-slate-200 dark:border-white/[0.08] shadow-sm overflow-hidden min-h-[300px]">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">Top Features</h3>
          <button className="text-[10px] font-bold text-rose-500 uppercase tracking-widest hover:underline cursor-pointer">View Logs</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead className="bg-slate-50/50 dark:bg-white/5 text-[9px] font-bold text-slate-400 uppercase tracking-widest">
              <tr className="border-b border-slate-100 dark:border-white/5">
                <th className="px-4 py-3">Feature Name</th>
                <th className="px-4 py-3 text-center">Count</th>
                <th className="px-4 py-3 text-center">Success Rate</th>
                <th className="px-4 py-3 text-center">CSAT</th>
                <th className="px-4 py-3 text-right">Performance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-white/5 text-xs sm:text-sm">
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                  <div className="flex flex-col items-center justify-center">
                    <Activity className="w-8 h-8 mb-2 opacity-50 text-slate-400" />
                    <p className="font-medium">No feature data recorded yet.</p>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

    </div>
  );
}
