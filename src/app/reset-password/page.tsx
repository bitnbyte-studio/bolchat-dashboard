"use client";

import React, { useState, useActionState, useEffect } from 'react';
import { Lock, Eye, EyeOff, Loader2, AlertCircle, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { forceResetPasswordAction } from "@/app/actions/auth";
import { useFormStatus } from 'react-dom';
import { BolchatLogo } from "@/components/BolchatLogo";

/* ── Password strength helper ── */
function getStrength(pw: string): { score: number; label: string; color: string } {
  if (!pw) return { score: 0, label: '', color: '#1e293b' };
  let score = 0;
  if (pw.length >= 8) score++;
  if (pw.length >= 12) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  if (score <= 1) return { score, label: 'Weak', color: '#ef4444' };
  if (score <= 3) return { score, label: 'Fair', color: '#f59e0b' };
  if (score === 4) return { score, label: 'Good', color: '#3b82f6' };
  return { score, label: 'Strong', color: '#10b981' };
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="group relative w-full h-11 overflow-hidden rounded-xl font-semibold text-sm tracking-wide transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-50"
      style={{ background: 'linear-gradient(135deg, #f43f5e 0%, #e11d48 100%)' }}
    >
      <span className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none" />
      <span className="relative flex items-center justify-center gap-2 text-white">
        {pending ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Updating…</span>
          </>
        ) : (
          <span>Set New Password</span>
        )}
      </span>
    </button>
  );
}

