"use client";

import { useState, useEffect, useCallback } from "react";
import {
  ChevronRight, Search, TrendingUp, ChevronDown, ListFilter,
  Download, MapPin, Mail, Eye, UserCheck, CheckCircle, Archive,
  Loader2, RefreshCw, X, Users, Zap, Target, Star, Trash2, Phone, Calendar
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  listLeadsAction, getLeadStatsAction,
  updateLeadStatusAction, deleteLeadAction, exportLeadsCsvAction
} from "@/app/actions/leads";
import { useToast } from "@/components/ui/toast";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

const STATUS_OPTIONS = ["all", "new", "contacted", "qualified", "converted", "lost", "archived"];
const INTEREST_OPTIONS = ["Any", "Pricing", "Demo", "Trial", "Enterprise", "API", "Integration", "Plans", "Contact", "Schedule"];
const SCORE_OPTIONS = [
  { label: "All Scores", value: 0 },
  { label: "High (80+)", value: 80 },
  { label: "Medium (50+)", value: 50 },
  { label: "Low (20+)", value: 20 },
];

const STATUS_STYLES: Record<string, string> = {
  new: "text-rose-600 dark:text-rose-500",
  contacted: "text-blue-600 dark:text-blue-500",
  qualified: "text-amber-600 dark:text-amber-500",
  converted: "text-green-600 dark:text-green-500",
  lost: "text-slate-500 dark:text-slate-400",
  archived: "text-slate-500 dark:text-slate-400",
};
const STATUS_DOT: Record<string, string> = {
  new: "bg-rose-500",
  contacted: "bg-blue-500",
  qualified: "bg-amber-500",
  converted: "bg-green-500",
  lost: "bg-slate-400",
  archived: "bg-slate-400 dark:bg-slate-500",
};
const INTEREST_COLORS: Record<string, string> = {
  Pricing: "bg-rose-100 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400",
  Demo: "bg-purple-100 text-purple-700 dark:bg-purple-500/10 dark:text-purple-400",
  Trial: "bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400",
  Enterprise: "bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400",
  API: "bg-cyan-100 text-cyan-700 dark:bg-cyan-500/10 dark:text-cyan-400",
  Integration: "bg-indigo-100 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400",
  default: "bg-slate-100 text-slate-600 dark:bg-white/5 dark:text-slate-400",
};

function getInterestColor(interest: string) {
  return INTEREST_COLORS[interest] || INTEREST_COLORS.default;
}

function getScoreColor(score: number) {
  if (score >= 80) return { bar: "bg-green-500", text: "text-green-500" };
  if (score >= 50) return { bar: "bg-amber-500", text: "text-amber-500" };
  return { bar: "bg-rose-400", text: "text-rose-400" };
}

function initials(name: string | null, email: string | null) {
  if (name) return name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2);
  if (email) return email[0].toUpperCase();
  return "?";
}

function avatarColor(str: string) {
  const colors = [
    "bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-300",
    "bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300",
    "bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-300",
    "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300",
    "bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-300",
    "bg-cyan-100 text-cyan-700 dark:bg-cyan-500/20 dark:text-cyan-300",
  ];
  let h = 0;
  for (let i = 0; i < str.length; i++) h = str.charCodeAt(i) + ((h << 5) - h);
  return colors[Math.abs(h) % colors.length];
}

