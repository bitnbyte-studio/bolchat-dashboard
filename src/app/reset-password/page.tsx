"use client";

import React, { useState, useActionState, useEffect } from 'react';
import { Lock, ArrowRight, ShieldCheck, Eye, EyeOff, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { forceResetPasswordAction } from "@/app/actions/auth";
import { useFormStatus } from 'react-dom';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button 
      type="submit" 
      disabled={pending}
      className="w-full h-16 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-2xl font-bold text-lg shadow-lg shadow-rose-500/20 hover:scale-[1.02] hover:shadow-rose-500/30 active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-70 disabled:hover:scale-100 disabled:cursor-not-allowed"
    >
      {pending ? (
        <>
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>Updating...</span>
        </>
      ) : (
        <>
          <span>Update Password & Continue</span>
          <ArrowRight className="w-5 h-5" />
        </>
      )}
    </button>
  );
}

export default function ResetPasswordPage() {
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();
  
  const [state, formAction] = useActionState(forceResetPasswordAction, null);

  useEffect(() => {
    if (state?.success && state.redirect) {
      router.push(state.redirect);
    }
  }, [state, router]);

  return (
    <div className="min-h-screen bg-[#0a0f1e] flex flex-col relative overflow-hidden px-6 lg:px-0 font-satoshi">
      {/* Background Orbs */}
      <div className="absolute rounded-full filter blur-[120px] pointer-events-none z-0 opacity-40 bg-rose-600 w-[500px] h-[500px] -top-40 -left-40 animate-float"></div>
      <div className="absolute rounded-full filter blur-[120px] pointer-events-none z-0 opacity-40 bg-pink-600 w-[600px] h-[600px] -bottom-40 -right-40 animate-float" style={{ animationDelay: '-5s' }}></div>
      <div className="absolute rounded-full filter blur-[120px] pointer-events-none z-0 opacity-40 bg-indigo-600/30 w-[400px] h-[400px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse-slow"></div>

      <div className="flex-1 flex flex-col justify-center w-full max-w-md mx-auto py-12 lg:py-16">
        <main className="w-full relative z-10 animate-fade-in">
          <div className="bg-white/[0.03] backdrop-blur-[20px] border border-white/[0.08] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] p-10 rounded-[2.5rem] relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/10 blur-3xl rounded-full"></div>
            
            <div className="mb-10 text-center lg:text-left">
              <h2 className="text-2xl font-bold text-white mb-2 font-cabinet">Update Password</h2>
              <p className="text-rose-400 font-medium text-sm mb-2">Security Policy Requirement</p>
              <p className="text-slate-400 text-sm">
                For security reasons, you are required to change your password on your first login to the C-Panel.
              </p>
            </div>

            <form className="space-y-6" action={formAction}>
              {state?.error && (
                <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm font-medium animate-fade-in flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 shrink-0" />
                  <span>{state.error}</span>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">New Password</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-slate-500 group-focus-within:text-rose-500 transition-colors">
                    <Lock className="w-5 h-5" />
                  </div>
                  <input 
                    name="newPassword"
                    type={showNewPassword ? "text" : "password"}
                    required
                    pattern=".*[A-Z].*"
                    title="Password must contain at least one uppercase letter"
                    placeholder="••••••••" 
                    className="w-full h-14 pl-14 pr-12 rounded-2xl bg-white/5 border border-white/10 text-white placeholder:text-slate-600 outline-none transition-all focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10"
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute inset-y-0 right-0 pr-5 flex items-center text-slate-500 hover:text-slate-300 transition-colors"
                  >
                    {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Confirm New Password</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-slate-500 group-focus-within:text-rose-500 transition-colors">
                    <Lock className="w-5 h-5" />
                  </div>
                  <input 
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    pattern=".*[A-Z].*"
                    title="Password must contain at least one uppercase letter"
                    placeholder="••••••••" 
                    className="w-full h-14 pl-14 pr-12 rounded-2xl bg-white/5 border border-white/10 text-white placeholder:text-slate-600 outline-none transition-all focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10"
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-5 flex items-center text-slate-500 hover:text-slate-300 transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <SubmitButton />
            </form>
          </div>
        </main>
      </div>

      <footer className="w-full text-center z-10 mt-auto pb-8">
        <p className="mt-6 text-[10px] text-slate-600 font-medium tracking-wider">© 2024 BOLCHAT AI. ALL RIGHTS RESERVED.</p>
      </footer>
    </div>
  );
}
