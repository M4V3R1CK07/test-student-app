import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { createClient } from '@/lib/supabase/client'

export type Transaction = {
  id: string
  user_id: string
  amount_cents: number
  type: 'income' | 'expense'
  category: string
  description: string | null
  created_at: string
}

interface FinanceState {
  transactions: Transaction[]
  isLoading: boolean
  error: string | null
  fetchTransactions: () => Promise<void>
  addTransaction: (tx: Omit<Transaction, 'id' | 'user_id' | 'created_at'>) => Promise<void>
  deleteTransaction: (id: string) => Promise<void>
}

export const useFinanceStore = create<FinanceState>()(
  persist(
    (set, get) => ({
      transactions: [],
      isLoading: false,
      error: null,
      fetchTransactions: async () => {
        set({ isLoading: true, error: null })
        const supabase = createClient()
        const { data: userData } = await supabase.auth.getUser()
        
        if (!userData.user) {
          set({ isLoading: false, error: 'User not authenticated' })
          return
        }

        const { data, error } = await supabase
          .from('transactions')
          .select('*')
          .eq('user_id', userData.user.id)
          .order('created_at', { ascending: false })

        if (error) {
          set({ error: error.message, isLoading: false })
          return
        }
        
        set({ transactions: data as Transaction[], isLoading: false })
      },
      addTransaction: async (txInput) => {
        const supabase = createClient()
        const { data: userData } = await supabase.auth.getUser()
        if (!userData.user) return

        const tempId = crypto.randomUUID()
        const newTx: Transaction = { 
          ...txInput, 
          id: tempId, 
          user_id: userData.user.id,
          created_at: new Date().toISOString()
        }
        set(state => ({ transactions: [newTx, ...state.transactions] }))

        const { data, error } = await supabase
          .from('transactions')
          .insert({
            user_id: userData.user.id,
            amount_cents: txInput.amount_cents,
            type: txInput.type,
            category: txInput.category,
            description: txInput.description,
          })
          .select()
          .single()

        if (error) {
          set(state => ({ transactions: state.transactions.filter(t => t.id !== tempId) }))
        } else {
          set(state => ({
            transactions: state.transactions.map(t => t.id === tempId ? (data as Transaction) : t)
          }))
        }
      },
      deleteTransaction: async (id) => {
        const supabase = createClient()
        // Optimistic delete
        set(state => ({ transactions: state.transactions.filter(t => t.id !== id) }))
        
        const { error } = await supabase.from('transactions').delete().eq('id', id)
        if (error) {
          // fetch entirely on error to resync
          get().fetchTransactions()
        }
      }
    }),
    {
      name: 'studentos-finance-storage',
      partialize: (state) => ({ transactions: state.transactions }),
    }
  )
)
