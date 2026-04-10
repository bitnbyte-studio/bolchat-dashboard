import { Metadata } from "next"
import { Users, MessagesSquare, Box, Activity, ChevronUp, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

export const metadata: Metadata = {
  title: "Dashboard - BolChat",
}

export default function DashboardPage() {
  return (
    <div className="space-y-8 animate-fade-in max-w-7xl mx-auto pb-20">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 relative z-20">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white font-cabinet tracking-tight">System Overview</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1 font-medium text-xs sm:text-sm">Monitor your AI agents' performance and engagement metrics.</p>
        </div>
        <div className="flex gap-3">
           <button className="h-10 px-4 rounded-xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-sm font-bold text-slate-500 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/10 transition-colors shadow-sm dark:shadow-none cursor-pointer">
              Last 30 Days
           </button>
           <button className="h-10 px-6 rounded-xl bg-gradient-to-r from-rose-500 to-pink-500 text-white text-sm font-bold shadow-lg shadow-rose-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer">
              Generate Report
           </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Stat Cards */}
        {[
          { label: "Total Conversations", value: "0", trend: "--", isPositive: true, icon: MessagesSquare, color: "text-slate-500", bg: "bg-slate-50 dark:bg-slate-800/20", line: "bg-slate-200 dark:bg-slate-800", barHeights: [10, 10, 10, 10, 10, 10, 10] },
          { label: "Active Chatbots", value: "0", trend: "--", isPositive: true, icon: Box, color: "text-slate-500", bg: "bg-slate-50 dark:bg-slate-800/20", line: "bg-slate-200 dark:bg-slate-800", barHeights: [10, 10, 10, 10, 10, 10, 10] },
          { label: "Avg Response Time", value: "--", trend: "--", isPositive: true, icon: Activity, color: "text-slate-500", bg: "bg-slate-50 dark:bg-slate-800/20", line: "bg-slate-200 dark:bg-slate-800", barHeights: [10, 10, 10, 10, 10, 10, 10] },
          { label: "User Satisfaction", value: "--", trend: "--", isPositive: true, icon: Users, color: "text-slate-500", bg: "bg-slate-50 dark:bg-slate-800/20", line: "bg-slate-200 dark:bg-slate-800", barHeights: [10, 10, 10, 10, 10, 10, 10] },
        ].map((stat, i) => (
          <div key={i} className="bg-white/80 dark:bg-white/[0.03] backdrop-blur-xl border border-white/50 dark:border-white/5 p-5 rounded-2xl relative overflow-hidden group hover:border-slate-200 dark:hover:border-white/10 transition-all shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-2xl hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] dark:hover:shadow-black/50 cursor-pointer">
             <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-slate-100 to-transparent dark:from-white/[0.02] dark:group-hover:from-white/[0.04] blur-2xl rounded-full transition-colors pointer-events-none"></div>
             
             <div className="flex items-start justify-between mb-5 relative z-10">
                <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center", stat.bg.split(' ')[0], "dark:" + stat.bg.split(' ')[1])}>
                  <stat.icon className={cn("w-5 h-5", stat.color.split(' ')[0], "dark:" + stat.color.split(' ')[1])} />
                </div>
                <div className={cn(
                  "flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-bold",
                  stat.trend === "--" 
                    ? "bg-slate-50 dark:bg-white/5 border-slate-100 dark:border-white/10 text-slate-500"
                    : stat.isPositive 
                      ? "bg-green-50 dark:bg-white/5 border-green-100 dark:border-white/10 text-green-600 dark:text-green-400"
                      : "bg-rose-50 dark:bg-white/5 border-rose-100 dark:border-white/10 text-rose-600 dark:text-rose-400"
                )}>
                  {stat.trend}
                </div>
             </div>
             
             <div className="relative z-10">
               <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1.5">{stat.label}</p>
               <h3 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">{stat.value}</h3>
             </div>
             
             {/* Decorative mini bar chart */}
             <div className="mt-8 flex items-end gap-[3px] h-8 opacity-40 dark:opacity-50 grayscale group-hover:grayscale-0 group-hover:opacity-100 transition-all">
                {stat.barHeights.map((height, j) => (
                  <div key={j} className={cn("w-full rounded-[2px] dark:rounded-t-sm", stat.line)} style={{ height: `${height}%` }}></div>
                ))}
             </div>
          </div>
        ))}
      </div>

      {/* Main Charts area layout placeholder */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         
         {/* Line Chart Component Area */}
         <div className="lg:col-span-2 bg-white/80 dark:bg-white/[0.03] backdrop-blur-xl border border-white/50 dark:border-white/5 p-5 md:p-6 rounded-2xl min-h-[320px] flex flex-col shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-2xl">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">Conversation Volume</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">Daily messages handled across all agents.</p>
            <div className="flex-1 w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5 border-dashed rounded-xl flex flex-col items-center justify-center text-slate-400">
               <Activity className="w-6 h-6 mb-2 opacity-50" />
               <p className="text-slate-500 dark:text-slate-400 font-medium text-xs">Not enough data to display trends.</p>
            </div>
         </div>
         
         {/* Radial/Donut Chart Component Area */}
         <div className="bg-white/80 dark:bg-white/[0.03] backdrop-blur-xl border border-white/50 dark:border-white/5 p-5 md:p-6 rounded-2xl min-h-[320px] flex flex-col shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-2xl">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">Top Languages</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">Language detection distribution.</p>
            <div className="flex-1 w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5 border-dashed rounded-xl flex flex-col items-center justify-center text-slate-400">
               <Activity className="w-6 h-6 mb-2 opacity-50" />
               <p className="text-slate-500 dark:text-slate-400 font-medium text-xs">No distribution data.</p>
            </div>
         </div>

      </div>
    </div>
  )
}
