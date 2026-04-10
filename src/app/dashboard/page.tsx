"use client";

import { useState, useEffect, useCallback } from "react";
import { MessagesSquare, Box, Activity, Users, TrendingUp, TrendingDown, Loader2, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import { getOverviewStats, getTrends } from "@/app/actions/analytics";

type OverviewData = {
  total_conversations: number;
  total_messages: number;
  active_conversations_24h: number;
  active_chatbots: number;
  total_documents: number;
  total_chunks: number;
  avg_messages_per_conversation: number;
  avg_response_time_ms: number | null;
  conversations_trend_pct: number | null;
  messages_trend_pct: number | null;
};

type TrendPoint = {
  date: string;
  conversations: number;
  messages: number;
  user_messages: number;
  bot_messages: number;
};

function formatTrend(pct: number | null): string {
  if (pct === null || pct === undefined) return "--";
  const sign = pct >= 0 ? "+" : "";
  return `${sign}${pct}%`;
}

function formatResponseTime(ms: number | null): string {
  if (ms === null || ms === undefined) return "--";
  if (ms < 1000) return `${Math.round(ms)}ms`;
  return `${(ms / 1000).toFixed(1)}s`;
}

function Sparkline({ data, color }: { data: number[]; color: string }) {
  if (!data.length) return null;
  const max = Math.max(...data, 1);
  const w = 120;
  const h = 32;
  const points = data
    .map((v, i) => `${(i / Math.max(data.length - 1, 1)) * w},${h - (v / max) * h}`)
    .join(" ");
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-8" preserveAspectRatio="none">
      <polyline fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" points={points} />
    </svg>
  );
}

function BarChart({ data, color }: { data: TrendPoint[]; color: string }) {
  if (!data.length) return null;
  const max = Math.max(...data.map((d) => d.messages), 1);
  const barW = Math.max(100 / data.length - 1, 2);

  return (
    <div className="flex items-end gap-[2px] h-full w-full px-1">
      {data.map((d, i) => {
        const pct = (d.messages / max) * 100;
        return (
          <div key={i} className="flex-1 flex flex-col items-center justify-end gap-1 group relative">
            <div
              className="w-full rounded-t transition-all hover:opacity-80 min-h-[2px]"
              style={{ height: `${Math.max(pct, 2)}%`, background: color }}
            />
            <div className="absolute -top-10 left-1/2 -translate-x-1/2 px-2 py-1 rounded-lg bg-slate-900 text-white text-[9px] font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
              {d.date.slice(5)}: {d.messages} msgs
            </div>
          </div>
        );
      })}
    </div>
  );
}

const RANGE_OPTIONS = [
  { label: "7 Days", days: 7 },
  { label: "30 Days", days: 30 },
  { label: "90 Days", days: 90 },
];

