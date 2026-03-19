"use client";

import { useState } from "react";
import { 
  Filter, RefreshCcw, Search, Globe, MapPin, 
  Archive, CheckCircle, MoreVertical, Paperclip, 
  Smile, Image as ImageIcon, Zap, Send, Bot, MessageCircle
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function ConversationsPage() {
  const [activeChat, setActiveChat] = useState("mr");

  const chats = [
    {
      id: "mr",
      initials: "MR",
      name: "Marco Rossi",
      status: "Unread",
      preview: "Quando potete spedire il mio ordine? È per un ...",
      lang: "IT",
      location: "Milan, IT",
      time: "5m ago",
      avatarColor: "orange",
      unread: true
    },
    {
      id: "sj",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
      name: "Sarah Johnson",
      status: "Read",
      preview: "Thank you for the discount code! I just placed my order.",
      lang: "EN",
      location: "London, UK",
      time: "2h ago",
      unread: false
    },
    {
      id: "yt",
      initials: "YT",
      name: "Yuki Tanaka",
      status: "Read",
      preview: "配送状況を確認したいのですが、追跡番号が届きません。",
      lang: "JP",
      location: "Tokyo, JP",
      time: "5h ago",
      avatarColor: "blue",
      unread: false
    },
    {
      id: "er",
      initials: "ER",
      name: "Elena Rodriguez",
      status: "Read",
      preview: "¿Tienen la chaqueta Luxe Bomber en color azul marino?",
      lang: "ES",
      location: "Madrid, ES",
      time: "1d ago",
      avatarColor: "purple",
      unread: false
    },
    {
      id: "cw",
      initials: "CW",
      name: "Chen Wei",
      status: "Read",
      preview: "我想了解一下你们的退货政策是怎么样的？",
      lang: "CN",
      location: "Shanghai, CN",
      time: "2d ago",
      avatarColor: "teal",
      unread: false
    }
  ];

  return (
    <div className="flex flex-col lg:flex-row h-full min-h-[calc(100vh-10rem)] bg-white dark:bg-[#0a0f1e]/40 border border-slate-200 dark:border-white/5 rounded-[2.5rem] overflow-hidden shadow-sm relative">
      
      {/* Decorative Orbs for Dark Mode */}
      <div className="hidden dark:block absolute rounded-full bg-rose-600/10 blur-[120px] w-[500px] h-[500px] -top-20 -left-20 pointer-events-none z-0"></div>
      <div className="hidden dark:block absolute rounded-full bg-pink-600/10 blur-[120px] w-[400px] h-[400px] bottom-0 right-0 pointer-events-none z-0"></div>

      {/* Left Column: Chat List */}
      <section className="w-full lg:w-2/5 xl:w-[420px] flex-shrink-0 border-b lg:border-b-0 lg:border-r border-slate-200 dark:border-white/5 bg-slate-50/50 dark:bg-[#0d1425]/50 flex flex-col z-10">
        <div className="p-6 space-y-6">
          <div className="flex justify-between items-center sm:items-end">
            <div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white font-cabinet">
                All Conversations <span className="text-slate-500 dark:text-slate-400 font-medium ml-1 text-[15px]">(847)</span>
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 hidden sm:block">Active chats and history</p>
            </div>
            <div className="flex gap-2">
              <button className="p-2 rounded-lg bg-white dark:bg-white/5 border border-slate-200 dark:border-transparent text-slate-500 dark:text-slate-400 hover:text-rose-500 dark:hover:text-white transition-colors cursor-pointer">
                <Filter className="w-5 h-5" />
              </button>
              <button className="p-2 rounded-lg bg-white dark:bg-white/5 border border-slate-200 dark:border-transparent text-slate-500 dark:text-slate-400 hover:text-rose-500 dark:hover:text-white transition-colors cursor-pointer">
                <RefreshCcw className="w-5 h-5" />
              </button>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input 
                type="text" 
                placeholder="Search messages, users..." 
                className="w-full h-12 pl-11 pr-4 rounded-xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/5 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500"
              />
            </div>
            
            <div className="flex gap-2">
              <div className="relative flex-1">
                <select className="w-full h-10 pl-3 pr-8 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/5 rounded-lg text-xs font-bold text-slate-600 dark:text-slate-400 uppercase outline-none transition-all hover:bg-slate-50 dark:hover:bg-white/10 appearance-none cursor-pointer">
                  <option>All Languages</option>
                  <option>English (EN)</option>
                  <option>Spanish (ES)</option>
                  <option>Italian (IT)</option>
                </select>
                <Globe className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
              </div>
              <select className="flex-1 h-10 px-3 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/5 rounded-lg text-xs font-bold text-slate-600 dark:text-slate-400 uppercase outline-none transition-all hover:bg-slate-50 dark:hover:bg-white/10 appearance-none cursor-pointer text-center">
                <option>Sort: Recent</option>
                <option>Unread First</option>
              </select>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-hide px-3 space-y-1 pb-4">
          {chats.map((chat) => (
            <div 
              key={chat.id}
              onClick={() => setActiveChat(chat.id)}
              className={cn(
                "p-4 rounded-2xl cursor-pointer transition-all group flex gap-4 border",
                activeChat === chat.id 
                  ? "bg-rose-50 dark:bg-rose-500/10 border-rose-500" 
                  : "bg-transparent border-transparent hover:bg-slate-100 dark:hover:bg-white/5"
              )}
            >
              <div className="relative flex-shrink-0 pt-0.5">
                {chat.avatar ? (
                  <img src={chat.avatar} className="w-12 h-12 rounded-full bg-slate-100 dark:bg-white/5" alt={chat.name} />
                ) : (
                  <div className={cn(
                    "w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm",
                    chat.avatarColor === "orange" && "bg-orange-100 text-orange-600 dark:bg-orange-500/20 dark:text-orange-500",
                    chat.avatarColor === "blue" && "bg-blue-100 text-blue-600 dark:bg-blue-500/20 dark:text-blue-500",
                    chat.avatarColor === "purple" && "bg-purple-100 text-purple-600 dark:bg-purple-500/20 dark:text-purple-500",
                    chat.avatarColor === "teal" && "bg-teal-100 text-teal-600 dark:bg-teal-500/20 dark:text-teal-500",
                  )}>
                    {chat.initials}
                  </div>
                )}
                {chat.unread && (
                  <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-rose-500 rounded-full border-2 border-white dark:border-[#0d1425]"></div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start">
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">{chat.name}</h4>
                  <span className={cn(
                    "text-[10px] font-bold px-1.5 py-0.5 rounded uppercase",
                    chat.unread 
                      ? "text-rose-600 bg-rose-100 dark:text-rose-500 dark:bg-rose-500/10" 
                      : "text-slate-400 dark:text-slate-500"
                  )}>
                    {chat.status}
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 truncate">{chat.preview}</p>
                <div className="flex items-center gap-3 mt-3 text-[10px] font-bold text-slate-500 uppercase tracking-tighter">
                  <span className="flex items-center gap-1"><Globe className="w-3 h-3"/> {chat.lang}</span>
                  <span className="flex items-center gap-1 truncate"><MapPin className="w-3 h-3"/> {chat.location}</span>
                  <span className="ml-auto lowercase font-medium tracking-normal opacity-70">{chat.time}</span>
                </div>
              </div>
            </div>
          ))}

          <div className="p-4 border-t border-slate-200 dark:border-white/5 mt-4">
            <button className="w-full py-3 rounded-xl bg-slate-100 dark:bg-white/5 text-slate-500 font-bold text-xs uppercase tracking-widest hover:bg-slate-200 dark:hover:bg-white/10 dark:hover:text-slate-300 transition-all cursor-pointer">
              Load More History
            </button>
          </div>
        </div>
      </section>

      {/* Right Column: Active Conversation Area */}
      <section className="flex-1 flex flex-col relative bg-slate-50 dark:bg-transparent z-10">
        
        {/* Chat Header */}
        <div className="p-4 sm:p-6 sticky top-0 bg-white/80 dark:bg-[#0a0f1e]/80 backdrop-blur-xl border-b border-slate-200 dark:border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 z-20">
          <div className="flex items-center gap-4">
            <div className="w-12 sm:w-14 h-12 sm:h-14 rounded-full bg-orange-100 dark:bg-orange-500/20 flex items-center justify-center text-orange-600 dark:text-orange-500 font-bold text-lg ring-4 ring-white dark:ring-white/5 shrink-0">
              MR
            </div>
            <div className="space-y-1 min-w-0">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-3 truncate">
                Marco Rossi 
                <span className="px-2 py-0.5 rounded-md bg-rose-500 text-white text-[8px] sm:text-[9px] font-bold uppercase tracking-widest shadow-md shadow-rose-500/20 shrink-0">Unread</span>
              </h3>
              <div className="flex flex-wrap items-center gap-2 text-[10px] sm:text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                <span className="flex items-center gap-1 text-rose-500 dark:text-rose-400"><Globe className="w-3 h-3" /> Native: IT (Italian)</span>
                <span className="w-1 h-1 bg-slate-300 dark:bg-white/10 rounded-full hidden sm:block"></span>
                <span className="hidden sm:block">Milan, IT</span>
                <span className="w-1 h-1 bg-slate-300 dark:bg-white/10 rounded-full hidden sm:block"></span>
                <span className="hidden sm:block">Started 5h ago</span>
              </div>
            </div>
          </div>
          <div className="flex gap-2 shrink-0">
            <button className="p-2 sm:p-3 rounded-xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/5 text-slate-500 dark:text-slate-400 hover:text-rose-500 dark:hover:text-white transition-all cursor-pointer shadow-sm dark:shadow-none" title="Archive">
              <Archive className="w-5 h-5" />
            </button>
            <button className="px-4 sm:px-6 py-2 sm:py-3 rounded-xl bg-white dark:bg-white border border-slate-200 dark:border-transparent text-slate-900 font-bold text-sm hover:bg-slate-50 dark:hover:bg-rose-500 dark:hover:text-white transition-all flex items-center gap-2 shadow-sm dark:shadow-xl dark:shadow-white/5 cursor-pointer">
              <CheckCircle className="w-4 h-4" /> 
              <span className="hidden sm:block">Resolve</span>
            </button>
            <button className="p-2 sm:p-3 rounded-xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/5 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/10 transition-all cursor-pointer shadow-sm dark:shadow-none items-center hidden sm:flex">
              <MoreVertical className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Chat History Container */}
        <div className="flex-1 overflow-y-auto scrollbar-hide p-4 sm:p-8 space-y-6 sm:space-y-8 pb-36 sm:pb-40">
          
          <div className="flex justify-start gap-3 sm:gap-4">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-rose-500 flex items-center justify-center text-white flex-shrink-0 shadow-lg shadow-rose-500/20">
              <Bot className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="max-w-[85%] sm:max-w-[75%] space-y-2">
              <div className="bg-white dark:bg-white/5 border border-slate-100 dark:border-white/10 p-4 sm:p-5 text-[13px] sm:text-sm leading-relaxed text-slate-700 dark:text-slate-200 rounded-2xl rounded-tl-none shadow-sm pb-5">
                Ciao! Benvenuto in Luxe Assistant. Come posso aiutarti oggi con la nostra collezione?
              </div>
              <p className="text-[9px] font-bold text-slate-500 dark:text-slate-600 uppercase ml-1">14:30 • BolChat AI (Luxe Agent)</p>
            </div>
          </div>

          <div className="flex justify-end gap-3 sm:gap-4">
            <div className="max-w-[85%] sm:max-w-[75%] space-y-2 text-right">
              <div className="bg-rose-100 dark:bg-gradient-to-tr dark:from-rose-500 dark:to-pink-500 text-rose-900 dark:text-white p-4 sm:p-5 text-[13px] sm:text-sm leading-relaxed rounded-2xl rounded-tr-none shadow-sm text-left">
                Buongiorno. Quando potete spedire il mio ordine? È l'ordine #LX-2024-089432.
              </div>
              <p className="text-[9px] font-bold text-slate-500 dark:text-slate-600 uppercase mr-1">14:31 • Marco Rossi</p>
            </div>
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-orange-100 dark:bg-orange-500/20 flex items-center justify-center text-orange-600 dark:text-orange-500 font-bold text-xs flex-shrink-0">
              MR
            </div>
          </div>

          <div className="flex justify-start gap-3 sm:gap-4">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-rose-500 flex items-center justify-center text-white flex-shrink-0 shadow-lg shadow-rose-500/20">
              <Bot className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="max-w-[85%] sm:max-w-[75%] space-y-2">
              <div className="bg-white dark:bg-white/5 border border-slate-100 dark:border-white/10 p-4 sm:p-5 text-[13px] sm:text-sm leading-relaxed text-slate-700 dark:text-slate-200 rounded-2xl rounded-tl-none shadow-sm pb-5">
                Ho controllato il tuo ordine #LX-2024-089432. Sarà spedito domani mattina alle 9:00 tramite corriere DHL Express. Riceverai un codice di tracciamento via email.
              </div>
              <p className="text-[9px] font-bold text-slate-500 dark:text-slate-600 uppercase ml-1">14:31 • BolChat AI</p>
            </div>
          </div>

          <div className="flex justify-end gap-3 sm:gap-4">
            <div className="max-w-[85%] sm:max-w-[75%] space-y-2 text-right">
              <div className="bg-rose-100 dark:bg-gradient-to-tr dark:from-rose-500 dark:to-pink-500 text-rose-900 dark:text-white p-4 sm:p-5 text-[13px] sm:text-sm leading-relaxed rounded-2xl rounded-tr-none shadow-sm text-left">
                Perfetto, grazie mille! Arriverà entro venerdì?
              </div>
              <p className="text-[9px] font-bold text-slate-500 dark:text-slate-600 uppercase mr-1">14:32 • Marco Rossi</p>
            </div>
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-orange-100 dark:bg-orange-500/20 flex items-center justify-center text-orange-600 dark:text-orange-500 font-bold text-xs flex-shrink-0">
              MR
            </div>
          </div>

          <div className="flex justify-start gap-3 sm:gap-4">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-rose-500 flex items-center justify-center text-white flex-shrink-0 shadow-lg shadow-rose-500/20">
              <Bot className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="max-w-[85%] sm:max-w-[75%] space-y-2">
              <div className="bg-white dark:bg-white/5 border border-slate-100 dark:border-white/10 p-4 sm:p-5 text-[13px] sm:text-sm leading-relaxed text-slate-700 dark:text-slate-200 rounded-2xl rounded-tl-none shadow-sm pb-5">
                Con la spedizione Express, la consegna stimata a Milano è prevista per giovedì 24 ottobre. Desideri che io verifichi l'indirizzo di consegna?
              </div>
              <p className="text-[9px] font-bold text-slate-500 dark:text-slate-600 uppercase ml-1">14:33 • BolChat AI</p>
            </div>
          </div>

          <div className="flex justify-center my-10">
            <div className="px-4 py-1.5 rounded-full bg-slate-200/50 dark:bg-white/5 border border-slate-300 dark:border-white/5 text-[9px] sm:text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest animate-pulse">
              User is typing...
            </div>
          </div>
        </div>

        {/* Input Footer Area */}
        <div className="absolute bottom-0 inset-x-0 p-4 sm:p-6 bg-slate-50/90 dark:bg-[#0a0f1e]/90 backdrop-blur-md border-t border-slate-200 dark:border-white/5 z-30">
          <div className="max-w-4xl mx-auto flex gap-3 sm:gap-4 items-end">
            <div className="flex-1 bg-white dark:bg-white/[0.03] rounded-2xl border border-slate-200 dark:border-white/10 shadow-lg dark:shadow-2xl overflow-hidden p-2 relative">
              <div className="absolute top-0 left-0 w-1 bg-rose-500 h-full hidden dark:block"></div>
              <textarea 
                placeholder="Type a message to Marco Rossi (AI will translate instantly)..." 
                className="w-full h-12 sm:h-16 bg-transparent text-sm text-slate-900 dark:text-white px-3 sm:px-4 pt-2 sm:pt-3 outline-none resize-none placeholder:text-slate-400 dark:placeholder:text-slate-600"
              />
              <div className="flex items-center justify-between px-2 pb-1">
                <div className="flex items-center gap-1">
                  <button className="p-2 sm:p-2.5 rounded-lg text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-white/5 transition-all cursor-pointer">
                    <Paperclip className="w-5 h-5 sm:w-5 sm:h-5" />
                  </button>
                  <button className="p-2 sm:p-2.5 rounded-lg text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-white/5 transition-all cursor-pointer">
                    <Smile className="w-5 h-5 sm:w-5 sm:h-5" />
                  </button>
                  <button className="p-2 sm:p-2.5 rounded-lg text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-white/5 transition-all cursor-pointer hidden sm:block">
                    <ImageIcon className="w-5 h-5 sm:w-5 sm:h-5" />
                  </button>
                  <div className="w-px h-4 bg-slate-200 dark:bg-white/10 mx-1 sm:mx-2 hidden sm:block"></div>
                  <button className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-white transition-all text-[10px] font-bold uppercase tracking-widest cursor-pointer">
                    <Zap className="w-3.5 h-3.5" /> Use Prompt
                  </button>
                </div>
                <div className="flex items-center gap-4">
                  <p className="text-[9px] font-bold text-slate-400 dark:text-slate-600 uppercase italic hidden md:block mr-2">
                    Auto-translation to Italian active
                  </p>
                </div>
              </div>
            </div>
            <button className="w-12 h-12 sm:w-14 sm:h-14 shrink-0 rounded-2xl bg-gradient-to-tr from-rose-500 to-pink-500 text-white flex items-center justify-center shadow-lg shadow-rose-500/20 hover:scale-[1.05] active:scale-95 transition-all cursor-pointer">
              <Send className="w-5 h-5 sm:w-6 sm:h-6 ml-0.5" />
            </button>
          </div>
        </div>
      </section>

    </div>
  );
}
