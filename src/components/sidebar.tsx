"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { BookOpen, Bot, LineChart, UserPlus, MessageSquare, Settings, LogOut, MessageCircle, LayoutDashboard, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { BolchatLogo } from "./BolchatLogo";
import { getMeAction, logoutAction } from "@/app/actions/auth";
import { useState, useEffect, useCallback, useRef } from "react";

type NavItem = {
  title: string;
  href: string;
  icon: any;
  badge?: string | number;
};

const navItems: NavItem[] = [
  { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { title: "Knowledge Base", href: "/dashboard/knowledge", icon: BookOpen },
  { title: "Agent Manager", href: "/dashboard/chatbots", icon: Bot },
  { title: "Analytics", href: "/dashboard/analytics", icon: LineChart },
  { title: "Lead Capture", href: "/dashboard/leads", icon: UserPlus },
  { title: "Conversations", href: "/dashboard/conversations", icon: MessageSquare },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [expanded, setExpanded] = useState(false);
  const collapseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    getMeAction().then(res => {
      if (res.success) setUser(res.data);
    });
  }, []);

  const handleMouseEnter = useCallback(() => {
    if (collapseTimer.current) { clearTimeout(collapseTimer.current); collapseTimer.current = null; }
    setExpanded(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    collapseTimer.current = setTimeout(() => setExpanded(false), 150);
  }, []);

  return (
    <aside
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={cn(
        "fixed inset-y-0 left-0 z-50 hidden lg:flex flex-col bg-white dark:bg-[#0a0f1e]/80 dark:backdrop-blur-2xl border-r border-slate-200 dark:border-white/10 shadow-xl overflow-hidden transition-all duration-300 ease-in-out",
        expanded ? "w-64" : "w-16"
      )}
    >
      <div className="pl-3 flex items-center gap-1 mb-8 h-16 shrink-0">
        <BolchatLogo size="md" textClassName={cn("transition-opacity duration-300 overflow-hidden", expanded ? "opacity-100" : "opacity-0")} />
      </div>

      <nav className="flex-1 space-y-2 px-3 overflow-y-auto scrollbar-hide">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center h-10 gap-3 px-3 rounded-lg transition-all relative overflow-hidden",
                isActive
                  ? "bg-rose-50 dark:bg-rose-500/10 border-l-[3px] border-rose-500 text-rose-500"
                  : "text-slate-500 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white border-l-[3px] border-transparent"
              )}
            >
              <item.icon className="w-5 h-5 shrink-0" />
              <span className={cn("text-sm font-medium transition-opacity duration-300 whitespace-nowrap", expanded ? "opacity-100" : "opacity-0")}>
                {item.title}
              </span>
              {item.badge && (
                <span className={cn("ml-auto bg-rose-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-md absolute right-3 transition-opacity duration-300", expanded ? "opacity-100" : "opacity-0")}>
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto p-3 space-y-2 border-t border-slate-100 dark:border-white/10">
        {user?.role === "superadmin" && (
          <Link
            href="/dashboard/superadmin"
            className={cn(
              "flex items-center h-10 gap-3 px-3 rounded-lg transition-all relative overflow-hidden",
              pathname === "/dashboard/superadmin"
                ? "bg-indigo-50 dark:bg-indigo-500/10 border-l-[3px] border-indigo-500 text-indigo-500"
                : "text-slate-500 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white border-l-[3px] border-transparent"
            )}
          >
            <ShieldCheck className="w-5 h-5 shrink-0" />
            <span className={cn("text-sm font-bold transition-opacity duration-300 whitespace-nowrap", expanded ? "opacity-100" : "opacity-0")}>
              BolChat Hub
            </span>
          </Link>
        )}
        <Link
          href="/dashboard/settings"
          className="flex items-center h-10 gap-3 px-3 rounded-lg transition-all text-slate-500 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white border-l-[3px] border-transparent"
        >
          <Settings className="w-5 h-5 shrink-0" />
          <span className={cn("text-sm font-medium transition-opacity duration-300 whitespace-nowrap", expanded ? "opacity-100" : "opacity-0")}>
            Settings
          </span>
        </Link>
        <button
          onClick={async () => {
            await logoutAction();
            router.push("/");
          }}
          className="w-full flex items-center h-10 gap-3 px-3 rounded-lg transition-all text-slate-500 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 border-l-[3px] border-transparent"
        >
          <LogOut className="w-5 h-5 shrink-0" />
          <span className={cn("text-sm font-medium transition-opacity duration-300 whitespace-nowrap", expanded ? "opacity-100" : "opacity-0")}>
            Logout
          </span>
        </button>
      </div>
    </aside>
  );
}
