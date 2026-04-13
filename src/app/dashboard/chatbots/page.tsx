"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import {
  Bot, Plus, Sparkles,
  ChevronDown, Info, Palette, Code, Eye, ChevronRight,
  X, Send, Loader2, Save, Database,
  Rocket, Copy, Key, CheckCircle2, Circle,
  RotateCcw, ArrowRight, MessageCircle, Headphones, HelpCircle, Zap,
  Trash2, AlertTriangle
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  getAgentsAction, createAgentAction, updateAgentAction,
  previewChatAction,
  getWidgetAction, updateWidgetAction, publishAgentAction,
  deleteAgentAction
} from "@/app/actions/agents";
import { getKBsAction } from "@/app/actions/knowledge";
import { getApiKeysAction, createApiKeyAction, revokeApiKeyAction } from "@/app/actions/settings";
import { useToast } from "@/components/ui/toast";

type AgentSettings = {
  confidence_threshold?: number;
  max_tokens?: number;
  temperature?: number;
  top_k?: number;
  language?: string;
};

const DEFAULT_SETTINGS: AgentSettings = {
  confidence_threshold: 85,
  max_tokens: 1024,
  temperature: 0.4,
  top_k: 5,
  language: "en",
};

const LANGUAGES = [
  { code: "en", label: "English (US)" },
  { code: "hi", label: "Hindi" },
  { code: "mr", label: "Marathi" },
  { code: "gu", label: "Gujarati" },
  { code: "bn", label: "Bengali" },
  { code: "te", label: "Telugu" },
  { code: "ta", label: "Tamil" },
  { code: "kn", label: "Kannada" },
  { code: "ml", label: "Malayalam" },
  { code: "pa", label: "Punjabi" },
  { code: "ur", label: "Urdu" },
  { code: "es", label: "Spanish" },
  { code: "fr", label: "French" },
  { code: "de", label: "German" },
  { code: "it", label: "Italian" },
  { code: "pt", label: "Portuguese" },
  { code: "zh", label: "Chinese" },
  { code: "ja", label: "Japanese" },
  { code: "ar", label: "Arabic" },
  { code: "ru", label: "Russian" },
];

