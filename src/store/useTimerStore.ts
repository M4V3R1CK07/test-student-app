import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { createClient } from '@/lib/supabase/client'

interface TimerState {
  focusedMinutes: number
  totalSessions: number
  addSession: (minutes: number) => Promise<void>
}

export const useTimerStore = create<TimerState>()(
  persist(
    (set, get) => ({
      focusedMinutes: 0,
      totalSessions: 0,
      addSession: async (minutes: number) => {
        // Optimistic update
        set((state) => ({ 
          focusedMinutes: state.focusedMinutes + minutes,
          totalSessions: state.totalSessions + 1
        }))

        // Sync to Supabase in background
        const supabase = createClient()
        const { data: userData } = await supabase.auth.getUser()
        if (userData?.user) {
          await supabase.from('focus_sessions').insert({
            user_id: userData.user.id,
            duration_minutes: minutes,
          })
        }
      }
    }),
    {
      name: 'studentos-timer-storage',
    }
  )
)
