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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
          <Link href="/planner" className="glass-panel p-6 rounded-3xl border-white/20 hover:-translate-y-1 hover:border-primary/50 hover:shadow-2xl transition-all cursor-pointer group">
            <h3 className="font-extrabold text-lg mb-2 flex items-center gap-2">🗓️ Planner</h3>
            <p className="text-sm text-foreground/70 font-medium">Manage timetable and to-do list synchronously.</p>
          </Link>
          <Link href="/timer" className="glass-panel p-6 rounded-3xl border-white/20 hover:-translate-y-1 hover:border-primary/50 hover:shadow-2xl transition-all cursor-pointer group">
            <h3 className="font-extrabold text-lg mb-2 flex items-center gap-2">⏱️ Timer</h3>
            <p className="text-sm text-foreground/70 font-medium">Pomodoro sessions with Strict Mode ambient noise.</p>
          </Link>
          <Link href="/finance" className="glass-panel p-6 rounded-3xl border-white/20 hover:-translate-y-1 hover:border-primary/50 hover:shadow-2xl transition-all cursor-pointer group">
            <h3 className="font-extrabold text-lg mb-2 flex items-center gap-2">💰 Finance</h3>
            <p className="text-sm text-foreground/70 font-medium">Track budgets with integer-cents logic.</p>
          </Link>
          <Link href="/flashcards" className="glass-panel p-6 rounded-3xl border-white/20 hover:-translate-y-1 hover:border-primary/50 hover:shadow-2xl transition-all cursor-pointer group">
            <h3 className="font-extrabold text-lg mb-2 flex items-center gap-2">🎓 Deck</h3>
            <p className="text-sm text-foreground/70 font-medium">FSRS algorithm spaced repetition flashcards.</p>
          </Link>
          <Link href="/tutor" className="glass-panel p-6 rounded-3xl border-primary hover:-translate-y-1 hover:shadow-2xl hover:shadow-primary/30 transition-all cursor-pointer group relative overflow-hidden bg-primary/10">
            <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 to-purple-500/20 blur-2xl opacity-50 group-hover:opacity-100 transition-opacity"></div>
            <h3 className="font-extrabold text-lg mb-2 flex items-center gap-2 relative z-10 text-primary">✨ Tutor <span className="opacity-0 group-hover:opacity-100 transition-opacity group-hover:translate-x-1 ml-auto">→</span></h3>
            <p className="text-sm text-foreground/80 font-medium relative z-10">AI Socratic Chat rendering LaTeX mathematics.</p>
          </Link>
        </div>
      </div>
    </div>
  )
}
