"use client";

import { 
  Zap, TrendingUp, Users, Minus, Clock, TrendingDown,
  CheckCircle, Expand, Cpu, Star, AlertCircle, HelpCircle,
  Package, Ruler, CreditCard
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function AnalyticsPage() {
  return (
    <div className="space-y-8 animate-fade-in pb-24">
      
      {/* Real-time Stats Header */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Total Queries */}
        <div className="bg-white dark:bg-white/[0.03] backdrop-blur-[12px] p-6 rounded-3xl border border-slate-200 dark:border-white/[0.08] shadow-sm hover:border-slate-300 dark:hover:border-rose-500/30 transition-all group">
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-500/10 text-rose-500 flex items-center justify-center">
              <Zap className="w-6 h-6" />
            </div>
            <div className="text-right">
              <span className="flex items-center justify-end gap-1 text-green-500 text-xs font-bold">
                <TrendingUp className="w-3 h-3"/> +12.4%
              </span>
              <p className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-tighter mt-1">vs prev. week</p>
            </div>
          </div>
          <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">Total Queries</p>
          <h3 className="text-3xl font-bold text-slate-900 dark:text-white mt-1 tracking-tight font-cabinet">48,291</h3>
          <div className="mt-4 h-8 w-full opacity-60 dark:opacity-50">
            <svg viewBox="0 0 100 20" className="w-full h-full overflow-visible">
              <path d="M0,15 Q10,18 20,12 T40,15 T60,5 T80,10 T100,2" fill="none" stroke="#f43f5e" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
        </div>

        {/* Active Chats */}
        <div className="bg-white dark:bg-white/[0.03] backdrop-blur-[12px] p-6 rounded-3xl border border-slate-200 dark:border-white/[0.08] shadow-sm hover:border-slate-300 dark:hover:border-rose-500/30 transition-all group">
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-500/10 text-blue-500 flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
            <div className="text-right">
              <span className="flex items-center justify-end gap-1 text-slate-400 dark:text-blue-400 text-xs font-bold">
                <Minus className="w-3 h-3"/> Stable
              </span>
              <p className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-tighter mt-1">Current Load</p>
            </div>
          </div>
          <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">Active Chats</p>
          <h3 className="text-3xl font-bold text-slate-900 dark:text-white mt-1 tracking-tight font-cabinet">152</h3>
          <div className="mt-4 flex items-center gap-3">
            <div className="flex-1 h-1.5 bg-blue-100 dark:bg-white/5 rounded-full overflow-hidden">
              <div className="h-full bg-blue-500 w-[72%] rounded-full"></div>
            </div>
            <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400">72%</span>
          </div>
        </div>

        {/* Avg Response */}
        <div className="bg-white dark:bg-white/[0.03] backdrop-blur-[12px] p-6 rounded-3xl border border-slate-200 dark:border-white/[0.08] shadow-sm hover:border-slate-300 dark:hover:border-rose-500/30 transition-all group">
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 rounded-2xl bg-orange-50 dark:bg-orange-500/10 text-orange-500 flex items-center justify-center">
              <Clock className="w-6 h-6" />
            </div>
            <div className="text-right">
              <span className="flex items-center justify-end gap-1 text-green-500 text-xs font-bold">
                <TrendingDown className="w-3 h-3"/> -0.4s
              </span>
              <p className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-tighter mt-1">Latency</p>
            </div>
          </div>
          <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">Avg. Response</p>
          <h3 className="text-3xl font-bold text-slate-900 dark:text-white mt-1 tracking-tight font-cabinet">1.8s</h3>
          <div className="mt-4 flex gap-1.5">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className={cn("h-1.5 flex-1 rounded-full", i < 4 ? "bg-orange-500" : "bg-slate-100 dark:bg-white/5")}></div>
            ))}
          </div>
        </div>

        {/* Resolution Rate */}
        <div className="bg-white dark:bg-white/[0.03] backdrop-blur-[12px] p-6 rounded-3xl border border-slate-200 dark:border-white/[0.08] shadow-sm hover:border-slate-300 dark:hover:border-rose-500/30 transition-all group">
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 rounded-2xl bg-green-50 dark:bg-green-500/10 text-green-500 flex items-center justify-center">
              <CheckCircle className="w-6 h-6" />
            </div>
            <div className="text-right">
              <span className="flex items-center justify-end gap-1 text-green-500 text-xs font-bold">
                <TrendingUp className="w-3 h-3"/> +2.1%
              </span>
              <p className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-tighter mt-1">Success Rate</p>
            </div>
          </div>
          <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">Resolution Rate</p>
          <h3 className="text-3xl font-bold text-slate-900 dark:text-white mt-1 tracking-tight font-cabinet">94.2%</h3>
          <div className="mt-4 h-1.5 w-full bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
            <div className="h-full bg-green-500 w-[94%] rounded-full"></div>
          </div>
        </div>

      </section>

      {/* Main Charts */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Trends Chart */}
        <div className="col-span-1 lg:col-span-2 bg-white dark:bg-white/[0.03] backdrop-blur-[12px] p-8 rounded-[2.5rem] border border-slate-200 dark:border-white/[0.08] shadow-sm relative overflow-hidden">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
            <div className="space-y-1">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white font-cabinet">Query Trends</h3>
              <p className="text-xs text-slate-500 px-1">Volume of multilingual support conversations across last 7 days</p>
            </div>
            <div className="flex gap-2">
              <button className="px-3 py-1.5 bg-slate-50 dark:bg-white/5 rounded-lg text-[10px] font-bold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer">Day</button>
              <button className="px-3 py-1.5 bg-rose-50 dark:bg-rose-500/20 text-rose-500 border border-rose-200 dark:border-rose-500/30 rounded-lg text-[10px] font-bold cursor-pointer">Week</button>
              <button className="px-3 py-1.5 bg-slate-50 dark:bg-white/5 rounded-lg text-[10px] font-bold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer">Month</button>
            </div>
          </div>

          <div className="h-72 w-full relative">
            <svg viewBox="0 0 800 240" className="w-full h-full overflow-visible">
              <defs>
                <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.2"/>
                  <stop offset="100%" stopColor="#f43f5e" stopOpacity="0"/>
                </linearGradient>
              </defs>
              <path d="M0,180 Q100,160 200,190 T400,100 T600,120 T800,40 L800,240 L0,240 Z" fill="url(#lineGrad)"/>
              <path d="M0,180 Q100,160 200,190 T400,100 T600,120 T800,40" fill="none" stroke="#f43f5e" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="200" cy="190" r="6" className="fill-white dark:fill-[#0a0f1e]" stroke="#f43f5e" strokeWidth="3"/>
              <circle cx="400" cy="100" r="6" className="fill-white dark:fill-[#0a0f1e]" stroke="#f43f5e" strokeWidth="3"/>
              <circle cx="800" cy="40" r="6" className="fill-white dark:fill-[#0a0f1e]" stroke="#f43f5e" strokeWidth="3"/>
            </svg>
            <div className="flex justify-between mt-6 px-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
              <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
            </div>
          </div>
        </div>

        {/* Query Distribution */}
        <div className="bg-white dark:bg-white/[0.03] backdrop-blur-[12px] p-8 rounded-[2.5rem] border border-slate-200 dark:border-white/[0.08] shadow-sm">
          <div className="mb-8">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white font-cabinet">Query Distribution</h3>
            <p className="text-xs text-slate-500 mt-1">Intent classification distribution</p>
          </div>
          <div className="flex flex-col items-center justify-center h-full pb-10">
            {/* Custom CSS Donut Chart */}
            <div className="w-48 h-48 rounded-full relative flex items-center justify-center border-[16px] border-slate-50 dark:border-white/5 mb-10 shrink-0">
              <div className="absolute inset-0 rounded-full border-[16px] border-rose-500 border-t-transparent border-l-transparent rotate-[25deg]"></div>
              <div className="absolute inset-0 rounded-full border-[16px] border-blue-500 border-b-transparent border-r-transparent border-l-transparent rotate-[160deg]"></div>
              <div className="absolute inset-0 rounded-full border-[16px] border-orange-500 border-t-transparent border-r-transparent border-b-transparent rotate-[280deg]"></div>
              <div className="text-center">
                <p className="text-2xl font-bold text-slate-900 dark:text-white font-cabinet">52+</p>
                <p className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase">Intents</p>
              </div>
            </div>
            
            <div className="w-full space-y-4 px-4">
              <div className="flex items-center justify-between text-xs font-bold">
                <div className="flex items-center gap-3"><div className="w-2 h-2 rounded-full bg-rose-500"></div><span className="text-slate-600 dark:text-slate-400">Product Support</span></div>
                <span className="text-slate-900 dark:text-white">42%</span>
              </div>
              <div className="flex items-center justify-between text-xs font-bold">
                <div className="flex items-center gap-3"><div className="w-2 h-2 rounded-full bg-blue-500"></div><span className="text-slate-600 dark:text-slate-400">Pricing Qs</span></div>
                <span className="text-slate-900 dark:text-white">28%</span>
              </div>
              <div className="flex items-center justify-between text-xs font-bold">
                <div className="flex items-center gap-3"><div className="w-2 h-2 rounded-full bg-orange-500"></div><span className="text-slate-600 dark:text-slate-400">Returns/Refunds</span></div>
                <span className="text-slate-900 dark:text-white">15%</span>
              </div>
              <div className="flex items-center justify-between text-xs font-bold">
                <div className="flex items-center gap-3"><div className="w-2 h-2 rounded-full bg-slate-200 dark:bg-white/10"></div><span className="text-slate-600 dark:text-slate-400">Others</span></div>
                <span className="text-slate-900 dark:text-white">15%</span>
              </div>
            </div>
          </div>
        </div>

      </section>

      {/* Model Tech Stats Section */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white dark:bg-white/[0.03] backdrop-blur-[12px] p-8 rounded-[2.5rem] border border-slate-200 dark:border-white/[0.08] shadow-sm">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-500/10 text-rose-500 flex items-center justify-center"><TrendingUp className="w-5 h-5"/></div>
            <h4 className="text-lg font-bold text-slate-900 dark:text-white font-cabinet">Input Tokens</h4>
          </div>
          <h3 className="text-4xl font-bold text-slate-900 dark:text-white mb-2 font-cabinet">1.2M</h3>
          <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-6">
            <span>Daily Avg: 42.8k</span>
            <span className="text-slate-900 dark:text-rose-400 font-bold">$24.50 EST.</span>
          </div>
          <div className="h-1.5 w-full bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-rose-500 to-rose-400 w-[45%] rounded-full"></div>
          </div>
          <p className="text-[10px] text-slate-500 mt-3">45% of monthly quota used</p>
        </div>

        <div className="bg-white dark:bg-white/[0.03] backdrop-blur-[12px] p-8 rounded-[2.5rem] border border-slate-200 dark:border-white/[0.08] shadow-sm">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-500/10 text-blue-500 flex items-center justify-center"><CheckCircle className="w-5 h-5"/></div>
            <h4 className="text-lg font-bold text-slate-900 dark:text-white font-cabinet">Output Tokens</h4>
          </div>
          <h3 className="text-4xl font-bold text-slate-900 dark:text-white mb-2 font-cabinet">3.8M</h3>
          <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-6">
            <span>Daily Avg: 135.7k</span>
            <span className="text-slate-900 dark:text-blue-400 font-bold">$76.20 EST.</span>
          </div>
          <div className="h-1.5 w-full bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-blue-500 to-blue-400 w-[68%] rounded-full"></div>
          </div>
          <p className="text-[10px] text-slate-500 mt-3">68% of monthly quota used</p>
        </div>

        <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-8 rounded-[2.5rem] border-none shadow-xl relative overflow-hidden">
          <div className="absolute -right-4 -top-4 w-20 h-20 bg-green-500/10 rounded-full blur-2xl"></div>
          <div className="flex items-center gap-4 mb-6">
            <div className="w-10 h-10 rounded-xl bg-white/10 text-rose-400 flex items-center justify-center"><Cpu className="w-5 h-5"/></div>
            <h4 className="text-lg font-bold text-white font-cabinet">AI Performance</h4>
          </div>
          <div className="space-y-4 mb-6">
            <div className="flex justify-between items-center"><span className="text-xs text-slate-400">Model Quality</span><span className="text-xs font-bold text-white">98.4%</span></div>
            <div className="flex justify-between items-center"><span className="text-xs text-slate-400">Context Recall</span><span className="text-xs font-bold text-white">96.2%</span></div>
            <div className="flex justify-between items-center"><span className="text-xs text-slate-400">Reasoning Speed</span><span className="text-xs font-bold text-white">420ms</span></div>
          </div>
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-3 mt-auto">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_10px_#22c55e]"></div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-green-500">Optimal Status</p>
          </div>
        </div>
      </section>

      {/* Complex Heatmap & Quality Section */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Heatmap */}
        <div className="bg-white dark:bg-white/[0.03] backdrop-blur-[12px] p-6 sm:p-8 rounded-[3rem] border border-slate-200 dark:border-white/[0.08] shadow-sm overflow-hidden">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
            <div className="space-y-1">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white font-cabinet">Hourly Activity Heatmap</h3>
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
        <div className="space-y-8 flex flex-col">
          <div className="bg-white dark:bg-white/[0.03] backdrop-blur-[12px] p-8 rounded-[2.5rem] border border-slate-200 dark:border-white/[0.08] shadow-sm flex-1">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-8 font-cabinet">Response Quality Metrics</h3>
            <div className="grid grid-cols-2 gap-4 sm:gap-6 mb-8">
              <div className="p-4 sm:p-6 rounded-3xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5">
                <div className="flex justify-between items-start mb-4">
                  <p className="text-[10px] font-bold text-slate-500 uppercase">CSAT Score</p>
                  <span className="px-2 py-0.5 rounded bg-green-100 dark:bg-green-500/10 text-green-600 dark:text-green-500 text-[9px] font-bold">Target Met</span>
                </div>
                <div className="flex flex-col sm:flex-row items-baseline sm:items-center gap-2 sm:gap-3">
                  <span className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white font-cabinet">4.8</span>
                  <div className="flex text-orange-400 text-xs sm:text-sm">
                    <Star className="fill-current w-3 h-3 sm:w-4 sm:h-4"/><Star className="fill-current w-3 h-3 sm:w-4 sm:h-4"/><Star className="fill-current w-3 h-3 sm:w-4 sm:h-4"/><Star className="fill-current w-3 h-3 sm:w-4 sm:h-4"/><Star className="fill-current w-3 h-3 sm:w-4 sm:h-4"/>
                  </div>
                </div>
                <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-2">+0.2 vs last period</p>
              </div>

              <div className="p-4 sm:p-6 rounded-3xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5">
                <div className="flex justify-between items-start mb-4">
                  <p className="text-[10px] font-bold text-slate-500 uppercase">Escalation Rate</p>
                  <span className="px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-500/10 text-blue-600 dark:text-blue-500 text-[9px] font-bold">Healthy</span>
                </div>
                <div className="flex flex-col sm:flex-row items-baseline sm:items-center gap-2 sm:gap-3">
                  <span className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white font-cabinet">8.2%</span>
                  <TrendingDown className="text-green-500 w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-2">Decreasing trend</p>
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 mt-auto">
              <div className="flex justify-between items-center mb-6">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Sentiment Breakdown</p>
                <div className="flex gap-4 text-[10px] font-bold">
                  <span className="text-green-500">Pos: 82%</span>
                  <span className="text-slate-500 dark:text-slate-400">Neu: 15%</span>
                  <span className="text-rose-500">Neg: 3%</span>
                </div>
              </div>
              <div className="flex h-3 w-full rounded-full overflow-hidden mb-4 bg-slate-200 dark:bg-transparent">
                <div className="bg-green-500 w-[82%] h-full"></div>
                <div className="bg-slate-300 dark:bg-slate-600 w-[15%] h-full"></div>
                <div className="bg-rose-500 w-[3%] h-full"></div>
              </div>
              <div className="grid grid-cols-3 text-center pt-2">
                <div className="border-r border-slate-200 dark:border-white/5">
                  <p className="text-lg font-bold text-green-600 font-cabinet">82%</p><p className="text-[9px] uppercase text-slate-400 font-bold tracking-widest">Positive</p>
                </div>
                <div className="border-r border-slate-200 dark:border-white/5">
                  <p className="text-lg font-bold text-slate-600 font-cabinet">15%</p><p className="text-[9px] uppercase text-slate-400 font-bold tracking-widest">Neutral</p>
                </div>
                <div>
                  <p className="text-lg font-bold text-rose-600 font-cabinet">3%</p><p className="text-[9px] uppercase text-slate-400 font-bold tracking-widest">Negative</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Top Features */}
      <section className="bg-white dark:bg-white/[0.03] backdrop-blur-[12px] p-6 sm:p-8 rounded-[2.5rem] border border-slate-200 dark:border-white/[0.08] shadow-sm overflow-hidden min-h-[400px]">
        <div className="flex justify-between items-center mb-8">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white font-cabinet">Top Features</h3>
          <button className="text-[10px] font-bold text-rose-500 uppercase tracking-widest hover:underline cursor-pointer">View Logs</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead className="bg-slate-50/50 dark:bg-white/5 text-[9px] font-bold text-slate-400 uppercase tracking-widest">
              <tr className="border-b border-slate-100 dark:border-white/5">
                <th className="px-6 py-4">Feature Name</th>
                <th className="px-6 py-4 text-center">Count</th>
                <th className="px-6 py-4 text-center">Success Rate</th>
                <th className="px-6 py-4 text-center">CSAT</th>
                <th className="px-6 py-4 text-right">Performance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-white/5 text-xs sm:text-sm">
              <tr className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors group">
                <td className="px-6 py-5">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-rose-50 dark:bg-rose-500/10 text-rose-500 flex items-center justify-center shrink-0">
                      <HelpCircle className="w-4 h-4"/>
                    </div>
                    <span className="text-slate-900 dark:text-white font-bold">Product FAQ</span>
                  </div>
                </td>
                <td className="px-6 py-5 text-center font-bold text-slate-600 dark:text-slate-300">12,842</td>
                <td className="px-6 py-5 text-center font-bold text-green-600 dark:text-green-500">96.4%</td>
                <td className="px-6 py-5 text-center font-bold text-slate-900 dark:text-white">4.9/5</td>
                <td className="px-6 py-5 text-right font-bold text-green-500 flex items-center justify-end gap-1">
                  <TrendingUp className="w-4 h-4" /> High
                </td>
              </tr>
              <tr className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors group">
                <td className="px-6 py-5">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-500/10 text-blue-500 flex items-center justify-center shrink-0">
                      <Package className="w-4 h-4"/>
                    </div>
                    <span className="text-slate-900 dark:text-white font-bold">Order Track</span>
                  </div>
                </td>
                <td className="px-6 py-5 text-center font-bold text-slate-600 dark:text-slate-300">8,421</td>
                <td className="px-6 py-5 text-center font-bold text-green-600 dark:text-green-500">94.1%</td>
                <td className="px-6 py-5 text-center font-bold text-slate-900 dark:text-white">4.7/5</td>
                <td className="px-6 py-5 text-right font-bold text-slate-600 dark:text-slate-400 flex items-center justify-end gap-1">
                  Stable
                </td>
              </tr>
              <tr className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors group">
                <td className="px-6 py-5">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-orange-50 dark:bg-orange-500/10 text-orange-500 flex items-center justify-center shrink-0">
                      <Ruler className="w-4 h-4"/>
                    </div>
                    <span className="text-slate-900 dark:text-white font-bold">Size Guide</span>
                  </div>
                </td>
                <td className="px-6 py-5 text-center font-bold text-slate-600 dark:text-slate-300">5,112</td>
                <td className="px-6 py-5 text-center font-bold text-green-600 dark:text-green-500">91.8%</td>
                <td className="px-6 py-5 text-center font-bold text-slate-900 dark:text-white">4.8/5</td>
                <td className="px-6 py-5 text-right font-bold text-green-500 flex items-center justify-end gap-1">
                  <TrendingUp className="w-4 h-4" /> Growth
                </td>
              </tr>
              <tr className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors group">
                <td className="px-6 py-5">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-purple-50 dark:bg-purple-500/10 text-purple-500 flex items-center justify-center shrink-0">
                      <CreditCard className="w-4 h-4"/>
                    </div>
                    <span className="text-slate-900 dark:text-white font-bold">Payment Help</span>
                  </div>
                </td>
                <td className="px-6 py-5 text-center font-bold text-slate-600 dark:text-slate-300">3,205</td>
                <td className="px-6 py-5 text-center font-bold text-orange-500">82.5%</td>
                <td className="px-6 py-5 text-center font-bold text-slate-900 dark:text-white">4.1/5</td>
                <td className="px-6 py-5 text-right font-bold text-orange-500 flex items-center justify-end gap-1">
                  <AlertCircle className="w-4 h-4" /> Review
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

    </div>
  );
}
