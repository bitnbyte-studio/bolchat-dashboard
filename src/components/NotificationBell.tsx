"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { Bell, Check, CheckCheck, X } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  listNotifications,
  markAllReadAction,
  markReadAction,
  type Notification,
} from "@/app/actions/notifications";

const TYPE_ICON: Record<string, string> = {
  "lead.captured": "👤",
  "lead.converted": "🎉",
  "agent.optimize_ready": "🤖",
  "agent.error_spike": "⚠️",
  "usage.limit_80pct": "📊",
  "billing.payment_failed": "💳",
  "satisfaction.low_score": "😟",
  "member.invited": "✉️",
};

function timeAgo(iso: string) {
  const diff = (Date.now() - new Date(iso).getTime()) / 1000;
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

interface Props {
  initialCount: number;
  apiUrl: string; // passed from server so no browser env leak
}

export default function NotificationBell({ initialCount, apiUrl }: Props) {
  const [open, setOpen] = useState(false);
  const [count, setCount] = useState(initialCount);
  const [items, setItems] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const [, startTransition] = useTransition();
  const panelRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Pre-load notifications on mount so opening the panel is instant
  useEffect(() => {
    listNotifications(20).then((data) => setItems(data));
  }, []);

  // SSE — real-time push
  useEffect(() => {
    // withCredentials sends the httpOnly accessToken cookie automatically
    const es = new EventSource(`${apiUrl}/api/v1/notifications/stream`, {
      withCredentials: true,
    });

    es.onmessage = (e) => {
      if (!e.data || e.data.startsWith(":")) return;
      try {
        const notif: Notification = JSON.parse(e.data);
        setCount((c) => c + 1);
        setItems((prev) => [{ ...notif, read_at: null }, ...prev]);
      } catch {
        // ignore malformed push
      }
    };

    return () => es.close();
  }, [apiUrl]);

  async function openPanel() {
    const willOpen = !open;
    setOpen(willOpen);
    // Only show spinner if mount pre-load hasn't finished yet (very fast click edge case)
    if (willOpen && items.length === 0) {
      setLoading(true);
      const data = await listNotifications(20);
      setItems(data);
      setLoading(false);
    }
  }

  async function handleMarkRead(id: string) {
    await markReadAction(id);
    setItems((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read_at: new Date().toISOString() } : n))
    );
    setCount((c) => Math.max(0, c - 1));
  }

  async function handleMarkAll() {
    startTransition(async () => {
      await markAllReadAction();
      setItems((prev) => prev.map((n) => ({ ...n, read_at: new Date().toISOString() })));
      setCount(0);
    });
  }

  return (
    <div className="relative" ref={panelRef}>
      <button
        onClick={openPanel}
        className="w-10 h-10 rounded-xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-center relative hover:text-rose-500 text-slate-500 dark:text-slate-400 transition-colors"
        aria-label="Notifications"
      >
        <Bell className="w-5 h-5" />
        {count > 0 && (
          <span className="absolute top-1.5 right-1.5 min-w-[16px] h-4 px-1 bg-rose-500 rounded-full text-white text-[9px] font-bold flex items-center justify-center leading-none">
            {count > 99 ? "99+" : count}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-12 w-80 bg-white dark:bg-[#0d1425] border border-slate-200 dark:border-white/10 rounded-2xl shadow-2xl z-50 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-white/5">
            <span className="text-sm font-bold text-slate-900 dark:text-white">Notifications</span>
            <div className="flex items-center gap-2">
              {count > 0 && (
                <button
                  onClick={handleMarkAll}
                  className="flex items-center gap-1 text-[10px] font-bold text-slate-400 hover:text-rose-500 uppercase tracking-widest transition-colors"
                >
                  <CheckCheck className="w-3 h-3" /> All read
                </button>
              )}
              <button onClick={() => setOpen(false)} className="text-slate-400 hover:text-slate-700 dark:hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* List */}
          <div className="max-h-80 overflow-y-auto divide-y divide-slate-50 dark:divide-white/[0.03]">
            {loading && (
              <div className="py-8 text-center text-slate-400 text-sm">Loading…</div>
            )}
            {!loading && items.length === 0 && (
              <div className="py-8 text-center text-slate-400 text-sm">You&apos;re all caught up 🎉</div>
            )}
            {items.map((n) => (
              <div
                key={n.id}
                className={cn(
                  "flex items-start gap-3 px-4 py-3 hover:bg-slate-50 dark:hover:bg-white/[0.03] transition-colors",
                  !n.read_at && "bg-rose-50/50 dark:bg-rose-500/[0.04]"
                )}
              >
                <div className="text-lg leading-none mt-0.5 shrink-0">
                  {TYPE_ICON[n.type] ?? "🔔"}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={cn("text-sm leading-snug", n.read_at ? "text-slate-600 dark:text-slate-400" : "text-slate-900 dark:text-white font-medium")}>
                    {n.title}
                  </p>
                  {n.body && (
                    <p className="text-xs text-slate-400 mt-0.5 truncate">{n.body}</p>
                  )}
                  <p className="text-[10px] text-slate-400 mt-1">{timeAgo(n.created_at)}</p>
                </div>
                {!n.read_at && (
                  <button
                    onClick={() => handleMarkRead(n.id)}
                    className="shrink-0 mt-0.5 text-slate-300 hover:text-rose-500 transition-colors"
                    title="Mark as read"
                  >
                    <Check className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
