"use client";

import { useState, useRef, useEffect } from "react";
import { 
  Bot, Plus, Sparkles,
  ChevronDown, Info, Palette, Code, History, Eye, ChevronRight,
  X, Send, Minimize2
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function BotManagerPage() {
  const [activeTab, setActiveTab] = useState("Basic Info");
  const [showPreview, setShowPreview] = useState(false);
  const [previewInput, setPreviewInput] = useState("");
  const [previewMessages, setPreviewMessages] = useState([
    { from: "bot", text: "Ciao! I'm Luxe Assistant v2.1 👋 How can I help you today?" },
    { from: "user", text: "What sizes does the Mode Luxe Bomber come in?" },
    { from: "bot", text: "The Luxe Bomber is available in XS through 3XL in all colorways. Would you like me to check stock for a specific size?" },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [previewMessages, isTyping]);

  function handlePreviewSend() {
    if (!previewInput.trim()) return;
    const userMsg = previewInput.trim();
    setPreviewInput("");
    setPreviewMessages(prev => [...prev, { from: "user", text: userMsg }]);
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      setPreviewMessages(prev => [...prev, { from: "bot", text: "Thanks for reaching out! Let me look that up for you right now. ✨" }]);
    }, 1400);
  }

  const tabs = [
    "Basic Info", 
    "Knowledge", 
    "Model", 
    "Branding", 
    "Languages", 
    "Deploy"
  ];

  return (
    <div className="flex flex-col xl:flex-row h-full min-h-[calc(100vh-10rem)] bg-white dark:bg-[#0d1425]/40 backdrop-blur-md border border-slate-200 dark:border-white/5 rounded-[2.5rem] overflow-hidden shadow-sm">
      
      {/* Left Column: My Chatbots List */}
      <section className="w-full xl:w-80 xl:border-r border-b xl:border-b-0 border-slate-200 dark:border-white/5 p-6 flex flex-col gap-6 bg-slate-50/30 dark:bg-transparent overflow-y-auto scrollbar-hide shrink-0 z-10">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white font-cabinet">My Chatbots</h3>
          <button className="w-8 h-8 rounded-lg bg-rose-500 text-white flex items-center justify-center hover:bg-rose-600 shadow-md shadow-rose-200 dark:shadow-none transition-all cursor-pointer">
            <Plus className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-3">
          {/* Active Bot */}
          <div className="p-4 rounded-2xl bg-white dark:bg-white/[0.03] border-2 border-rose-500 shadow-lg shadow-rose-100 dark:shadow-[0_0_20px_rgba(244,63,94,0.15)] flex items-center justify-between cursor-pointer">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-500 to-pink-500 flex items-center justify-center text-white shrink-0">
                <Bot className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-bold text-slate-900 dark:text-white truncate">Luxe Assistant v2.1</p>
                <p className="text-[10px] font-bold text-green-500 uppercase tracking-tighter mt-0.5">Online</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-rose-500" />
          </div>

          {/* Inactive Bot 1 */}
          <div className="p-4 rounded-2xl bg-white dark:bg-white/[0.03] border border-slate-200 dark:border-transparent cursor-pointer hover:border-slate-300 dark:hover:border-white/10 opacity-80 hover:opacity-100 transition-all flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 shrink-0">
                <Bot className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-bold text-slate-700 dark:text-slate-300 truncate">Support Hero</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter mt-0.5">Offline</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-300 dark:text-slate-600" />
          </div>

          {/* Inactive Bot 2 */}
          <div className="p-4 rounded-2xl bg-white dark:bg-white/[0.03] border border-slate-200 dark:border-transparent cursor-pointer hover:border-slate-300 dark:hover:border-white/10 opacity-80 hover:opacity-100 transition-all flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 shrink-0">
                <Bot className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-bold text-slate-700 dark:text-slate-300 truncate">Sales Copilot</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter mt-0.5">In Draft</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-300 dark:text-slate-600" />
          </div>
        </div>

        <div className="mt-auto pt-8">
          {/* Light mode uses white card, dark mode uses rose-500/5 */}
          <div className="bg-white dark:bg-rose-500/5 p-6 rounded-[2rem] border border-slate-200 dark:border-rose-500/20 relative overflow-hidden flex flex-col gap-4 text-center">
            <div className="absolute -right-4 -top-4 w-16 h-16 bg-rose-500/10 rounded-full blur-xl hidden dark:block"></div>
            <div className="w-16 h-16 rounded-3xl bg-slate-50 dark:bg-transparent flex items-center justify-center mx-auto border border-slate-100 dark:border-transparent">
              <Sparkles className="w-8 h-8 text-rose-500" />
            </div>
            <div>
              <h4 className="text-lg sm:text-sm font-bold text-slate-900 dark:text-white mb-1 font-cabinet items-center">Auto-Optimize Agent</h4>
              <p className="text-sm sm:text-[10px] text-slate-500 leading-relaxed">Let our AI analyze your recent conversation history to improve accuracy.</p>
            </div>
            <button className="w-full py-3 sm:py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl sm:rounded-xl font-bold text-sm sm:text-[10px] uppercase tracking-widest hover:bg-slate-800 dark:hover:bg-rose-500 hover:text-white transition-all cursor-pointer">
              Run Optimizer
            </button>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="flex-1 flex flex-col relative overflow-hidden bg-white/50 dark:bg-transparent">
        
        {/* Scrollable Container */}
        <div className="flex-1 overflow-y-auto scrollbar-hide p-6 lg:p-8 space-y-8">
          
          {/* Hero Card */}
          <div className="bg-white dark:bg-white/[0.03] border border-slate-200 dark:border-white/5 p-6 lg:p-8 rounded-[2.5rem] flex flex-col xl:flex-row justify-between items-start xl:items-center gap-8 shadow-sm relative z-20">
            <div className="flex items-center gap-6 lg:gap-8 w-full xl:w-auto">
              <div className="w-20 h-20 lg:w-24 lg:h-24 rounded-[2rem] bg-gradient-to-tr from-rose-500 to-pink-500 flex items-center justify-center shadow-xl shadow-rose-200 dark:shadow-rose-500/30 ring-4 ring-white dark:ring-white/5 shrink-0">
                <Bot className="w-10 h-10 lg:w-12 lg:h-12 text-white" />
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <h3 className="text-2xl lg:text-3xl font-bold text-slate-900 dark:text-white tracking-tight font-cabinet">Luxe Assistant v2.1</h3>
                  <span className="px-2 py-0.5 rounded-md bg-green-100 dark:bg-green-500/10 text-green-600 dark:text-green-500 text-[10px] font-bold uppercase tracking-widest hidden sm:block">Active</span>
                </div>
                <div className="flex flex-wrap gap-3 lg:gap-4 text-xs font-bold text-slate-500 uppercase tracking-widest pt-1 lg:pt-0">
                  <p className="normal-case tracking-normal font-normal">Created on Oct 12, 2024 • v2.1.4</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full xl:w-auto overflow-x-auto pb-2 xl:pb-0">
              <div className="flex flex-col items-end mr-2 shrink-0">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Bot Status</span>
                <label className="relative inline-flex items-center cursor-pointer group h-6">
                  <input type="checkbox" defaultChecked className="sr-only peer" />
                  <div className="w-12 h-6 bg-slate-200 dark:bg-slate-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-rose-500"></div>
                </label>
              </div>
              <button className="px-5 py-2.5 bg-white xl:bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/10 rounded-xl font-bold text-sm transition-all text-slate-700 dark:text-white cursor-pointer shrink-0">
                Deploy
              </button>
              <button className="px-5 py-2.5 bg-slate-900 dark:bg-rose-500 text-white rounded-xl font-bold text-sm shadow-lg shadow-slate-200 dark:shadow-rose-500/20 hover:bg-slate-800 dark:hover:bg-rose-600 hover:scale-105 transition-all cursor-pointer shrink-0">
                Save
              </button>
            </div>
          </div>

          {/* Sticky Tabs Navigation */}
          <div className="flex border-b border-slate-200 dark:border-white/5 px-4 overflow-x-auto whitespace-nowrap scrollbar-hide">
            {tabs.map((tab) => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "px-6 py-5 text-sm font-bold transition-colors cursor-pointer relative",
                  activeTab === tab 
                    ? "text-rose-500" 
                    : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                )}
              >
                {tab}
                {activeTab === tab && (
                  <div className="absolute bottom-[-1px] left-0 right-0 h-[2px] bg-rose-500" />
                )}
              </button>
            ))}
          </div>

          <div className="p-2 sm:p-6 lg:p-10 space-y-10 animate-fade-in">
            {/* Tab Content (Basic Info) */}
            <div className="space-y-8">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.1em] ml-1">Chatbot Display Name</label>
                  <input 
                    type="text" 
                    defaultValue="Luxe Assistant v2.1" 
                    className="w-full h-14 px-6 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white focus:border-rose-500 focus:ring-4 focus:ring-rose-50 dark:focus:ring-rose-500/10 transition-all outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.1em] ml-1">Primary Language</label>
                  <div className="relative">
                    <select className="w-full h-14 px-6 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white focus:border-rose-500 focus:ring-4 focus:ring-rose-50 dark:focus:ring-rose-500/10 transition-all outline-none appearance-none cursor-pointer">
                      <option>English (US)</option>
                      <option>Spanish</option>
                      <option>French</option>
                      <option>German</option>
                    </select>
                    <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none w-4 h-4" />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.1em] ml-1">Bot Description / Tagline</label>
                <textarea 
                  rows={3} 
                  defaultValue="Your premium concierge for all things Mode Luxe. Specializing in sizing, international shipping, and style recommendations."
                  className="w-full p-6 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white focus:border-rose-500 focus:ring-4 focus:ring-rose-50 dark:focus:ring-rose-500/10 transition-all outline-none resize-none leading-relaxed"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-12 pt-2">
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <label className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.1em]">Confidence Threshold</label>
                      <span className="text-sm font-bold text-rose-500 bg-transparent dark:bg-rose-500/10 px-0 dark:px-2 py-0 dark:py-0.5 rounded-lg border-transparent">85%</span>
                    </div>
                    <input type="range" min="0" max="100" defaultValue="85" className="w-full h-2 bg-slate-100 dark:bg-white/10 rounded-lg appearance-none cursor-pointer accent-rose-500" />
                    <div className="flex justify-between mt-2">
                      <span className="text-[10px] text-slate-400">Loose</span>
                      <span className="text-[10px] text-slate-400">Strict</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <label className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.1em]">Max Tokens per Response</label>
                      <span className="text-sm font-bold text-rose-500 bg-transparent dark:bg-rose-500/10 px-0 dark:px-2 py-0 dark:py-0.5 rounded-lg border-transparent">450</span>
                    </div>
                    <input type="range" min="100" max="2048" defaultValue="450" className="w-full h-2 bg-slate-100 dark:bg-white/10 rounded-lg appearance-none cursor-pointer accent-rose-500" />
                    <div className="flex justify-between mt-2">
                      <span className="text-[10px] text-slate-400">Short</span>
                      <span className="text-[10px] text-slate-400">Detailed</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Alert Box */}
              <div className="p-6 rounded-3xl bg-rose-50 dark:bg-rose-500/5 border border-rose-100 dark:border-rose-500/20 flex items-start gap-4">
                <div className="shrink-0 mt-0.5">
                  <Info className="w-6 h-6 text-rose-500" />
                </div>
                <div>
                  <h5 className="text-sm font-bold text-rose-900 dark:text-white">Configuration Alert</h5>
                  <p className="text-xs text-rose-700 dark:text-slate-400 mt-1 leading-relaxed">
                    Setting the confidence threshold above 90% may increase the frequency of handovers to human agents for complex queries.
                  </p>
                </div>
              </div>

              <div className="flex justify-end pt-6 border-t border-slate-100 dark:border-white/5">
                <button className="px-8 py-4 bg-rose-500 text-white rounded-2xl font-bold text-sm shadow-xl shadow-rose-200 dark:shadow-rose-500/20 hover:scale-[1.02] active:scale-95 transition-all cursor-pointer">
                  Save & Continue
                </button>
              </div>

            </div>

            {/* Bottom Quick Actions (Light Mode design places this at the bottom grid) */}
            <div className="grid md:grid-cols-3 gap-6 pt-4 border-t border-slate-100 dark:border-white/5 mt-8">
              <div className="bg-white dark:bg-white/[0.03] rounded-[2rem] border border-slate-200 dark:border-white/5 p-8 flex items-center gap-6 group hover:border-rose-300 dark:hover:border-rose-500/50 transition-all cursor-pointer shadow-sm">
                <div className="w-14 h-14 rounded-2xl bg-rose-50 dark:bg-rose-500/10 text-rose-500 flex items-center justify-center group-hover:scale-110 transition-transform shrink-0">
                  <Palette className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white">Widget Customizer</h4>
                  <p className="text-xs text-slate-500">Modify colors, fonts, and icons.</p>
                </div>
              </div>

              <div className="bg-white dark:bg-white/[0.03] rounded-[2rem] border border-slate-200 dark:border-white/5 p-8 flex items-center gap-6 group hover:border-blue-300 dark:hover:border-blue-500/50 transition-all cursor-pointer shadow-sm">
                <div className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-500/10 text-blue-500 flex items-center justify-center group-hover:scale-110 transition-transform shrink-0">
                  <Code className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white">API Settings</h4>
                  <p className="text-xs text-slate-500">Access your unique bot tokens.</p>
                </div>
              </div>

              <div className="bg-white dark:bg-white/[0.03] rounded-[2rem] border border-slate-200 dark:border-white/5 p-8 flex items-center gap-6 group hover:border-orange-300 dark:hover:border-orange-500/50 transition-all cursor-pointer shadow-sm">
                <div className="w-14 h-14 rounded-2xl bg-orange-50 dark:bg-orange-500/10 text-orange-500 flex items-center justify-center group-hover:scale-110 transition-transform shrink-0">
                  <History className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white">Version Control</h4>
                  <p className="text-xs text-slate-500">Rollback to previous states.</p>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Floating Preview Button */}
        <div className="absolute bottom-6 right-6 lg:bottom-8 lg:right-8 z-50">
          <button
            onClick={() => setShowPreview(true)}
            className="w-14 h-14 lg:w-16 lg:h-16 rounded-full bg-slate-900 dark:bg-slate-800 dark:border dark:border-slate-700 text-white shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all group relative cursor-pointer"
          >
            <Eye className="w-6 h-6 lg:w-7 lg:h-7" />
            <div className="absolute top-1/2 -translate-y-1/2 right-16 lg:right-20 px-3 py-1.5 rounded-lg bg-slate-900 dark:bg-slate-800 text-white text-[10px] font-bold uppercase tracking-widest whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
              Preview Bot
            </div>
          </button>
        </div>

      </section>

      {/* Bot Preview Overlay */}
      {showPreview && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-[60] bg-black/30 dark:bg-black/60 backdrop-blur-sm"
            onClick={() => setShowPreview(false)}
          />

          {/* Chat Widget */}
          <div className="fixed bottom-6 right-6 z-[70] w-[380px] max-w-[calc(100vw-2rem)] flex flex-col rounded-[2rem] overflow-hidden shadow-[0_32px_80px_rgba(0,0,0,0.3)] border border-white/10">

            {/* Widget Header */}
            <div className="bg-gradient-to-r from-rose-500 to-pink-500 p-5 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 rounded-2xl bg-white/20 flex items-center justify-center">
                  <Bot className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="font-bold text-white text-sm">Luxe Assistant v2.1</p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></div>
                    <p className="text-[10px] text-white/80 font-medium uppercase tracking-widest">Online</p>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setShowPreview(false)}
                className="w-8 h-8 rounded-xl bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4 text-white" />
              </button>
            </div>

            {/* Messages */}
            <div className="bg-slate-50 dark:bg-[#0d1425] flex-1 p-4 space-y-4 max-h-[360px] overflow-y-auto">
              {previewMessages.map((msg, i) => (
                <div key={i} className={cn("flex gap-3", msg.from === "user" && "flex-row-reverse")}>
                  {msg.from === "bot" ? (
                    <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-rose-500 to-pink-500 flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm">
                      <Bot className="w-3.5 h-3.5 text-white" />
                    </div>
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-slate-300 dark:bg-slate-700 flex items-center justify-center flex-shrink-0 mt-0.5 text-[10px] font-bold text-slate-600 dark:text-slate-300">
                      U
                    </div>
                  )}
                  <div
                    className={cn(
                      "max-w-[75%] px-4 py-3 text-sm leading-relaxed shadow-sm",
                      msg.from === "bot"
                        ? "bg-white dark:bg-white/5 text-slate-700 dark:text-slate-200 rounded-2xl rounded-tl-none border border-slate-100 dark:border-white/10"
                        : "bg-gradient-to-br from-rose-500 to-pink-500 text-white rounded-2xl rounded-tr-none"
                    )}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex gap-3">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-rose-500 to-pink-500 flex items-center justify-center flex-shrink-0 shadow-sm">
                    <Bot className="w-3.5 h-3.5 text-white" />
                  </div>
                  <div className="bg-white dark:bg-white/5 border border-slate-100 dark:border-white/10 rounded-2xl rounded-tl-none px-4 py-3 flex items-center gap-1.5 shadow-sm">
                    <span className="w-2 h-2 rounded-full bg-slate-400 dark:bg-slate-500 animate-bounce" style={{ animationDelay: "0ms" }}></span>
                    <span className="w-2 h-2 rounded-full bg-slate-400 dark:bg-slate-500 animate-bounce" style={{ animationDelay: "150ms" }}></span>
                    <span className="w-2 h-2 rounded-full bg-slate-400 dark:bg-slate-500 animate-bounce" style={{ animationDelay: "300ms" }}></span>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Input bar */}
            <div className="bg-white dark:bg-[#0a0f1e] border-t border-slate-100 dark:border-white/5 p-3 flex items-center gap-3">
              <input
                type="text"
                value={previewInput}
                onChange={(e) => setPreviewInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handlePreviewSend()}
                placeholder="Type a message..."
                className="flex-1 h-10 px-4 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-sm outline-none focus:border-rose-400 transition-colors placeholder:text-slate-400"
              />
              <button
                onClick={handlePreviewSend}
                className="w-10 h-10 shrink-0 rounded-xl bg-gradient-to-tr from-rose-500 to-pink-500 text-white flex items-center justify-center shadow-md shadow-rose-200 dark:shadow-rose-500/20 hover:scale-105 active:scale-95 transition-all cursor-pointer"
              >
                <Send className="w-4 h-4 ml-0.5" />
              </button>
            </div>

            {/* Preview Badge */}
            <div className="bg-slate-100 dark:bg-[#0a0f1e] border-t border-slate-100 dark:border-white/5 py-2 flex justify-center">
              <p className="text-[9px] font-bold text-slate-400 dark:text-slate-600 uppercase tracking-widest">
                ✦ Live Preview — This is how users see your bot
              </p>
            </div>

          </div>
        </>
      )}

    </div>
  );
}

