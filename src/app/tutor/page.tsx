import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Sparkles } from 'lucide-react'
import SocraticChat from '@/components/pedagogy/SocraticChat'

export default async function TutorPage() {
  const supabase = await createClient()
  const { data, error } = await supabase.auth.getUser()

  if (error || !data?.user) {
    redirect('/login')
  }

  return (
    <div className="min-h-screen p-4 md:p-8 bg-background relative overflow-hidden">
      <div className="absolute inset-0 z-0 radial-blobs pointer-events-none opacity-20"></div>
      
      <div className="max-w-[1200px] mx-auto z-10 relative h-full flex flex-col min-h-[calc(100vh-4rem)]">
        <header className="flex items-center gap-4 mb-4">
          <Link href="/" className="p-3 glass-panel rounded-full hover:scale-110 hover:bg-white/20 transition-all group border-white/20 shadow-sm">
            <ArrowLeft className="w-5 h-5 text-foreground group-hover:-translate-x-1 transition-transform" />
          </Link>
          <h1 className="text-3xl font-black tracking-tight flex items-center gap-3">
            Socratic Tutor <Sparkles className="text-primary w-6 h-6 animate-pulse" />
          </h1>
        </header>
        
        <main className="flex-1 mt-2">
          <SocraticChat />
        </main>
      </div>
    </div>
  )
}
