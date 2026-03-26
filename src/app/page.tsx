import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function Home() {
  const supabase = await createClient()
  const { data, error } = await supabase.auth.getUser()

  if (error || !data?.user) {
    redirect('/login')
  }

  return (
    <div className="min-h-screen p-8 bg-background relative">
      <div className="absolute inset-0 z-0"></div>
      <div className="glass-panel p-8 rounded-3xl w-full max-w-5xl mx-auto z-10 relative">
        <div className="flex justify-between items-center mb-12">
          <h1 className="text-4xl font-extrabold tracking-tight">StudentOS Dashboard</h1>
          <form action="/auth/signout" method="post">
            <button className="bg-red-500/10 text-red-500 border border-red-500/20 px-6 py-2 rounded-xl font-bold hover:bg-red-500/20 hover:scale-105 transition-all">
              Sign Out
            </button>
          </form>
        </div>
        
        <div className="p-6 bg-foreground/5 rounded-2xl border border-foreground/10 mb-8">
          <p className="text-xl">Welcome, <span className="font-bold text-primary">{data.user.email}</span>!</p>
          <p className="mt-2 text-foreground/70">Your architecture and security baseline is active.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-panel p-6 rounded-2xl border-white/10 opacity-50 cursor-not-allowed">
            <h3 className="font-bold text-lg mb-2">🗓️ Unified Planner</h3>
            <p className="text-sm">Phase 2 Module: Pending Implementation</p>
          </div>
          <div className="glass-panel p-6 rounded-2xl border-white/10 opacity-50 cursor-not-allowed">
            <h3 className="font-bold text-lg mb-2">⏱️ Focus Timer</h3>
            <p className="text-sm">Phase 2 Module: Pending Implementation</p>
          </div>
          <div className="glass-panel p-6 rounded-2xl border-white/10 opacity-50 cursor-not-allowed">
            <h3 className="font-bold text-lg mb-2">💰 Financial Tracker</h3>
            <p className="text-sm">Phase 2 Module: Pending Implementation</p>
          </div>
        </div>
      </div>
    </div>
  )
}
