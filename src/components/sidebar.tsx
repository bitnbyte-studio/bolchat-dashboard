"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, Bot, LineChart, UserPlus, MessageSquare, Settings, LogOut, MessageCircle, LayoutDashboard } from "lucide-react";
import { cn } from "@/lib/utils";
import { BolchatLogo } from "./BolchatLogo";

const navItems = [
  { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { title: "Knowledge Base", href: "/dashboard/knowledge", icon: BookOpen },
  { title: "Chatbot Manager", href: "/dashboard/chatbots", icon: Bot },
  { title: "Analytics", href: "/dashboard/analytics", icon: LineChart },
  { title: "Lead Capture", href: "/dashboard/leads", icon: UserPlus, badge: "12" },
  { title: "Conversations", href: "/dashboard/conversations", icon: MessageSquare },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="group fixed inset-y-0 left-0 z-50 hidden lg:flex flex-col bg-white dark:bg-[#0a0f1e]/80 dark:backdrop-blur-2xl border-r border-slate-200 dark:border-white/10 w-20 hover:w-72 shadow-xl transition-[width] duration-300 cubic-bezier(0.4, 0, 0.2, 1) overflow-hidden">
      
      <div className="pl-3 pr-4 flex items-center gap-1 mb-8 h-20 shrink-0">
        <BolchatLogo size="md" textClassName="opacity-0 group-hover:opacity-100 transition-opacity duration-300 overflow-hidden" />
      </div>

      <nav className="flex-1 space-y-2 px-3">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center h-12 gap-4 px-3 rounded-xl transition-all relative overflow-hidden",
                isActive 
                  ? "bg-rose-50 dark:bg-rose-500/10 border-l-[4px] border-rose-500 text-rose-500" 
                  : "text-slate-500 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white border-l-[4px] border-transparent"
              )}
            >
              <item.icon className="w-6 h-6 shrink-0" />
              <span className="font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                {item.title}
              </span>
              {item.badge && (
                <span className="ml-auto bg-rose-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-md opacity-0 group-hover:opacity-100 absolute right-3">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto p-3 space-y-2 border-t border-slate-100 dark:border-white/10">
        <Link
          href="/dashboard/settings"
          className="flex items-center h-12 gap-4 px-3 rounded-xl transition-all text-slate-500 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white border-l-[4px] border-transparent"
        >
          <Settings className="w-6 h-6 shrink-0" />
          <span className="font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
            Settings
          </span>
        </Link>
        <Link
          href="/"
          className="flex items-center h-12 gap-4 px-3 rounded-xl transition-all text-slate-500 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 border-l-[4px] border-transparent"
        >
          <LogOut className="w-6 h-6 shrink-0" />
          <span className="font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
            Logout
          </span>
        </Link>
      </div>
    </aside>
  );
}
