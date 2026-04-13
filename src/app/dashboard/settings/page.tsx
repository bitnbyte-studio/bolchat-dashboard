"use client";

import { useState, useEffect } from "react";
import { 
  Key,
  CheckCircle2, Copy, Trash2, Plus, Loader2,
  Code
} from "lucide-react";
import { 
  getApiKeysAction, createApiKeyAction, revokeApiKeyAction,
} from "@/app/actions/settings";
import { cn } from "@/lib/utils";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { useToast } from "@/components/ui/toast";

const WIDGET_API_URL =
  process.env.NEXT_PUBLIC_WIDGET_API_URL ||
  "https://bolchat-backend-api-ggb9ghbnctddhufy.centralindia-01.azurewebsites.net";
const WIDGET_SCRIPT_URL = process.env.NEXT_PUBLIC_WIDGET_URL || `${WIDGET_API_URL}/static/widget.js`;

export default function SettingsPage() {
  const [apiKeys, setApiKeys] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [keyLoading, setKeyLoading] = useState(false);
  const [newKeyName, setNewKeyName] = useState("");
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [generatedKey, setGeneratedKey] = useState<string | null>(null);
  const [revokeTarget, setRevokeTarget] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    init();
  }, []);

  async function init() {
    setLoading(true);
    const keysRes = await getApiKeysAction();
    if (keysRes.success) setApiKeys(keysRes.data || []);
    setLoading(false);
  }

  async function handleCreateKey() {
    if (!newKeyName.trim()) return;
    setKeyLoading(true);
    const res = await createApiKeyAction(newKeyName);
    if (res.success) {
      setGeneratedKey(res.data.key); // This will show the full key once
      setNewKeyName("");
      init();
    }
    setKeyLoading(false);
  }

  async function handleRevokeKey(id: string) {
    const res = await revokeApiKeyAction(id);
    if (res.success) init();
    setRevokeTarget(null);
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast("Copied to clipboard!", "success");
  };

  const integrationSnippet = `<script
  src="${WIDGET_SCRIPT_URL}"
  data-key="YOUR_API_KEY"
  data-agent="YOUR_AGENT_ID"
  data-api-url="${WIDGET_API_URL}"
  async
></script>`;

  return (
    <div className="max-w-6xl mx-auto space-y-10 animate-fade-in pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 overflow-hidden">
        <div>
          <h2 className="text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-500 dark:from-white dark:to-slate-400 bg-clip-text text-transparent font-cabinet">
            Settings
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mt-2">Manage your account, API keys, and widget customization.</p>
        </div>
      </div>

      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center text-slate-400">
          <Loader2 className="w-10 h-10 animate-spin mb-4" />
          <p className="text-sm font-bold uppercase tracking-widest">Loading Settings...</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* API Key List */}
          <div className="bg-white/70 dark:bg-white/5 backdrop-blur-md border border-white/80 dark:border-white/10 shadow-xl rounded-[2.5rem] p-8">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white font-cabinet">Account API Keys</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">Keys belong to your account and can be used with any published agent in this workspace.</p>
              </div>
              <button 
                onClick={() => setShowKeyModal(true)}
                className="flex items-center gap-2 px-6 py-3 bg-rose-500 hover:bg-rose-600 text-white rounded-xl font-bold text-sm transition-all shadow-lg shadow-rose-500/20"
              >
                <Plus className="w-4 h-4" /> Create New Key
              </button>
            </div>

            <div className="mb-6 rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 p-4">
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Full API keys are shown only once when created. Existing keys display only their prefix. If you lose a key, revoke it and create a new one.
              </p>
            </div>

            <div className="space-y-3">
              {apiKeys.length === 0 ? (
                <div className="py-12 text-center text-slate-500 uppercase tracking-widest text-xs border border-dashed border-slate-200 dark:border-white/5 rounded-3xl">
                  No API keys generated yet.
                </div>
              ) : apiKeys.map((key) => (
                <div key={key.id} className="group p-4 bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 rounded-2xl flex items-center justify-between transition-all hover:border-rose-200 dark:hover:border-rose-500/30">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-white dark:bg-white/10 rounded-xl flex items-center justify-center text-slate-400">
                      <Key className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">{key.name}</h4>
                      <p className="text-[10px] text-slate-400 font-mono mt-0.5 tracking-wider uppercase">Created {new Date(key.created_at).toLocaleDateString()}</p>
                      <p className="text-[10px] text-slate-400 mt-1">Full key hidden after creation</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="px-3 py-1 bg-slate-200 dark:bg-white/10 rounded-lg font-mono text-[11px] text-slate-600 dark:text-slate-400">
                      ••••••••••••••••
                    </div>
                    <button 
                      onClick={() => setRevokeTarget(key.id)}
                      className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                      title="Revoke Key"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Setup Instructions */}
          <div className="bg-slate-900 dark:bg-white/5 border border-white/10 shadow-xl rounded-[2.5rem] p-8 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-rose-500/10 blur-[100px] rounded-full"></div>
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-rose-500/20 rounded-xl flex items-center justify-center text-rose-500">
                  <Code className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-bold text-white font-cabinet">Integration Guide</h3>
              </div>
              <p className="text-slate-400 text-sm mb-6 max-w-2xl">Copy this script into the <code>&lt;head&gt;</code> of your website to enable the BolChat bubble. For a personalized embed snippet with your actual API key and agent ID, visit the <strong className="text-white">Deploy tab</strong> in the Chatbot Manager.</p>
              <div className="bg-black/40 border border-white/5 rounded-2xl p-6 relative group">
                <pre className="text-xs text-rose-300 font-mono overflow-x-auto">
{integrationSnippet}
                </pre>
                <button 
                  onClick={() => copyToClipboard(integrationSnippet)}
                  className="absolute top-4 right-4 p-2 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-all opacity-0 group-hover:opacity-100"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={revokeTarget !== null}
        onClose={() => setRevokeTarget(null)}
        onConfirm={() => revokeTarget && handleRevokeKey(revokeTarget)}
        title="Revoke API Key"
        description="This key will immediately stop working. Any integrations using it will break. This cannot be undone."
        confirmLabel="Revoke Key"
        variant="danger"
      />

      {/* API Key Generation Modal */}
      {showKeyModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
           <div className="w-full max-w-md bg-white dark:bg-[#1a2135] rounded-[2rem] shadow-2xl overflow-hidden border border-slate-200 dark:border-white/10 p-8 space-y-6">
              <div className="flex justify-between items-center">
                 <h3 className="text-xl font-bold dark:text-white font-cabinet">Generate Key</h3>
                 <button onClick={() => {setShowKeyModal(false); setGeneratedKey(null);}} className="text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">✕</button>
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
                        className="w-full h-12 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 text-sm dark:text-white outline-none focus:ring-2 focus:ring-rose-500/20"
                     />
                   </div>
                   <button 
                      onClick={handleCreateKey}
                      disabled={keyLoading}
                      className="w-full py-4 bg-rose-500 text-white rounded-2xl font-bold shadow-xl shadow-rose-500/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
                   >
                      {keyLoading ? <Loader2 className="w-4 h-4 animate-spin"/> : "Generate API Key"}
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
                      <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                        Existing keys are displayed only by prefix. If you close this window without copying the full key, create a new key.
                      </p>
                   </div>
                   <button 
                      onClick={() => {setShowKeyModal(false); setGeneratedKey(null);}}
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