function LanguageSelect({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selected = LANGUAGES.find(l => l.code === value) || LANGUAGES[0];

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full h-10 px-4 flex justify-between items-center rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-sm text-slate-900 dark:text-white hover:border-slate-300 dark:hover:border-white/20 focus:border-rose-500 focus:ring-4 focus:ring-rose-50 dark:focus:ring-rose-500/10 transition-all outline-none"
      >
        <span>{selected.label}</span>
        <ChevronDown className={cn("w-4 h-4 text-slate-400 transition-transform duration-200", open && "rotate-180")} />
      </button>

      {open && (
        <div className="absolute z-50 w-full mt-2 bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-white/10 rounded-xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          <div className="max-h-60 overflow-y-auto scrollbar-hide py-1">
            {LANGUAGES.map((lang) => (
              <button
                key={lang.code}
                type="button"
                onClick={() => { onChange(lang.code); setOpen(false); }}
                className={cn(
                  "w-full px-4 py-2 text-left text-sm transition-colors",
                  value === lang.code 
                    ? "bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 font-medium" 
                    : "text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5"
                )}
              >
                {lang.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

const TABS = ["Basic Info", "Knowledge", "Widget", "Deploy"] as const;
type Tab = (typeof TABS)[number];

const LAUNCHER_ICONS = [
  { id: "chat", label: "Chat Bubble", Icon: MessageCircle },
  { id: "bot", label: "Bot", Icon: Bot },
  { id: "headphones", label: "Support", Icon: Headphones },
  { id: "help", label: "Help", Icon: HelpCircle },
  { id: "zap", label: "Zap", Icon: Zap },
] as const;

const WIDGET_API_URL =
  process.env.NEXT_PUBLIC_WIDGET_API_URL ||
  "https://bolchat-backend-api-ggb9ghbnctddhufy.centralindia-01.azurewebsites.net";
const WIDGET_SCRIPT_URL = process.env.NEXT_PUBLIC_WIDGET_URL || `${WIDGET_API_URL}/static/widget.js`;

function getWidgetTheme(widget: any) {
  return {
    launcher_icon: "chat",
    chat_height: 520,
    ...(widget?.theme || {}),
  };
}

function LauncherIcon({ iconId, className }: { iconId: string; className?: string }) {
  const match = LAUNCHER_ICONS.find((i) => i.id === iconId);
  const Ic = match?.Icon || MessageCircle;
  return <Ic className={className} />;
}

export default function BotManagerPage() {
  const { toast } = useToast();

  const [activeTab, setActiveTab] = useState<Tab>("Basic Info");
  const [showPreview, setShowPreview] = useState(false);
  const [previewInput, setPreviewInput] = useState("");
  const [previewMessages, setPreviewMessages] = useState<{ from: string; text: string }[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [agents, setAgents] = useState<any[]>([]);
  const [currentAgent, setCurrentAgent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteConfirmName, setDeleteConfirmName] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const [allKBs, setAllKBs] = useState<any[]>([]);
  const [kbLoading, setKbLoading] = useState(false);

  const [widget, setWidget] = useState<any>(null);
  const [widgetLoading, setWidgetLoading] = useState(false);
  const [widgetSaveLoading, setWidgetSaveLoading] = useState(false);

  const [apiKeys, setApiKeys] = useState<any[]>([]);
  const [apiKeysLoading, setApiKeysLoading] = useState(false);
  const [publishLoading, setPublishLoading] = useState(false);
  const [newKeyName, setNewKeyName] = useState("");
  const [keyCreateLoading, setKeyCreateLoading] = useState(false);
  const [generatedKey, setGeneratedKey] = useState<string | null>(null);
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [revokeKeyTarget, setRevokeKeyTarget] = useState<any>(null);
  const [revokeKeyLoading, setRevokeKeyLoading] = useState(false);

  // ── Helpers ──

  function agentSettings(): AgentSettings {
    return { ...DEFAULT_SETTINGS, ...(currentAgent?.settings || {}) };
  }

  function updateSettings(patch: Partial<AgentSettings>) {
    if (!currentAgent) return;
    setCurrentAgent({
      ...currentAgent,
      settings: { ...agentSettings(), ...patch },
    });
  }

  const isDraft = !currentAgent?.id;

  // ── Data Fetching ──

  useEffect(() => {
    fetchAgents();
  }, []);

  async function fetchAgents() {
    setLoading(true);
    const result = await getAgentsAction();
    if (result.success && result.data?.length > 0) {
      setAgents(result.data);
      setCurrentAgent(result.data[0]);
    } else if (result.success) {
      setAgents([]);
      setCurrentAgent({
        name: "",
        description: "",
        system_prompt: "",
        settings: { ...DEFAULT_SETTINGS },
      });
    } else {
      toast(result.error || "Failed to load agents", "error");
      setAgents([]);
      setCurrentAgent({
        name: "",
        description: "",
        system_prompt: "",
        settings: { ...DEFAULT_SETTINGS },
      });
    }
    setLoading(false);
  }

  useEffect(() => {
    if (currentAgent?.id) {
      fetchAllKBs();
      fetchWidget(currentAgent.id);
    }
  }, [currentAgent?.id]);

  const resetPreview = useCallback((greeting?: string) => {
    const msg = greeting || widget?.greeting || "Hi! How can I help you today?";
    setPreviewMessages([{ from: "bot", text: msg }]);
    setPreviewInput("");
  }, [widget?.greeting]);

  useEffect(() => {
    resetPreview();
  }, [currentAgent?.id, resetPreview]);

  async function fetchAllKBs() {
    setKbLoading(true);
    const res = await getKBsAction();
    if (res.success) setAllKBs(res.data || []);
    setKbLoading(false);
  }

  async function fetchWidget(agentId: string) {
    setWidgetLoading(true);
    const res = await getWidgetAction(agentId);
    if (res.success) setWidget(res.data);
    setWidgetLoading(false);
  }

  async function fetchApiKeys() {
    setApiKeysLoading(true);
    const res = await getApiKeysAction();
    if (res.success) setApiKeys(res.data || []);
    setApiKeysLoading(false);
  }

  useEffect(() => {
    if (activeTab === "Deploy") fetchApiKeys();
  }, [activeTab]);

  useEffect(() => {
    if (activeTab === "Knowledge") fetchAllKBs();
  }, [activeTab]);

  // ── Actions ──

  async function handleSave(advance?: boolean) {
    if (!currentAgent) return;
    if (!currentAgent.name?.trim()) {
      toast("Please enter an agent name.", "error");
      return;
    }

    setSaveLoading(true);

    if (isDraft) {
      const result = await createAgentAction({
        name: currentAgent.name.trim(),
        description: currentAgent.description || "",
        systemPrompt: currentAgent.system_prompt || "You are a helpful assistant.",
        settings: agentSettings(),
      });
      if (result.success && result.data) {
        toast("Agent created!", "success");
        const created = result.data;
        setCurrentAgent(created);
        setAgents([created]);
        fetchWidget(created.id);
        fetchAllKBs();
        if (advance) {
          const tabIdx = TABS.indexOf(activeTab);
          if (tabIdx < TABS.length - 1) setActiveTab(TABS[tabIdx + 1]);
        }
      } else {
        toast(result.error || "Failed to create agent", "error");
      }
    } else {
      const result = await updateAgentAction(currentAgent.id, {
        name: currentAgent.name,
        description: currentAgent.description,
        system_prompt: currentAgent.system_prompt,
        settings: agentSettings(),
      });
      if (result.success) {
        toast("Agent saved", "success");
        const idx = agents.findIndex((a: any) => a.id === currentAgent.id);
        if (idx >= 0) {
          const updated = [...agents];
          updated[idx] = { ...currentAgent, ...result.data };
          setAgents(updated);
        }
        if (advance) {
          const tabIdx = TABS.indexOf(activeTab);
          if (tabIdx < TABS.length - 1) setActiveTab(TABS[tabIdx + 1]);
        }
      } else {
        toast(result.error || "Failed to save agent", "error");
      }
    }
    setSaveLoading(false);
  }

  async function handleWidgetSave() {
    if (!widget || !currentAgent?.id) return;
    setWidgetSaveLoading(true);
    const res = await updateWidgetAction(currentAgent.id, {
      brand_color: widget.brand_color,
      greeting: widget.greeting,
      position: widget.position,
      theme: widget.theme || {},
    });
    if (res.success) {
      toast("Widget saved", "success");
    } else {
      toast(res.error || "Failed to save widget", "error");
    }
    setWidgetSaveLoading(false);
  }

  async function handlePublish() {
    if (!currentAgent?.id) return;
    setPublishLoading(true);
    const res = await publishAgentAction(currentAgent.id);
    if (res.success) {
      toast("Agent published!", "success");
      setCurrentAgent({ ...currentAgent, status: "published" });
      const idx = agents.findIndex((a) => a.id === currentAgent.id);
      if (idx >= 0) {
        const updated = [...agents];
        updated[idx] = { ...updated[idx], status: "published" };
        setAgents(updated);
      }
    } else {
      toast(res.error || "Failed to publish agent", "error");
    }
    setPublishLoading(false);
  }

  function openDeleteModal() {
    if (!currentAgent?.id) return;
    setDeleteConfirmName("");
    setDeleteModalOpen(true);
  }

  function closeDeleteModal() {
    if (deleteLoading) return;
    setDeleteModalOpen(false);
    setDeleteConfirmName("");
  }

  async function handleDeleteAgent() {
    if (!currentAgent?.id || deleteConfirmName !== currentAgent.name) return;

    setDeleteLoading(true);
    const agentId = currentAgent.id;
    const res = await deleteAgentAction(agentId);

    if (res.success) {
      toast("Agent deleted", "success");
      const remainingAgents = agents.filter((agent) => agent.id !== agentId);
      setAgents(remainingAgents);
      setCurrentAgent(
        remainingAgents[0] || {
          name: "",
          description: "",
          system_prompt: "",
          settings: { ...DEFAULT_SETTINGS },
        }
      );
      setWidget(null);
      setAllKBs([]);
      setPreviewMessages([]);
      setActiveTab("Basic Info");
      setDeleteModalOpen(false);
      setDeleteConfirmName("");
    } else {
      toast(res.error || "Failed to delete agent", "error");
    }

    setDeleteLoading(false);
  }

  async function handleCreateKey() {
    if (!newKeyName.trim()) return;
    setKeyCreateLoading(true);
    const res = await createApiKeyAction(newKeyName);
    if (res.success) {
      setGeneratedKey(res.data.key);
      setNewKeyName("");
      fetchApiKeys();
    } else {
      toast(res.error || "Failed to create key", "error");
    }
    setKeyCreateLoading(false);
  }

  async function handleRevokeApiKey() {
    if (!revokeKeyTarget?.id) return;

    setRevokeKeyLoading(true);
    const res = await revokeApiKeyAction(revokeKeyTarget.id);
    if (res.success) {
      toast("API key revoked", "success");
      setApiKeys((prev) => prev.filter((key) => key.id !== revokeKeyTarget.id));
      setRevokeKeyTarget(null);
    } else {
      toast(res.error || "Failed to revoke API key", "error");
    }
    setRevokeKeyLoading(false);
  }

  function copyToClipboard(text: string) {
    navigator.clipboard.writeText(text);
    toast("Copied to clipboard!", "success");
  }

  // ── Preview Chat ──

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [previewMessages, isTyping]);

  async function handlePreviewSend() {
    if (!previewInput.trim()) return;
    if (!currentAgent?.id) {
      toast("Create your agent first by filling in the details and clicking Create & Next.", "error");
      return;
    }
    const userMsg = previewInput.trim();
    setPreviewInput("");
    setPreviewMessages((prev) => [...prev, { from: "user", text: userMsg }]);
    setIsTyping(true);

    const result = await previewChatAction(currentAgent.id, userMsg);
    setIsTyping(false);
    if (result.success && result.data) {
      setPreviewMessages((prev) => [...prev, { from: "bot", text: result.data.answer }]);
    } else {
      setPreviewMessages((prev) => [...prev, { from: "bot", text: "Error: Could not get a response." }]);
    }
  }

  // ── Computed ──

  const brandColor = widget?.brand_color || "#f43f5e";
  const isPublished = currentAgent?.status === "published";
  const hasApiKey = apiKeys.length > 0;
  const hasKBs = allKBs.length > 0;
  const isLastTab = activeTab === TABS[TABS.length - 1];

  function getValidationIssue(): string | null {
    if (!currentAgent) return "Loading...";
    if (!currentAgent.name?.trim()) return "Enter an agent name to continue.";
    return null;
  }
  const validationIssue = getValidationIssue();
  const canSave = !validationIssue && !saveLoading;
  const canDeleteAgent = !!currentAgent?.id && deleteConfirmName === currentAgent.name && !deleteLoading;

  const embedSnippet = `<script
  src="${WIDGET_SCRIPT_URL}"
  data-key="YOUR_API_KEY"
  data-agent="${currentAgent?.id || "YOUR_AGENT_ID"}"
  data-api-url="${WIDGET_API_URL}"
  async
></script>`;

  // ── Render ──

  return (
    <div className="flex flex-col xl:flex-row h-full min-h-[calc(100vh-10rem)] bg-white dark:bg-[#0d1425]/40 backdrop-blur-md border border-slate-200 dark:border-white/5 rounded-2xl xl:rounded-3xl overflow-hidden shadow-sm">

      {/* ── Left Column: Chatbot List ── */}
      <section className="w-full xl:w-60 2xl:w-80 xl:border-r border-b xl:border-b-0 border-slate-200 dark:border-white/5 p-4 xl:p-4 2xl:p-6 flex flex-col gap-4 2xl:gap-6 bg-slate-50/30 dark:bg-transparent overflow-y-auto scrollbar-hide shrink-0 z-10">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white font-cabinet">My Chatbots</h3>
        </div>

        <div className="space-y-3">
          {loading ? (
            <div className="flex justify-center p-8">
              <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
            </div>
          ) : agents.length === 0 ? (
            <div className="p-4 rounded-2xl border-2 border-dashed border-rose-300 dark:border-rose-500/30 bg-rose-50/50 dark:bg-rose-500/5 text-center">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-500 to-pink-500 text-white flex items-center justify-center mx-auto mb-2">
                <Bot className="w-5 h-5" />
              </div>
              <p className="text-sm font-bold text-slate-700 dark:text-slate-300">New Agent</p>
              <p className="text-[10px] text-rose-500 font-bold uppercase tracking-widest mt-0.5">Draft -- fill details & save</p>
            </div>
          ) : (
            agents.map((agent) => (
              <div
                key={agent.id}
                onClick={() => setCurrentAgent(agent)}
                className={cn(
                  "p-4 rounded-2xl bg-white dark:bg-white/3 border flex items-center justify-between cursor-pointer transition-all",
                  currentAgent?.id === agent.id
                    ? "border-2 border-rose-500 shadow-lg shadow-rose-100 dark:shadow-[0_0_20px_rgba(244,63,94,0.15)]"
                    : "border-slate-200 dark:border-transparent opacity-80 hover:opacity-100 hover:border-slate-300 dark:hover:border-white/10"
                )}
              >
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
                    currentAgent?.id === agent.id ? "bg-linear-to-tr from-rose-500 to-pink-500 text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400"
                  )}>
                    <Bot className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <p className={cn("text-sm font-bold truncate", currentAgent?.id === agent.id ? "text-slate-900 dark:text-white" : "text-slate-700 dark:text-slate-300")}>
                      {agent.name}
                    </p>
                    <p className={cn("text-[10px] font-bold uppercase tracking-tighter mt-0.5", agent.status === "published" ? "text-green-500" : "text-slate-400")}>
                      {agent.status}
                    </p>
                  </div>
                </div>
                <ChevronRight className={cn("w-4 h-4", currentAgent?.id === agent.id ? "text-rose-500" : "text-slate-300 dark:text-slate-600")} />
              </div>
            ))
          )}
        </div>

        <div className="mt-auto pt-8">
          <div className="bg-white dark:bg-rose-500/5 p-5 rounded-2xl border border-slate-200 dark:border-rose-500/20 relative overflow-hidden flex flex-col gap-4 text-center">
            <div className="absolute -right-4 -top-4 w-16 h-16 bg-rose-500/10 rounded-full blur-xl hidden dark:block" />
            <div className="w-12 h-12 rounded-xl bg-slate-50 dark:bg-transparent flex items-center justify-center mx-auto border border-slate-100 dark:border-transparent">
              <Sparkles className="w-6 h-6 text-rose-500" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-1">Auto-Optimize Agent</h4>
              <p className="text-xs text-slate-500 leading-relaxed">Let our AI analyze your recent conversation history to improve accuracy.</p>
            </div>
            <button className="w-full py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-bold text-[10px] uppercase tracking-widest hover:bg-slate-800 dark:hover:bg-rose-500 hover:text-white transition-all cursor-pointer">
              Run Optimizer
            </button>
          </div>
        </div>
      </section>

      {/* ── Main Content + Phone Preview ── */}
      <section className="flex-1 flex relative overflow-hidden bg-white/50 dark:bg-transparent">

        {/* Left: Tab content */}
        <div className="flex-1 flex flex-col overflow-hidden min-w-0">
          <div className="flex-1 overflow-y-auto scrollbar-hide p-4 lg:p-5 2xl:p-8 space-y-5 2xl:space-y-8">

            {/* Hero Card */}
            <div className="bg-white dark:bg-white/[0.03] border border-slate-200 dark:border-white/5 p-4 2xl:p-6 rounded-2xl flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4 2xl:gap-6 shadow-sm relative z-20">
              <div className="flex items-center gap-3 2xl:gap-5 w-full xl:w-auto">
                <div className="w-11 h-11 2xl:w-16 2xl:h-16 rounded-xl bg-linear-to-tr from-rose-500 to-pink-500 flex items-center justify-center shadow-lg 2xl:shadow-xl shadow-rose-200 dark:shadow-rose-500/30 ring-2 2xl:ring-4 ring-white dark:ring-white/5 shrink-0">
                  <Bot className="w-5 h-5 2xl:w-8 2xl:h-8 text-white" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">{currentAgent?.name || (isDraft ? "New Agent" : "Select an Agent")}</h3>
                    {isDraft && (
                      <span className="px-2 py-0.5 rounded-md bg-amber-100 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 text-[10px] font-bold uppercase tracking-widest hidden sm:block">Draft</span>
                    )}
                    {isPublished && (
                      <span className="px-2 py-0.5 rounded-md bg-green-100 dark:bg-green-500/10 text-green-600 dark:text-green-500 text-[10px] font-bold uppercase tracking-widest hidden sm:block">Live</span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500">
                    {isDraft ? "Fill in the details below and click Save & Next" : `Created on ${currentAgent ? new Date(currentAgent.created_at).toLocaleDateString() : "N/A"}`}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 w-full xl:w-auto">
                <button
                  onClick={() => setShowPreview(true)}
                  disabled={!currentAgent?.id}
                  className="px-5 py-2.5 bg-white dark:bg-white/5 text-slate-700 dark:text-white border border-slate-200 dark:border-white/10 rounded-xl font-bold text-sm hover:bg-slate-50 dark:hover:bg-white/10 hover:scale-105 transition-all cursor-pointer shrink-0 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 xl:hidden"
                >
                  <Eye className="w-4 h-4" /> Test Agent
                </button>
                <button
                  onClick={openDeleteModal}
                  disabled={!currentAgent?.id || deleteLoading}
                  className="px-4 py-2.5 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 border border-red-100 dark:border-red-500/20 rounded-xl font-bold text-sm hover:bg-red-100 dark:hover:bg-red-500/15 transition-all cursor-pointer shrink-0 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  <span className="hidden sm:inline">Delete</span>
                </button>
                <button
                  onClick={() => handleSave(false)}
                  disabled={!canSave}
                  className="px-5 py-2.5 bg-slate-900 dark:bg-rose-500 text-white rounded-xl font-bold text-sm shadow-lg shadow-slate-200 dark:shadow-rose-500/20 hover:bg-slate-800 dark:hover:bg-rose-600 hover:scale-105 transition-all cursor-pointer shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saveLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : isDraft ? "Create Agent" : "Save"}
                </button>
              </div>
            </div>

            {/* Tab Navigation */}
            <div className="flex border-b border-slate-200 dark:border-white/5 px-4 overflow-x-auto whitespace-nowrap scrollbar-hide">
              {TABS.map((tab, idx) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={cn(
                    "px-4 py-3 text-sm font-bold transition-colors cursor-pointer relative flex items-center gap-2",
                    activeTab === tab
                      ? "text-rose-500"
                      : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                  )}
                >
                  <span className={cn(
                    "w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center",
                    activeTab === tab ? "bg-rose-500 text-white" : "bg-slate-200 dark:bg-white/10 text-slate-500 dark:text-slate-400"
                  )}>
                    {idx + 1}
                  </span>
                  {tab}
                  {activeTab === tab && (
                    <div className="absolute bottom-[-1px] left-0 right-0 h-[2px] bg-rose-500" />
                  )}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="p-4 sm:p-6 space-y-8 animate-fade-in">

              {/* ─── Basic Info Tab ─── */}
              {activeTab === "Basic Info" && (
                <div className="space-y-8">
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Assistant Name</label>
                      <input
                        type="text"
                        value={currentAgent?.name || ""}
                        onChange={(e) => setCurrentAgent({ ...currentAgent, name: e.target.value })}
                        placeholder="e.g. Bolchat AI"
                        className="w-full h-10 px-4 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-sm text-slate-900 dark:text-white focus:border-rose-500 focus:ring-4 focus:ring-rose-50 dark:focus:ring-rose-500/10 transition-all outline-none"
                      />
                      <p className="text-[10px] text-slate-400 ml-1">This name appears in the chat widget header.</p>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Primary Language</label>
                        <LanguageSelect
                          value={agentSettings().language || "en"}
                          onChange={(val) => updateSettings({ language: val })}
                        />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Description / Tagline</label>
                    <textarea
                      rows={2}
                      value={currentAgent?.description || ""}
                      onChange={(e) => setCurrentAgent({ ...currentAgent, description: e.target.value })}
                      placeholder="A short description of what this agent does"
                      className="w-full p-4 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-sm text-slate-900 dark:text-white focus:border-rose-500 focus:ring-4 focus:ring-rose-50 dark:focus:ring-rose-500/10 transition-all outline-none resize-none leading-relaxed"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">System Prompt</label>
                    <textarea
                      rows={5}
                      value={currentAgent?.system_prompt || ""}
                      onChange={(e) => setCurrentAgent({ ...currentAgent, system_prompt: e.target.value })}
                      placeholder="Define your agent's personality and behavior. e.g. 'You are a friendly customer support agent for a SaaS company...'"
                      className="w-full p-4 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-sm text-slate-900 dark:text-white focus:border-rose-500 focus:ring-4 focus:ring-rose-50 dark:focus:ring-rose-500/10 transition-all outline-none resize-none leading-relaxed font-mono text-[13px]"
                    />
                    <p className="text-[10px] text-slate-400 ml-1">This prompt shapes how your agent responds. If left empty, a sensible default is used.</p>
                  </div>

                  {/* Response Tuning */}
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-4">Response Tuning</h4>
                    <div className="grid md:grid-cols-2 gap-x-12 gap-y-6">
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Temperature</label>
                          <span className="text-sm font-bold text-rose-500">{(agentSettings().temperature ?? 0.4).toFixed(2)}</span>
                        </div>
                        <input
                          type="range" min="0" max="1" step="0.05"
                          value={agentSettings().temperature ?? 0.4}
                          onChange={(e) => updateSettings({ temperature: Number(e.target.value) })}
                          className="w-full h-2 bg-slate-100 dark:bg-white/10 rounded-lg appearance-none cursor-pointer accent-rose-500"
                        />
                        <div className="flex justify-between">
                          <span className="text-[10px] text-slate-400">Precise</span>
                          <span className="text-[10px] text-slate-400">Creative</span>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Max Tokens</label>
                          <span className="text-sm font-bold text-rose-500">{agentSettings().max_tokens}</span>
                        </div>
                        <input
                          type="range" min="100" max="4096" step="50"
                          value={agentSettings().max_tokens}
                          onChange={(e) => updateSettings({ max_tokens: Number(e.target.value) })}
                          className="w-full h-2 bg-slate-100 dark:bg-white/10 rounded-lg appearance-none cursor-pointer accent-rose-500"
                        />
                        <div className="flex justify-between">
                          <span className="text-[10px] text-slate-400">Short</span>
                          <span className="text-[10px] text-slate-400">Detailed</span>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Confidence Threshold</label>
                          <span className="text-sm font-bold text-rose-500">{agentSettings().confidence_threshold}%</span>
                        </div>
                        <input
                          type="range" min="0" max="100"
                          value={agentSettings().confidence_threshold}
                          onChange={(e) => updateSettings({ confidence_threshold: Number(e.target.value) })}
                          className="w-full h-2 bg-slate-100 dark:bg-white/10 rounded-lg appearance-none cursor-pointer accent-rose-500"
                        />
                        <div className="flex justify-between">
                          <span className="text-[10px] text-slate-400">Loose</span>
                          <span className="text-[10px] text-slate-400">Strict</span>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">RAG Top-K Results</label>
                          <span className="text-sm font-bold text-rose-500">{agentSettings().top_k ?? 5}</span>
                        </div>
                        <input
                          type="range" min="1" max="20"
                          value={agentSettings().top_k ?? 5}
                          onChange={(e) => updateSettings({ top_k: Number(e.target.value) })}
                          className="w-full h-2 bg-slate-100 dark:bg-white/10 rounded-lg appearance-none cursor-pointer accent-rose-500"
                        />
                        <div className="flex justify-between">
                          <span className="text-[10px] text-slate-400">Focused (1)</span>
                          <span className="text-[10px] text-slate-400">Broad (20)</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-500/5 border border-rose-100 dark:border-rose-500/20 flex items-start gap-4">
                    <Info className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                    <div>
                      <h5 className="text-sm font-bold text-rose-900 dark:text-white">Tip</h5>
                      <p className="text-xs text-rose-700 dark:text-slate-400 mt-0.5 leading-relaxed">
                        The system prompt is the most powerful knob. Use it to control tone, language, and which topics the agent handles.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* ─── Knowledge Tab ─── */}
              {activeTab === "Knowledge" && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">Knowledge Base</h3>
                    <p className="text-sm text-slate-500">Your agent automatically searches all uploaded documents in your organization when answering questions.</p>
                  </div>

                  <div className="p-4 rounded-xl bg-green-50 dark:bg-green-500/5 border border-green-200 dark:border-green-500/20 flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
                    <div>
                      <p className="text-sm font-bold text-green-800 dark:text-green-300">Auto-connected</p>
                      <p className="text-xs text-green-700 dark:text-green-400 mt-0.5">All your uploaded documents are automatically available to this agent. No manual linking required.</p>
                    </div>
                  </div>

                  {kbLoading ? (
                    <div className="py-8 flex justify-center"><Loader2 className="w-6 h-6 animate-spin text-slate-400" /></div>
                  ) : allKBs.length === 0 ? (
                    <div className="py-10 text-center border border-dashed border-slate-200 dark:border-white/10 rounded-2xl">
                      <Database className="w-8 h-8 mx-auto text-slate-300 dark:text-slate-600 mb-3" />
                      <p className="text-sm font-medium text-slate-600 dark:text-slate-400">No documents uploaded yet</p>
                      <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto leading-relaxed">
                        Go to the <strong>Knowledge</strong> page in the sidebar to create a knowledge base and upload your documents.
                      </p>
                    </div>
                  ) : (
                    <>
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Your Document Collections</h4>
                      <div className="space-y-3">
                        {allKBs.map((kb: any) => {
                          const docCount = kb.doc_count ?? 0;
                          return (
                            <div key={kb.id} className="p-4 rounded-xl bg-white dark:bg-white/3 border border-slate-200 dark:border-white/5 flex items-center gap-4">
                              <div className="w-10 h-10 rounded-xl bg-green-100 dark:bg-green-500/20 text-green-600 dark:text-green-400 flex items-center justify-center shrink-0">
                                <Database className="w-5 h-5" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{kb.name}</p>
                                <p className="text-[10px] text-slate-400 mt-0.5">
                                  {docCount} {docCount === 1 ? "document" : "documents"} indexed
                                </p>
                              </div>
                              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-50 dark:bg-green-500/10">
                                <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
                                <span className="text-[10px] font-bold text-green-600 dark:text-green-400 uppercase tracking-widest">Active</span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </>
                  )}

                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-white/3 border border-slate-100 dark:border-white/5 flex items-start gap-4">
                    <Info className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
                    <div>
                      <h5 className="text-sm font-bold text-slate-700 dark:text-slate-300">How it works</h5>
                      <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                        When a user asks a question, your agent searches through all your uploaded documents to find the most relevant information. Upload more documents on the <strong>Knowledge</strong> page to expand what your agent knows.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* ─── Widget Tab ─── */}
              {activeTab === "Widget" && (
                <div className="space-y-8">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">Widget Customization</h3>
                    <p className="text-sm text-slate-500">Design how your chat widget looks and behaves on your website.</p>
                  </div>

                  {widgetLoading ? (
                    <div className="py-12 flex justify-center"><Loader2 className="w-6 h-6 animate-spin text-slate-400" /></div>
                  ) : (
                    <div className="space-y-6">
                      {/* Brand Color */}
                      <div className="space-y-2">
                        <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Brand Color</label>
                        <div className="flex gap-4 items-center">
                          <input
                            type="color"
                            value={widget?.brand_color || "#f43f5e"}
                            onChange={(e) => setWidget({ ...widget, brand_color: e.target.value })}
                            className="w-12 h-12 rounded-xl bg-transparent border-0 outline-none cursor-pointer p-0"
                          />
                          <input
                            type="text"
                            value={widget?.brand_color || "#f43f5e"}
                            onChange={(e) => setWidget({ ...widget, brand_color: e.target.value })}
                            className="flex-1 h-12 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 text-sm font-mono dark:text-white outline-none focus:ring-2 focus:ring-rose-500/20"
                          />
                        </div>
                      </div>

                      {/* Welcome Message */}
                      <div className="space-y-2">
                        <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Welcome Message</label>
                        <textarea
                          value={widget?.greeting || ""}
                          onChange={(e) => setWidget({ ...widget, greeting: e.target.value })}
                          placeholder="e.g. Hi! How can we help you today?"
                          className="w-full h-24 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl px-4 py-3 text-sm dark:text-white resize-none outline-none focus:ring-2 focus:ring-rose-500/20"
                        />
                      </div>

                      {/* Launcher Icon */}
                      <div className="space-y-2">
                        <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Launcher Icon</label>
                        <div className="grid grid-cols-5 gap-2">
                          {LAUNCHER_ICONS.map(({ id, label, Icon }) => (
                            <button
                              key={id}
                              onClick={() => setWidget({ ...widget, theme: { ...getWidgetTheme(widget), launcher_icon: id } })}
                              className={cn(
                                "flex flex-col items-center gap-1.5 py-3 rounded-xl border transition-all cursor-pointer",
                                getWidgetTheme(widget).launcher_icon === id
                                  ? "border-rose-500 bg-rose-50 dark:bg-rose-500/10"
                                  : "border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20"
                              )}
                            >
                              <div
                                className="w-9 h-9 rounded-full flex items-center justify-center"
                                style={{ background: getWidgetTheme(widget).launcher_icon === id ? brandColor : "#e2e8f0" }}
                              >
                                <Icon className={cn("w-4 h-4", getWidgetTheme(widget).launcher_icon === id ? "text-white" : "text-slate-500")} />
                              </div>
                              <span className={cn("text-[9px] font-bold uppercase tracking-wider", getWidgetTheme(widget).launcher_icon === id ? "text-rose-500" : "text-slate-400")}>{label}</span>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Widget Position */}
                      <div className="space-y-2">
                        <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Widget Position</label>
                        <div className="flex gap-3">
                          {(["bottom_right", "bottom_left"] as const).map((pos) => (
                            <button
                              key={pos}
                              onClick={() => setWidget({ ...widget, position: pos })}
                              className={cn(
                                "flex-1 py-3 rounded-xl text-sm font-bold border transition-all cursor-pointer",
                                widget?.position === pos
                                  ? "border-rose-500 bg-rose-50 dark:bg-rose-500/10 text-rose-500"
                                  : "border-slate-200 dark:border-white/10 text-slate-500 hover:border-slate-300 dark:hover:border-white/20"
                              )}
                            >
                              {pos === "bottom_right" ? "Bottom Right" : "Bottom Left"}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Chat Panel Height */}
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Chat Panel Height</label>
                          <span className="text-sm font-bold text-rose-500">{getWidgetTheme(widget).chat_height}px</span>
                        </div>
                        <input
                          type="range" min="350" max="700" step="10"
                          value={getWidgetTheme(widget).chat_height}
                          onChange={(e) => setWidget({ ...widget, theme: { ...getWidgetTheme(widget), chat_height: Number(e.target.value) } })}
                          className="w-full h-2 bg-slate-100 dark:bg-white/10 rounded-lg appearance-none cursor-pointer accent-rose-500"
                        />
                        <div className="flex justify-between">
                          <span className="text-[10px] text-slate-400">Compact (350px)</span>
                          <span className="text-[10px] text-slate-400">Tall (700px)</span>
                        </div>
                      </div>

                      <div className="p-4 rounded-xl bg-slate-50 dark:bg-white/3 border border-slate-100 dark:border-white/5 flex items-start gap-3">
                        <Palette className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
                        <p className="text-xs text-slate-500 leading-relaxed">Changes are reflected in the widget preview on the right in real time. Click <strong>Save Widget</strong> to persist.</p>
                      </div>

                      <button
                        onClick={handleWidgetSave}
                        disabled={widgetSaveLoading}
                        className="w-full py-3.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-bold text-sm shadow-xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
                      >
                        {widgetSaveLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        Save Widget
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* ─── Deploy Tab ─── */}
              {activeTab === "Deploy" && (
                <div className="space-y-8">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">Deploy Your Agent</h3>
                    <p className="text-sm text-slate-500">Publish your agent and embed it on your website.</p>
                  </div>

                  {/* Readiness Checklist */}
                  <div className="bg-white dark:bg-white/[0.03] border border-slate-200 dark:border-white/5 rounded-2xl p-6 space-y-4">
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">Deployment Checklist</h4>
                    <div className="space-y-3">
                      {[
                        { label: "Configure your agent (Basic Info)", done: !!currentAgent?.name?.trim() },
                        { label: "Upload documents (Knowledge page)", done: hasKBs },
                        { label: "Publish your agent", done: isPublished },
                        { label: "Create an API key", done: hasApiKey },
                      ].map((item) => (
                        <div key={item.label} className="flex items-center gap-3">
                          {item.done ? (
                            <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
                          ) : (
                            <Circle className="w-5 h-5 text-slate-300 dark:text-slate-600 shrink-0" />
                          )}
                          <span className={cn("text-sm", item.done ? "text-slate-900 dark:text-white" : "text-slate-400")}>{item.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Publish */}
                  <div className="bg-white dark:bg-white/[0.03] border border-slate-200 dark:border-white/5 rounded-2xl p-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white">Agent Status</h4>
                        <p className="text-xs text-slate-400 mt-0.5">{isPublished ? "Your agent is live and ready to serve users." : "Publish your agent to make it accessible via the widget."}</p>
                      </div>
                      <button
                        onClick={handlePublish}
                        disabled={publishLoading || isPublished}
                        className={cn(
                          "flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all",
                          isPublished
                            ? "bg-green-100 dark:bg-green-500/10 text-green-600 dark:text-green-400 cursor-default"
                            : "bg-rose-500 hover:bg-rose-600 text-white shadow-lg shadow-rose-500/20"
                        )}
                      >
                        {publishLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Rocket className="w-4 h-4" />}
                        {isPublished ? "Published" : "Publish Agent"}
                      </button>
                    </div>
                  </div>

                  {/* API Keys */}
                  <div className="bg-white dark:bg-white/[0.03] border border-slate-200 dark:border-white/5 rounded-2xl p-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white">Account API Keys</h4>
                        <p className="text-xs text-slate-400 mt-0.5">Keys belong to your account and can be used with any published agent in this workspace.</p>
                      </div>
                      <button
                        onClick={() => setShowKeyModal(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 rounded-xl text-sm font-bold text-slate-700 dark:text-white transition-all"
                      >
                        <Plus className="w-4 h-4" /> Create Key
                      </button>
                    </div>
                    <div className="rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 p-3 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                      Full API keys are shown only once when created. If you lose a key, revoke it and create a new one.
                    </div>
                    {apiKeysLoading ? (
                      <div className="py-6 flex justify-center"><Loader2 className="w-5 h-5 animate-spin text-slate-400" /></div>
                    ) : apiKeys.length === 0 ? (
                      <div className="py-6 text-center text-xs text-slate-400 border border-dashed border-slate-200 dark:border-white/10 rounded-xl">
                        No API keys yet. Create one to use the embed script.
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {apiKeys.map((key: any) => (
                          <div key={key.id} className="p-3 bg-slate-50 dark:bg-white/5 rounded-xl flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <Key className="w-4 h-4 text-slate-400" />
                              <span className="text-sm font-bold text-slate-900 dark:text-white">{key.name}</span>
                            </div>
                            <div className="text-right">
                              <span className="text-xs text-slate-400 font-mono">{key.prefix}........</span>
                              <p className="text-[10px] text-slate-400 mt-0.5">Full key hidden after creation</p>
                            </div>
                            <button
                              onClick={() => setRevokeKeyTarget(key)}
                              className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                              title="Revoke API key"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Embed Script */}
                  <div className="bg-slate-900 dark:bg-white/5 border border-white/10 shadow-xl rounded-2xl p-6 overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-rose-500/10 blur-[100px] rounded-full" />
                    <div className="relative z-10">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-rose-500/20 rounded-xl flex items-center justify-center text-rose-500">
                          <Code className="w-5 h-5" />
                        </div>
                        <h4 className="text-lg font-bold text-white font-cabinet">Embed Script</h4>
                      </div>
                      <p className="text-slate-400 text-sm mb-4">
                        Copy this script into the <code className="text-rose-300">&lt;head&gt;</code> or before <code className="text-rose-300">&lt;/body&gt;</code> of your website.
                      </p>
                      <div className="bg-black/40 border border-white/5 rounded-xl p-5 relative group">
                        <pre className="text-xs text-rose-300 font-mono overflow-x-auto whitespace-pre-wrap">{embedSnippet}</pre>
                        <button
                          onClick={() => copyToClipboard(embedSnippet)}
                          className="absolute top-3 right-3 p-2 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-all opacity-0 group-hover:opacity-100"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                      </div>
                      {!hasApiKey ? (
                        <p className="text-xs text-amber-400 mt-3">Create an API key above to get a working embed snippet.</p>
                      ) : (
                        <p className="text-xs text-green-400 mt-3">Replace <code className="text-rose-300">YOUR_API_KEY</code> with the full key from the Generate Key modal (starts with <code className="text-rose-300">bc_live_</code>).</p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* ─── Save & Next / Save footer ─── */}
              <div className="flex items-center justify-between pt-6 border-t border-slate-100 dark:border-white/5 gap-4">
                {validationIssue ? (
                  <p className="text-xs text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
                    <Info className="w-3.5 h-3.5 shrink-0" /> {validationIssue}
                  </p>
                ) : <span />}
                <div className="flex gap-3 shrink-0">
                  {!isLastTab ? (
                    <button
                      onClick={() => handleSave(true)}
                      disabled={!canSave}
                      className="flex items-center gap-2 px-6 py-2.5 bg-rose-500 text-white rounded-xl font-bold text-sm shadow-xl shadow-rose-200 dark:shadow-rose-500/20 hover:scale-[1.02] active:scale-95 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {saveLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <>{isDraft ? "Create & Next" : "Save & Next"} <ArrowRight className="w-4 h-4" /></>}
                    </button>
                  ) : (
                    <button
                      onClick={() => handleSave(false)}
                      disabled={!canSave}
                      className="px-6 py-2.5 bg-rose-500 text-white rounded-xl font-bold text-sm shadow-xl shadow-rose-200 dark:shadow-rose-500/20 hover:scale-[1.02] active:scale-95 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {saveLoading ? "Saving..." : "Save"}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Floating Preview Button -- visible only below xl */}
          <div className="xl:hidden absolute bottom-6 right-6 z-50">
            <button
              onClick={() => setShowPreview(true)}
              className="w-12 h-12 lg:w-14 lg:h-14 rounded-full bg-slate-900 dark:bg-slate-800 dark:border dark:border-slate-700 text-white shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all group relative cursor-pointer"
            >
              <Eye className="w-5 h-5 lg:w-6 lg:h-6" />
              <div className="absolute top-1/2 -translate-y-1/2 right-14 lg:right-16 px-3 py-1.5 rounded-lg bg-slate-900 dark:bg-slate-800 text-white text-[10px] font-bold uppercase tracking-widest whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                Preview Bot
              </div>
            </button>
          </div>
        </div>{/* close left tab-content column */}

        {/* ── Right: Website-style Widget Preview (xl+ only) ── */}
        <div className="hidden xl:flex w-[300px] 2xl:w-[420px] shrink-0 border-l border-slate-200 dark:border-white/5 flex-col bg-slate-50/50 dark:bg-[#0a0f1e]/50 overflow-hidden">
          <div className="px-3 py-2 border-b border-slate-200 dark:border-white/10 flex items-center justify-between">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Widget Preview</p>
            <button onClick={() => resetPreview()} className="text-[10px] text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 flex items-center gap-1 transition-colors" title="Reset chat">
              <RotateCcw className="w-3 h-3" /> Reset
            </button>
          </div>

          {!currentAgent?.id ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center gap-3 p-6">
              <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-white/5 flex items-center justify-center">
                <Bot className="w-8 h-8 text-slate-300 dark:text-slate-600" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-400 dark:text-slate-500">{isDraft ? "Save Your Agent First" : "No Agent Selected"}</p>
                <p className="text-xs text-slate-400 dark:text-slate-600 mt-1">{isDraft ? "Fill in the details and click Create & Next to start chatting." : "Select an agent to preview."}</p>
              </div>
            </div>
          ) : (
            <div className="flex-1 relative overflow-hidden">
              {/* Fake website background */}
              <div className="absolute inset-0 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-[#111827] dark:to-[#0f172a]">
                {/* Fake browser chrome */}
                <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-3 py-1.5 flex items-center gap-2">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 rounded-full bg-red-400" />
                    <div className="w-2 h-2 rounded-full bg-yellow-400" />
                    <div className="w-2 h-2 rounded-full bg-green-400" />
                  </div>
                  <div className="flex-1 h-5 bg-slate-100 dark:bg-slate-700 rounded text-[8px] text-slate-400 flex items-center px-2 font-mono">yourwebsite.com</div>
                </div>
                {/* Fake page content lines */}
                <div className="p-4 space-y-3 opacity-40">
                  <div className="h-6 w-2/3 bg-slate-300 dark:bg-slate-600 rounded" />
                  <div className="h-3 w-full bg-slate-200 dark:bg-slate-700 rounded" />
                  <div className="h-3 w-5/6 bg-slate-200 dark:bg-slate-700 rounded" />
                  <div className="h-3 w-4/6 bg-slate-200 dark:bg-slate-700 rounded" />
                  <div className="h-20 w-full bg-slate-200 dark:bg-slate-700 rounded mt-4" />
                  <div className="h-3 w-full bg-slate-200 dark:bg-slate-700 rounded" />
                  <div className="h-3 w-3/4 bg-slate-200 dark:bg-slate-700 rounded" />
                </div>
              </div>

              {/* Widget chat panel (positioned like real widget) */}
              <div className={cn(
                "absolute bottom-14 w-[250px] 2xl:w-[320px] flex flex-col rounded-2xl overflow-hidden shadow-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0d1425] z-10",
                widget?.position === "bottom_left" ? "left-3" : "right-3"
              )} style={{ height: `min(${getWidgetTheme(widget).chat_height}px, calc(100% - 80px))` }}>
                {/* Widget header */}
                <div className="px-3 py-2.5 flex items-center gap-2 shrink-0" style={{ background: `linear-gradient(135deg, ${brandColor}, ${brandColor}cc)` }}>
                  <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center">
                    <Bot className="w-3.5 h-3.5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-white text-xs truncate">{currentAgent?.name || "Assistant"}</p>
                    <div className="flex items-center gap-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                      <p className="text-[7px] text-white/70 font-medium uppercase tracking-widest">Online</p>
                    </div>
                  </div>
                  <div className="w-5 h-5 rounded bg-white/20 flex items-center justify-center">
                    <X className="w-3 h-3 text-white" />
                  </div>
                </div>

                {/* Messages area */}
                <div className="flex-1 overflow-y-auto p-2.5 space-y-2.5 min-h-0 scrollbar-hide">
                  {previewMessages.map((msg, i) => (
                    <div key={i} className={cn("flex gap-1.5", msg.from === "user" && "flex-row-reverse")}>
                      {msg.from === "bot" ? (
                        <div className="w-5 h-5 rounded-full shrink-0 mt-0.5 flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${brandColor}, ${brandColor}cc)` }}>
                          <Bot className="w-2.5 h-2.5 text-white" />
                        </div>
                      ) : (
                        <div className="w-5 h-5 rounded-full bg-slate-200 dark:bg-slate-700 shrink-0 mt-0.5 flex items-center justify-center text-[7px] font-bold text-slate-500 dark:text-slate-300">U</div>
                      )}
                      <div
                        className={cn(
                          "max-w-[82%] px-2.5 py-1.5 text-[11px] leading-relaxed",
                          msg.from === "bot"
                            ? "bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-slate-200 rounded-xl rounded-tl-none border border-slate-100 dark:border-white/10"
                            : "text-white rounded-xl rounded-tr-none"
                        )}
                        style={msg.from === "user" ? { background: `linear-gradient(135deg, ${brandColor}, ${brandColor}cc)` } : undefined}
                      >
                        {msg.text}
                      </div>
                    </div>
                  ))}
                  {isTyping && (
                    <div className="flex gap-1.5">
                      <div className="w-5 h-5 rounded-full shrink-0 flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${brandColor}, ${brandColor}cc)` }}>
                        <Bot className="w-2.5 h-2.5 text-white" />
                      </div>
                      <div className="bg-slate-100 dark:bg-white/5 border border-slate-100 dark:border-white/10 rounded-xl rounded-tl-none px-2.5 py-1.5 flex items-center gap-1">
                        <span className="w-1 h-1 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: "0ms" }} />
                        <span className="w-1 h-1 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: "150ms" }} />
                        <span className="w-1 h-1 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: "300ms" }} />
                      </div>
                    </div>
                  )}
                  <div ref={chatEndRef} />
                </div>

                {/* Input */}
                <div className="border-t border-slate-100 dark:border-white/5 p-2 flex items-center gap-1.5 shrink-0">
                  <input
                    type="text"
                    value={previewInput}
                    onChange={(e) => setPreviewInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handlePreviewSend()}
                    disabled={isDraft}
                    placeholder={isDraft ? "Create agent first..." : "Type a message..."}
                    className="flex-1 h-7 px-2.5 rounded-lg bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-[11px] outline-none placeholder:text-slate-400 disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                  <button
                    onClick={handlePreviewSend}
                    disabled={isDraft}
                    className="w-7 h-7 shrink-0 rounded-lg text-white flex items-center justify-center hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ background: `linear-gradient(135deg, ${brandColor}, ${brandColor}cc)` }}
                  >
                    <Send className="w-3 h-3" />
                  </button>
                </div>

                {/* Powered by */}
                <div className="border-t border-slate-100 dark:border-white/5 py-1 flex justify-center shrink-0 bg-slate-50 dark:bg-white/[0.02]">
                  <p className="text-[8px] text-slate-400 dark:text-slate-500">Powered by <span className="font-bold">BolChat</span></p>
                </div>
              </div>

              {/* Launcher button (positioned like real widget) */}
              <div className={cn(
                "absolute bottom-3 z-10",
                widget?.position === "bottom_left" ? "left-3" : "right-3"
              )}>
                <div
                  className="w-11 h-11 rounded-full shadow-lg flex items-center justify-center cursor-pointer hover:scale-110 transition-transform"
                  style={{ background: `linear-gradient(135deg, ${brandColor}, ${brandColor}cc)` }}
                >
                  <LauncherIcon iconId={getWidgetTheme(widget).launcher_icon} className="w-5 h-5 text-white" />
                </div>
              </div>
            </div>
          )}
        </div>

      </section>

      {/* ── Bot Preview Overlay (small screens only) ── */}
      {showPreview && (
        <>
          <div
            className="fixed inset-0 z-60 bg-black/30 dark:bg-black/60 backdrop-blur-sm xl:hidden"
            onClick={() => setShowPreview(false)}
          />

          <div className="fixed bottom-6 right-6 z-70 w-[340px] max-w-[calc(100vw-2rem)] flex flex-col rounded-2xl overflow-hidden shadow-[0_32px_80px_rgba(0,0,0,0.3)] border border-white/10 xl:hidden" style={{ height: `min(${getWidgetTheme(widget).chat_height}px, calc(100vh - 5rem))` }}>
            <div className="p-4 flex items-center justify-between shrink-0" style={{ background: `linear-gradient(135deg, ${brandColor}, ${brandColor}dd)` }}>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
                  <LauncherIcon iconId={getWidgetTheme(widget).launcher_icon} className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-bold text-white text-sm">{currentAgent?.name || "Assistant"}</p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                    <p className="text-[10px] text-white/80 font-medium uppercase tracking-widest">Online</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => resetPreview()}
                  className="w-8 h-8 rounded-xl bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors cursor-pointer"
                  title="Clear conversation"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-white" />
                </button>
                <button
                  onClick={() => setShowPreview(false)}
                  className="w-8 h-8 rounded-xl bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4 text-white" />
                </button>
              </div>
            </div>

            <div className="bg-slate-50 dark:bg-[#0d1425] flex-1 p-4 space-y-4 overflow-y-auto min-h-0">
              {previewMessages.map((msg, i) => (
                <div key={i} className={cn("flex gap-3", msg.from === "user" && "flex-row-reverse")}>
                  {msg.from === "bot" ? (
                    <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5 shadow-sm" style={{ background: `linear-gradient(135deg, ${brandColor}, ${brandColor}dd)` }}>
                      <Bot className="w-3.5 h-3.5 text-white" />
                    </div>
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-slate-300 dark:bg-slate-700 flex items-center justify-center shrink-0 mt-0.5 text-[10px] font-bold text-slate-600 dark:text-slate-300">
                      U
                    </div>
                  )}
                  <div
                    className={cn(
                      "max-w-[75%] px-4 py-3 text-sm leading-relaxed shadow-sm",
                      msg.from === "bot"
                        ? "bg-white dark:bg-white/5 text-slate-700 dark:text-slate-200 rounded-2xl rounded-tl-none border border-slate-100 dark:border-white/10"
                        : "text-white rounded-2xl rounded-tr-none"
                    )}
                    style={msg.from === "user" ? { background: `linear-gradient(135deg, ${brandColor}, ${brandColor}dd)` } : undefined}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex gap-3">
                  <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 shadow-sm" style={{ background: `linear-gradient(135deg, ${brandColor}, ${brandColor}dd)` }}>
                    <Bot className="w-3.5 h-3.5 text-white" />
                  </div>
                  <div className="bg-white dark:bg-white/5 border border-slate-100 dark:border-white/10 rounded-2xl rounded-tl-none px-4 py-3 flex items-center gap-1.5 shadow-sm">
                    <span className="w-2 h-2 rounded-full bg-slate-400 dark:bg-slate-500 animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-2 h-2 rounded-full bg-slate-400 dark:bg-slate-500 animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-2 h-2 rounded-full bg-slate-400 dark:bg-slate-500 animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            <div className="bg-white dark:bg-[#0a0f1e] border-t border-slate-100 dark:border-white/5 p-3 flex items-center gap-3">
              <input
                type="text"
                value={previewInput}
                onChange={(e) => setPreviewInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handlePreviewSend()}
                disabled={isDraft}
                placeholder={isDraft ? "Create agent to start chatting..." : "Type a message..."}
                className="flex-1 h-10 px-4 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-sm outline-none focus:border-rose-400 transition-colors placeholder:text-slate-400 disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <button
                onClick={handlePreviewSend}
                disabled={isDraft}
                className="w-10 h-10 shrink-0 rounded-xl text-white flex items-center justify-center shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ background: `linear-gradient(135deg, ${brandColor}, ${brandColor}dd)` }}
              >
                <Send className="w-4 h-4 ml-0.5" />
              </button>
            </div>

            <div className="bg-slate-50 dark:bg-[#0a0f1e] border-t border-slate-100 dark:border-white/5 py-1.5 flex justify-center">
              <p className="text-[8px] text-slate-400 dark:text-slate-500">Powered by <span className="font-bold">BolChat</span></p>
            </div>
          </div>
        </>
      )}

      {/* Delete Agent Modal */}
      {deleteModalOpen && currentAgent?.id && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="w-full max-w-lg bg-white dark:bg-[#1a2135] rounded-[2rem] shadow-2xl overflow-hidden border border-slate-200 dark:border-white/10">
            <div className="p-8 space-y-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-xl bg-red-100 dark:bg-red-500/15 text-red-600 dark:text-red-400 flex items-center justify-center shrink-0">
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white font-cabinet">Delete agent</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                      This permanently deletes <strong className="text-slate-900 dark:text-white">{currentAgent.name}</strong>, its widget settings, and knowledge-base links. Existing embed scripts for this agent will stop working.
                    </p>
                  </div>
                </div>
                <button
                  onClick={closeDeleteModal}
                  disabled={deleteLoading}
                  className="text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors disabled:opacity-50"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="rounded-2xl border border-red-100 dark:border-red-500/20 bg-red-50 dark:bg-red-500/10 p-4">
                <p className="text-sm text-red-700 dark:text-red-300">
                  To confirm, type <strong>{currentAgent.name}</strong> below.
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Agent name</label>
                <input
                  type="text"
                  value={deleteConfirmName}
                  onChange={(e) => setDeleteConfirmName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && canDeleteAgent) handleDeleteAgent();
                  }}
                  autoFocus
                  disabled={deleteLoading}
                  placeholder={currentAgent.name}
                  className="w-full h-12 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 text-sm text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-400 disabled:opacity-50"
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  onClick={closeDeleteModal}
                  disabled={deleteLoading}
                  className="flex-1 h-11 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-700 dark:text-slate-300 rounded-xl text-sm font-bold transition-all disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteAgent}
                  disabled={!canDeleteAgent}
                  className="flex-1 h-11 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-bold shadow-lg shadow-red-600/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {deleteLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                  Delete agent
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Revoke API Key Modal */}
      {revokeKeyTarget && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="w-full max-w-md bg-white dark:bg-[#1a2135] rounded-[2rem] shadow-2xl overflow-hidden border border-slate-200 dark:border-white/10 p-8 space-y-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-xl bg-red-100 dark:bg-red-500/15 text-red-600 dark:text-red-400 flex items-center justify-center shrink-0">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white font-cabinet">Revoke API key</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                    This will immediately stop any widget using <strong className="text-slate-900 dark:text-white">{revokeKeyTarget.name}</strong>.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setRevokeKeyTarget(null)}
                disabled={revokeKeyLoading}
                className="text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors disabled:opacity-50"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 p-4">
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Prefix: <span className="font-mono">{revokeKeyTarget.prefix}........</span>. This action cannot be undone.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => setRevokeKeyTarget(null)}
                disabled={revokeKeyLoading}
                className="flex-1 h-11 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-700 dark:text-slate-300 rounded-xl text-sm font-bold transition-all disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleRevokeApiKey}
                disabled={revokeKeyLoading}
                className="flex-1 h-11 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-bold shadow-lg shadow-red-600/20 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {revokeKeyLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                Revoke key
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── API Key Modal ── */}
      {showKeyModal && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="w-full max-w-md bg-white dark:bg-[#1a2135] rounded-[2rem] shadow-2xl overflow-hidden border border-slate-200 dark:border-white/10 p-8 space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold dark:text-white font-cabinet">Generate Key</h3>
              <button onClick={() => { setShowKeyModal(false); setGeneratedKey(null); }} className="text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {!generatedKey ? (
              <div className="space-y-6">
                <div className="rounded-2xl border border-amber-100 dark:border-amber-500/20 bg-amber-50 dark:bg-amber-500/10 p-4">
                  <p className="text-xs text-amber-700 dark:text-amber-300 leading-relaxed">
                    You will see the full API key only once. Copy it before closing this window.
                  </p>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Key Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Production Widget"
                    value={newKeyName}
                    onChange={(e) => setNewKeyName(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleCreateKey()}
                    className="w-full h-12 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 text-sm dark:text-white outline-none focus:ring-2 focus:ring-rose-500/20"
                  />
                </div>
                <button
                  onClick={handleCreateKey}
                  disabled={keyCreateLoading}
                  className="w-full py-4 bg-rose-500 text-white rounded-2xl font-bold shadow-xl shadow-rose-500/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                  {keyCreateLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Generate API Key"}
                </button>
              </div>
            ) : (
              <div className="space-y-4 animate-in zoom-in-95 duration-300">
                <div className="p-4 bg-green-50 dark:bg-green-500/10 border border-green-100 dark:border-green-500/20 rounded-2xl flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                  <p className="text-xs font-bold text-green-700 dark:text-green-400">Key generated successfully!</p>
                </div>
                <p className="text-xs text-slate-500">Copy this key now. For security reasons, <strong>it will not be shown again.</strong></p>
                <div className="p-4 bg-slate-900 rounded-xl font-mono text-sm text-rose-300 break-all select-all flex justify-between items-center gap-4">
                  <span>{generatedKey}</span>
                  <button onClick={() => copyToClipboard(generatedKey)} className="shrink-0 text-white/40 hover:text-white transition-colors">
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl">
                  <p className="text-xs font-bold text-slate-700 dark:text-slate-200 mb-2">Use this key in your widget snippet</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    Existing keys are displayed only by prefix. If you close this window without copying the full key, create a new key.
                  </p>
                </div>
                <button
                  onClick={() => { setShowKeyModal(false); setGeneratedKey(null); }}
                  className="w-full py-3 bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-white rounded-xl font-bold text-sm"
                >
                  Got it
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
