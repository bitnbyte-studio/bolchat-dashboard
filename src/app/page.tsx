"use client";

import React, { useState, useActionState, useEffect, useRef } from 'react';
import { Mail, Lock, Eye, EyeOff, Loader2, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { BolchatLogo } from "@/components/BolchatLogo";
import { loginAction } from "@/app/actions/auth";
import { useFormStatus } from 'react-dom';

function SubmitButton({ disabled }: { disabled?: boolean }) {
  const { pending } = useFormStatus();
  const isDisabled = pending || disabled;
  return (
    <button
      type="submit"
      disabled={isDisabled}
      className="group relative w-full h-12 overflow-hidden rounded-xl font-semibold text-sm tracking-wide transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-60"
      style={{ background: 'linear-gradient(135deg, #f43f5e 0%, #e11d48 100%)' }}
    >
      {/* Shine sweep on hover */}
      <span className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none" />
      <span className="relative flex items-center justify-center gap-2 text-white">
        {pending ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Authenticating…</span>
          </>
        ) : (
          <span>Sign In</span>
        )}
      </span>
    </button>
  );
}

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const router = useRouter();
  const [state, formAction] = useActionState(loginAction, null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (state?.success) {
      if (state.require2FA) router.push("/2fa");
      else if (state.requirePasswordChange) router.push("/reset-password");
      else if (state.redirect) router.push(state.redirect);
    }
  }, [state, router]);

  return (
    <div className="min-h-screen flex font-satoshi" style={{ background: '#080b14' }}>

      {/* ── Left panel — brand story ── */}
      <div
        className="hidden lg:flex flex-col justify-between w-[52%] relative overflow-hidden"
        style={{
          background: 'linear-gradient(160deg, #0f1422 0%, #0a0d1a 60%, #0c0814 100%)',
          borderRight: '1px solid rgba(255,255,255,0.045)',
        }}
      >
        {/* Subtle grid */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.018) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.018) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />

        {/* Radial glow — deep rose, very restrained */}
        <div
          className="absolute pointer-events-none"
          style={{
            width: 600,
            height: 600,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(244,63,94,0.08) 0%, transparent 70%)',
            top: '30%',
            left: '-15%',
          }}
        />

        {/* Top — logo */}
        <div className="relative z-10 px-14 pt-14">
          <BolchatLogo size="md" />
        </div>

        {/* Mid — editorial headline */}
        <div className="relative z-10 px-14 pb-4">
          <p
            className="text-[10px] tracking-[0.25em] font-semibold mb-6 uppercase"
            style={{ color: '#f43f5e', letterSpacing: '0.22em' }}
          >
            Command Center
          </p>
          <h1
            className="font-cabinet leading-[1.08] mb-8"
            style={{
              fontSize: 'clamp(2.4rem, 3.2vw, 3.6rem)',
              color: '#f1f5f9',
              fontWeight: 700,
            }}
          >
            Intelligent support,<br />
            <span style={{ color: '#94a3b8', fontWeight: 400 }}>on every channel.</span>
          </h1>
          <p
            className="text-sm leading-relaxed max-w-sm"
            style={{ color: '#475569', lineHeight: 1.75 }}
          >
            Manage your AI agents, knowledge bases, and live analytics — all
            from one frictionless workspace.
          </p>

          {/* Stat row */}
          <div className="flex items-center gap-10 mt-12">
            {[
              { value: '52+', label: 'Languages' },
              { value: '98%', label: 'Accuracy' },
              { value: '24/7', label: 'Uptime' },
            ].map((s, i) => (
              <div key={i}>
                <div
                  className="font-cabinet font-bold"
                  style={{ fontSize: '1.6rem', color: '#f1f5f9', lineHeight: 1 }}
                >
                  {s.value}
                </div>
                <div
                  className="text-[10px] mt-1 uppercase tracking-widest font-semibold"
                  style={{ color: '#334155' }}
                >
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom — footer hint */}
        <div
          className="relative z-10 px-14 pb-10 flex items-center gap-2"
          style={{ borderTop: '1px solid rgba(255,255,255,0.04)', paddingTop: 24 }}
        >
          <span className="text-xs" style={{ color: '#475569' }}>Welcome to Bolchat Dashboard</span>
        </div>
      </div>

      {/* ── Right panel — login form ── */}
      <div className="flex-1 flex flex-col justify-center items-center px-6 relative" style={{ background: '#080b14' }}>

        {/* Very faint radial for depth */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse 60% 50% at 50% 60%, rgba(244,63,94,0.04) 0%, transparent 100%)',
          }}
        />

        {/* Mobile logo */}
        <div className="lg:hidden mb-10 relative z-10">
          <BolchatLogo size="md" />
        </div>

        <div className="w-full max-w-[360px] relative z-10">

          {/* Heading */}
          <div className="mb-10">
            <h2
              className="font-cabinet font-bold mb-1.5"
              style={{ fontSize: '1.6rem', color: '#f1f5f9', letterSpacing: '-0.02em' }}
            >
              Welcome back
            </h2>
            <p className="text-sm" style={{ color: '#475569' }}>
              Sign in to your organisation's workspace.
            </p>
          </div>

          {/* Error */}
          {state?.error && (
            <div
              className="flex items-start gap-3 p-3.5 rounded-xl mb-6 text-sm"
              style={{
                background: 'rgba(239,68,68,0.08)',
                border: '1px solid rgba(239,68,68,0.18)',
                color: '#fca5a5',
              }}
            >
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{state.error}</span>
            </div>
          )}

          <form action={formAction} className="space-y-4">

            {/* Email */}
            <div>
              <label
                className="block text-xs font-semibold mb-2 uppercase tracking-widest"
                style={{ color: '#475569', letterSpacing: '0.12em' }}
              >
                Business Email
              </label>
              <div className="relative">
                <Mail
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
                  style={{ color: '#334155' }}
                />
                <input
                  ref={inputRef}
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="you@company.com"
                  className="w-full h-11 pl-10 pr-4 text-sm rounded-xl outline-none transition-all duration-200"
                  style={{
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.07)',
                    color: '#f1f5f9',
                  }}
                  onFocus={e => {
                    e.currentTarget.style.borderColor = 'rgba(244,63,94,0.5)';
                    e.currentTarget.style.boxShadow = '0 0 0 3px rgba(244,63,94,0.08)';
                  }}
                  onBlur={e => {
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label
                  className="block text-xs font-semibold uppercase tracking-widest"
                  style={{ color: '#475569', letterSpacing: '0.12em' }}
                >
                  Password
                </label>
                {/* TODO: Forgot/Reset password not implemented yet
                <Link href="/forgot-password" className="text-xs" style={{ color: '#f43f5e' }}>
                  Forgot?
                </Link>
                */}
              </div>
              <div className="relative">
                <Lock
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
                  style={{ color: '#334155' }}
                />
                <input
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  pattern=".*[A-Z].*"
                  title="Password must contain at least one uppercase letter"
                  autoComplete="current-password"
                  placeholder="••••••••"
                  className="w-full h-11 pl-10 pr-10 text-sm rounded-xl outline-none transition-all duration-200"
                  style={{
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.07)',
                    color: '#f1f5f9',
                  }}
                  onFocus={e => {
                    e.currentTarget.style.borderColor = 'rgba(244,63,94,0.5)';
                    e.currentTarget.style.boxShadow = '0 0 0 3px rgba(244,63,94,0.08)';
                  }}
                  onBlur={e => {
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                />
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={() => setShowPassword(v => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 transition-colors duration-150"
                  style={{ color: '#334155' }}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Terms and conditions checkbox */}
            <div className="flex items-center gap-2.5 pt-1">
              <div className="relative flex items-center justify-center">
                <input
                  type="checkbox"
                  required
                  id="terms"
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                  className="peer appearance-none w-4 h-4 rounded-[4px] cursor-pointer transition-all duration-200 shrink-0"
                  style={{
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.15)',
                  }}
                />
                <div className="absolute pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity duration-200">
                  <svg width="10" height="8" viewBox="0 0 10 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1 4L3.5 6.5L9 1" stroke="#f43f5e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </div>
              <label htmlFor="terms" className="text-[11px] leading-tight cursor-pointer select-none" style={{ color: '#94a3b8' }}>
                I agree to the{' '}
                <Link href="/terms" className="text-white hover:text-rose-400 transition-colors font-medium">Terms of Service</Link>
                {' '}and{' '}
                <Link href="/privacy" className="text-white hover:text-rose-400 transition-colors font-medium">Privacy Policy</Link>
              </label>
            </div>

            <div className="pt-2">
              <SubmitButton disabled={!termsAccepted} />
            </div>
          </form>

          {/* Footer links */}
          <div className="mt-12 flex items-center justify-center gap-6">
            {[
              { href: '/privacy', label: 'Privacy' },
              { href: '/terms', label: 'Terms' },
              { href: '/security', label: 'Security' },
            ].map(link => (
              <Link
                key={link.href}
                href={link.href}
                className="text-[10px] uppercase tracking-widest font-semibold transition-colors duration-150 hover:text-rose-500"
                style={{ color: '#1e293b', letterSpacing: '0.15em' }}
              >
                {link.label}
              </Link>
            ))}
          </div>
          <p className="text-center mt-4 text-[10px]" style={{ color: '#1e293b' }}>
            © 2026 BolChat
          </p>
        </div>
      </div>
    </div>
  );
}
