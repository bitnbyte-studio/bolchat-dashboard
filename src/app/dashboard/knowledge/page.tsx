"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { 
  UploadCloud, Trash2, FileText, 
  Loader2, ChevronDown, CheckCircle2, AlertCircle, X, File, ExternalLink
} from "lucide-react";
import { getKBsAction, getDocumentsAction, deleteDocumentAction, createKBAction } from "@/app/actions/knowledge";
import { cn } from "@/lib/utils";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";

type UploadingFile = {
  id: string;
  name: string;
  size: number;
  progress: number;
  status: "uploading" | "processing" | "done" | "error";
  error?: string;
};

function formatBytes(bytes: number) {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
}

export default function KnowledgeBasePage() {
  const [kbs, setKbs] = useState<any[]>([]);
  const [selectedKb, setSelectedKb] = useState<any>(null);
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploadingFiles, setUploadingFiles] = useState<UploadingFile[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const initCalledRef = useRef(false);

  useEffect(() => {
    if (initCalledRef.current) return;
    initCalledRef.current = true;
    init();
    return () => { if (pollRef.current) clearInterval(pollRef.current); };
  }, []);

  useEffect(() => {
    const hasProcessing = documents.some(
      (d) => d.status !== "ready" && d.status !== "failed"
    );
    if (hasProcessing && selectedKb) {
      if (!pollRef.current) {
        pollRef.current = setInterval(() => fetchDocuments(selectedKb.id), 4000);
      }
    } else {
      if (pollRef.current) { clearInterval(pollRef.current); pollRef.current = null; }
    }
  }, [documents, selectedKb]);

  async function init() {
    setLoading(true);
    const kbResult = await getKBsAction();
    if (kbResult.success && kbResult.data && kbResult.data.length > 0) {
      setKbs(kbResult.data);
      const firstKb = kbResult.data[0];
      setSelectedKb(firstKb);
      fetchDocuments(firstKb.id);
    } else if (kbResult.success && kbResult.data && kbResult.data.length === 0) {
      const newKb = await createKBAction("Default Knowledge Base", "Primary repository for AI training data.");
      if (newKb.success) {
        setKbs([newKb.data]);
        setSelectedKb(newKb.data);
      }
    }
    setLoading(false);
  }

  async function fetchDocuments(kbId: string) {
    const docResult = await getDocumentsAction(kbId);
    if (docResult.success) {
      setDocuments(docResult.data);
    }
  }

  function uploadFileWithProgress(file: File, kbId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const fileId = crypto.randomUUID();
      
      // Add to uploading files state
      setUploadingFiles(prev => [...prev, {
        id: fileId,
        name: file.name,
        size: file.size,
        progress: 0,
        status: "uploading",
      }]);

      const xhr = new XMLHttpRequest();
      const formData = new FormData();
      formData.append("file", file);

      // Track upload progress
      xhr.upload.addEventListener("progress", (e) => {
        if (e.lengthComputable) {
          const percent = Math.round((e.loaded / e.total) * 100);
          setUploadingFiles(prev => prev.map(f => 
            f.id === fileId ? { ...f, progress: percent } : f
          ));
        }
      });

      xhr.upload.addEventListener("load", () => {
        // Upload complete, now processing on server
        setUploadingFiles(prev => prev.map(f => 
          f.id === fileId ? { ...f, progress: 100, status: "processing" } : f
        ));
      });

      xhr.addEventListener("load", () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          setUploadingFiles(prev => prev.map(f => 
            f.id === fileId ? { ...f, status: "done" } : f
          ));
          // Remove from upload list after delay and refresh docs
          setTimeout(() => {
            setUploadingFiles(prev => prev.filter(f => f.id !== fileId));
            fetchDocuments(kbId);
          }, 2000);
          resolve();
        } else {
          let errorMsg = "Upload failed";
          try {
            const data = JSON.parse(xhr.responseText);
            errorMsg = data.error || data.detail || errorMsg;
          } catch {}
          setUploadingFiles(prev => prev.map(f => 
            f.id === fileId ? { ...f, status: "error", error: errorMsg } : f
          ));
          reject(new Error(errorMsg));
        }
      });

      xhr.addEventListener("error", () => {
        setUploadingFiles(prev => prev.map(f => 
          f.id === fileId ? { ...f, status: "error", error: "Network error" } : f
        ));
        reject(new Error("Network error"));
      });

      xhr.open("POST", `/api/upload?kbId=${kbId}`);
      xhr.send(formData);
    });
  }

  async function handleFileUpload(files: FileList | null) {
    if (!files || files.length === 0 || !selectedKb) return;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      
      // Validate PDF only
      if (file.type !== "application/pdf") {
        setUploadingFiles(prev => [...prev, {
          id: crypto.randomUUID(),
          name: file.name,
          size: file.size,
          progress: 0,
          status: "error",
          error: "Only PDF files are supported",
        }]);
        continue;
      }

      // Validate file size (50MB)
      if (file.size > 50 * 1024 * 1024) {
        setUploadingFiles(prev => [...prev, {
          id: crypto.randomUUID(),
          name: file.name,
          size: file.size,
          progress: 0,
          status: "error",
          error: "File exceeds 50MB limit",
        }]);
        continue;
      }

      try {
        await uploadFileWithProgress(file, selectedKb.id);
      } catch (e) {
        // Error already handled in the XHR callbacks
      }
    }

    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function removeUploadItem(id: string) {
    setUploadingFiles(prev => prev.filter(f => f.id !== id));
  }

  async function handleDelete(docId: string) {
    const result = await deleteDocumentAction(docId);
    if (result.success && selectedKb) {
      fetchDocuments(selectedKb.id);
    }
    setDeleteTarget(null);
  }

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    handleFileUpload(e.dataTransfer.files);
  }, [selectedKb]);

  const isUploading = uploadingFiles.some(f => f.status === "uploading" || f.status === "processing");

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white/70 dark:bg-white/5 backdrop-blur-md border border-white/80 dark:border-white/10 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)] p-5 rounded-2xl transition-all duration-300">
          <p className="text-slate-500 dark:text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1">Total Documents</p>
          <div className="flex items-end justify-between">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{documents.length}</h3>
            <span className="text-slate-400 text-[10px] font-bold">PDF</span>
          </div>
        </div>
        <div className="bg-white/70 dark:bg-white/5 backdrop-blur-md border border-white/80 dark:border-white/10 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)] p-5 rounded-2xl transition-all duration-300">
          <p className="text-slate-500 dark:text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1">Total Chunks</p>
          <div className="flex items-end justify-between">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
              {documents.reduce((sum, d) => sum + (d.chunk_count || 0), 0)}
            </h3>
            <span className="text-slate-400 text-[10px] font-bold">Vectors</span>
          </div>
        </div>
        <div className="bg-white/70 dark:bg-white/5 backdrop-blur-md border border-white/80 dark:border-white/10 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)] p-5 rounded-2xl transition-all duration-300">
          <p className="text-slate-500 dark:text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1">Indexing Status</p>
          <div className="flex items-end justify-between">
            {(() => {
              const processingCount = documents.filter(d => d.status !== "ready" && d.status !== "failed").length;
              if (processingCount > 0) return (
                <>
                  <h3 className="text-2xl font-bold text-amber-600 dark:text-amber-400">{processingCount} Pending</h3>
                  <span className="flex items-center gap-1 text-amber-500 text-[10px] font-bold uppercase">
                    <Loader2 className="w-3 h-3 animate-spin" /> Working
                  </span>
                </>
              );
              if (documents.length > 0) return (
                <>
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white">All Ready</h3>
                  <span className="flex items-center gap-1 text-green-500 text-[10px] font-bold uppercase">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div> Healthy
                  </span>
                </>
              );
              return (
                <>
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white">No Data</h3>
                  <span className="text-slate-400 text-[10px] font-bold uppercase">Idle</span>
                </>
              );
            })()}
          </div>
        </div>
      </div>

      {/* Upload Section */}
      <section className="bg-white/70 dark:bg-white/5 backdrop-blur-md border border-white/80 dark:border-white/10 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)] p-5 md:p-6 rounded-2xl transition-all duration-300">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-5">
          <div>
             <h3 className="text-lg font-bold text-slate-900 dark:text-white">Upload PDF Documents</h3>
             <p className="text-xs text-slate-500 dark:text-slate-400">Train your AI agent by uploading PDF knowledge sources. <a href="https://bolchat.tech/docs#knowledge-base" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-rose-500 hover:text-rose-600 font-bold">View Guide <ExternalLink className="w-3 h-3" /></a></p>
          </div>
          {selectedKb && (
            <span className="px-3 py-1 bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 text-[10px] font-bold rounded-full uppercase tracking-wider">
              KB: {selectedKb.name}
            </span>
          )}
        </div>

        {/* Drop Zone */}
        <div 
          onClick={() => !isUploading && fileInputRef.current?.click()}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={cn(
            "border-2 border-dashed rounded-xl p-8 text-center group cursor-pointer transition-all duration-300",
            isDragOver 
              ? "border-rose-500 bg-rose-50/50 dark:bg-rose-500/10 scale-[1.01]" 
              : "border-slate-200 dark:border-slate-700 hover:border-pink-300 dark:hover:border-rose-500/50 hover:bg-rose-50/50 dark:hover:bg-rose-500/5",
            isUploading && "pointer-events-none opacity-60"
          )}
        >
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={(e) => handleFileUpload(e.target.files)} 
            className="hidden" 
            accept=".pdf,application/pdf"
            multiple
          />
          <div className={cn(
            "w-14 h-14 bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 rounded-xl flex items-center justify-center mx-auto mb-4 transition-all duration-500",
            isDragOver ? "scale-110 bg-rose-50 dark:bg-rose-500/20" : "group-hover:scale-110 group-hover:bg-rose-50 dark:group-hover:bg-rose-500/20"
          )}>
            <UploadCloud className={cn(
              "w-6 h-6 transition-colors",
              isDragOver ? "text-rose-500" : "text-slate-400 group-hover:text-rose-500"
            )} />
          </div>
          <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-2">
            {isDragOver ? "Drop your PDF here" : "Drag & drop PDF files here"}
          </h4>
          <p className="text-slate-500 dark:text-slate-400 text-xs mb-5">
            Only <span className="font-bold text-rose-500">.pdf</span> files supported • Max 50MB per file
          </p>
          <button className="px-5 py-2 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-xl font-bold text-xs shadow-xl shadow-rose-500/20 hover:scale-105 active:scale-95 transition-all cursor-pointer">
            Browse Files
          </button>
        </div>

        {/* Upload Progress List */}
        {uploadingFiles.length > 0 && (
          <div className="mt-5 space-y-3">
            <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Upload Progress</h4>
            {uploadingFiles.map((file) => (
              <div 
                key={file.id} 
                className={cn(
                  "p-4 rounded-xl border transition-all",
                  file.status === "error" 
                    ? "bg-red-50 dark:bg-red-500/5 border-red-200 dark:border-red-500/20" 
                    : file.status === "done"
                    ? "bg-green-50 dark:bg-green-500/5 border-green-200 dark:border-green-500/20"
                    : "bg-white dark:bg-white/5 border-slate-100 dark:border-white/5"
                )}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={cn(
                      "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0",
                      file.status === "error" ? "bg-red-100 dark:bg-red-500/20 text-red-500" :
                      file.status === "done" ? "bg-green-100 dark:bg-green-500/20 text-green-500" :
                      "bg-rose-50 dark:bg-rose-500/10 text-rose-500"
                    )}>
                      {file.status === "done" ? <CheckCircle2 className="w-4 h-4" /> :
                       file.status === "error" ? <AlertCircle className="w-4 h-4" /> :
                       file.status === "processing" ? <Loader2 className="w-4 h-4 animate-spin" /> :
                       <File className="w-4 h-4" />}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{file.name}</p>
                      <p className="text-[10px] text-slate-400">{formatBytes(file.size)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span className={cn(
                      "text-[10px] font-bold uppercase tracking-widest",
                      file.status === "error" ? "text-red-500" :
                      file.status === "done" ? "text-green-500" :
                      file.status === "processing" ? "text-amber-500" :
                      "text-rose-500"
                    )}>
                      {file.status === "uploading" && `${file.progress}%`}
                      {file.status === "processing" && "Sending..."}
                      {file.status === "done" && "Uploaded"}
                      {file.status === "error" && "Failed"}
                    </span>
                    {(file.status === "error" || file.status === "done") && (
                      <button 
                        onClick={() => removeUploadItem(file.id)}
                        className="w-6 h-6 rounded-md bg-slate-100 dark:bg-white/5 flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors cursor-pointer"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>
                
                {/* Progress Bar */}
                {(file.status === "uploading" || file.status === "processing") && (
                  <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div 
                      className={cn(
                        "h-full rounded-full transition-all duration-300",
                        file.status === "processing" 
                          ? "bg-amber-500 animate-pulse w-full" 
                          : "bg-gradient-to-r from-rose-500 to-pink-500"
                      )}
                      style={file.status === "uploading" ? { width: `${file.progress}%` } : undefined}
                    />
                  </div>
                )}

                {/* Error message */}
                {file.status === "error" && file.error && (
                  <p className="text-[11px] text-red-500 mt-1">{file.error}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Indexed Documents Section */}
      <section className="bg-white/70 dark:bg-white/5 backdrop-blur-md border border-white/80 dark:border-white/10 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)] p-5 md:p-6 rounded-2xl transition-all duration-300">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-5 gap-4">
          <div className="flex items-center gap-3">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Indexed Documents</h3>
            <span className="px-2.5 py-1 bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300 text-[10px] font-bold rounded-full">{documents.length} Total</span>
            {documents.some(d => d.status !== "ready" && d.status !== "failed") && (
              <span className="flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 text-[10px] font-bold rounded-full">
                <Loader2 className="w-3 h-3 animate-spin" /> Indexing in progress...
              </span>
            )}
          </div>
        </div>
        
        <div className="space-y-3">
          {loading ? (
             <div className="py-16 flex flex-col items-center justify-center text-slate-400">
                <Loader2 className="w-8 h-8 animate-spin mb-3" />
                <p className="text-xs font-bold uppercase tracking-widest">Loading Knowledge Base...</p>
             </div>
          ) : documents.length === 0 ? (
            <div className="py-16 text-center border border-dashed border-slate-200 dark:border-white/10 rounded-xl">
               <FileText className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
               <p className="text-slate-500 dark:text-slate-400 font-bold text-sm">No documents indexed yet</p>
               <p className="text-slate-400 dark:text-slate-500 text-xs mt-1">Upload a PDF above to get started</p>
            </div>
          ) : (
             documents.map((doc) => (
              <div key={doc.id} className="p-4 rounded-xl bg-white dark:bg-white/5 border border-slate-100 dark:border-white/5 flex flex-col md:flex-row md:items-center gap-3 group hover:shadow-lg hover:border-rose-100 dark:hover:border-rose-500/30 transition-all">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="w-10 h-10 bg-rose-50 dark:bg-rose-500/10 rounded-lg flex items-center justify-center text-rose-500 flex-shrink-0">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{doc.filename}</p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Added {new Date(doc.created_at).toLocaleDateString()} • {doc.file_type?.toUpperCase()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-between md:justify-end gap-6">
                  <div className="flex flex-col items-end gap-1">
                    {doc.status === "ready" ? (
                      <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full bg-green-100 dark:bg-green-500/20 text-green-600 dark:text-green-400 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Indexed
                      </span>
                    ) : doc.status === "failed" ? (
                      <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> Error
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full bg-amber-100 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center gap-1">
                        <Loader2 className="w-3 h-3 animate-spin" /> Indexing
                      </span>
                    )}
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">
                      {doc.status === "processing" && doc.chunk_count === 0
                        ? "Generating embeddings..."
                        : `${doc.chunk_count || 0} Chunks`}
                    </p>
                  </div>
                  <button 
                    onClick={() => setDeleteTarget(doc.id)}
                    className="w-8 h-8 rounded-lg bg-slate-50 dark:bg-white/5 hover:bg-rose-500 dark:hover:bg-rose-500 hover:text-white transition-all flex items-center justify-center text-slate-400 cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {documents.length > 10 && (
          <div className="mt-8 flex justify-center">
            <button className="text-slate-400 hover:text-rose-500 font-bold text-sm flex items-center gap-2 transition-all cursor-pointer">
              Load More Documents <ChevronDown className="w-4 h-4" />
            </button>
          </div>
        )}
      </section>

      <ConfirmDialog
        open={deleteTarget !== null}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => deleteTarget && handleDelete(deleteTarget)}
        title="Delete Document"
        description="This will permanently remove the document and all its indexed chunks. This action cannot be undone."
        confirmLabel="Delete"
        variant="danger"
      />
    </div>
  );
}
