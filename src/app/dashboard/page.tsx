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
          { label: "Total Conversations", value: "24,592", trend: "+12.5%", isPositive: true, icon: MessagesSquare, color: "text-blue-500 text-blue-400", bg: "bg-blue-50 bg-blue-500/20", line: "bg-blue-500", barHeights: [40, 70, 45, 90, 65, 100, 85] },
          { label: "Active Chatbots", value: "8", trend: "+1", isPositive: true, icon: Box, color: "text-rose-500 text-rose-400", bg: "bg-rose-50 bg-rose-500/20", line: "bg-rose-500", barHeights: [100, 100, 100, 100, 100, 100, 100] },
          { label: "Avg Response Time", value: "1.2s", trend: "-0.3s", isPositive: true, icon: Activity, color: "text-green-500 text-green-400", bg: "bg-green-50 bg-green-500/20", line: "bg-green-500", barHeights: [60, 50, 40, 30, 25, 20, 15] },
          { label: "User Satisfaction", value: "98.4%", trend: "+2.1%", isPositive: true, icon: Users, color: "text-purple-500 text-purple-400", bg: "bg-purple-50 bg-purple-500/20", line: "bg-purple-500", barHeights: [85, 88, 90, 85, 92, 95, 98] },
        ].map((stat, i) => (
          <div key={i} className="bg-white/80 dark:bg-white/[0.03] backdrop-blur-xl border border-white/50 dark:border-white/5 p-6 rounded-[1.5rem] md:rounded-[2rem] relative overflow-hidden group hover:border-slate-200 dark:hover:border-white/10 transition-all shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-2xl hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] dark:hover:shadow-black/50 cursor-pointer">
             <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-slate-100 to-transparent dark:from-white/[0.02] dark:group-hover:from-white/[0.04] blur-2xl rounded-full transition-colors pointer-events-none"></div>
             
             <div className="flex items-start justify-between mb-6 relative z-10">
                <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center", stat.bg.split(' ')[0], "dark:" + stat.bg.split(' ')[1])}>
                  <stat.icon className={cn("w-6 h-6", stat.color.split(' ')[0], "dark:" + stat.color.split(' ')[1])} />
                </div>
                <div className={cn(
                  "flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-bold",
                  stat.isPositive 
                    ? "bg-green-50 dark:bg-white/5 border-green-100 dark:border-white/10 text-green-600 dark:text-green-400"
                    : "bg-rose-50 dark:bg-white/5 border-rose-100 dark:border-white/10 text-rose-600 dark:text-rose-400"
                )}>
                  {stat.trend}
                </div>
             </div>
             
             <div className="relative z-10">
               <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2">{stat.label}</p>
               <h3 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white font-cabinet tracking-tight">{stat.value}</h3>
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
         <div className="lg:col-span-2 bg-white/80 dark:bg-white/[0.03] backdrop-blur-xl border border-white/50 dark:border-white/5 p-6 md:p-8 rounded-[2rem] min-h-[400px] flex flex-col shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-2xl">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white font-cabinet mb-1">Conversation Volume</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-8">Daily messages handled across all agents.</p>
            <div className="flex-1 w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5 border-dashed rounded-[1.5rem] flex items-center justify-center">
               <p className="text-slate-500 dark:text-slate-500 font-medium text-sm">Chart Component Placeholder</p>
            </div>
         </div>
         
         {/* Radial/Donut Chart Component Area */}
         <div className="bg-white/80 dark:bg-white/[0.03] backdrop-blur-xl border border-white/50 dark:border-white/5 p-6 md:p-8 rounded-[2rem] min-h-[400px] flex flex-col shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-2xl">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white font-cabinet mb-1">Top Languages</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-8">Language detection distribution.</p>
            <div className="flex-1 w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5 border-dashed rounded-[1.5rem] flex items-center justify-center">
               <p className="text-slate-500 dark:text-slate-500 font-medium text-sm">Radial Chart Placeholder</p>
            </div>
         </div>

      </div>
    </div>
  )
}
