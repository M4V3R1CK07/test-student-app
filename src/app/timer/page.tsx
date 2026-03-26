import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import PomodoroTimer from '@/components/timer/PomodoroTimer'

export default async function TimerPage() {
  const supabase = await createClient()
  const { data, error } = await supabase.auth.getUser()

  if (error || !data?.user) {
    redirect('/login')
  }

  return (
    <div className="min-h-screen p-4 md:p-8 bg-background relative overflow-hidden transition-colors duration-1000">
      <div className="absolute inset-0 z-0 bg-[url('/noise.png')] opacity-10 mix-blend-overlay pointer-events-none"></div>
      
      <div className="max-w-[1600px] mx-auto z-10 relative h-full flex flex-col min-h-[calc(100vh-4rem)]">
        <header className="flex items-center gap-4 mb-4">
          <Link href="/" className="p-3 glass-panel rounded-full hover:scale-110 hover:bg-white/20 transition-all group">
            <ArrowLeft className="w-5 h-5 text-foreground group-hover:-translate-x-1 transition-transform" />
          </Link>
          <h1 className="text-3xl font-black tracking-tight drop-shadow-sm">Focus Timer</h1>
        </header>
        
        <main className="flex-1 flex items-center justify-center p-4">
          <PomodoroTimer />
        </main>
      </div>
    </div>
  )
}
