"use client";

import React, { useState, useRef } from 'react';
import { ShieldCheck, ArrowRight, KeyRound, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function TwoFactorPage() {
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const inputs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const value = e.target.value;
    if (/[^0-9]/.test(value)) return;
    
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // Auto focus next input
    if (value && index < 5) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate verification
    if (code.join('').length === 6) {
      alert("Verification successful! Redirecting to dashboard...");
      // router.push('/dashboard');
    }
  };

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
          
          <div className="mb-8 text-center flex flex-col items-center">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-rose-500 to-pink-500 flex items-center justify-center shadow-lg shadow-rose-500/20 mb-6">
              <KeyRound className="text-white w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2 font-cabinet">Two-Factor Authentication</h2>
            <p className="text-slate-400 text-sm">
              We sent a 6-digit verification code to your email. Enter it below to continue.
            </p>
          </div>

          <form className="space-y-8" onSubmit={handleSubmit}>
            <div className="flex justify-between gap-2">
              {code.map((digit, i) => (
                <input
                  key={i}
                  ref={el => { inputs.current[i] = el }}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(e, i)}
                  onKeyDown={(e) => handleKeyDown(e, i)}
                  className="w-12 h-14 text-center text-xl font-bold rounded-2xl bg-white/5 border border-white/10 text-white outline-none transition-all focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10"
                />
              ))}
            </div>

            <button 
              type="submit" 
              className="w-full h-16 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-2xl font-bold text-lg shadow-lg shadow-rose-500/20 hover:scale-[1.02] hover:shadow-rose-500/30 active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:pointer-events-none"
              disabled={code.join('').length < 6}
            >
              <span>Verify &amp; Continue</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-slate-500">
              Didn't receive the code? <button className="text-rose-500 font-bold hover:underline">Resend</button>
            </p>
          </div>
          <div className="mt-4 text-center">
             <Link href="/" className="inline-flex items-center text-xs font-bold text-slate-400 hover:text-white transition-colors group">
              <ArrowLeft className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform" /> Back to Login
            </Link>
          </div>
        </div>
      </main>
      </div>

      <footer className="w-full text-center z-10 mt-auto pb-8">
        <p className="mt-6 text-[10px] text-slate-600 font-medium tracking-wider">© 2024 BOLCHAT AI. ALL RIGHTS RESERVED.</p>
      </footer>
    </div>
  );
}