export default function DashboardPage() {
  const [overview, setOverview] = useState<OverviewData | null>(null);
  const [trends, setTrends] = useState<TrendPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [rangeDays, setRangeDays] = useState(30);

  const fetchData = useCallback(async () => {
    setLoading(true);
    const [overviewRes, trendsRes] = await Promise.all([
      getOverviewStats(),
      getTrends("day", rangeDays),
    ]);
    if (overviewRes.success) setOverview(overviewRes.data);
    if (trendsRes.success) setTrends(trendsRes.data.data || []);
    setLoading(false);
  }, [rangeDays]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const stats = [
    {
      label: "Total Conversations",
      value: overview?.total_conversations ?? 0,
      trend: formatTrend(overview?.conversations_trend_pct ?? null),
      isPositive: (overview?.conversations_trend_pct ?? 0) >= 0,
      icon: MessagesSquare,
      color: "text-rose-500",
      bg: "bg-rose-50 dark:bg-rose-500/10",
      sparkData: trends.map((t) => t.conversations),
      sparkColor: "#f43f5e",
    },
    {
      label: "Active Chatbots",
      value: overview?.active_chatbots ?? 0,
      trend: null,
      isPositive: true,
      icon: Box,
      color: "text-blue-500",
      bg: "bg-blue-50 dark:bg-blue-500/10",
      sparkData: [],
      sparkColor: "#3b82f6",
    },
    {
      label: "Avg Response Time",
      value: formatResponseTime(overview?.avg_response_time_ms ?? null),
      trend: null,
      isPositive: true,
      icon: Activity,
      color: "text-orange-500",
      bg: "bg-orange-50 dark:bg-orange-500/10",
      sparkData: [],
      sparkColor: "#f97316",
    },
    {
      label: "User Satisfaction",
      value: "--",
      trend: null,
      isPositive: true,
      icon: Users,
      color: "text-green-500",
      bg: "bg-green-50 dark:bg-green-500/10",
      sparkData: [],
      sparkColor: "#22c55e",
    },
  ];

  return (
    <div className="space-y-8 animate-fade-in max-w-7xl mx-auto pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 relative z-20">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white font-cabinet tracking-tight">System Overview</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1 font-medium text-xs sm:text-sm">Monitor your AI agents' performance and engagement metrics.</p>
        </div>
        <div className="flex gap-2">
          {RANGE_OPTIONS.map((opt) => (
            <button
              key={opt.days}
              onClick={() => setRangeDays(opt.days)}
              className={cn(
                "h-9 px-4 rounded-xl text-sm font-bold transition-all cursor-pointer border",
                rangeDays === opt.days
                  ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-transparent shadow-lg"
                  : "bg-white dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-500 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/10"
              )}
            >
              {opt.label}
            </button>
          ))}
          <button
            onClick={fetchData}
            disabled={loading}
            className="h-9 w-9 rounded-xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-500 hover:text-slate-900 dark:hover:text-white flex items-center justify-center transition-colors cursor-pointer disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white/80 dark:bg-white/[0.03] backdrop-blur-xl border border-white/50 dark:border-white/5 p-5 rounded-2xl relative overflow-hidden group hover:border-slate-200 dark:hover:border-white/10 transition-all shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-2xl hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] dark:hover:shadow-black/50">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-slate-100 to-transparent dark:from-white/[0.02] dark:group-hover:from-white/[0.04] blur-2xl rounded-full transition-colors pointer-events-none" />

            <div className="flex items-start justify-between mb-5 relative z-10">
              <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center", stat.bg)}>
                <stat.icon className={cn("w-5 h-5", stat.color)} />
              </div>
              {stat.trend !== null && (
                <div className={cn(
                  "flex items-center gap-1 px-2.5 py-1 rounded-lg border text-xs font-bold",
                  stat.trend === "--"
                    ? "bg-slate-50 dark:bg-white/5 border-slate-100 dark:border-white/10 text-slate-500"
                    : stat.isPositive
                      ? "bg-green-50 dark:bg-green-500/10 border-green-100 dark:border-green-500/20 text-green-600 dark:text-green-400"
                      : "bg-rose-50 dark:bg-rose-500/10 border-rose-100 dark:border-rose-500/20 text-rose-600 dark:text-rose-400"
                )}>
                  {stat.trend !== "--" && (stat.isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />)}
                  {stat.trend}
                </div>
              )}
            </div>

            <div className="relative z-10">
              <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1.5">{stat.label}</p>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                {loading ? <Loader2 className="w-5 h-5 animate-spin text-slate-300" /> : stat.value}
              </h3>
            </div>

            {stat.sparkData.length > 1 && (
              <div className="mt-4 opacity-50 group-hover:opacity-100 transition-opacity">
                <Sparkline data={stat.sparkData} color={stat.sparkColor} />
              </div>
            )}
            {stat.sparkData.length <= 1 && stat.label === "User Satisfaction" && (
              <div className="mt-6 flex items-center justify-center h-8">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Coming Soon</span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Conversation Volume */}
        <div className="lg:col-span-2 bg-white/80 dark:bg-white/[0.03] backdrop-blur-xl border border-white/50 dark:border-white/5 p-5 md:p-6 rounded-2xl min-h-[320px] flex flex-col shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-2xl">
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Conversation Volume</h3>
            {trends.length > 0 && (
              <span className="text-xs font-bold text-slate-400">
                {trends.reduce((s, t) => s + t.messages, 0).toLocaleString()} total messages
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">Daily messages handled across all agents.</p>

          {loading ? (
            <div className="flex-1 flex items-center justify-center">
              <Loader2 className="w-6 h-6 animate-spin text-slate-300" />
            </div>
          ) : trends.length === 0 ? (
            <div className="flex-1 w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5 border-dashed rounded-xl flex flex-col items-center justify-center text-slate-400">
              <Activity className="w-6 h-6 mb-2 opacity-50" />
              <p className="text-slate-500 dark:text-slate-400 font-medium text-xs">Not enough data to display trends.</p>
            </div>
          ) : (
            <div className="flex-1 w-full">
              <BarChart data={trends} color="#f43f5e" />
            </div>
          )}
        </div>

        {/* Quick Stats */}
        <div className="bg-white/80 dark:bg-white/[0.03] backdrop-blur-xl border border-white/50 dark:border-white/5 p-5 md:p-6 rounded-2xl min-h-[320px] flex flex-col shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-2xl">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">Quick Stats</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">Key metrics at a glance.</p>

          <div className="flex-1 space-y-4">
            {[
              { label: "Total Documents", value: overview?.total_documents ?? 0 },
              { label: "Indexed Chunks", value: overview?.total_chunks ?? 0 },
              { label: "Active Chats (24h)", value: overview?.active_conversations_24h ?? 0 },
              { label: "Avg Msgs/Conversation", value: overview?.avg_messages_per_conversation ?? 0 },
              { label: "Total Messages", value: overview?.total_messages ?? 0 },
            ].map((item, idx) => (
              <div key={idx} className="flex items-center justify-between py-2.5 border-b border-slate-100 dark:border-white/5 last:border-none">
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400">{item.label}</span>
                <span className="text-sm font-bold text-slate-900 dark:text-white">
                  {loading ? <Loader2 className="w-3 h-3 animate-spin text-slate-300" /> : item.value.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
