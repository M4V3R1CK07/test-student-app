import { login, signup, signInWithGoogle } from './actions'

export default function LoginPage({
  searchParams,
}: {
  searchParams: { error?: string }
}) {
  return (
    <div className="min-h-screen flex items-center justify-center relative bg-background">
      {/* Decorative background gradients from Liquid Glass theme */}
      <div className="absolute inset-0 z-0"></div>
      
      <div className="glass-panel p-8 rounded-3xl w-full max-w-md z-10 m-4">
        <h1 className="text-3xl font-extrabold mb-2 text-center tracking-tight text-foreground">StudentOS</h1>
        <p className="text-sm text-center mb-8 text-foreground/70">Sign in to your productivity ecosystem</p>
        
        {searchParams?.error && (
          <div className="bg-red-500/20 text-red-600 dark:text-red-400 p-3 rounded-lg mb-6 text-sm text-center border border-red-500/30">
            {searchParams.error}
          </div>
        )}

        <form className="flex flex-col gap-5">
          <div>
            <label className="block text-sm font-semibold mb-1 text-foreground">Email</label>
            <input 
              id="email" 
              name="email" 
              type="email" 
              required 
              placeholder="you@university.edu"
              className="w-full px-4 py-3 rounded-xl bg-foreground/5 border border-foreground/10 focus:outline-none focus:ring-2 focus:ring-primary backdrop-blur-sm transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1 text-foreground">Password</label>
            <input 
              id="password" 
              name="password" 
              type="password" 
              required 
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-xl bg-foreground/5 border border-foreground/10 focus:outline-none focus:ring-2 focus:ring-primary backdrop-blur-sm transition-all"
            />
          </div>
          <div className="flex gap-4 mt-2">
            <button formAction={login} className="flex-1 bg-primary text-primary-foreground py-3 rounded-xl font-bold hover:bg-primary/90 hover:scale-[1.02] shadow-lg shadow-primary/20 transition-all">
              Log In
            </button>
            <button formAction={signup} className="flex-1 bg-foreground/10 text-foreground py-3 rounded-xl font-bold border border-foreground/10 hover:bg-foreground/20 hover:scale-[1.02] transition-all">
              Sign Up
            </button>
          </div>
        </form>
        
        <div className="mt-8 flex items-center justify-between">
          <hr className="w-full border-foreground/10" />
          <span className="p-2 text-xs font-semibold text-foreground/50 uppercase tracking-widest">or continue with</span>
          <hr className="w-full border-foreground/10" />
        </div>
        
        <form action={signInWithGoogle} className="mt-6">
          <button className="w-full bg-foreground text-background py-3 rounded-xl font-bold hover:scale-[1.02] transition-all flex items-center justify-center gap-3">
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Google
          </button>
        </form>
      </div>
    </div>
  )
}
