"use client";

import React, { useState } from 'react';
import { Mail, ArrowRight, ShieldCheck, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function ForgotPasswordPage() {
  const [submitted, setSubmitted] = useState(false);

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
            <Link href="/" className="inline-flex items-center text-xs font-bold text-slate-400 hover:text-white transition-colors mb-6 group">
              <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" /> Back to Login
            </Link>
            <h2 className="text-2xl font-bold text-white mb-2 font-cabinet">Reset Password</h2>
            <p className="text-slate-400 text-sm">
              {submitted ? "Check your email for reset instructions." : "Enter your business email and we'll send you a link to reset your password."}
            </p>
          </div>

          {!submitted ? (
            <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }}>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Business Email</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-slate-500 group-focus-within:text-rose-500 transition-colors">
                    <Mail className="w-5 h-5" />
                  </div>
                  <input 
                    type="email" 
                    required 
                    placeholder="your@company.com" 
                    className="w-full h-14 pl-14 pr-6 rounded-2xl bg-white/5 border border-white/10 text-white placeholder:text-slate-600 outline-none transition-all focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10"
                  />
                </div>
              </div>

              <button 
                type="submit" 
                className="w-full h-16 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-2xl font-bold text-lg shadow-lg shadow-rose-500/20 hover:scale-[1.02] hover:shadow-rose-500/30 active:scale-[0.98] transition-all flex items-center justify-center gap-3"
              >
                <span>Send Reset Link</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </form>
          ) : (
             <div className="flex flex-col items-center justify-center space-y-6 py-4">
                <div className="w-16 h-16 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center text-green-400">
                  <Mail className="w-8 h-8" />
                </div>
                <div className="text-center">
                  <h3 className="text-white font-bold text-lg">Check Your Email</h3>
                  <p className="text-slate-400 text-sm mt-2">We've sent a password reset link to your email address.</p>
                </div>
                <button 
                  onClick={() => setSubmitted(false)}
                  className="text-rose-500 text-sm font-bold hover:underline mt-4 cursor-pointer"
                >
                  Didn't receive the email? Try again
                </button>
             </div>
          )}
        </div>
      </main>
      </div>

      <footer className="w-full text-center z-10 mt-auto pb-8">
        <p className="mt-6 text-[10px] text-slate-600 font-medium tracking-wider">© 2024 BOLCHAT AI. ALL RIGHTS RESERVED.</p>
      </footer>
    </div>
  );
}
