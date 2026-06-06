"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import {
  Zap, Users, Clock, CheckCircle, TrendingUp, TrendingDown,
  Cpu, Star, Activity, Loader2, RefreshCw, Minus
} from "lucide-react";
import { cn } from "@/lib/utils";
import { getOverviewStats, getTrends, getHeatmap } from "@/app/actions/analytics";

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

type HeatmapCell = { day: number; hour: number; count: number };
type HeatmapData = { data: HeatmapCell[]; max_count: number };

function formatMs(ms: number | null): string {
  if (ms === null || ms === undefined) return "--";
  if (ms < 1000) return `${Math.round(ms)}ms`;
  return `${(ms / 1000).toFixed(1)}s`;
}

function formatTrend(pct: number | null): string {
  if (pct === null || pct === undefined) return "--";
  const sign = pct >= 0 ? "+" : "";
  return `${sign}${pct}%`;
}

const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const HOUR_LABELS = ["00:00", "04:00", "08:00", "12:00", "16:00", "20:00", "23:59"];

function TrendChart({ data, color }: { data: TrendPoint[]; color: string }) {
  const [tooltip, setTooltip] = useState<{ x: number; y: number; d: TrendPoint } | null>(null);
  if (!data.length) return null;

  const PAD_L = 44, PAD_B = 36, PAD_T = 16, PAD_R = 12;
  const W = 900, H = 340;
  const innerW = W - PAD_L - PAD_R;
  const innerH = H - PAD_T - PAD_B;

  const maxVal = Math.max(...data.map((d) => d.messages), 1);
  const niceMax = Math.ceil(maxVal / 5) * 5 || 5;
  const yTicks = 5;
  const barW = Math.min(Math.floor(innerW / data.length) - 2, 24);

  // Thin x-labels to max 10
  const labelStep = Math.ceil(data.length / 10);

  function barX(i: number) {
    return PAD_L + (i / data.length) * innerW + (innerW / data.length - barW) / 2;
  }

  return (
    <div className="relative w-full h-full">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full h-full"
        onMouseLeave={() => setTooltip(null)}
      >
        {/* Y grid lines + ticks */}
        {Array.from({ length: yTicks + 1 }).map((_, i) => {
          const val = Math.round((niceMax / yTicks) * i);
          const y = PAD_T + innerH - (val / niceMax) * innerH;
          return (
            <g key={i}>
              <line x1={PAD_L} x2={W - PAD_R} y1={y} y2={y} stroke="currentColor" strokeOpacity={0.07} strokeWidth={1} className="text-slate-900 dark:text-white" />
              <text x={PAD_L - 6} y={y + 4} textAnchor="end" fontSize={10} fill="currentColor" className="text-slate-400" fillOpacity={0.5}>{val}</text>
            </g>
          );
        })}

        {/* Bars */}
        {data.map((d, i) => {
          const bh = Math.max((d.messages / niceMax) * innerH, d.messages > 0 ? 2 : 0);
          const x = barX(i);
          const y = PAD_T + innerH - bh;
          return (
            <rect
              key={i}
              x={x} y={y} width={barW} height={bh}
              rx={3}
              fill={color}
              fillOpacity={tooltip?.d === d ? 1 : 0.85}
              className="cursor-pointer transition-opacity"
              onMouseEnter={(e) => setTooltip({ x: x + barW / 2, y, d })}
            />
          );
        })}

        {/* X labels */}
        {data.map((d, i) => {
          if (i % labelStep !== 0 && i !== data.length - 1) return null;
          const x = barX(i) + barW / 2;
          const [, mo, dy] = d.date.split("-");
          return (
            <text key={i} x={x} y={H - 8} textAnchor="middle" fontSize={10} fill="currentColor" fillOpacity={0.45} className="text-slate-500">
              {`${mo}/${dy}`}
            </text>
          );
        })}

        {/* Tooltip */}
        {tooltip && (() => {
          const tx = Math.min(Math.max(tooltip.x, 80), W - 80);
          const ty = Math.max(tooltip.y - 8, PAD_T);
          return (
            <g>
              <rect x={tx - 64} y={ty - 30} width={128} height={26} rx={6} fill="#0f172a" fillOpacity={0.92} />
              <text x={tx} y={ty - 13} textAnchor="middle" fontSize={10} fill="white" fontWeight="bold">
                {tooltip.d.date.slice(5)} · {tooltip.d.messages} msgs · {tooltip.d.conversations} convs
              </text>
            </g>
          );
        })()}
      </svg>
    </div>
  );
}

