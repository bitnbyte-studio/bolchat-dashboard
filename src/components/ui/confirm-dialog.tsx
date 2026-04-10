"use client";

import { useEffect, useRef } from "react";
import { AlertTriangle, Loader2, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "danger" | "warning" | "default";
  loading?: boolean;
}

export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title = "Are you sure?",
  description = "This action cannot be undone.",
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  variant = "danger",
  loading = false,
}: ConfirmDialogProps) {
  const cancelRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (open) {
      cancelRef.current?.focus();
      const handler = (e: KeyboardEvent) => {
        if (e.key === "Escape") onClose();
      };
      document.addEventListener("keydown", handler);
      document.body.style.overflow = "hidden";
      return () => {
        document.removeEventListener("keydown", handler);
        document.body.style.overflow = "";
      };
    }
  }, [open, onClose]);

  if (!open) return null;

  const colors = {
    danger: {
      icon: "bg-red-100 dark:bg-red-500/15 text-red-600 dark:text-red-400",
      button: "bg-red-600 hover:bg-red-700 focus-visible:ring-red-500/30 shadow-red-600/20",
    },
    warning: {
      icon: "bg-amber-100 dark:bg-amber-500/15 text-amber-600 dark:text-amber-400",
      button: "bg-amber-600 hover:bg-amber-700 focus-visible:ring-amber-500/30 shadow-amber-600/20",
    },
    default: {
      icon: "bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-400",
      button: "bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-white/90 dark:text-slate-900 focus-visible:ring-slate-500/30 shadow-slate-900/10",
    },
  };

  const c = colors[variant];

  return (
    <div className="fixed inset-0 z-200 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={onClose}
      />
      <div className="relative w-full max-w-sm bg-white dark:bg-[#1a2135] rounded-2xl shadow-2xl border border-slate-200 dark:border-white/10 animate-in zoom-in-95 fade-in duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-7 h-7 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="p-6 pb-0">
          <div className={cn("w-11 h-11 rounded-xl flex items-center justify-center mb-4", c.icon)}>
            <AlertTriangle className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">{title}</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
            {description}
          </p>
        </div>

        <div className="flex gap-3 p-6">
          <button
            ref={cancelRef}
            onClick={onClose}
            disabled={loading}
            className="flex-1 h-10 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-700 dark:text-slate-300 rounded-xl text-sm font-semibold transition-all focus-visible:ring-2 focus-visible:ring-slate-500/30 outline-none disabled:opacity-50"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className={cn(
              "flex-1 h-10 text-white rounded-xl text-sm font-semibold shadow-lg transition-all focus-visible:ring-2 outline-none disabled:opacity-50 flex items-center justify-center gap-2",
              c.button,
            )}
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
