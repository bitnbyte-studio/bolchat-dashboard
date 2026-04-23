import { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { BolchatLogo } from "@/components/BolchatLogo"

export const metadata: Metadata = {
  title: "Terms of Service | BolChat",
  description: "BolChat Terms and Conditions",
}

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col font-satoshi selection:bg-rose-500/30 selection:text-white" style={{ background: '#080b14' }}>
      {/* Editorial grid overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.018) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.018) 1px, transparent 1px)',
          backgroundSize: '80px 80px',
        }}
      />

      {/* Header */}
      <header className="relative z-10 w-full max-w-4xl mx-auto px-6 py-12 flex justify-between items-center">
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest transition-colors hover:text-rose-400 group"
          style={{ color: '#64748b', letterSpacing: '0.12em' }}
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> 
          Back
        </Link>
        <BolchatLogo size="sm" />
      </header>

      {/* Content */}
      <main className="flex-1 w-full max-w-3xl mx-auto px-6 pb-24 relative z-10">
        <div className="mb-16 pt-8 border-t" style={{ borderColor: 'rgba(255,255,255,0.04)' }}>
          <p className="text-[10px] tracking-[0.25em] font-semibold mb-6 uppercase" style={{ color: '#f43f5e' }}>
            Legal Framework
          </p>
          <h1 className="font-cabinet leading-[1.08] mb-6" style={{ fontSize: 'clamp(2.4rem, 4vw, 3.6rem)', color: '#f1f5f9', fontWeight: 700 }}>
            Terms of Service
          </h1>
          <p className="text-sm" style={{ color: '#475569' }}>Effective Date: January 1, 2026</p>
        </div>

        <div className="space-y-12">
          <section>
            <h2 className="font-cabinet font-bold mb-4" style={{ fontSize: '1.4rem', color: '#f1f5f9' }}>1. Agreement to Terms</h2>
            <div className="space-y-4 text-sm leading-relaxed" style={{ color: '#94a3b8' }}>
              <p>
                By accessing or using our services, including our dashboard and chat widgets, you agree to be bound by these Terms of Service. These Terms constitute a legally binding agreement between you (whether personally or on behalf of an entity) and BolChat concerning your access to and use of our services.
              </p>
              <p>
                We reserve the right to make changes or modifications to these Terms at any time and for any reason. We will alert you about any changes by updating the "Effective Date" of these Terms, and you waive any right to receive specific notice of each such change.
              </p>
            </div>
          </section>

          <section>
            <h2 className="font-cabinet font-bold mb-4" style={{ fontSize: '1.4rem', color: '#f1f5f9' }}>2. Acceptable Use and Restrictions</h2>
            <div className="space-y-4 text-sm leading-relaxed" style={{ color: '#94a3b8' }}>
              <p>
                You are granted a non-exclusive, non-transferable, revocable license to access and use the services strictly in accordance with these Terms. As a condition of your use of the site and services, you warrant to BolChat that you will not use the services for any purpose that is unlawful or prohibited by these Terms.
              </p>
              <p>Specifically, you agree not to:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Reverse engineer, decompile, or disassemble any part of the service.</li>
                <li>Use the service to transmit any malicious code, viruses, or harmful data.</li>
                <li>Attempt to bypass any measures of the service designed to prevent or restrict access to the service or any part thereof.</li>
                <li>Use the service in any manner that could disable, overburden, damage, or impair the site or interfere with any other party's use of the service.</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="font-cabinet font-bold mb-4" style={{ fontSize: '1.4rem', color: '#f1f5f9' }}>3. User Accounts and Security</h2>
            <div className="space-y-4 text-sm leading-relaxed" style={{ color: '#94a3b8' }}>
              <p>
                When you create an account, you must provide accurate, complete, and current information. You are solely responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You must notify us immediately upon becoming aware of any breach of security or unauthorized use of your account.
              </p>
              <p>
                We reserve the right to remove, reclaim, or change a username you select if we determine, in our sole discretion, that such username is inappropriate, obscene, or otherwise objectionable.
              </p>
            </div>
          </section>

          <section>
            <h2 className="font-cabinet font-bold mb-4" style={{ fontSize: '1.4rem', color: '#f1f5f9' }}>4. Intellectual Property</h2>
            <div className="space-y-4 text-sm leading-relaxed" style={{ color: '#94a3b8' }}>
              <p>
                The service and its original content, features, and functionality are and will remain the exclusive property of BolChat and its licensors. Our trademarks and trade dress may not be used in connection with any product or service without the prior written consent of BolChat.
              </p>
              <p>
                You retain all rights to any data or content you upload to the service. By submitting data, you grant us a worldwide, non-exclusive, royalty-free license to use, reproduce, and process the data solely for the purpose of providing the service to you.
              </p>
            </div>
          </section>

          <section>
            <h2 className="font-cabinet font-bold mb-4" style={{ fontSize: '1.4rem', color: '#f1f5f9' }}>5. Limitation of Liability</h2>
            <div className="space-y-4 text-sm leading-relaxed" style={{ color: '#94a3b8' }}>
              <p>
                In no event shall BolChat, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the service.
              </p>
            </div>
          </section>
        </div>

        <div className="mt-20 pt-8 border-t" style={{ borderColor: 'rgba(255,255,255,0.04)' }}>
          <p className="text-xs" style={{ color: '#64748b' }}>
            If you have any questions about these Terms, please contact us at <a href="mailto:support@bolchat.tech" className="text-white hover:text-rose-400 transition-colors">support@bolchat.tech</a>.
          </p>
        </div>
      </main>
    </div>
  )
}
