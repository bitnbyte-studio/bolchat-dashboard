import { useState, useEffect, useRef } from "react";
import { 
  Filter, RefreshCcw, Search, Globe, MapPin, 
  Archive, CheckCircle, MoreVertical, Paperclip, 
  Smile, Image as ImageIcon, Zap, Send, Bot, MessageCircle,
  Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { getConversationsAction, getConversationDetailAction } from "@/app/actions/conversations";

export default function ConversationsPage() {
  const [conversations, setConversations] = useState<any[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [activeChatDetail, setActiveChatDetail] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchConversations();
  }, []);

  useEffect(() => {
    if (activeChatId) {
      fetchChatDetail(activeChatId);
    }
  }, [activeChatId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeChatDetail]);

  async function fetchConversations() {
    setLoading(true);
    const result = await getConversationsAction();
    if (result.success && result.data) {
      setConversations(result.data);
      if (result.data.length > 0 && !activeChatId) {
        setActiveChatId(result.data[0].id);
      }
    }
    setLoading(false);
  }

  async function fetchChatDetail(id: string) {
    setDetailLoading(true);
    const result = await getConversationDetailAction(id);
    if (result.success) {
      setActiveChatDetail(result.data);
    }
    setDetailLoading(false);
  }

  const getAvatarColor = (id: string) => {
    const colors = ["orange", "blue", "purple", "teal"];
    const index = id.charCodeAt(0) % colors.length;
    return colors[index];
  };

  const getInitials = (name: string) => {
    return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
  };

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
                All Conversations <span className="text-slate-500 dark:text-slate-400 font-medium ml-1 text-[15px]">({conversations.length})</span>
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
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 text-slate-400">
              <Loader2 className="w-8 h-8 animate-spin mb-2" />
              <p className="text-[10px] font-bold uppercase tracking-widest">Loading chats...</p>
            </div>
          ) : conversations.length === 0 ? (
            <div className="py-20 text-center text-slate-500 text-xs uppercase tracking-widest">No chats yet</div>
          ) : conversations.map((chat) => (
            <div 
              key={chat.id}
              onClick={() => setActiveChatId(chat.id)}
              className={cn(
                "p-4 rounded-2xl cursor-pointer transition-all group flex gap-4 border",
                activeChatId === chat.id 
                  ? "bg-rose-50 dark:bg-rose-500/10 border-rose-500" 
                  : "bg-transparent border-transparent hover:bg-slate-100 dark:hover:bg-white/5"
              )}
            >
              <div className="relative flex-shrink-0 pt-0.5">
                <div className={cn(
                  "w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm",
                  getAvatarColor(chat.id) === "orange" && "bg-orange-100 text-orange-600 dark:bg-orange-500/20 dark:text-orange-500",
                  getAvatarColor(chat.id) === "blue" && "bg-blue-100 text-blue-600 dark:bg-blue-500/20 dark:text-blue-500",
                  getAvatarColor(chat.id) === "purple" && "bg-purple-100 text-purple-600 dark:bg-purple-500/20 dark:text-purple-500",
                  getAvatarColor(chat.id) === "teal" && "bg-teal-100 text-teal-600 dark:bg-teal-500/20 dark:text-teal-500",
                )}>
                  {getInitials(chat.metadata?.user_name || "User")}
                </div>
                {chat.status === "ACTIVE" && (
                  <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-rose-500 rounded-full border-2 border-white dark:border-[#0d1425]"></div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start">
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">{chat.metadata?.user_name || "Anonymous User"}</h4>
                  <span className={cn(
                    "text-[10px] font-bold px-1.5 py-0.5 rounded uppercase",
                    chat.status === "ACTIVE"
                      ? "text-rose-600 bg-rose-100 dark:text-rose-500 dark:bg-rose-500/10" 
                      : "text-slate-400 dark:text-slate-500"
                  )}>
                    {chat.status}
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 truncate">
                  {chat.last_message || "No messages yet"}
                </p>
                <div className="flex items-center gap-3 mt-3 text-[10px] font-bold text-slate-500 uppercase tracking-tighter">
                  <span className="flex items-center gap-1"><Globe className="w-3 h-3"/> {chat.metadata?.language || '--'}</span>
                  <span className="flex items-center gap-1 truncate"><MapPin className="w-3 h-3"/> {chat.metadata?.country || 'Unknown'}</span>
                  <span className="ml-auto lowercase font-medium tracking-normal opacity-70">
                    {new Date(chat.created_at).toLocaleDateString()}
                  </span>
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
            <div className={cn(
              "w-12 sm:w-14 h-12 sm:h-14 rounded-full flex items-center justify-center font-bold text-lg ring-4 ring-white dark:ring-white/5 shrink-0",
              activeChatId ? (
                getAvatarColor(activeChatId) === "orange" && "bg-orange-100 text-orange-600 dark:bg-orange-500/20 dark:text-orange-500" ||
                getAvatarColor(activeChatId) === "blue" && "bg-blue-100 text-blue-600 dark:bg-blue-500/20 dark:text-blue-500" ||
                getAvatarColor(activeChatId) === "purple" && "bg-purple-100 text-purple-600 dark:bg-purple-500/20 dark:text-purple-500" ||
                getAvatarColor(activeChatId) === "teal" && "bg-teal-100 text-teal-600 dark:bg-teal-500/20 dark:text-teal-500"
              ) : "bg-slate-100"
            )}>
              {activeChatDetail ? getInitials(activeChatDetail.metadata?.user_name || "User") : "??"}
            </div>
            <div className="space-y-1 min-w-0">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-3 truncate">
                {activeChatDetail ? (activeChatDetail.metadata?.user_name || "Anonymous User") : "Select a conversation"}
                {activeChatDetail?.status === "ACTIVE" && (
                  <span className="px-2 py-0.5 rounded-md bg-rose-500 text-white text-[8px] sm:text-[9px] font-bold uppercase tracking-widest shadow-md shadow-rose-500/20 shrink-0">Live</span>
                )}
              </h3>
              <div className="flex flex-wrap items-center gap-2 text-[10px] sm:text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                <span className="flex items-center gap-1 text-rose-500 dark:text-rose-400"><Globe className="w-3 h-3" /> {activeChatDetail?.metadata?.language || 'Unknown Language'}</span>
                <span className="w-1 h-1 bg-slate-300 dark:bg-white/10 rounded-full hidden sm:block"></span>
                <span className="hidden sm:block">{activeChatDetail?.metadata?.country || 'Unknown Location'}</span>
                <span className="w-1 h-1 bg-slate-300 dark:bg-white/10 rounded-full hidden sm:block"></span>
                <span className="hidden sm:block">ID: {activeChatDetail?.id.slice(0, 8)}...</span>
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
          {detailLoading ? (
             <div className="flex flex-col items-center justify-center h-full text-slate-400">
                <Loader2 className="w-10 h-10 animate-spin mb-4" />
                <p className="text-sm font-bold uppercase tracking-widest">Loading Conversation...</p>
             </div>
          ) : !activeChatDetail ? (
             <div className="flex flex-col items-center justify-center h-full text-slate-400 text-center px-10">
                <div className="w-20 h-20 bg-slate-100 dark:bg-white/5 rounded-full flex items-center justify-center mb-6">
                  <MessageCircle className="w-10 h-10 opacity-20" />
                </div>
                <h4 className="text-lg font-bold text-slate-900 dark:text-white font-cabinet mb-1">No Chat Selected</h4>
                <p className="text-sm">Click on a conversation to view the full message history and metadata.</p>
             </div>
          ) : (
            activeChatDetail.messages?.map((msg: any) => (
              <div key={msg.id} className={cn("flex gap-3 sm:gap-4", msg.role === "user" ? "justify-end" : "justify-start")}>
                {msg.role !== "user" && (
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-rose-500 flex items-center justify-center text-white flex-shrink-0 shadow-lg shadow-rose-500/20">
                    <Bot className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                )}
                
                <div className={cn("max-w-[85%] sm:max-w-[75%] space-y-2", msg.role === "user" && "text-right")}>
                  <div className={cn(
                    "p-4 sm:p-5 text-[13px] sm:text-sm leading-relaxed rounded-2xl shadow-sm",
                    msg.role === "user" 
                      ? "bg-rose-100 dark:bg-gradient-to-tr dark:from-rose-500 dark:to-pink-500 text-rose-900 dark:text-white rounded-tr-none text-left"
                      : "bg-white dark:bg-white/5 border border-slate-100 dark:border-white/10 text-slate-700 dark:text-slate-200 rounded-tl-none"
                  )}>
                    {msg.content}
                  </div>
                  <p className="text-[9px] font-bold text-slate-500 dark:text-slate-600 uppercase">
                    {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {msg.role === "user" ? (activeChatDetail.metadata?.user_name || "User") : "BolChat AI"}
                  </p>
                </div>

                {msg.role === "user" && (
                   <div className={cn(
                    "w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-bold text-xs flex-shrink-0",
                    getAvatarColor(activeChatDetail.id) === "orange" && "bg-orange-100 text-orange-600 dark:bg-orange-500/20 dark:text-orange-500",
                    getAvatarColor(activeChatDetail.id) === "blue" && "bg-blue-100 text-blue-600 dark:bg-blue-500/20 dark:text-blue-500",
                    getAvatarColor(activeChatDetail.id) === "purple" && "bg-purple-100 text-purple-600 dark:bg-purple-500/20 dark:text-purple-500",
                    getAvatarColor(activeChatDetail.id) === "teal" && "bg-teal-100 text-teal-600 dark:bg-teal-500/20 dark:text-teal-500",
                  )}>
                    {getInitials(activeChatDetail.metadata?.user_name || "User")}
                  </div>
                )}
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
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
