import { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { BolchatLogo } from "@/components/BolchatLogo"

export const metadata: Metadata = {
  title: "Security | BolChat",
  description: "BolChat Security Practices",
}

export default function SecurityPage() {
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
            Infrastructure
          </p>
          <h1 className="font-cabinet leading-[1.08] mb-6" style={{ fontSize: 'clamp(2.4rem, 4vw, 3.6rem)', color: '#f1f5f9', fontWeight: 700 }}>
            Security
          </h1>
          <p className="text-sm" style={{ color: '#475569' }}>Enterprise-grade protection by default.</p>
        </div>

        <div className="space-y-12">
          <section>
            <h2 className="font-cabinet font-bold mb-4" style={{ fontSize: '1.4rem', color: '#f1f5f9' }}>Data Protection & Encryption</h2>
            <div className="space-y-4 text-sm leading-relaxed" style={{ color: '#94a3b8' }}>
              <p>
                Security is foundational to our architecture. All data transmitted between our clients (including the dashboard and embedded chat widgets) and our servers is encrypted in transit using industry-standard TLS 1.3. 
              </p>
              <p>
                At rest, all customer data, chat logs, and configuration details are encrypted using AES-256 block-level encryption. We leverage managed Key Management Services (KMS) to handle cryptographic keys, ensuring separation of duties and rigorous access controls.
              </p>
            </div>
          </section>

          <section>
            <h2 className="font-cabinet font-bold mb-4" style={{ fontSize: '1.4rem', color: '#f1f5f9' }}>Access Control & Identity Management</h2>
            <div className="space-y-4 text-sm leading-relaxed" style={{ color: '#94a3b8' }}>
              <p>
                Internal access to production infrastructure is strictly limited to authorized engineering personnel based on the principle of least privilege. Access requires multi-factor authentication (MFA), strong passwords, and connections via secure VPNs.
              </p>
              <p>
                For our customers, the BolChat dashboard supports role-based access control (RBAC), allowing you to restrict permissions within your organization. We mandate password complexity requirements and support two-factor authentication (2FA) for all administrative accounts.
              </p>
            </div>
          </section>

          <section>
            <h2 className="font-cabinet font-bold mb-4" style={{ fontSize: '1.4rem', color: '#f1f5f9' }}>Compliance & Privacy Standards</h2>
            <div className="space-y-4 text-sm leading-relaxed" style={{ color: '#94a3b8' }}>
              <p>
                We design our systems to comply with leading global privacy regulations, including the General Data Protection Regulation (GDPR) and the California Consumer Privacy Act (CCPA). We offer data processing agreements (DPAs) for customers operating in regulated regions.
              </p>
              <p>
                Our infrastructure providers maintain a comprehensive array of compliance certifications, including SOC 2 Type II, ISO 27001, and PCI-DSS, ensuring the underlying physical and network security of our platform.
              </p>
            </div>
          </section>

          <section>
            <h2 className="font-cabinet font-bold mb-4" style={{ fontSize: '1.4rem', color: '#f1f5f9' }}>Continuous Monitoring & Incident Response</h2>
            <div className="space-y-4 text-sm leading-relaxed" style={{ color: '#94a3b8' }}>
              <p>
                Our systems are continuously monitored for suspicious activity, performance anomalies, and potential security threats. We employ automated logging and alerting mechanisms that notify our security operations team in real-time.
              </p>
              <p>
                In the event of a security incident, our incident response plan is immediately activated. This plan includes defined procedures for containment, eradication, recovery, and communication with affected customers within legally mandated timeframes.
              </p>
            </div>
          </section>
        </div>

        <div className="mt-20 pt-8 border-t" style={{ borderColor: 'rgba(255,255,255,0.04)' }}>
          <p className="text-xs" style={{ color: '#64748b' }}>
            For responsible disclosure or security inquiries, contact <a href="mailto:support@bolchat.tech" className="text-white hover:text-rose-400 transition-colors">support@bolchat.tech</a>.
          </p>
        </div>
      </main>
    </div>
  )
}
