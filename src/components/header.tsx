"use client";

import { Bell, Menu, Search, HelpCircle, Activity, Plus, Calendar, Download, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { usePathname } from "next/navigation";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { BolchatLogo } from "./BolchatLogo";
import Link from "next/link";
import { BookOpen, Bot, LineChart, UserPlus, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { title: "Knowledge Base", href: "/dashboard/knowledge", icon: BookOpen },
  { title: "Chatbot Manager", href: "/dashboard/chatbots", icon: Bot },
  { title: "Analytics", href: "/dashboard/analytics", icon: LineChart },
  { title: "Lead Capture", href: "/dashboard/leads", icon: UserPlus, badge: "12" },
  { title: "Conversations", href: "/dashboard/conversations", icon: MessageSquare },
];

function MobileNav() {
  const pathname = usePathname();
  return (
    <div className="flex flex-col h-full bg-slate-50 dark:bg-[#0a0f1e] text-slate-900 border-none">
      <SheetHeader className="p-6 border-b border-slate-200 dark:border-white/5 text-left">
         <SheetTitle className="flex items-center gap-2">
           <BolchatLogo size="sm" />
         </SheetTitle>
      </SheetHeader>
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group",
                isActive 
                  ? "bg-rose-50 text-rose-500 border-l-[4px] border-rose-500" 
                  : "text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white"
              )}
            >
              <item.icon className={cn("w-5 h-5", isActive ? "text-rose-500" : "text-slate-500")} />
              {item.title}
            </Link>
          );
        })}
      </nav>
    </div>
  )
}

function getPageMetadata(pathname: string) {
  if (pathname.includes("knowledge")) return { title: "Knowledge Base", subtitle: "Documents Central" };
  if (pathname.includes("chatbots")) return { title: "Chatbot Manager", subtitle: "Agent Configuration" };
  if (pathname.includes("analytics")) return { title: "Analytics", subtitle: "Performance Metrics" };
  if (pathname.includes("leads")) return { title: "Lead Capture", subtitle: "Visitor Intelligence" };
  if (pathname.includes("conversations")) return { title: "Conversations", subtitle: "Inbox & Live Chat" };
  return { title: "Dashboard", subtitle: "Overview" };
}

export function Header() {
  const pathname = usePathname();
  const { title, subtitle } = getPageMetadata(pathname);

  return (
    <header className="sticky top-0 z-30 h-20 bg-white/80 dark:bg-[#0a0f1e]/80 backdrop-blur-md border-b border-slate-200 dark:border-white/10 px-4 md:px-8 flex items-center justify-between shadow-sm transition-colors duration-300">
      <div className="flex items-center gap-4">
        <Sheet>
          <SheetTrigger className="lg:hidden flex items-center justify-center w-10 h-10 shrink-0 text-slate-500 hover:text-slate-900 dark:hover:text-white bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl transition-colors cursor-pointer">
            <Menu className="w-5 h-5" />
          </SheetTrigger>
          <SheetContent side="left" className="p-0 border-r border-slate-200 dark:border-white/10 w-72 bg-white dark:bg-[#0a0f1e]">
             <MobileNav />
          </SheetContent>
        </Sheet>
        
        <div className="hidden sm:block">
          <h2 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white font-cabinet">{title}</h2>
          <div className="flex items-center gap-2 mt-0.5">
             <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">{subtitle}</span>
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-3 md:gap-6">
        {pathname.includes("leads") && (
          <button className="hidden sm:flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-xl font-bold text-xs md:text-sm shadow-lg shadow-rose-500/20 hover:scale-105 transition-all cursor-pointer">
            <Plus className="w-4 h-4" /> New Lead
          </button>
        )}

        {pathname.includes("analytics") && (
          <div className="hidden xl:flex items-center gap-2">
            <button className="bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-600 dark:text-slate-300 flex items-center gap-3 hover:bg-slate-100 dark:hover:bg-white/10 transition-all cursor-pointer">
              <span>Last 7 Days</span>
              <Calendar className="w-3 h-3 text-rose-500" />
            </button>
            <button className="h-10 px-5 bg-slate-900 border border-transparent dark:border-white/10 text-white rounded-xl font-bold text-xs flex items-center gap-2 hover:bg-rose-600 transition-all shadow-lg cursor-pointer">
              <Download className="w-3 h-3" /> Export
            </button>
            <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all cursor-pointer group">
              <RefreshCcw className="w-4 h-4 text-slate-500 group-active:rotate-180 transition-transform duration-500" />
            </button>
            <div className="h-8 w-px bg-slate-200 dark:bg-white/10 mx-1"></div>
          </div>
        )}
        
        {!pathname.includes("analytics") && (
          <div className="hidden lg:flex items-center bg-slate-100 dark:bg-white/5 rounded-full px-4 py-2 border border-slate-200 dark:border-white/10 focus-within:ring-2 focus-within:ring-rose-500/20 transition-all">
            <Search className="text-slate-400 w-4 h-4 mr-3" />
            <input 
              type="text" 
              placeholder="Search documents..." 
              className="bg-transparent border-none outline-none text-sm text-slate-900 dark:text-white placeholder:text-slate-400 w-48 transition-colors"
            />
          </div>
        )}

        <div className="flex items-center gap-2 md:gap-3">
          <ThemeToggle />
          
          <button className="w-10 h-10 rounded-xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-center relative hover:text-rose-500 text-slate-500 dark:text-slate-400 transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full"></span>
          </button>
          
          <div className="h-8 w-[1px] bg-slate-200 dark:bg-white/10 mx-1 hidden sm:block"></div>
          
          <button className="flex items-center gap-3 pl-2 pr-1 py-1 rounded-2xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:border-rose-300 dark:hover:border-rose-500/50 transition-all text-left">
            <span className="text-sm font-bold text-slate-700 dark:text-slate-200 ml-1 hidden sm:block">Bolchat Admin</span>
            <Avatar className="w-8 h-8 rounded-xl object-cover">
               <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="Profile" />
               <AvatarFallback className="bg-rose-500/20 text-rose-500 font-bold rounded-xl text-xs">BT</AvatarFallback>
            </Avatar>
          </button>
        </div>
      </div>
    </header>
  );
}
