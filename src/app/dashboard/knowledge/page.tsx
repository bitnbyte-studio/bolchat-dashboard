import { Metadata } from "next";
import { UploadCloud, Filter, Trash2, FileText, Eye, Loader2, Table, ChevronDown } from "lucide-react";

export const metadata: Metadata = {
  title: "Knowledge Base - BolChat",
};

export default function KnowledgeBasePage() {
  return (
    <div className="space-y-10 animate-fade-in pb-12">
      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white/70 dark:bg-white/5 backdrop-blur-md border border-white/80 dark:border-white/10 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)] p-6 rounded-3xl transition-all duration-300">
          <p className="text-slate-500 dark:text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1">Total Documents</p>
          <div className="flex items-end justify-between">
            <h3 className="text-3xl font-bold text-slate-900 dark:text-white font-cabinet">142</h3>
            <span className="text-rose-500 text-xs font-bold">+8 this week</span>
          </div>
        </div>
        <div className="bg-white/70 dark:bg-white/5 backdrop-blur-md border border-white/80 dark:border-white/10 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)] p-6 rounded-3xl transition-all duration-300">
          <p className="text-slate-500 dark:text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1">Storage Used</p>
          <div className="flex items-end justify-between">
            <h3 className="text-3xl font-bold text-slate-900 dark:text-white font-cabinet">4.8 GB</h3>
            <span className="text-slate-400 text-xs font-bold">of 10 GB</span>
          </div>
          <div className="mt-3 h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full bg-rose-500 w-[48%]"></div>
          </div>
        </div>
        <div className="bg-white/70 dark:bg-white/5 backdrop-blur-md border border-white/80 dark:border-white/10 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)] p-6 rounded-3xl transition-all duration-300">
          <p className="text-slate-500 dark:text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1">Last Indexing</p>
          <div className="flex items-end justify-between">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white font-cabinet">22 min ago</h3>
            <span className="flex items-center gap-1 text-green-500 text-[10px] font-bold uppercase">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div> Healthy
            </span>
          </div>
        </div>
      </div>

      {/* Upload Section */}
      <section className="bg-white/70 dark:bg-white/5 backdrop-blur-md border border-white/80 dark:border-white/10 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)] p-8 rounded-[2.5rem] transition-all duration-300">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
             <h3 className="text-2xl font-bold text-slate-900 dark:text-white font-cabinet">Upload New Sources</h3>
             <p className="text-sm text-slate-500 dark:text-slate-400">Training your AI agent starts with high-quality data.</p>
          </div>
        </div>
        <div className="border-2 border-dashed border-slate-200 dark:border-slate-700 hover:border-pink-300 dark:hover:border-rose-500/50 hover:bg-rose-50/50 dark:hover:bg-rose-500/5 rounded-[2rem] p-12 text-center group cursor-pointer transition-all duration-300">
          <div className="w-20 h-20 bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:bg-rose-50 dark:group-hover:bg-rose-500/20 transition-all duration-500">
            <UploadCloud className="w-10 h-10 text-slate-400 group-hover:text-rose-500 transition-colors" />
          </div>
          <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-2 font-cabinet">Drop PDF, DOCX or CSV files here</h4>
          <p className="text-slate-500 dark:text-slate-400 text-sm mb-8">Maximum file size 50MB. Zip files not supported.</p>
          <button className="px-10 py-4 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-2xl font-bold text-sm shadow-xl shadow-rose-500/20 hover:scale-105 active:scale-95 transition-all">
            Browse Local Files
          </button>
        </div>
      </section>

      {/* Indexed Documents Section */}
      <section className="bg-white/70 dark:bg-white/5 backdrop-blur-md border border-white/80 dark:border-white/10 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)] p-8 rounded-[2.5rem] transition-all duration-300">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-10 gap-4">
          <div className="flex items-center gap-4">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white font-cabinet">Indexed Documents</h3>
            <span className="px-3 py-1 bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300 text-[10px] font-bold rounded-full">142 Total</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center bg-slate-100 dark:bg-white/5 rounded-xl px-3 py-2 border border-slate-200 dark:border-white/10">
              <Filter className="w-4 h-4 text-slate-400 mr-2" />
              <select className="bg-transparent border-none outline-none text-xs font-bold text-slate-500 dark:text-slate-300 uppercase cursor-pointer">
                <option>Sort: Recent</option>
                <option>Sort: Name</option>
                <option>Sort: Size</option>
              </select>
            </div>
            <button className="p-2.5 bg-slate-100 dark:bg-white/5 hover:bg-rose-50 dark:hover:bg-rose-500/20 hover:text-rose-500 rounded-xl border border-slate-200 dark:border-white/10 transition-all text-slate-400 cursor-pointer">
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        <div className="space-y-4">
          {/* Document Item 1 */}
          <div className="p-5 rounded-3xl bg-white dark:bg-white/5 border border-slate-100 dark:border-white/5 flex flex-col md:flex-row md:items-center gap-6 group hover:shadow-lg hover:border-rose-100 dark:hover:border-rose-500/30 transition-all">
            <div className="flex items-center gap-4 flex-1">
              <div className="w-14 h-14 bg-rose-50 dark:bg-rose-500/10 rounded-2xl flex items-center justify-center text-rose-500">
                <FileText className="w-7 h-7" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900 dark:text-white">Product_Catalog_2024.pdf</p>
                <p className="text-xs text-slate-400 mt-0.5">Added 2 days ago • 12.4 MB</p>
              </div>
            </div>
            <div className="flex items-center justify-between md:justify-end gap-10">
              <div className="flex flex-col items-end gap-1">
                <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full bg-green-100 dark:bg-green-500/20 text-green-600 dark:text-green-400">Indexed</span>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">98% Confidence</p>
              </div>
              <div className="flex gap-2">
                <button className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-white/5 hover:bg-rose-500 dark:hover:bg-rose-500 hover:text-white transition-all flex items-center justify-center text-slate-400 cursor-pointer">
                  <Eye className="w-4 h-4" />
                </button>
                <button className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-white/5 hover:bg-rose-500 dark:hover:bg-rose-500 hover:text-white transition-all flex items-center justify-center text-slate-400 cursor-pointer">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Document Item 2 */}
          <div className="p-5 rounded-3xl bg-white dark:bg-white/5 border border-slate-100 dark:border-white/5 flex flex-col md:flex-row md:items-center gap-6 group hover:shadow-lg hover:border-rose-100 dark:hover:border-rose-500/30 transition-all">
            <div className="flex items-center gap-4 flex-1">
              <div className="w-14 h-14 bg-blue-50 dark:bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-500">
                <FileText className="w-7 h-7" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900 dark:text-white">FAQ_Spanish_Support.docx</p>
                <p className="text-xs text-slate-400 mt-0.5">Added 1 week ago • 2.1 MB</p>
              </div>
            </div>
            <div className="flex items-center justify-between md:justify-end gap-10">
              <div className="flex flex-col items-end gap-1">
                <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full bg-green-100 dark:bg-green-500/20 text-green-600 dark:text-green-400">Indexed</span>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">100% Confidence</p>
              </div>
              <div className="flex gap-2">
                <button className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-white/5 hover:bg-rose-500 dark:hover:bg-rose-500 hover:text-white transition-all flex items-center justify-center text-slate-400 cursor-pointer">
                  <Eye className="w-4 h-4" />
                </button>
                <button className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-white/5 hover:bg-rose-500 dark:hover:bg-rose-500 hover:text-white transition-all flex items-center justify-center text-slate-400 cursor-pointer">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Document Item 3 (Processing) */}
          <div className="p-5 rounded-3xl bg-white dark:bg-white/5 border border-rose-100 dark:border-rose-500/30 ring-4 ring-rose-50 dark:ring-rose-500/10 flex flex-col md:flex-row md:items-center gap-6 group transition-all relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/5 blur-3xl rounded-full"></div>
            <div className="flex items-center gap-4 flex-1 relative z-10">
              <div className="w-14 h-14 bg-orange-50 dark:bg-orange-500/10 rounded-2xl flex items-center justify-center text-orange-500">
                <Table className="w-7 h-7" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900 dark:text-white">Pricing_Guide_Multi.csv</p>
                <p className="text-xs text-slate-400 mt-0.5">Added 1 hour ago • 450 KB</p>
              </div>
            </div>
            <div className="flex items-center justify-between md:justify-end gap-10 relative z-10">
              <div className="flex flex-col items-end gap-1">
                <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full bg-orange-100 dark:bg-orange-500/20 text-orange-600 dark:text-orange-400 flex items-center gap-1">
                  <Loader2 className="w-3 h-3 animate-spin"/> Indexing
                </span>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">Parsing rows...</p>
              </div>
              <div className="flex gap-2">
                <button className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-white/5 hover:bg-rose-500 hover:text-white transition-all flex items-center justify-center text-slate-400 cursor-pointer">
                  <Eye className="w-4 h-4" />
                </button>
                <button className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-white/5 hover:bg-rose-500 hover:text-white transition-all flex items-center justify-center text-slate-400 cursor-pointer">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

        </div>

        <div className="mt-10 flex justify-center">
          <button className="text-slate-400 hover:text-rose-500 font-bold text-sm flex items-center gap-2 transition-all cursor-pointer">
            Load More Documents <ChevronDown className="w-4 h-4" />
          </button>
        </div>
      </section>
    </div>
  );
}
