"use client";

import React, { useState, useActionState, useEffect } from 'react';
import { MessageSquare, Mail, Lock, Eye, Check, ArrowRight, ShieldCheck, EyeOff, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { BolchatLogo } from "@/components/BolchatLogo";
import { loginAction } from "@/app/actions/auth";
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
          <span>Authenticating...</span>
        </>
      ) : (
        <>
          <span>Sign In to Dashboard</span>
          <ArrowRight className="w-5 h-5" />
        </>
      )}
    </button>
  );
}

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  
  // Tie the Next.js server action to a form state handler for built-in loading tracking and messages.
  const [state, formAction] = useActionState(loginAction, null);

  useEffect(() => {
    if (state?.success) {
      if (state.require2FA) {
        router.push("/2fa");
      } else if (state.requirePasswordChange) {
        router.push("/reset-password");
      } else if (state.redirect) {
        router.push(state.redirect);
      }
    }
  }, [state, router]);

  return (
    <div className="min-h-screen bg-[#0a0f1e] flex flex-col relative overflow-hidden px-6 lg:px-0 font-satoshi">
      {/* Background Orbs */}
      <div className="absolute rounded-full filter blur-[120px] pointer-events-none z-0 opacity-40 bg-rose-600 w-[500px] h-[500px] -top-40 -left-40 animate-float"></div>
      <div className="absolute rounded-full filter blur-[120px] pointer-events-none z-0 opacity-40 bg-pink-600 w-[600px] h-[600px] -bottom-40 -right-40 animate-float" style={{ animationDelay: '-5s' }}></div>
      <div className="absolute rounded-full filter blur-[120px] pointer-events-none z-0 opacity-40 bg-indigo-600/30 w-[400px] h-[400px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse-slow"></div>

      <div className="flex-1 flex flex-col justify-center w-full max-w-6xl mx-auto py-12 lg:py-16">
        <main className="w-full grid lg:grid-cols-2 gap-12 lg:gap-24 items-center relative z-10 animate-fade-in">
          {/* Left Side Content */}
        <div className="text-center lg:text-left space-y-8">
          <div className="flex items-center justify-center lg:justify-start gap-3 mb-4 group hover:scale-[1.02] transition-transform duration-500">
             <BolchatLogo size="lg" />
          </div>
          
          <div className="space-y-4">
            <h1 className="text-5xl lg:text-6xl font-bold text-white leading-tight font-cabinet">
              Scale Your Support <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-pink-500">Without Boundaries.</span>
            </h1>
            <p className="text-slate-400 text-lg max-w-md mx-auto lg:mx-0 leading-relaxed">
              Log in to your command center to manage knowledge bases, track real-time analytics, and configure your multilingual AI agents.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-8 pt-4">
            <div className="flex flex-col items-center lg:items-start">
              <span className="text-white font-bold text-2xl">52+</span>
              <span className="text-slate-500 text-sm uppercase tracking-wider font-medium">Languages</span>
            </div>
            <div className="w-px h-10 bg-slate-800 hidden lg:block"></div>
            <div className="flex flex-col items-center lg:items-start">
              <span className="text-white font-bold text-2xl">98%</span>
              <span className="text-slate-500 text-sm uppercase tracking-wider font-medium">Accuracy</span>
            </div>
            <div className="w-px h-10 bg-slate-800 hidden lg:block"></div>
            <div className="flex flex-col items-center lg:items-start">
              <span className="text-white font-bold text-2xl">24/7</span>
              <span className="text-slate-500 text-sm uppercase tracking-wider font-medium">Availability</span>
            </div>
          </div>
        </div>

        {/* Right Side Card */}
        <div className="w-full max-w-md mx-auto">
          <div className="bg-white/[0.03] backdrop-blur-[20px] border border-white/[0.08] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] p-10 rounded-[2.5rem] relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/10 blur-3xl rounded-full"></div>
            
            <div className="mb-10 text-center lg:text-left">
              <h2 className="text-2xl font-bold text-white mb-2 font-cabinet">Company Login</h2>
              <p className="text-slate-400 text-sm">Enter your credentials to access the C-Panel.</p>
            </div>

            <form className="space-y-6" action={formAction}>
              {state?.error && (
                <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm font-medium animate-fade-in flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 shrink-0" />
                  <span>{state.error}</span>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Business Email</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-slate-500 group-focus-within:text-rose-500 transition-colors">
                    <Mail className="w-5 h-5" />
                  </div>
                  <input 
                    name="email"
                    type="email" 
                    required 
                    placeholder="your@company.com" 
                    className="w-full h-14 pl-14 pr-6 rounded-2xl bg-white/5 border border-white/10 text-white placeholder:text-slate-600 outline-none transition-all focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center px-1">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Password</label>
                  <Link href="/forgot-password" className="text-xs font-bold text-rose-500 hover:text-rose-400 transition-colors">
                    Forgot?
                  </Link>
                </div>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-slate-500 group-focus-within:text-rose-500 transition-colors">
                    <Lock className="w-5 h-5" />
                  </div>
                  <input 
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    pattern=".*[A-Z].*"
                    title="Password must contain at least one uppercase letter"
                    placeholder="••••••••" 
                    className="w-full h-14 pl-14 pr-12 rounded-2xl bg-white/5 border border-white/10 text-white placeholder:text-slate-600 outline-none transition-all focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10"
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-5 flex items-center text-slate-500 hover:text-slate-300 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-3 px-1">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <div className="relative">
                    <input type="checkbox" name="rememberMe" className="peer sr-only" />
                    <div className="w-5 h-5 rounded-md border-2 border-white/10 peer-checked:bg-rose-500 peer-checked:border-rose-500 transition-all flex items-center justify-center">
                      <Check className="text-white w-3 h-3 opacity-0 peer-checked:opacity-100 transition-opacity" strokeWidth={3} />
                    </div>
                  </div>
                  <span className="text-sm text-slate-400 group-hover:text-slate-300 transition-colors">Remember me for 30 days</span>
                </label>
              </div>

              <SubmitButton />
            </form>
          </div>
        </div>
      </main>
      </div>

      <footer className="w-full text-center z-10 mt-auto pb-8">
        <div className="flex justify-center gap-8 text-[11px] font-bold text-slate-500 uppercase tracking-[0.2em]">
          <Link href="/privacy" className="hover:text-rose-500 transition-colors">Privacy Policy</Link>
          <Link href="/terms" className="hover:text-rose-500 transition-colors">Terms of Service</Link>
          <Link href="/security" className="hover:text-rose-500 transition-colors">Security</Link>
        </div>
        <p className="mt-6 text-[10px] text-slate-600 font-medium tracking-wider">© 2024 BOLCHAT AI. ALL RIGHTS RESERVED.</p>
      </footer>
    </div>
  );
}