function Heatmap({ heatmap }: { heatmap: HeatmapData | null }) {
  const lookup = new Map<string, number>();
  if (heatmap) {
    for (const cell of heatmap.data) {
      lookup.set(`${cell.day}-${cell.hour}`, cell.count);
    }
  }
  const maxCount = heatmap?.max_count || 1;

  return (
    <div className="grid grid-cols-[30px_1fr] sm:grid-cols-[40px_1fr] gap-2 sm:gap-4 overflow-x-auto scrollbar-hide">
      <div className="flex flex-col justify-between py-2 text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase">
        {DAY_LABELS.map((d) => (
          <span key={d}>{d}</span>
        ))}
      </div>
      <div className="grid grid-cols-24 gap-1 sm:gap-1.5 min-w-[500px]">
        {Array.from({ length: 168 }).map((_, i) => {
          const dayIdx = Math.floor(i / 24);
          const hourIdx = i % 24;
          const count = lookup.get(`${dayIdx}-${hourIdx}`) || 0;
          const opacity = maxCount > 0 ? Math.max(count / maxCount, count > 0 ? 0.15 : 0.04) : 0.04;
          return (
            <div
              key={i}
              className="w-full aspect-square rounded-[2px] cursor-crosshair transition-all hover:scale-[1.5] hover:z-10 hover:outline hover:outline-1 hover:outline-black/10 dark:hover:outline-white/20 relative group"
              style={{ backgroundColor: `rgba(244, 63, 94, ${opacity})` }}
            >
              {count > 0 && (
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 rounded bg-slate-900 text-white text-[8px] font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20">
                  {DAY_LABELS[dayIdx]} {hourIdx}:00 - {count} msgs
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

const RANGE_OPTIONS = [
  { label: "7D", days: 7 },
  { label: "30D", days: 30 },
  { label: "90D", days: 90 },
];

export default function AnalyticsPage() {
  const searchParams = useSearchParams();
  const [overview, setOverview] = useState<OverviewData | null>(null);
  const [trends, setTrends] = useState<TrendPoint[]>([]);
  const [heatmap, setHeatmap] = useState<HeatmapData | null>(null);
  const [loading, setLoading] = useState(true);
  const [rangeDays, setRangeDays] = useState(30);
  const [trendView, setTrendView] = useState<"day" | "week" | "month">("day");

  // Sync range from URL param (set by header calendar picker)
  useEffect(() => {
    const d = Number(searchParams.get("days"));
    if (d && [7, 30, 90].includes(d)) setRangeDays(d);
  }, [searchParams]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    const [overviewRes, trendsRes, heatmapRes] = await Promise.all([
      getOverviewStats(rangeDays),
      getTrends(trendView, rangeDays),
      getHeatmap(rangeDays),
    ]);
    if (overviewRes.success) setOverview(overviewRes.data);
    if (trendsRes.success) setTrends(trendsRes.data.data || []);
    if (heatmapRes.success) setHeatmap(heatmapRes.data);
    setLoading(false);
  }, [rangeDays, trendView]);

  useEffect(() => { fetchData(); }, [fetchData]);

  // Listen for header Export / Refresh events
  useEffect(() => {
    function handleExport() {
      if (!trends.length) return;
      const header = "Date,Messages,Conversations,User Messages,Bot Messages";
      const rows = trends.map((t) =>
        `${t.date},${t.messages},${t.conversations},${t.user_messages},${t.bot_messages}`
      );
      const csv = [header, ...rows].join("\n");
      const blob = new Blob([csv], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `analytics-${rangeDays}d.csv`;
      a.click();
      URL.revokeObjectURL(url);
    }
    function handleRefresh() { fetchData(); }
    window.addEventListener("analytics:export", handleExport);
    window.addEventListener("analytics:refresh", handleRefresh);
    return () => {
      window.removeEventListener("analytics:export", handleExport);
      window.removeEventListener("analytics:refresh", handleRefresh);
    };
  }, [trends, rangeDays, fetchData]);

  const totalUserMessages = trends.reduce((s, t) => s + t.user_messages, 0);
  const msgTrendPct = overview?.messages_trend_pct;

  return (
    <div className="space-y-8 animate-fade-in pb-24">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white font-cabinet tracking-tight">Analytics</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1 font-medium text-xs sm:text-sm">Deep dive into your chatbot performance and engagement. <a href="https://bolchat.tech/docs#analytics" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-rose-500 hover:text-rose-600 font-bold">View Guide →</a></p>
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
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Queries */}
        <div className="bg-white dark:bg-white/[0.03] backdrop-blur-[12px] p-5 rounded-2xl border border-slate-200 dark:border-white/[0.08] shadow-sm hover:border-slate-300 dark:hover:border-rose-500/30 transition-all group">
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-500/10 text-rose-500 flex items-center justify-center">
              <Zap className="w-5 h-5" />
            </div>
            <div className="text-right">
              <span className={cn(
                "flex items-center justify-end gap-1 text-[10px] font-bold",
                msgTrendPct !== null && msgTrendPct !== undefined
                  ? msgTrendPct >= 0 ? "text-green-500" : "text-rose-500"
                  : "text-slate-400"
              )}>
                {msgTrendPct !== null && msgTrendPct !== undefined && (
                  msgTrendPct >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />
                )}
                {formatTrend(msgTrendPct ?? null)}
              </span>
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter mt-1">vs prev. period</p>
            </div>
          </div>
          <p className="text-slate-500 text-[9px] font-bold uppercase tracking-widest">Total Queries</p>
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1 tracking-tight">
            {loading ? <Loader2 className="w-5 h-5 animate-spin text-slate-300" /> : totalUserMessages.toLocaleString()}
          </h3>
        </div>

        {/* Active Chats */}
        <div className="bg-white dark:bg-white/[0.03] backdrop-blur-[12px] p-5 rounded-2xl border border-slate-200 dark:border-white/[0.08] shadow-sm hover:border-slate-300 dark:hover:border-rose-500/30 transition-all group">
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-500/10 text-blue-500 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <div className="text-right">
              <span className="flex items-center justify-end gap-1 text-slate-400 dark:text-blue-400 text-[10px] font-bold">
                <Minus className="w-3 h-3" /> Live
              </span>
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter mt-1">Current Load</p>
            </div>
          </div>
          <p className="text-slate-500 text-[9px] font-bold uppercase tracking-widest">Active Chats (24h)</p>
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1 tracking-tight">
            {loading ? <Loader2 className="w-5 h-5 animate-spin text-slate-300" /> : overview?.active_conversations_24h ?? 0}
          </h3>
          <div className="mt-4 flex items-center gap-3">
            <div className="flex-1 h-1.5 bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500 rounded-full transition-all"
                style={{ width: `${Math.min((overview?.active_conversations_24h ?? 0) / Math.max(overview?.total_conversations ?? 1, 1) * 100, 100)}%` }}
              />
            </div>
            <span className="text-[9px] font-bold text-slate-400">
              {overview?.total_conversations ? Math.round((overview.active_conversations_24h / overview.total_conversations) * 100) : 0}%
            </span>
          </div>
        </div>

        {/* Avg Response */}
        <div className="bg-white dark:bg-white/[0.03] backdrop-blur-[12px] p-5 rounded-2xl border border-slate-200 dark:border-white/[0.08] shadow-sm hover:border-slate-300 dark:hover:border-rose-500/30 transition-all group">
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 rounded-xl bg-orange-50 dark:bg-orange-500/10 text-orange-500 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
            <div className="text-right">
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter mt-1">Latency</p>
            </div>
          </div>
          <p className="text-slate-500 text-[9px] font-bold uppercase tracking-widest">Avg. Response</p>
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1 tracking-tight">
            {loading ? <Loader2 className="w-5 h-5 animate-spin text-slate-300" /> : formatMs(overview?.avg_response_time_ms ?? null)}
          </h3>
          <div className="mt-4 flex gap-1.5">
            {[1, 2, 3, 4].map((seg) => {
              const ms = overview?.avg_response_time_ms ?? 0;
              const filled = ms > 0 && seg <= Math.ceil(Math.min(ms / 1000, 4));
              return (
                <div key={seg} className={cn("h-1 flex-1 rounded-full", filled ? "bg-orange-400" : "bg-slate-100 dark:bg-white/5")} />
              );
            })}
          </div>
        </div>

        {/* Resolution Rate - Coming Soon */}
        <div className="bg-white dark:bg-white/[0.03] backdrop-blur-[12px] p-5 rounded-2xl border border-slate-200 dark:border-white/[0.08] shadow-sm hover:border-slate-300 dark:hover:border-rose-500/30 transition-all group">
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 rounded-xl bg-green-50 dark:bg-green-500/10 text-green-500 flex items-center justify-center">
              <CheckCircle className="w-5 h-5" />
            </div>
            <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-white/5 text-slate-400 text-[9px] font-bold uppercase">Coming Soon</span>
          </div>
          <p className="text-slate-500 text-[9px] font-bold uppercase tracking-widest">Resolution Rate</p>
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1 tracking-tight">--</h3>
          <div className="mt-4 h-1 w-full bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
            <div className="h-full bg-slate-300 w-[0%] rounded-full" />
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
              <p className="text-xs text-slate-500">Volume of conversations across the selected period</p>
            </div>
            <div className="flex gap-2">
              {(["day", "week", "month"] as const).map((v) => (
                <button
                  key={v}
                  onClick={() => setTrendView(v)}
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-[10px] font-bold cursor-pointer transition-colors",
                    trendView === v
                      ? "bg-rose-50 dark:bg-rose-500/20 text-rose-500 border border-rose-200 dark:border-rose-500/30"
                      : "bg-slate-50 dark:bg-white/5 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                  )}
                >
                  {v.charAt(0).toUpperCase() + v.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="h-96 flex items-center justify-center">
              <Loader2 className="w-6 h-6 animate-spin text-slate-300" />
            </div>
          ) : trends.length === 0 ? (
            <div className="h-96 w-full flex flex-col items-center justify-center bg-slate-50 dark:bg-white/5 border border-dashed border-slate-200 dark:border-white/10 rounded-2xl">
              <TrendingUp className="w-8 h-8 text-slate-300 mb-2" />
              <p className="text-sm font-medium text-slate-400">No trend data available yet.</p>
            </div>
          ) : (
            <div className="h-96 w-full">
              <TrendChart data={trends} color="#f43f5e" />
            </div>
          )}
        </div>

        {/* Message Breakdown */}
        <div className="bg-white dark:bg-white/[0.03] backdrop-blur-[12px] p-5 rounded-2xl border border-slate-200 dark:border-white/[0.08] shadow-sm">
          <div className="mb-6">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Message Breakdown</h3>
            <p className="text-xs text-slate-500 mt-1">User vs bot message distribution</p>
          </div>
          {loading ? (
            <div className="flex-1 flex items-center justify-center py-12">
              <Loader2 className="w-6 h-6 animate-spin text-slate-300" />
            </div>
          ) : overview && overview.total_messages > 0 ? (
            <div className="space-y-6">
              {(() => {
                const userMsgs = trends.reduce((s, t) => s + t.user_messages, 0);
                const botMsgs = trends.reduce((s, t) => s + t.bot_messages, 0);
                const total = userMsgs + botMsgs || 1;
                return (
                  <>
                    <div className="flex items-center gap-4">
                      <div className="flex-1 h-4 bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden flex">
                        <div className="h-full bg-rose-500 rounded-l-full transition-all" style={{ width: `${(userMsgs / total) * 100}%` }} />
                        <div className="h-full bg-blue-500 rounded-r-full transition-all" style={{ width: `${(botMsgs / total) * 100}%` }} />
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-rose-500" />
                          <span className="text-xs font-medium text-slate-600 dark:text-slate-300">User Messages</span>
                        </div>
                        <span className="text-sm font-bold text-slate-900 dark:text-white">{userMsgs.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-blue-500" />
                          <span className="text-xs font-medium text-slate-600 dark:text-slate-300">Bot Messages</span>
                        </div>
                        <span className="text-sm font-bold text-slate-900 dark:text-white">{botMsgs.toLocaleString()}</span>
                      </div>
                    </div>
                    <div className="pt-4 border-t border-slate-100 dark:border-white/5">
                      <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-slate-400">
                        <span>Total: {total.toLocaleString()}</span>
                        <span>Ratio: {total > 0 ? (userMsgs / Math.max(botMsgs, 1)).toFixed(1) : "--"}:1</span>
                      </div>
                    </div>
                  </>
                );
              })()}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12">
              <Activity className="w-8 h-8 text-slate-300 mb-2" />
              <p className="text-sm font-medium text-slate-400">No messages yet.</p>
            </div>
          )}
        </div>
      </section>

      {/* AI Performance + Avg Stats */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white dark:bg-white/[0.03] backdrop-blur-[12px] p-5 rounded-2xl border border-slate-200 dark:border-white/[0.08] shadow-sm">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-10 h-10 rounded-lg bg-slate-50 dark:bg-white/5 text-slate-500 flex items-center justify-center"><TrendingUp className="w-5 h-5" /></div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">Conversations</h4>
          </div>
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
            {loading ? <Loader2 className="w-5 h-5 animate-spin text-slate-300" /> : (overview?.total_conversations ?? 0).toLocaleString()}
          </h3>
          <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-4">
            <span>Avg {overview?.avg_messages_per_conversation ?? 0} msgs each</span>
          </div>
          <div className="h-1.5 w-full bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
            <div className="h-full bg-rose-400 rounded-full transition-all" style={{ width: `${Math.min((overview?.total_conversations ?? 0) / 10, 100)}%` }} />
          </div>
        </div>

        <div className="bg-white dark:bg-white/[0.03] backdrop-blur-[12px] p-5 rounded-2xl border border-slate-200 dark:border-white/[0.08] shadow-sm">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-10 h-10 rounded-lg bg-slate-50 dark:bg-white/5 text-slate-500 flex items-center justify-center"><CheckCircle className="w-5 h-5" /></div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">Documents</h4>
          </div>
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
            {loading ? <Loader2 className="w-5 h-5 animate-spin text-slate-300" /> : (overview?.total_documents ?? 0).toLocaleString()}
          </h3>
          <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-4">
            <span>{(overview?.total_chunks ?? 0).toLocaleString()} chunks indexed</span>
          </div>
          <div className="h-1.5 w-full bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
            <div className="h-full bg-blue-400 rounded-full transition-all" style={{ width: `${Math.min((overview?.total_documents ?? 0) / 5 * 100, 100)}%` }} />
          </div>
        </div>

        <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-5 rounded-2xl border-none shadow-xl relative overflow-hidden">
          <div className="absolute -right-4 -top-4 w-20 h-20 bg-green-500/10 rounded-full blur-2xl" />
          <div className="flex items-center gap-4 mb-6">
            <div className="w-10 h-10 rounded-lg bg-white/10 text-rose-400 flex items-center justify-center"><Cpu className="w-5 h-5" /></div>
            <h4 className="text-sm font-bold text-white">AI Performance</h4>
          </div>
          <div className="space-y-4 mb-6">
            <div className="flex justify-between items-center">
              <span className="text-xs text-slate-400">Reasoning Speed</span>
              <span className="text-xs font-bold text-white">{formatMs(overview?.avg_response_time_ms ?? null)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-slate-400">Model Quality</span>
              <span className="text-xs font-bold text-white">--</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-slate-400">Context Recall</span>
              <span className="text-xs font-bold text-white">--</span>
            </div>
          </div>
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-3 mt-auto">
            <div className={cn("w-2 h-2 rounded-full", overview?.avg_response_time_ms ? "bg-green-500 animate-pulse" : "bg-slate-500")} />
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
              {overview?.avg_response_time_ms ? "Operational" : "Awaiting Traffic"}
            </p>
          </div>
        </div>
      </section>

      {/* Heatmap + Quality */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Heatmap */}
        <div className="bg-white dark:bg-white/[0.03] backdrop-blur-[12px] p-5 sm:p-6 rounded-2xl border border-slate-200 dark:border-white/[0.08] shadow-sm overflow-hidden">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Hourly Activity Heatmap</h3>
              <p className="text-xs text-slate-500">Message intensity by day and hour</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-[9px] font-bold text-slate-500 uppercase">Low</span>
                <div className="flex gap-1">
                  <div className="w-3 h-3 rounded bg-rose-500/10" />
                  <div className="w-3 h-3 rounded bg-rose-500/30" />
                  <div className="w-3 h-3 rounded bg-rose-500/60" />
                  <div className="w-3 h-3 rounded bg-rose-500" />
                </div>
                <span className="text-[9px] font-bold text-slate-500 uppercase">High</span>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-6 h-6 animate-spin text-slate-300" />
            </div>
          ) : (
            <>
              <Heatmap heatmap={heatmap} />
              <div className="flex justify-between mt-4 pl-8 sm:pl-10 pr-2 text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest overflow-x-auto min-w-[500px]">
                {HOUR_LABELS.map((h) => (
                  <span key={h}>{h}</span>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Quality Metrics */}
        <div className="space-y-6 flex flex-col">
          <div className="bg-white dark:bg-white/[0.03] backdrop-blur-[12px] p-5 sm:p-6 rounded-2xl border border-slate-200 dark:border-white/[0.08] shadow-sm flex-1">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Response Quality Metrics</h3>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5">
                <div className="flex justify-between items-start mb-4">
                  <p className="text-[10px] font-bold text-slate-500 uppercase">CSAT Score</p>
                  <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-500/10 text-slate-500 text-[9px] font-bold">Coming Soon</span>
                </div>
                <div className="flex flex-col sm:flex-row items-baseline sm:items-center gap-2 sm:gap-3">
                  <span className="text-2xl font-bold text-slate-900 dark:text-white">--</span>
                  <div className="flex text-slate-300 dark:text-slate-600 text-xs sm:text-sm">
                    <Star className="fill-current w-3 h-3 sm:w-4 sm:h-4" />
                    <Star className="fill-current w-3 h-3 sm:w-4 sm:h-4" />
                    <Star className="fill-current w-3 h-3 sm:w-4 sm:h-4" />
                    <Star className="fill-current w-3 h-3 sm:w-4 sm:h-4" />
                    <Star className="fill-current w-3 h-3 sm:w-4 sm:h-4" />
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5">
                <div className="flex justify-between items-start mb-4">
                  <p className="text-[10px] font-bold text-slate-500 uppercase">Escalation Rate</p>
                  <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-500/10 text-slate-500 text-[9px] font-bold">Coming Soon</span>
                </div>
                <div className="flex flex-col sm:flex-row items-baseline sm:items-center gap-2 sm:gap-3">
                  <span className="text-2xl font-bold text-slate-900 dark:text-white">--</span>
                </div>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 mt-auto">
              <div className="flex justify-between items-center mb-6">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Sentiment Breakdown</p>
                <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-500/10 text-slate-400 text-[9px] font-bold uppercase">Coming Soon</span>
              </div>
              <div className="flex items-center justify-center h-12 w-full rounded-full mb-4 bg-transparent border border-dashed border-slate-200 dark:border-white/10 text-slate-400 text-xs font-medium">
                Requires feedback integration
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
