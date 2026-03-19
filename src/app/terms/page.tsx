import { Metadata } from "next"
import Link from "next/link"
import { Scale, ArrowLeft } from "lucide-react"

export const metadata: Metadata = {
  title: "Terms of Service | BolChat AI",
  description: "BolChat AI Terms and Conditions",
}

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#0a0f1e] flex flex-col relative overflow-hidden font-satoshi">
      {/* Background Orbs */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-rose-600/20 rounded-full blur-[120px] pointer-events-none mix-blend-screen"></div>
      <div className="absolute bottom-1/4 left-1/4 w-[300px] h-[300px] bg-pink-600/20 rounded-full blur-[120px] pointer-events-none mix-blend-screen"></div>

      <div className="flex-1 w-full max-w-4xl mx-auto px-6 py-12 lg:py-24 relative z-10 flex flex-col">
        <div className="mb-12">
          <Link href="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors group text-sm font-bold uppercase tracking-widest">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Login
          </Link>
        </div>

        <div className="mb-16">
          <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 shadow-xl shadow-rose-500/10">
            <Scale className="w-8 h-8 text-rose-500" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white font-cabinet tracking-tight mb-4">Terms of Service</h1>
          <p className="text-xl text-slate-400">Last updated: October 2024</p>
        </div>

        <div className="prose prose-invert prose-rose max-w-none">
          <div className="bg-white/5 border border-white/10 rounded-3xl p-8 md:p-12 shadow-2xl backdrop-blur-sm space-y-8">
            <section>
              <h2 className="text-2xl font-bold text-white font-cabinet mb-4">1. Acceptance of Terms</h2>
              <p className="text-slate-300 leading-relaxed">
                By accessing and embedding the BolChat AI service ("Service"), you agree to be bound by these Terms of Service. This Service is strictly provided for registered businesses engaging in automated customer support and analytics tracking. 
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white font-cabinet mb-4">2. Account Credentials</h2>
              <p className="text-slate-300 leading-relaxed">
                You are responsible for safeguarding the password that you use to access the Service and for any activities or actions under your password. You agree not to disclose your password to any third party and to implement required 2FA protocols when accessing the BolChat Admin Dashboard.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white font-cabinet mb-4">3. Prohibited Usage</h2>
              <p className="text-slate-300 leading-relaxed">
                The AI models provided via the BolChat widget must not be manipulated, prompted, or reverse-engineered to bypass predefined behavioral guardrails. You may not deploy the widget on domains outside of your approved billing plan's allowed list. Attempting to bypass the CORS restrictions or manipulate the Knowledge Base indexing API will result in immediate account termination.
              </p>
            </section>
            
            <section className="pt-8 mt-8 border-t border-white/10">
              <p className="text-sm text-slate-500 uppercase tracking-widest font-bold">
                For legal inquiries, please contact legal@bolchat.ai
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
