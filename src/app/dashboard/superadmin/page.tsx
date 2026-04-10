"use client";

import { useState, useEffect } from "react";
import { 
  Building2, Users, Bot, FileText, Plus, 
  ExternalLink, Mail, Key, ShieldCheck, 
  CheckCircle2, Loader2, Search, Trash2,
  Copy, Info
} from "lucide-react";
import { 
  getOrganizationsAction, 
  provisionCompanyAction, 
  sendWelcomeEmailAction 
} from "@/app/actions/admin";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/toast";

export default function SuperAdminPage() {
  const [organizations, setOrganizations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showProvisionModal, setShowProvisionModal] = useState(false);
  const [provisionLoading, setProvisionLoading] = useState(false);
  const { toast } = useToast();
  
  // New Org State
  const [newOrg, setNewOrg] = useState({ name: "", slug: "", adminEmail: "" });
  const [provisionedData, setProvisionedData] = useState<any>(null);
  const [emailLoading, setEmailLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  useEffect(() => {
    fetchOrganizations();
  }, []);

  async function fetchOrganizations() {
    setLoading(true);
    const res = await getOrganizationsAction();
    if (res.success) setOrganizations(res.data);
    setLoading(false);
  }

  async function handleProvision() {
    if (!newOrg.name || !newOrg.slug || !newOrg.adminEmail) return;
    setProvisionLoading(true);
    const res = await provisionCompanyAction(newOrg.name, newOrg.slug, newOrg.adminEmail);
    if (res.success) {
      setProvisionedData(res.data);
      fetchOrganizations();
    } else {
      toast(res.error || "Provisioning failed", "error");
    }
    setProvisionLoading(false);
  }

  async function handleSendEmail() {
    if (!provisionedData) return;
    setEmailLoading(true);
    const res = await sendWelcomeEmailAction(
      provisionedData.user.id, 
      provisionedData.user.temp_password
    );
    if (res.success) {
      setEmailSent(true);
      setTimeout(() => setEmailSent(false), 3000);
    }
    setEmailLoading(false);
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const stats = [
    { title: "Total Organizations", value: organizations.length, icon: Building2, color: "indigo" },
    { title: "Total Chatbots", value: organizations.reduce((acc, org) => acc + (org.stats?.agents || 0), 0), icon: Bot, color: "rose" },
    { title: "Documents Indexed", value: organizations.reduce((acc, org) => acc + (org.stats?.documents || 0), 0), icon: FileText, color: "emerald" },
    { title: "Active Users", value: organizations.reduce((acc, org) => acc + (org.stats?.users || 0), 0), icon: Users, color: "amber" },
  ];

  return (
    <div className="max-w-[1600px] mx-auto space-y-8 animate-fade-in pb-16">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 overflow-hidden">
        <div>
          <div className="flex items-center gap-3 mb-2">
             <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-500">
                <ShieldCheck className="w-5 h-5" />
             </div>
             <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-[0.2em]">Platform Control</span>
          </div>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white font-cabinet">
            BolChat Hub
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm">Centralized multi-tenancy management and platform operations.</p>
        </div>
        <button 
          onClick={() => setShowProvisionModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-bold text-sm transition-all shadow-xl hover:scale-[1.02] active:scale-95"
        >
          <Plus className="w-4 h-4" /> Provision New Company
        </button>
      </div>

      {/* Stats Bento */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
         {stats.map((stat, i) => (
           <div key={i} className="group p-5 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl shadow-sm hover:shadow-xl transition-all">
              <div className="flex justify-between items-start mb-3">
                 <div className={cn(
                   "w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110",
                   stat.color === "indigo" && "bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400",
                   stat.color === "rose" && "bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400",
                   stat.color === "emerald" && "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400",
                   stat.color === "amber" && "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400",
                 )}>
                    <stat.icon className="w-5 h-5" />
                 </div>
              </div>
              <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">{stat.title}</p>
              <h4 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{stat.value}</h4>
           </div>
         ))}
      </div>

      {/* Main Table Container */}
      <div className="bg-white/70 dark:bg-white/5 backdrop-blur-xl border border-white/80 dark:border-white/10 shadow-2xl rounded-3xl overflow-hidden">
          <div className="p-6 border-b border-slate-100 dark:border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white font-cabinet">Client Directory</h3>
              <div className="relative w-full md:w-80">
                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                 <input 
                    type="text" 
                    placeholder="Search companies, slugs..." 
                    className="w-full h-10 pl-9 pr-3 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-transparent rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
                 />
              </div>
          </div>

          <div className="overflow-x-auto">
             <table className="w-full text-left border-collapse">
                <thead>
                   <tr className="bg-slate-50/50 dark:bg-white/[0.02] text-[9px] font-bold text-slate-500 uppercase tracking-[0.2em]">
                      <th className="px-6 py-4">Company Details</th>
                      <th className="px-6 py-4 text-center">Status</th>
                      <th className="px-6 py-4 text-center">Chatbots</th>
                      <th className="px-6 py-4 text-center">Users</th>
                      <th className="px-6 py-4 text-center">Documents</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                   {loading ? (
                     [...Array(3)].map((_, i) => (
                       <tr key={i} className="animate-pulse">
                          <td colSpan={6} className="px-6 py-4 h-16 bg-slate-50/20 dark:bg-white/[0.01]"></td>
                       </tr>
                     ))
                   ) : organizations.map((org) => (
                     <tr key={org.id} className="group hover:bg-slate-50/50 dark:hover:bg-white/[0.02] transition-colors">
                        <td className="px-6 py-4">
                           <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-indigo-100/50 dark:bg-indigo-500/10 rounded-xl flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold text-xs">
                                 {org.name.slice(0, 2).toUpperCase()}
                              </div>
                              <div>
                                 <h4 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-indigo-500 transition-colors">{org.name}</h4>
                                 <p className="text-[9px] text-slate-500 dark:text-slate-400 font-mono mt-0.5 max-w-[120px] truncate">slug: {org.slug}</p>
                              </div>
                           </div>
                        </td>
                        <td className="px-6 py-4 text-center">
                           <span className="px-2.5 py-1 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[9px] font-bold rounded-full uppercase">Active</span>
                        </td>
                        <td className="px-6 py-4 text-center text-sm font-bold text-slate-700 dark:text-slate-300">{org.stats?.agents || 0}</td>
                        <td className="px-6 py-4 text-center text-sm font-bold text-slate-700 dark:text-slate-300">{org.stats?.users || 0}</td>
                        <td className="px-6 py-4 text-center text-sm font-bold text-slate-700 dark:text-slate-300">{org.stats?.documents || 0}</td>
                        <td className="px-6 py-4 text-right">
                           <div className="flex justify-end gap-1.5">
                             <button className="p-2 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/5 rounded-lg text-slate-400 hover:text-indigo-500 transition-all shadow-sm cursor-pointer">
                                <ExternalLink className="w-3.5 h-3.5" />
                             </button>
                             <button className="p-2 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/5 rounded-lg text-slate-400 hover:text-rose-500 transition-all shadow-sm cursor-pointer">
                                <Trash2 className="w-3.5 h-3.5" />
                             </button>
                           </div>
                        </td>
                     </tr>
                   ))}
                </tbody>
             </table>
          </div>
      </div>

      {/* Provisioning Modal */}
      {showProvisionModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
           <div className="w-full max-w-xl bg-white dark:bg-[#1a2135] rounded-3xl shadow-2xl overflow-hidden border border-slate-200 dark:border-white/10 p-8 space-y-6">
              <div className="flex justify-between items-center">
                 <div>
                    <h3 className="text-xl font-bold dark:text-white font-cabinet">Provision Client Space</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Onboard a new company to BolChat platform.</p>
                 </div>
                 <button 
                  onClick={() => {setShowProvisionModal(false); setProvisionedData(null); setEmailSent(false);}} 
                  className="w-8 h-8 flex items-center justify-center bg-slate-100 dark:bg-white/5 rounded-full text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
                 >✕</button>
              </div>

              {!provisionedData ? (
                <div className="space-y-4">
                   <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5 col-span-2 sm:col-span-1">
                        <label className="text-[9px] font-bold text-slate-500 uppercase tracking-widest ml-1">Company Name</label>
                        <input 
                           type="text" 
                           placeholder="e.g. Nike Global"
                           value={newOrg.name}
                           onChange={(e) => setNewOrg({...newOrg, name: e.target.value})}
                           className="w-full h-10 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-3 text-sm dark:text-white outline-none focus:ring-2 focus:ring-indigo-500/20"
                        />
                      </div>
                      <div className="space-y-1.5 col-span-2 sm:col-span-1">
                        <label className="text-[9px] font-bold text-slate-500 uppercase tracking-widest ml-1">Slug (Subdomain)</label>
                        <input 
                           type="text" 
                           placeholder="nike"
                           value={newOrg.slug}
                           onChange={(e) => setNewOrg({...newOrg, slug: e.target.value})}
                           className="w-full h-10 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-3 text-sm dark:text-white outline-none focus:ring-2 focus:ring-indigo-500/20 font-mono"
                        />
                      </div>
                   </div>
                   <div className="space-y-1.5">
                     <label className="text-[9px] font-bold text-slate-500 uppercase tracking-widest ml-1">Admin Email Address</label>
                     <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 pointer-events-none" />
                        <input 
                           type="email" 
                           placeholder="admin@nike.com"
                           value={newOrg.adminEmail}
                           onChange={(e) => setNewOrg({...newOrg, adminEmail: e.target.value})}
                           className="w-full h-10 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl pl-9 pr-3 text-sm dark:text-white outline-none focus:ring-2 focus:ring-indigo-500/20"
                        />
                     </div>
                   </div>

                   <div className="p-3 bg-indigo-50 dark:bg-indigo-500/5 rounded-xl border border-indigo-100 dark:border-indigo-500/10 flex gap-3 items-start mt-4">
                      <Info className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
                      <p className="text-[10px] text-indigo-700 dark:text-indigo-300 leading-relaxed">
                        By provisioning, you will create a dedicated vector collection and an admin account. 
                        No email will be sent automatically. You will receive the temporary password on the next screen.
                      </p>
                   </div>

                   <button 
                      onClick={handleProvision}
                      disabled={provisionLoading}
                      className="w-full py-3 mt-4 bg-indigo-600 text-white rounded-xl text-sm font-bold shadow-xl shadow-indigo-600/20 hover:scale-[1.01] active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                   >
                      {provisionLoading ? <Loader2 className="w-4 h-4 animate-spin"/> : <Building2 className="w-4 h-4" />}
                      Provision Client Environment
                   </button>
                </div>
              ) : (
                <div className="space-y-4 animate-in zoom-in-95 duration-300">
                   <div className="p-5 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20 rounded-2xl text-center space-y-1.5">
                       <div className="w-10 h-10 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto mb-1 shadow-lg shadow-emerald-500/20 animate-bounce">
                          <CheckCircle2 className="w-6 h-6" />
                       </div>
                       <h4 className="text-base font-bold text-emerald-900 dark:text-emerald-400">Onboarding Successful</h4>
                       <p className="text-xs text-emerald-700 dark:text-emerald-500/80">Space for {provisionedData.organization.name} is ready.</p>
                   </div>

                   <div className="space-y-3">
                      <div className="space-y-1.5">
                         <label className="text-[9px] font-bold text-slate-500 uppercase tracking-widest ml-1">Temporary Credentials</label>
                         <div className="p-5 bg-slate-900 rounded-2xl border border-white/10 space-y-3 relative overflow-hidden group">
                             <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 blur-[50px] rounded-full pointer-events-none"></div>
                             
                             <div className="space-y-1">
                                <p className="text-[9px] text-slate-500 uppercase font-bold tracking-tighter">Admin Email</p>
                                <div className="flex justify-between items-center text-white font-mono text-sm">
                                   <span>{provisionedData.user.email}</span>
                                   <button onClick={() => {copyToClipboard(provisionedData.user.email); toast("Email copied", "success");}} className="text-slate-600 hover:text-white transition-colors cursor-pointer"><Copy className="w-4 h-4"/></button>
                                </div>
                             </div>

                             <div className="w-full h-px bg-white/5"></div>

                             <div className="space-y-1">
                                <p className="text-[9px] text-rose-500 uppercase font-bold tracking-tighter">Temporary Password</p>
                                <div className="flex justify-between items-center text-rose-400 font-mono text-base font-bold">
                                   <span>{provisionedData.user.temp_password}</span>
                                   <button onClick={() => {copyToClipboard(provisionedData.user.temp_password); toast("Password copied", "success");}} className="text-slate-600 hover:text-white transition-colors cursor-pointer"><Copy className="w-4 h-4"/></button>
                                </div>
                             </div>
                         </div>
                      </div>

                      <div className="pt-2 flex flex-col gap-2 relative z-10">
                         <button 
                            onClick={handleSendEmail}
                            disabled={emailLoading || emailSent}
                            className={cn(
                              "w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all cursor-pointer text-sm",
                              emailSent 
                                ? "bg-emerald-500 text-white" 
                                : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-xl shadow-indigo-600/20"
                            )}
                         >
                            {emailLoading ? <Loader2 className="w-4 h-4 animate-spin"/> : emailSent ? <CheckCircle2 className="w-4 h-4"/> : <Mail className="w-4 h-4" />}
                            {emailSent ? "Welcome Email Sent!" : "Send Welcome Email"}
                         </button>
                         <button 
                            onClick={() => {setShowProvisionModal(false); setProvisionedData(null); setEmailSent(false);}}
                            className="w-full py-2 hover:bg-slate-50 dark:hover:bg-white/5 rounded-xl text-slate-500 dark:text-slate-400 font-bold text-xs hover:text-slate-900 dark:hover:text-white transition-all cursor-pointer"
                         >
                            Done, go to hub
                         </button>
                      </div>
                   </div>
                </div>
              )}
           </div>
        </div>
      )}
    </div>
  );
}
