import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

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
          <Link href="/planner" className="glass-panel p-6 rounded-3xl border-white/20 hover:scale-[1.03] hover:border-primary/50 hover:shadow-primary/20 transition-all cursor-pointer group">
            <h3 className="font-extrabold text-xl mb-2 flex items-center gap-2">🗓️ Unified Planner <span className="opacity-0 group-hover:opacity-100 transition-opacity translate-x-[-10px] group-hover:translate-x-0 ml-auto">→</span></h3>
            <p className="text-sm text-foreground/70 font-medium">Manage your calendar and actionable to-do list synchronously.</p>
          </Link>
          <Link href="/timer" className="glass-panel p-6 rounded-3xl border-white/20 hover:scale-[1.03] hover:border-primary/50 hover:shadow-primary/20 transition-all cursor-pointer group">
            <h3 className="font-extrabold text-xl mb-2 flex items-center gap-2">⏱️ Focus Timer <span className="opacity-0 group-hover:opacity-100 transition-opacity translate-x-[-10px] group-hover:translate-x-0 ml-auto">→</span></h3>
            <p className="text-sm text-foreground/70 font-medium">Pomodoro sessions with Strict Mode and procedural ambient noise.</p>
          </Link>
          <Link href="/finance" className="glass-panel p-6 rounded-3xl border-white/20 hover:scale-[1.03] hover:border-primary/50 hover:shadow-primary/20 transition-all cursor-pointer group">
            <h3 className="font-extrabold text-xl mb-2 flex items-center gap-2">💰 Financial Tracker <span className="opacity-0 group-hover:opacity-100 transition-opacity translate-x-[-10px] group-hover:translate-x-0 ml-auto">→</span></h3>
            <p className="text-sm text-foreground/70 font-medium">Track budgets with strict integer-cents accounting precision.</p>
          </Link>
        </div>
      </div>
    </div>
  )
}
