import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { createClient } from '@/lib/supabase/client'

export type Task = {
  id: string
  user_id: string
  title: string
  description: string | null
  start_time: string | null
  end_time: string | null
  is_completed: boolean
}

interface PlannerState {
  tasks: Task[]
  isLoading: boolean
  error: string | null
  fetchTasks: () => Promise<void>
  addTask: (task: Omit<Task, 'id' | 'user_id'>) => Promise<void>
  updateTask: (id: string, updates: Partial<Task>) => Promise<void>
  deleteTask: (id: string) => Promise<void>
}

export const usePlannerStore = create<PlannerState>()(
  persist(
    (set, get) => ({
      tasks: [],
      isLoading: false,
      error: null,
      fetchTasks: async () => {
        set({ isLoading: true, error: null })
        const supabase = createClient()
        const { data: userData } = await supabase.auth.getUser()
        
        if (!userData.user) {
          set({ isLoading: false, error: 'User not authenticated' })
          return
        }

        const { data, error } = await supabase
          .from('tasks')
          .select('*')
          .eq('user_id', userData.user.id)
          .order('created_at', { ascending: false })

        if (error) {
          set({ error: error.message, isLoading: false })
          return
        }
        
        set({ tasks: data as Task[], isLoading: false })
      },
      addTask: async (taskInput) => {
        const supabase = createClient()
        const { data: userData } = await supabase.auth.getUser()
        if (!userData.user) return

        // Optimistic UI update
        const tempId = crypto.randomUUID()
        const newTask: Task = { 
          ...taskInput, 
          id: tempId, 
          user_id: userData.user.id 
        }
        set(state => ({ tasks: [newTask, ...state.tasks] }))

        // Real insert
        const { data, error } = await supabase
          .from('tasks')
          .insert({
            user_id: userData.user.id,
            title: taskInput.title,
            description: taskInput.description,
            start_time: taskInput.start_time,
            end_time: taskInput.end_time,
            is_completed: taskInput.is_completed,
          })
          .select()
          .single()

        if (error) {
          // Revert optimistic update
          set(state => ({ tasks: state.tasks.filter(t => t.id !== tempId) }))
        } else {
          // Replace temp UUID with real database UUID
          set(state => ({
            tasks: state.tasks.map(t => t.id === tempId ? (data as Task) : t)
          }))
        }
      },
      updateTask: async (id, updates) => {
        const supabase = createClient()
        // Optimistic
        set(state => ({
          tasks: state.tasks.map(t => t.id === id ? { ...t, ...updates } : t)
        }))
        
        const { error } = await supabase
          .from('tasks')
          .update(updates)
          .eq('id', id)
          
        if (error) {
          get().fetchTasks() // Re-sync from server on error
        }
      },
      deleteTask: async (id) => {
        const supabase = createClient()
        // Optimistic
        set(state => ({
          tasks: state.tasks.filter(t => t.id !== id)
        }))
        
        const { error } = await supabase
          .from('tasks')
          .delete()
          .eq('id', id)

        if (error) {
          get().fetchTasks() // Re-sync from server on error
        }
      }
    }),
    {
      name: 'studentos-planner-storage',
      partialize: (state) => ({ tasks: state.tasks }), // Persist offline-first cache
    }
  )
)
