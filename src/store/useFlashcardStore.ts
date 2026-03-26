import { create } from 'zustand'
import { createClient } from '@/lib/supabase/client'
import { FSRS, createEmptyCard, generatorParameters, Rating, State, type Card } from 'ts-fsrs'

const fsrs = new FSRS(generatorParameters({ request_retention: 0.85 }))

export type Flashcard = {
  id: string
  user_id: string
  front: string
  back: string
  due: string
  stability: number
  difficulty: number
  elapsed_days: number
  scheduled_days: number
  reps: number
  lapses: number
  state: number
  last_review: string | null
}

interface FlashcardState {
  cardsDue: Flashcard[]
  isLoading: boolean
  fetchDueCards: () => Promise<void>
  addCard: (front: string, back: string) => Promise<void>
  reviewCard: (id: string, rating: Rating) => Promise<void>
}

export const useFlashcardStore = create<FlashcardState>((set, get) => ({
  cardsDue: [],
  isLoading: false,
  fetchDueCards: async () => {
    set({ isLoading: true })
    const supabase = createClient()
    const { data: userData } = await supabase.auth.getUser()
    if (!userData.user) {
      set({ isLoading: false })
      return
    }

    const now = new Date().toISOString()
    const { data, error } = await supabase
      .from('flashcards')
      .select('*')
      .eq('user_id', userData.user.id)
      .lte('due', now)
      .order('due', { ascending: true })
      
    if (!error && data) {
      set({ cardsDue: data as Flashcard[] })
    }
    set({ isLoading: false })
  },
  
  addCard: async (front: string, back: string) => {
    const supabase = createClient()
    const { data: userData } = await supabase.auth.getUser()
    if (!userData.user) return

    const initialCard = createEmptyCard(new Date())
    
    await supabase.from('flashcards').insert({
      user_id: userData.user.id,
      front,
      back,
      due: initialCard.due.toISOString(),
      stability: initialCard.stability,
      difficulty: initialCard.difficulty,
      elapsed_days: initialCard.elapsed_days,
      scheduled_days: initialCard.scheduled_days,
      reps: initialCard.reps,
      lapses: initialCard.lapses,
      state: initialCard.state,
      last_review: null
    })
    
    get().fetchDueCards()
  },
  
  reviewCard: async (id: string, rating: Rating) => {
    const supabase = createClient()
    const currentCard = get().cardsDue.find(c => c.id === id)
    if (!currentCard) return
    
    const fsrsCard: Card = {
      ...createEmptyCard(new Date()), // Satisfies strict missing generic interface fields like learning_steps
      due: new Date(currentCard.due),
      stability: currentCard.stability,
      difficulty: currentCard.difficulty,
      elapsed_days: currentCard.elapsed_days || 0,
      scheduled_days: currentCard.scheduled_days || 0,
      reps: currentCard.reps,
      lapses: currentCard.lapses,
      state: currentCard.state as State,
      last_review: currentCard.last_review ? new Date(currentCard.last_review) : undefined
    }
    
    const now = new Date()
    const scheduling_cards = fsrs.repeat(fsrsCard, now)
    
    // @ts-ignore - Supress internal Rating enum mismatch for IPreview dictionary
    const next_card = scheduling_cards[rating].card
    
    set({ cardsDue: get().cardsDue.filter(c => c.id !== id) })
    
    await supabase.from('flashcards').update({
      due: next_card.due.toISOString(),
      stability: next_card.stability,
      difficulty: next_card.difficulty,
      elapsed_days: next_card.elapsed_days,
      scheduled_days: next_card.scheduled_days,
      reps: next_card.reps,
      lapses: next_card.lapses,
      state: next_card.state,
      last_review: next_card.last_review?.toISOString()
    }).eq('id', id)
  }
}))