export default function ResetPasswordPage() {
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [newPw, setNewPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const router = useRouter();
  const [state, formAction] = useActionState(forceResetPasswordAction, null);
  const strength = getStrength(newPw);

  /* Requirements checklist */
  const reqs = [
    { label: 'At least 8 characters', met: newPw.length >= 8 },
    { label: 'One uppercase letter', met: /[A-Z]/.test(newPw) },
    { label: 'One number', met: /[0-9]/.test(newPw) },
    { label: 'Passwords match', met: newPw.length > 0 && newPw === confirmPw },
  ];

  useEffect(() => {
    if (state?.success && state.redirect) router.push(state.redirect);
  }, [state, router]);

  const inputBase: React.CSSProperties = {
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.07)',
    color: '#f1f5f9',
  };

  function handleFocus(e: React.FocusEvent<HTMLInputElement>) {
    e.currentTarget.style.borderColor = 'rgba(244,63,94,0.5)';
    e.currentTarget.style.boxShadow = '0 0 0 3px rgba(244,63,94,0.08)';
  }
  function handleBlur(e: React.FocusEvent<HTMLInputElement>) {
    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)';
    e.currentTarget.style.boxShadow = 'none';
  }

  return (
    <div
      className="min-h-screen flex flex-col justify-center items-center px-6 font-satoshi relative"
      style={{ background: '#080b14' }}
    >
      {/* Very faint radial */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 55% 50% at 50% 55%, rgba(244,63,94,0.05) 0%, transparent 100%)',
        }}
      />

      {/* Subtle grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      <div className="w-full max-w-[420px] relative z-10">

        {/* Logo */}
        <div className="flex justify-center mb-10">
          <BolchatLogo size="md" />
        </div>

        {/* Security badge */}
        <div
          className="flex items-center gap-2.5 px-4 py-3 rounded-xl mb-8"
          style={{
            background: 'rgba(244,63,94,0.06)',
            border: '1px solid rgba(244,63,94,0.14)',
          }}
        >
          <ShieldCheck className="w-4 h-4 flex-shrink-0" style={{ color: '#f43f5e' }} />
          <div>
            <p className="text-xs font-semibold" style={{ color: '#f43f5e' }}>
              First Login — Password Update Required
            </p>
            <p className="text-xs mt-0.5" style={{ color: '#64748b' }}>
              Your organisation requires you to set a personal password.
            </p>
          </div>
        </div>

        {/* Heading */}
        <div className="mb-8">
          <h1
            className="font-cabinet font-bold mb-1"
            style={{ fontSize: '1.5rem', color: '#f1f5f9', letterSpacing: '-0.02em' }}
          >
            Set your password
          </h1>
          <p className="text-sm" style={{ color: '#475569' }}>
            Choose something strong. You'll use this every time you sign in.
          </p>
        </div>

        {/* Error */}
        {state?.error && (
          <div
            className="flex items-start gap-3 p-3.5 rounded-xl mb-5 text-sm"
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

          {/* New Password */}
          <div>
            <label
              className="block text-xs font-semibold uppercase tracking-widest mb-2"
              style={{ color: '#475569', letterSpacing: '0.12em' }}
            >
              New Password
            </label>
            <div className="relative">
              <Lock
                className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
                style={{ color: '#334155' }}
              />
              <input
                name="newPassword"
                type={showNew ? 'text' : 'password'}
                required
                pattern=".*[A-Z].*"
                title="Password must contain at least one uppercase letter"
                placeholder="••••••••"
                value={newPw}
                onChange={e => setNewPw(e.target.value)}
                className="w-full h-11 pl-10 pr-10 text-sm rounded-xl outline-none transition-all duration-200"
                style={inputBase}
                onFocus={handleFocus}
                onBlur={handleBlur}
              />
              <button
                type="button"
                tabIndex={-1}
                onClick={() => setShowNew(v => !v)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 transition-colors"
                style={{ color: '#334155' }}
              >
                {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {/* Strength bar */}
            {newPw && (
              <div className="mt-2.5">
                <div className="flex gap-1 mb-1.5">
                  {[1, 2, 3, 4, 5].map(i => (
                    <div
                      key={i}
                      className="flex-1 h-[3px] rounded-full transition-all duration-400"
                      style={{
                        background: i <= strength.score ? strength.color : 'rgba(255,255,255,0.07)',
                      }}
                    />
                  ))}
                </div>
                <p className="text-[11px] font-semibold" style={{ color: strength.color }}>
                  {strength.label}
                </p>
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label
              className="block text-xs font-semibold uppercase tracking-widest mb-2"
              style={{ color: '#475569', letterSpacing: '0.12em' }}
            >
              Confirm Password
            </label>
            <div className="relative">
              <Lock
                className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
                style={{ color: '#334155' }}
              />
              <input
                name="confirmPassword"
                type={showConfirm ? 'text' : 'password'}
                required
                pattern=".*[A-Z].*"
                title="Password must contain at least one uppercase letter"
                placeholder="••••••••"
                value={confirmPw}
                onChange={e => setConfirmPw(e.target.value)}
                className="w-full h-11 pl-10 pr-10 text-sm rounded-xl outline-none transition-all duration-200"
                style={{
                  ...inputBase,
                  borderColor:
                    confirmPw && newPw !== confirmPw
                      ? 'rgba(239,68,68,0.5)'
                      : confirmPw && newPw === confirmPw
                        ? 'rgba(16,185,129,0.4)'
                        : 'rgba(255,255,255,0.07)',
                }}
                onFocus={handleFocus}
                onBlur={handleBlur}
              />
              <button
                type="button"
                tabIndex={-1}
                onClick={() => setShowConfirm(v => !v)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 transition-colors"
                style={{ color: '#334155' }}
              >
                {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Requirements checklist */}
          <div
            className="p-4 rounded-xl space-y-2"
            style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}
          >
            {reqs.map((r, i) => (
              <div key={i} className="flex items-center gap-2.5">
                <CheckCircle2
                  className="w-3.5 h-3.5 flex-shrink-0 transition-colors duration-300"
                  style={{ color: r.met ? '#10b981' : '#1e293b' }}
                />
                <span
                  className="text-xs transition-colors duration-300"
                  style={{ color: r.met ? '#94a3b8' : '#334155' }}
                >
                  {r.label}
                </span>
              </div>
            ))}
          </div>

          <div className="pt-1">
            <SubmitButton />
          </div>
        </form>

        <p className="text-center mt-10 text-[10px]" style={{ color: '#1e293b' }}>
          © 2026 BolChat — All rights reserved
        </p>
      </div>
    </div>
  );
}
