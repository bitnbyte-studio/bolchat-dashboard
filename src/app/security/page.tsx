import { Metadata } from "next"
import Link from "next/link"
import { Lock, ArrowLeft, Fingerprint, Network, Server } from "lucide-react"

export const metadata: Metadata = {
  title: "Security & Trust | BolChat AI",
  description: "BolChat AI Security Architecture and Compliance",
}

export default function SecurityPage() {
  return (
    <div className="min-h-screen bg-[#0a0f1e] flex flex-col relative overflow-hidden font-satoshi">
      {/* Background Orbs */}
      <div className="absolute top-[20%] right-0 w-[600px] h-[600px] bg-rose-600/10 rounded-full blur-[120px] pointer-events-none mix-blend-screen"></div>
      <div className="absolute bottom-0 left-[-10%] w-[500px] h-[500px] bg-pink-600/10 rounded-full blur-[120px] pointer-events-none mix-blend-screen"></div>

      <div className="flex-1 w-full max-w-4xl mx-auto px-6 py-12 lg:py-24 relative z-10 flex flex-col">
        <div className="mb-12">
          <Link href="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors group text-sm font-bold uppercase tracking-widest">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Login
          </Link>
        </div>

        <div className="mb-16">
          <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 shadow-xl shadow-rose-500/10">
            <Lock className="w-8 h-8 text-rose-500" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white font-cabinet tracking-tight mb-4">Security Architecture</h1>
          <p className="text-xl text-slate-400">Enterprise-grade protection for your conversational data.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
           <div className="bg-white/5 border border-white/10 p-6 rounded-2xl backdrop-blur-sm hover:border-rose-500/30 transition-colors">
              <Fingerprint className="w-6 h-6 text-rose-400 mb-4" />
              <h3 className="text-lg font-bold text-white font-cabinet mb-2">Access Control</h3>
              <p className="text-sm text-slate-400">Multi-factor authentication via TOTP and IP-based rate limiting on all dashboard routes.</p>
           </div>
           <div className="bg-white/5 border border-white/10 p-6 rounded-2xl backdrop-blur-sm hover:border-pink-500/30 transition-colors">
              <Network className="w-6 h-6 text-pink-400 mb-4" />
              <h3 className="text-lg font-bold text-white font-cabinet mb-2">Encryption in Transit</h3>
              <p className="text-sm text-slate-400">All data transferred between the widget and our servers is secured with TLS 1.3 encryption.</p>
           </div>
           <div className="bg-white/5 border border-white/10 p-6 rounded-2xl backdrop-blur-sm hover:border-orange-500/30 transition-colors">
              <Server className="w-6 h-6 text-orange-400 mb-4" />
              <h3 className="text-lg font-bold text-white font-cabinet mb-2">Data Residency</h3>
              <p className="text-sm text-slate-400">User chat logs and generated responses are isolated in AES-256 encrypted regional AWS databases.</p>
           </div>
        </div>

        <div className="prose prose-invert prose-rose max-w-none">
          <div className="bg-white/5 border border-white/10 rounded-3xl p-8 md:p-12 shadow-2xl backdrop-blur-sm space-y-8">
            <section>
              <h2 className="text-2xl font-bold text-white font-cabinet mb-4">Compliance & Auditing</h2>
              <p className="text-slate-300 leading-relaxed">
                BolChat AI conducts quarterly third-party penetration tests on both our Dashboard Application and the public-facing Chatbot Embed Widget. Our infrastructure conforms strictly to GDPR data processing agreements. If a vulnerability is suspected, please report it immediately through our coordinated disclosure program.
              </p>
            </section>
            
            <section className="pt-8 mt-8 border-t border-white/10">
              <p className="text-sm text-slate-500 uppercase tracking-widest font-bold">
                Responsible disclosure team: security@bolchat.ai
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
