import { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { BolchatLogo } from "@/components/BolchatLogo"

export const metadata: Metadata = {
  title: "Privacy Policy | BolChat",
  description: "BolChat Privacy Policy and Data Handling",
}

export default function PrivacyPage() {
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
            Privacy Policy
          </h1>
          <p className="text-sm" style={{ color: '#475569' }}>Effective Date: January 1, 2026</p>
        </div>

        <div className="space-y-12">
          <section>
            <h2 className="font-cabinet font-bold mb-4" style={{ fontSize: '1.4rem', color: '#f1f5f9' }}>1. Information We Collect</h2>
            <div className="space-y-4 text-sm leading-relaxed" style={{ color: '#94a3b8' }}>
              <p>
                <strong>Information you provide to us:</strong> We collect information that you provide directly to us when you create an account, modify your profile, request customer support, or otherwise communicate with us. This information may include your name, company name, email address, phone number, billing address, and payment method details.
              </p>
              <p>
                <strong>Information we collect automatically:</strong> When you access or use our services, we automatically collect information about you, including log data (such as IP address, browser type, and operating system), device information, and usage information (such as the pages you visit and the actions you take within our dashboard). We use cookies and similar tracking technologies to collect this data.
              </p>
              <p>
                <strong>Customer Data:</strong> In the course of using BolChat to provide support to your end-users, we process chat logs, visitor IP addresses, and language preferences on your behalf. This data is strictly governed by the data processing agreement outlined in our Terms of Service.
              </p>
            </div>
          </section>

          <section>
            <h2 className="font-cabinet font-bold mb-4" style={{ fontSize: '1.4rem', color: '#f1f5f9' }}>2. Use of Information</h2>
            <div className="space-y-4 text-sm leading-relaxed" style={{ color: '#94a3b8' }}>
              <p>
                We use the information we collect to operate, maintain, and provide the features and functionality of our services. This includes:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Processing your transactions and managing your account.</li>
                <li>Responding to your comments, questions, and customer service requests.</li>
                <li>Monitoring and analyzing trends, usage, and activities in connection with our services.</li>
                <li>Detecting, investigating, and preventing fraudulent transactions and other illegal activities.</li>
                <li>Personalizing and improving the services, and providing advertisements, content, or features that match user profiles or interests.</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="font-cabinet font-bold mb-4" style={{ fontSize: '1.4rem', color: '#f1f5f9' }}>3. Sharing of Information</h2>
            <div className="space-y-4 text-sm leading-relaxed" style={{ color: '#94a3b8' }}>
              <p>
                We do not share your personal information with third parties except as described in this privacy policy. We may share information with:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li><strong>Service Providers:</strong> We share information with vendors, consultants, and other service providers who need access to such information to carry out work on our behalf (e.g., payment processing, cloud hosting).</li>
                <li><strong>Legal Compliance:</strong> We may disclose information if we believe disclosure is in accordance with, or required by, any applicable law, regulation, or legal process.</li>
                <li><strong>Business Transfers:</strong> We may share or transfer your information in connection with, or during negotiations of, any merger, sale of company assets, financing, or acquisition of all or a portion of our business to another company.</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="font-cabinet font-bold mb-4" style={{ fontSize: '1.4rem', color: '#f1f5f9' }}>4. Data Retention and Security</h2>
            <div className="space-y-4 text-sm leading-relaxed" style={{ color: '#94a3b8' }}>
              <p>
                We store the information we collect for as long as is necessary for the purpose(s) for which we originally collected it. We may retain certain information for legitimate business purposes or as required by law.
              </p>
              <p>
                We take reasonable administrative, technical, and physical measures to help protect information about you from loss, theft, misuse, and unauthorized access, disclosure, alteration, and destruction. However, no internet transmission is completely secure, and we cannot guarantee the absolute security of your data.
              </p>
            </div>
          </section>
          
          <section>
            <h2 className="font-cabinet font-bold mb-4" style={{ fontSize: '1.4rem', color: '#f1f5f9' }}>5. Your Rights and Choices</h2>
            <div className="space-y-4 text-sm leading-relaxed" style={{ color: '#94a3b8' }}>
              <p>
                Depending on your location, you may have certain rights regarding your personal information, including the right to access, correct, or delete your data. You may update or correct your account information at any time by logging into your account. If you wish to delete your account or exercise other data rights, please contact us at the email provided below.
              </p>
            </div>
          </section>
        </div>

        <div className="mt-20 pt-8 border-t" style={{ borderColor: 'rgba(255,255,255,0.04)' }}>
          <p className="text-xs" style={{ color: '#64748b' }}>
            If you have any questions about this Privacy Policy, please contact us at <a href="mailto:support@bolchat.tech" className="text-white hover:text-rose-400 transition-colors">support@bolchat.tech</a>.
          </p>
        </div>
      </main>
    </div>
  )
}
