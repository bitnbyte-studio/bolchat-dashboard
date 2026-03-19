import { Metadata } from "next"
import Link from "next/link"
import { Shield, ArrowLeft } from "lucide-react"

export const metadata: Metadata = {
  title: "Privacy Policy | BolChat AI",
  description: "BolChat AI Privacy Policy and Data Handling",
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#0a0f1e] flex flex-col relative overflow-hidden font-satoshi">
      {/* Background Orbs */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-rose-600/20 rounded-full blur-[120px] pointer-events-none mix-blend-screen"></div>
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-pink-600/20 rounded-full blur-[120px] pointer-events-none mix-blend-screen"></div>

      <div className="flex-1 w-full max-w-4xl mx-auto px-6 py-12 lg:py-24 relative z-10 flex flex-col">
        <div className="mb-12">
          <Link href="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors group text-sm font-bold uppercase tracking-widest">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Login
          </Link>
        </div>

        <div className="mb-16">
          <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 shadow-xl shadow-rose-500/10">
            <Shield className="w-8 h-8 text-rose-500" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white font-cabinet tracking-tight mb-4">Privacy Policy</h1>
          <p className="text-xl text-slate-400">Last updated: October 2024</p>
        </div>

        <div className="prose prose-invert prose-rose max-w-none">
          <div className="bg-white/5 border border-white/10 rounded-3xl p-8 md:p-12 shadow-2xl backdrop-blur-sm space-y-8">
            <section>
              <h2 className="text-2xl font-bold text-white font-cabinet mb-4">1. Data Collection & Processing</h2>
              <p className="text-slate-300 leading-relaxed">
                BolChat AI explicitly collects data strictly necessary to provide intelligent chatbot services to your website visitors. This includes automated collection of interaction logs, detected languages, IP-based routing metrics, and browser configurations strictly authorized by your embed deployment.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white font-cabinet mb-4">2. Your Customer's Data</h2>
              <p className="text-slate-300 leading-relaxed">
                As a processor of your end-users' data, we enforce end-to-end encryption for all real-time chat handoffs. Conversation history is securely stored on enterprise-grade AWS infrastructure and gets aggressively purged according to the data retention policy configured in your Analytics module.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white font-cabinet mb-4">3. Security Infrastructure</h2>
              <p className="text-slate-300 leading-relaxed">
                We maintain active SOC 2 Type II compliance and regularly submit to comprehensive third-party penetration testing. The administrative dashboard enforces modern SSL protocols and requires secure authentication to access any operational logs.
              </p>
            </section>
            
            <section className="pt-8 mt-8 border-t border-white/10">
              <p className="text-sm text-slate-500 uppercase tracking-widest font-bold">
                For complete privacy inquiries, please contact privacy@bolchat.ai
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