export default function LeadCapturePage() {
  const { toast } = useToast();

  // ── Stats ──
  const [stats, setStats] = useState<any>(null);
  const [statsLoading, setStatsLoading] = useState(true);

  // ── Leads ──
  const [leads, setLeads] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  // ── Filters ──
  const [statusFilter, setStatusFilter] = useState("all");
  const [interestFilter, setInterestFilter] = useState("Any");
  const [minScore, setMinScore] = useState(0);
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 20;

  // ── Selection ──
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // ── Modal ──
  const [selectedLead, setSelectedLead] = useState<any | null>(null);

  // ── Export ──
  const [exporting, setExporting] = useState(false);

  // ── Fetch ──────────────────────────────────────────────────────────────────

  const fetchStats = useCallback(async () => {
    setStatsLoading(true);
    const res = await getLeadStatsAction();
    if (res.success) setStats(res.data);
    setStatsLoading(false);
  }, []);

  const fetchLeads = useCallback(async (p = page) => {
    setLoading(true);
    const params: any = { page: p, page_size: PAGE_SIZE };
    if (statusFilter !== "all") params.status = statusFilter;
    if (interestFilter !== "Any") params.interest = interestFilter;
    if (minScore > 0) params.min_score = minScore;
    const res = await listLeadsAction(params);
    if (res.success) {
      setLeads(res.data.leads || []);
      setTotal(res.data.total || 0);
      setTotalPages(res.data.total_pages || 1);
    } else {
      toast(res.error || "Failed to fetch leads", "error");
    }
    setLoading(false);
    setSelectedIds([]);
  }, [statusFilter, interestFilter, minScore, page]);

  useEffect(() => { fetchStats(); }, []);
  useEffect(() => { setPage(1); fetchLeads(1); }, [statusFilter, interestFilter, minScore]);
  useEffect(() => { fetchLeads(page); }, [page]);

  // ── Actions ────────────────────────────────────────────────────────────────

  async function handleStatusChange(leadId: string, status: string) {
    const res = await updateLeadStatusAction(leadId, status);
    if (res.success) {
      setLeads(prev => prev.map(l => l.id === leadId ? { ...l, status } : l));
      fetchStats();
      toast(`Lead marked as ${status}`, "success");
    } else {
      toast(res.error || "Failed to update status", "error");
    }
  }

  async function handleDeleteSelected() {
    for (const id of selectedIds) {
      await deleteLeadAction(id);
    }
    toast(`${selectedIds.length} lead(s) deleted permanently`, "success");
    setSelectedIds([]);
    fetchLeads(page);
    fetchStats();
  }

  async function handleExport() {
    setExporting(true);
    const params: any = {};
    if (statusFilter !== "all") params.status = statusFilter;
    if (interestFilter !== "Any") params.interest = interestFilter;
    if (minScore > 0) params.min_score = minScore;
    const res = await exportLeadsCsvAction(params);
    if (res.success && res.csv) {
      const blob = new Blob([res.csv], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `leads_${new Date().toISOString().slice(0, 10)}.csv`;
      a.click();
      URL.revokeObjectURL(url);
      toast("CSV downloaded", "success");
    } else {
      toast(res.error || "Export failed", "error");
    }
    setExporting(false);
  }

  function toggleLead(id: string) {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  }
  function toggleAll() {
    setSelectedIds(prev => prev.length === leads.length ? [] : leads.map(l => l.id));
  }

  function clearFilters() {
    setStatusFilter("all");
    setInterestFilter("Any");
    setMinScore(0);
    setPage(1);
  }

  const hasFilters = statusFilter !== "all" || interestFilter !== "Any" || minScore > 0;

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-6 animate-fade-in pb-24">

      {/* Stats */}
      <section className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          {
            label: "Total Leads", value: statsLoading ? "—" : stats?.total ?? 0,
            sub: statsLoading ? "" : `${stats?.leads_this_week ?? 0} this week`,
            icon: Users, accent: ""
          },
          {
            label: "New Leads", value: statsLoading ? "—" : stats?.new ?? 0,
            sub: "Needs action",
            icon: Zap, accent: "border-l-4 border-l-rose-500"
          },
          {
            label: "Contacted", value: statsLoading ? "—" : stats?.contacted ?? 0,
            sub: stats && stats.total > 0 ? `${Math.round(((stats.contacted || 0) / stats.total) * 100)}% of total` : "—",
            icon: Mail, accent: ""
          },
          {
            label: "Converted", value: statsLoading ? "—" : stats?.converted ?? 0,
            sub: stats && stats.total > 0 ? `${Math.round(((stats.converted || 0) / stats.total) * 100)}% rate` : "—",
            icon: CheckCircle, accent: "border-l-4 border-l-green-500"
          },
          {
            label: "Avg. Score", value: statsLoading ? "—" : stats?.avg_score != null ? `${stats.avg_score}` : "—",
            sub: "Lead quality",
            icon: Star, accent: ""
          },
        ].map(({ label, value, sub, icon: Icon, accent }) => (
          <div key={label} className={cn(
            "bg-white dark:bg-white/[0.03] backdrop-blur-[12px] p-4 rounded-xl border border-slate-200 dark:border-white/[0.08] shadow-sm hover:border-slate-300 dark:hover:border-rose-500/30 transition-all",
            accent
          )}>
            <div className="flex items-center justify-between mb-1">
              <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">{label}</p>
              <Icon className="w-3.5 h-3.5 text-slate-400 dark:text-white/20" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{value}</h3>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">{sub}</p>
          </div>
        ))}
      </section>

      {/* Table */}
      <section className="bg-white dark:bg-white/[0.03] backdrop-blur-[12px] border border-slate-200 dark:border-white/[0.08] shadow-sm rounded-2xl overflow-hidden">

        {/* Filters bar */}
        <div className="p-4 md:p-5 border-b border-slate-100 dark:border-white/5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">

            {/* Status filter */}
            <DropdownMenu>
              <DropdownMenuTrigger className="h-8 px-3 rounded-lg bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5 text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-widest outline-none cursor-pointer flex items-center gap-1.5 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors">
                {statusFilter === "all" ? "All Status" : statusFilter}
                <ChevronDown className="w-3 h-3 opacity-50" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-40">
                {STATUS_OPTIONS.map(s => (
                  <DropdownMenuItem key={s} onClick={() => setStatusFilter(s)} className="text-xs font-bold uppercase tracking-widest">
                    {s === "all" ? "All Status" : s.charAt(0).toUpperCase() + s.slice(1)}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Interest filter */}
            <DropdownMenu>
              <DropdownMenuTrigger className="h-8 px-3 rounded-lg bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5 text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-widest outline-none cursor-pointer flex items-center gap-1.5 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors">
                {interestFilter}
                <ChevronDown className="w-3 h-3 opacity-50" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-40">
                {INTEREST_OPTIONS.map(i => (
                  <DropdownMenuItem key={i} onClick={() => setInterestFilter(i)} className="text-xs font-bold uppercase tracking-widest">
                    {i}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Score filter */}
            <DropdownMenu>
              <DropdownMenuTrigger className="h-8 px-3 rounded-lg bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5 text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-widest outline-none cursor-pointer flex items-center gap-1.5 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors">
                {SCORE_OPTIONS.find(o => o.value === minScore)?.label || "All Scores"}
                <ChevronDown className="w-3 h-3 opacity-50" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-40">
                {SCORE_OPTIONS.map(o => (
                  <DropdownMenuItem key={o.value} onClick={() => setMinScore(o.value)} className="text-xs font-bold uppercase tracking-widest">
                    {o.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {hasFilters && (
              <button onClick={clearFilters} className="text-[10px] font-bold text-rose-500 hover:underline uppercase tracking-widest flex items-center gap-1">
                <X className="w-3 h-3" /> Clear
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => fetchLeads(page)}
              className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors"
              title="Refresh"
            >
              <RefreshCw className={cn("w-4 h-4", loading && "animate-spin")} />
            </button>
            <button
              onClick={handleExport}
              disabled={exporting}
              className="flex items-center gap-1.5 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/5 px-3 py-1.5 rounded-lg text-[10px] font-bold text-slate-700 dark:text-white uppercase tracking-widest hover:bg-slate-50 dark:hover:bg-white/10 transition-all cursor-pointer disabled:opacity-50"
            >
              {exporting ? <Loader2 className="w-3 h-3 animate-spin" /> : <Download className="w-3 h-3" />}
              Export CSV
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto scrollbar-hide">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead className="bg-slate-50/50 dark:bg-white/[0.02] text-[10px] text-slate-600 dark:text-slate-400 uppercase tracking-widest font-bold border-b border-slate-100 dark:border-white/5">
              <tr>
                <th className="py-4 px-5 w-12">
                  <input
                    type="checkbox"
                    className="w-3.5 h-3.5 rounded border-slate-300 dark:border-white/10 bg-white/5 accent-rose-500 cursor-pointer"
                    checked={leads.length > 0 && selectedIds.length === leads.length}
                    onChange={toggleAll}
                  />
                </th>
                <th className="py-4 px-5">Lead Details</th>
                <th className="py-4 px-5">Captured At</th>
                <th className="py-4 px-5">Interest</th>
                <th className="py-4 px-5">Lead Score</th>
                <th className="py-4 px-5">Status</th>
                <th className="py-4 px-5 text-right w-24">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-white/5">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-16 text-center border-none">
                    <Loader2 className="w-6 h-6 animate-spin text-slate-300 dark:text-white/20 mx-auto" />
                  </td>
                </tr>
              ) : leads.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-16 text-center border-none">
                    <div className="flex flex-col items-center justify-center gap-2 text-slate-400">
                      <Target className="w-8 h-8 opacity-30" />
                      <p className="font-bold text-sm">No leads captured yet</p>
                      <p className="text-xs text-slate-400 max-w-xs text-center">
                        Leads appear here automatically as visitors chat — enable Lead Capture in your Chatbot settings.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                leads.map(lead => {
                  const scoreColors = getScoreColor(lead.lead_score);
                  const key = lead.name || lead.email || lead.id;
                  return (
                    <tr
                      key={lead.id}
                      onClick={() => setSelectedLead(lead)}
                      className="hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors group cursor-pointer"
                    >
                      <td className="py-4 px-5" onClick={e => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          className="w-3.5 h-3.5 rounded border-slate-300 dark:border-white/10 bg-white/5 accent-rose-500 cursor-pointer"
                          checked={selectedIds.includes(lead.id)}
                          onChange={() => toggleLead(lead.id)}
                        />
                      </td>
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-3">
                          <div className={cn("w-8 h-8 rounded-full flex items-center justify-center font-bold text-[11px] shrink-0", avatarColor(key))}>
                            {initials(lead.name, lead.email)}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-slate-900 dark:text-white">{lead.name || <span className="italic text-slate-400 font-normal">Unknown</span>}</p>
                            <div className="flex flex-col gap-0.5 mt-0.5">
                              {lead.email && <p className="text-[11px] text-slate-500 flex items-center gap-1"><Mail className="w-3 h-3" /> {lead.email}</p>}
                              {lead.phone && <p className="text-[11px] text-slate-500 flex items-center gap-1"><Phone className="w-3 h-3" /> {lead.phone}</p>}
                              {!lead.email && !lead.phone && <p className="text-xs text-slate-500">No contact info</p>}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-5">
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                          {lead.captured_at ? new Date(lead.captured_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : <span className="text-slate-300 dark:text-slate-600">—</span>}
                        </span>
                      </td>
                      <td className="py-4 px-5">
                        {lead.interest ? (
                          <span className={cn("text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full whitespace-nowrap", getInterestColor(lead.interest))}>
                            {lead.interest}
                          </span>
                        ) : <span className="text-slate-300 dark:text-slate-600 text-xs">—</span>}
                      </td>
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-1.5 rounded-full bg-slate-100 dark:bg-white/10 overflow-hidden flex-shrink-0">
                            <div className={cn("h-full rounded-full", scoreColors.bar)} style={{ width: `${lead.lead_score}%` }} />
                          </div>
                          <span className={cn("text-xs font-bold", scoreColors.text)}>{lead.lead_score}</span>
                        </div>
                      </td>
                      <td className="py-4 px-5 relative" onClick={e => e.stopPropagation()}>
                        <DropdownMenu>
                          <DropdownMenuTrigger className={cn("flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest whitespace-nowrap group/status outline-none", STATUS_STYLES[lead.status] || "text-slate-400")}>
                            <div className={cn("w-1.5 h-1.5 rounded-full", STATUS_DOT[lead.status] || "bg-slate-400")} />
                            {lead.status}
                            <ChevronDown className="w-3 h-3 opacity-40 group-hover/status:opacity-100 transition-opacity" />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="start" className="w-36">
                            {STATUS_OPTIONS.filter(s => s !== "all" && s !== lead.status).map(s => (
                              <DropdownMenuItem
                                key={s}
                                onClick={() => handleStatusChange(lead.id, s)}
                                className={cn("text-[10px] font-bold uppercase tracking-widest flex items-center", STATUS_STYLES[s])}
                              >
                                <div className={cn("w-1.5 h-1.5 rounded-full mr-1.5 shrink-0", STATUS_DOT[s] || "bg-slate-400")} />
                                {s}
                              </DropdownMenuItem>
                            ))}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                      <td className="py-4 px-5 text-right">
                        <div className="flex justify-end gap-1.5 opacity-0 group-hover:opacity-100 transition-all">
                          {lead.email && (
                            <a
                              href={`mailto:${lead.email}`}
                              onClick={e => e.stopPropagation()}
                              title="Email"
                              className="w-7 h-7 rounded-lg bg-slate-50 dark:bg-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-blue-500 transition-all"
                            >
                              <Mail className="w-3.5 h-3.5" />
                            </a>
                          )}
                          <button
                            onClick={async (e) => { e.stopPropagation(); await handleStatusChange(lead.id, "archived"); }}
                            title="Archive"
                            className="w-7 h-7 rounded-lg bg-slate-50 dark:bg-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700 dark:hover:bg-slate-600 transition-all"
                          >
                            <Archive className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={async (e) => { e.stopPropagation(); await deleteLeadAction(lead.id); fetchLeads(page); fetchStats(); toast("Lead deleted permanently", "success"); }}
                            title="Delete"
                            className="w-7 h-7 rounded-lg bg-slate-50 dark:bg-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-rose-500 transition-all"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-4 border-t border-slate-100 dark:border-white/5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-slate-500 font-medium">
            Showing <span className="text-slate-900 dark:text-white font-bold">{leads.length}</span> of <span className="text-slate-900 dark:text-white font-bold">{total}</span> leads
          </p>
          {totalPages > 1 && (
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="w-8 h-8 rounded-lg bg-white/5 border border-slate-200 dark:border-transparent flex items-center justify-center text-slate-500 hover:text-slate-900 dark:hover:text-white transition-all disabled:opacity-30"
              >
                <ChevronRight className="w-4 h-4 rotate-180" />
              </button>
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map(p => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={cn(
                    "w-8 h-8 rounded-lg text-xs font-bold transition-all",
                    page === p
                      ? "bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-lg shadow-rose-500/20"
                      : "bg-white/5 border border-slate-200 dark:border-transparent text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
                  )}
                >
                  {p}
                </button>
              ))}
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="w-8 h-8 rounded-lg bg-white/5 border border-slate-200 dark:border-transparent flex items-center justify-center text-slate-500 hover:text-slate-900 dark:hover:text-white transition-all disabled:opacity-30"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Bulk action bar */}
      <div className={cn(
        "fixed bottom-10 left-[max(50%,theme(spacing.20))] -translate-x-1/2 z-50 transition-transform duration-500 ease-[cubic-bezier(0.175,0.885,0.32,1.275)]",
        selectedIds.length > 0 ? "translate-y-0" : "translate-y-[150%]"
      )}>
        <div className="bg-white/95 dark:bg-[#0d1425]/95 backdrop-blur-[12px] border border-slate-200 dark:border-rose-500/30 p-3 px-5 rounded-2xl flex items-center gap-6 shadow-2xl dark:shadow-rose-500/10 ring-1 ring-slate-200 dark:ring-white/10">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-rose-500 flex items-center justify-center text-white text-[10px] font-bold shadow-lg shadow-rose-500/30">
              {selectedIds.length}
            </div>
            <span className="text-sm font-bold text-slate-900 dark:text-white whitespace-nowrap">Selected</span>
          </div>
          <button
            onClick={handleDeleteSelected}
            className="flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-rose-500 uppercase tracking-widest transition-colors"
          >
            <Trash2 className="w-4 h-4" /> Delete
          </button>
          <button
            onClick={() => setSelectedIds([])}
            className="text-[10px] font-bold text-slate-400 hover:text-rose-500 uppercase tracking-widest transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>


      {/* Lead Details Modal */}
      {selectedLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200" onClick={() => setSelectedLead(null)}>
          <div className="w-full max-w-md bg-white dark:bg-[#0d1425] rounded-2xl shadow-2xl overflow-hidden border border-slate-200 dark:border-white/10 animate-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-slate-100 dark:border-white/5 flex items-start justify-between bg-slate-50 dark:bg-white/[0.02]">
              <div className="flex items-center gap-4">
                <div className={cn("w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg", avatarColor(selectedLead.name || selectedLead.email || selectedLead.id))}>
                  {initials(selectedLead.name, selectedLead.email)}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">{selectedLead.name || "Unknown Lead"}</h2>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={cn("flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest whitespace-nowrap", STATUS_STYLES[selectedLead.status] || "text-slate-400")}>
                      <div className={cn("w-1.5 h-1.5 rounded-full", STATUS_DOT[selectedLead.status] || "bg-slate-400")} />
                      {selectedLead.status}
                    </span>
                  </div>
                </div>
              </div>
              <button onClick={() => setSelectedLead(null)} className="text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 gap-4">
                {selectedLead.email && (
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center text-slate-500">
                      <Mail className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Email</p>
                      <p className="text-sm font-medium text-slate-900 dark:text-white">{selectedLead.email}</p>
                    </div>
                  </div>
                )}
                {selectedLead.phone && (
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center text-slate-500">
                      <Phone className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Phone Number</p>
                      <p className="text-sm font-medium text-slate-900 dark:text-white">{selectedLead.phone}</p>
                    </div>
                  </div>
                )}
                {selectedLead.captured_at && (
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center text-slate-500">
                      <Calendar className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Captured At</p>
                      <p className="text-sm font-medium text-slate-900 dark:text-white">{new Date(selectedLead.captured_at).toLocaleString()}</p>
                    </div>
                  </div>
                )}
                {selectedLead.interest && (
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center text-slate-500">
                      <Star className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Primary Interest</p>
                      <span className={cn("inline-block mt-0.5 text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full whitespace-nowrap", getInterestColor(selectedLead.interest))}>
                        {selectedLead.interest}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="p-4 border-t border-slate-100 dark:border-white/5 bg-slate-50 dark:bg-white/[0.02] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button 
                  onClick={async () => {
                    await deleteLeadAction(selectedLead.id);
                    toast("Lead deleted permanently", "success");
                    setSelectedLead(null);
                    fetchLeads(page);
                    fetchStats();
                  }}
                  className="text-xs font-bold text-rose-500 hover:text-rose-600 flex items-center gap-1.5 uppercase tracking-widest transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Delete
                </button>
                <button 
                  onClick={async () => {
                    await handleStatusChange(selectedLead.id, "archived");
                    setSelectedLead(null);
                  }}
                  className="text-xs font-bold text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 flex items-center gap-1.5 uppercase tracking-widest transition-colors"
                >
                  <Archive className="w-3.5 h-3.5" /> Archive
                </button>
              </div>
              {selectedLead.email && (
                <a href={`mailto:${selectedLead.email}`} className="text-xs font-bold text-white bg-slate-900 dark:bg-white dark:text-slate-900 px-4 py-2 rounded-lg hover:opacity-90 transition-opacity">
                  Send Email
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
