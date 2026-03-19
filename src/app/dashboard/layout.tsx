import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen bg-slate-50 dark:bg-[#0a0f1e] font-satoshi text-slate-900 dark:text-slate-100 overflow-hidden transition-colors duration-300">
      {/* Background Subtle Gradient for Dark Mode */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-0 hidden dark:block">
         <div className="absolute top-0 left-1/4 w-[800px] h-[400px] bg-rose-500/5 blur-[120px] rounded-full"></div>
         <div className="absolute bottom-0 right-1/4 w-[600px] h-[400px] bg-indigo-500/5 blur-[120px] rounded-full"></div>
      </div>
      
      <Sidebar />
      <div className="flex-1 lg:ml-20 flex flex-col h-screen overflow-hidden relative z-10 transition-all duration-300 w-full">
        <Header />
        <main className="flex-1 overflow-y-auto scroll-smooth animate-fade-in pb-24 scrollbar-hide p-4 md:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}
