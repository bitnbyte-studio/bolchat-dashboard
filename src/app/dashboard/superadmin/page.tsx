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

export default function SuperAdminPage() {
  const [organizations, setOrganizations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showProvisionModal, setShowProvisionModal] = useState(false);
  const [provisionLoading, setProvisionLoading] = useState(false);
  
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
      alert(res.error);
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
    <div className="max-w-[1600px] mx-auto space-y-10 animate-fade-in pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 overflow-hidden">
        <div>
          <div className="flex items-center gap-3 mb-2">
             <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-500">
                <ShieldCheck className="w-6 h-6" />
             </div>
             <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-[0.2em]">Platform Control</span>
          </div>
          <h2 className="text-4xl font-bold text-slate-900 dark:text-white font-cabinet">
            BolChat Hub
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mt-2">Centralized multi-tenancy management and platform operations.</p>
        </div>
        <button 
          onClick={() => setShowProvisionModal(true)}
          className="flex items-center gap-2 px-6 py-3.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-bold text-sm transition-all shadow-xl hover:scale-[1.02] active:scale-95"
        >
          <Plus className="w-5 h-5" /> Provision New Company
        </button>
      </div>

      {/* Stats Bento */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
         {stats.map((stat, i) => (
           <div key={i} className="group p-6 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-[2rem] shadow-sm hover:shadow-xl transition-all">
              <div className="flex justify-between items-start mb-4">
                 <div className={cn(
                   "w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110",
                   stat.color === "indigo" && "bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400",
                   stat.color === "rose" && "bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400",
                   stat.color === "emerald" && "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400",
                   stat.color === "amber" && "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400",
                 )}>
                    <stat.icon className="w-6 h-6" />
                 </div>
              </div>
              <p className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">{stat.title}</p>
              <h4 className="text-3xl font-bold text-slate-900 dark:text-white mt-1">{stat.value}</h4>
           </div>
         ))}
      </div>

      {/* Main Table Container */}
      <div className="bg-white/70 dark:bg-white/5 backdrop-blur-xl border border-white/80 dark:border-white/10 shadow-2xl rounded-[3rem] overflow-hidden">
          <div className="p-8 border-b border-slate-100 dark:border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white font-cabinet">Client Directory</h3>
              <div className="relative w-full md:w-96">
                 <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                 <input 
                    type="text" 
                    placeholder="Search companies, slugs..." 
                    className="w-full h-12 pl-11 pr-4 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-transparent rounded-2xl text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
                 />
              </div>
          </div>

          <div className="overflow-x-auto">
             <table className="w-full text-left border-collapse">
                <thead>
                   <tr className="bg-slate-50/50 dark:bg-white/[0.02] text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">
                      <th className="px-8 py-5">Company Details</th>
                      <th className="px-8 py-5 text-center">Status</th>
                      <th className="px-8 py-5 text-center">Chatbots</th>
                      <th className="px-8 py-5 text-center">Users</th>
                      <th className="px-8 py-5 text-center">Documents</th>
                      <th className="px-8 py-5 text-right">Actions</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                   {loading ? (
                     [...Array(3)].map((_, i) => (
                       <tr key={i} className="animate-pulse">
                          <td colSpan={6} className="px-8 py-6 h-20 bg-slate-50/20 dark:bg-white/[0.01]"></td>
                       </tr>
                     ))
                   ) : organizations.map((org) => (
                     <tr key={org.id} className="group hover:bg-slate-50/50 dark:hover:bg-white/[0.02] transition-colors">
                        <td className="px-8 py-6">
                           <div className="flex items-center gap-4">
                              <div className="w-12 h-12 bg-indigo-100/50 dark:bg-indigo-500/10 rounded-2xl flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold text-sm">
                                 {org.name.slice(0, 2).toUpperCase()}
                              </div>
                              <div>
                                 <h4 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-indigo-500 transition-colors">{org.name}</h4>
                                 <p className="text-[10px] text-slate-500 dark:text-slate-400 font-mono mt-0.5">slug: {org.slug}</p>
                              </div>
                           </div>
                        </td>
                        <td className="px-8 py-6 text-center">
                           <span className="px-3 py-1 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold rounded-full uppercase">Active</span>
                        </td>
                        <td className="px-8 py-6 text-center font-bold text-slate-700 dark:text-slate-300">{org.stats?.agents || 0}</td>
                        <td className="px-8 py-6 text-center font-bold text-slate-700 dark:text-slate-300">{org.stats?.users || 0}</td>
                        <td className="px-8 py-6 text-center font-bold text-slate-700 dark:text-slate-300">{org.stats?.documents || 0}</td>
                        <td className="px-8 py-6 text-right">
                           <div className="flex justify-end gap-2">
                             <button className="p-2.5 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/5 rounded-xl text-slate-400 hover:text-indigo-500 transition-all shadow-sm">
                                <ExternalLink className="w-4 h-4" />
                             </button>
                             <button className="p-2.5 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/5 rounded-xl text-slate-400 hover:text-rose-500 transition-all shadow-sm">
                                <Trash2 className="w-4 h-4" />
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
           <div className="w-full max-w-xl bg-white dark:bg-[#1a2135] rounded-[3rem] shadow-2xl overflow-hidden border border-slate-200 dark:border-white/10 p-10 space-y-8">
              <div className="flex justify-between items-center">
                 <div>
                    <h3 className="text-2xl font-bold dark:text-white font-cabinet">Provision Client Space</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Onboard a new company to BolChat platform.</p>
                 </div>
                 <button 
                  onClick={() => {setShowProvisionModal(false); setProvisionedData(null); setEmailSent(false);}} 
                  className="w-10 h-10 flex items-center justify-center bg-slate-100 dark:bg-white/5 rounded-full text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                 >✕</button>
              </div>

              {!provisionedData ? (
                <div className="space-y-6">
                   <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2 col-span-2 sm:col-span-1">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Company Name</label>
                        <input 
                           type="text" 
                           placeholder="e.g. Nike Global"
                           value={newOrg.name}
                           onChange={(e) => setNewOrg({...newOrg, name: e.target.value})}
                           className="w-full h-14 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl px-4 text-sm dark:text-white outline-none focus:ring-2 focus:ring-indigo-500/20"
                        />
                      </div>
                      <div className="space-y-2 col-span-2 sm:col-span-1">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Slug (Subdomain)</label>
                        <input 
                           type="text" 
                           placeholder="nike"
                           value={newOrg.slug}
                           onChange={(e) => setNewOrg({...newOrg, slug: e.target.value})}
                           className="w-full h-14 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl px-4 text-sm dark:text-white outline-none focus:ring-2 focus:ring-indigo-500/20 font-mono"
                        />
                      </div>
                   </div>
                   <div className="space-y-2">
                     <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Admin Email Address</label>
                     <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 pointer-events-none" />
                        <input 
                           type="email" 
                           placeholder="admin@nike.com"
                           value={newOrg.adminEmail}
                           onChange={(e) => setNewOrg({...newOrg, adminEmail: e.target.value})}
                           className="w-full h-14 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl pl-12 pr-4 text-sm dark:text-white outline-none focus:ring-2 focus:ring-indigo-500/20"
                        />
                     </div>
                   </div>

                   <div className="p-4 bg-indigo-50 dark:bg-indigo-500/5 rounded-2xl border border-indigo-100 dark:border-indigo-500/10 flex gap-3 items-start">
                      <Info className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />
                      <p className="text-[11px] text-indigo-700 dark:text-indigo-300 leading-relaxed">
                        By provisioning, you will create a dedicated vector collection and an admin account. 
                        No email will be sent automatically. You will receive the temporary password on the next screen.
                      </p>
                   </div>

                   <button 
                      onClick={handleProvision}
                      disabled={provisionLoading}
                      className="w-full py-4.5 bg-indigo-600 text-white rounded-2xl font-bold shadow-xl shadow-indigo-600/20 hover:scale-[1.01] active:scale-95 transition-all flex items-center justify-center gap-3"
                   >
                      {provisionLoading ? <Loader2 className="w-5 h-5 animate-spin"/> : <Building2 className="w-5 h-5" />}
                      Provision Client Environment
                   </button>
                </div>
              ) : (
                <div className="space-y-6 animate-in zoom-in-95 duration-300">
                   <div className="p-6 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20 rounded-[2rem] text-center space-y-2">
                       <div className="w-12 h-12 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto mb-2 shadow-lg shadow-emerald-500/20 animate-bounce">
                          <CheckCircle2 className="w-7 h-7" />
                       </div>
                       <h4 className="text-lg font-bold text-emerald-900 dark:text-emerald-400">Onboarding Successful</h4>
                       <p className="text-sm text-emerald-700 dark:text-emerald-500/80">Space for {provisionedData.organization.name} is ready.</p>
                   </div>

                   <div className="space-y-4">
                      <div className="space-y-2">
                         <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Temporary Credentials</label>
                         <div className="p-6 bg-slate-900 rounded-[2rem] border border-white/10 space-y-4 relative overflow-hidden group">
                             <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 blur-[50px] rounded-full pointer-events-none"></div>
                             
                             <div className="space-y-1">
                                <p className="text-[10px] text-slate-500 uppercase font-bold tracking-tighter">Admin Email</p>
                                <div className="flex justify-between items-center text-white font-mono text-sm">
                                   <span>{provisionedData.user.email}</span>
                                   <button onClick={() => {copyToClipboard(provisionedData.user.email); alert("Email copied");}} className="text-slate-600 hover:text-white transition-colors"><Copy className="w-4 h-4"/></button>
                                </div>
                             </div>

                             <div className="w-full h-px bg-white/5"></div>

                             <div className="space-y-1">
                                <p className="text-[10px] text-rose-500 uppercase font-bold tracking-tighter">Temporary Password</p>
                                <div className="flex justify-between items-center text-rose-400 font-mono text-lg font-bold">
                                   <span>{provisionedData.user.temp_password}</span>
                                   <button onClick={() => {copyToClipboard(provisionedData.user.temp_password); alert("Password copied");}} className="text-slate-600 hover:text-white transition-colors"><Copy className="w-4 h-4"/></button>
                                </div>
                             </div>
                         </div>
                      </div>

                      <div className="pt-4 flex flex-col gap-3">
                         <button 
                            onClick={handleSendEmail}
                            disabled={emailLoading || emailSent}
                            className={cn(
                              "w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all",
                              emailSent 
                                ? "bg-emerald-500 text-white" 
                                : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-xl shadow-indigo-600/20"
                            )}
                         >
                            {emailLoading ? <Loader2 className="w-5 h-5 animate-spin"/> : emailSent ? <CheckCircle2 className="w-5 h-5"/> : <Mail className="w-5 h-5" />}
                            {emailSent ? "Welcome Email Sent!" : "Send Welcome Email Now"}
                         </button>
                         <button 
                            onClick={() => {setShowProvisionModal(false); setProvisionedData(null); setEmailSent(false);}}
                            className="w-full py-4 text-slate-500 dark:text-slate-400 font-bold text-sm hover:text-slate-900 dark:hover:text-white transition-all"
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
