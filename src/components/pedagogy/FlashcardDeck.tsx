'use client'

import { useState, useEffect } from 'react'
import { useFlashcardStore } from '@/store/useFlashcardStore'
import { Rating } from 'ts-fsrs'

export default function FlashcardDeck() {
  const { cardsDue, isLoading, fetchDueCards, reviewCard, addCard } = useFlashcardStore()
  const [showBack, setShowBack] = useState(false)
  
  const [newFront, setNewFront] = useState('')
  const [newBack, setNewBack] = useState('')
  const [mode, setMode] = useState<'review' | 'add'>('review')

  useEffect(() => {
    fetchDueCards()
  }, [fetchDueCards])

  const handleReview = async (rating: Rating) => {
    if (cardsDue.length === 0) return
    await reviewCard(cardsDue[0].id, rating)
    setShowBack(false)
  }

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newFront || !newBack) return
    await addCard(newFront, newBack)
    setNewFront('')
    setNewBack('')
    setMode('review')
    alert('Flashcard added!')
  }

  if (isLoading && cardsDue.length === 0) {
    return <div className="h-[500px] flex items-center justify-center font-bold tracking-widest uppercase opacity-50">Syncing Decks...</div>
  }

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] w-full max-w-4xl mx-auto items-center p-4">
      <div className="flex gap-4 mb-8">
        <button 
          onClick={() => setMode('review')}
          className={`px-8 py-3 rounded-full font-black text-sm tracking-wide transition-all ${mode === 'review' ? 'bg-primary text-primary-foreground shadow-xl shadow-primary/30 scale-105' : 'bg-foreground/5 text-foreground/70 border border-foreground/10 hover:bg-foreground/10'}`}
        >
          Review Due ({cardsDue.length})
        </button>
        <button 
          onClick={() => setMode('add')}
          className={`px-8 py-3 rounded-full font-black text-sm tracking-wide transition-all ${mode === 'add' ? 'bg-primary text-primary-foreground shadow-xl shadow-primary/30 scale-105' : 'bg-foreground/5 text-foreground/70 border border-foreground/10 hover:bg-foreground/10'}`}
        >
          Add Flashcard
        </button>
      </div>

      {mode === 'add' ? (
        <form onSubmit={handleAdd} className="glass-panel w-full p-10 rounded-[3rem] flex flex-col gap-6 shadow-2xl border-white/10">
          <h2 className="text-3xl font-black tracking-tight mb-2">Create FSRS Flashcard</h2>
          <div>
            <label className="block text-xs uppercase font-extrabold tracking-widest opacity-50 mb-2">Front (Question)</label>
            <textarea 
              value={newFront} onChange={e => setNewFront(e.target.value)}
              className="w-full h-32 bg-background/50 border border-foreground/10 p-5 rounded-3xl focus:outline-none focus:ring-2 focus:ring-primary text-lg font-medium resize-none shadow-inner"
              required
            />
          </div>
          <div>
            <label className="block text-xs uppercase font-extrabold tracking-widest opacity-50 mb-2">Back (Answer)</label>
            <textarea 
              value={newBack} onChange={e => setNewBack(e.target.value)}
              className="w-full h-32 bg-background/50 border border-foreground/10 p-5 rounded-3xl focus:outline-none focus:ring-2 focus:ring-primary text-lg font-medium resize-none shadow-inner"
              required
            />
          </div>
          <button type="submit" className="bg-foreground text-background py-5 mt-4 rounded-full font-black text-lg hover:-translate-y-1 transition-all shadow-xl">
            Save Flashcard to Neurons
          </button>
        </form>
      ) : (
        <div className="w-full flex-1 flex flex-col items-center justify-center relative">
          {cardsDue.length === 0 ? (
            <div className="text-center glass-panel p-16 rounded-[3rem] opacity-80 border-white/10 shadow-2xl">
              <span className="text-8xl mb-8 block grayscale opacity-50">🎓</span>
              <h2 className="text-3xl font-black mb-3 tracking-tight">You're all caught up!</h2>
              <p className="font-semibold text-foreground/60 max-w-sm text-lg leading-relaxed">No flashcards due. Your FSRS memory stability algorithm confirms maximum retention for now.</p>
            </div>
          ) : (
            <div className="w-full h-full max-h-[600px] flex flex-col relative z-10">
              <div 
                onClick={() => setShowBack(true)}
                className={`flex-1 glass-panel rounded-[3rem] p-10 md:p-16 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-700 shadow-2xl ${showBack ? 'bg-primary/5 border-primary/20' : 'bg-white/5 border-white/20 hover:bg-white/10 hover:scale-[1.02]'}`}
              >
                {!showBack ? (
                   <div className="animate-in fade-in zoom-in duration-500 flex flex-col items-center">
                     <span className="text-xs font-black uppercase tracking-widest text-primary mb-8 bg-primary/10 px-4 py-2 rounded-full">Question</span>
                     <h2 className="text-4xl md:text-6xl font-black leading-tight tracking-tighter text-foreground drop-shadow-sm">{cardsDue[0].front}</h2>
                     <p className="mt-12 text-foreground/40 font-bold tracking-widest text-sm uppercase animate-pulse border border-foreground/10 px-6 py-3 rounded-full">Tap to reveal answer</p>
                   </div>
                ) : (
                   <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 flex flex-col items-center">
                     <span className="text-xs font-black uppercase tracking-widest text-green-500 mb-8 bg-green-500/10 px-4 py-2 rounded-full">Answer</span>
                     <p className="text-3xl md:text-5xl font-extrabold leading-relaxed tracking-tight text-foreground">{cardsDue[0].back}</p>
                   </div>
                )}
              </div>
              
              <div className={`mt-8 grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-2xl mx-auto transition-all duration-500 ${showBack ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12 pointer-events-none'}`}>
                <button onClick={() => handleReview(Rating.Again)} className="bg-red-500 border border-red-500/50 text-white hover:bg-red-600 hover:-translate-y-1 py-5 rounded-3xl font-black tracking-wider uppercase text-sm transition-all shadow-xl shadow-red-500/20">
                  Again (1m)
                </button>
                <button onClick={() => handleReview(Rating.Hard)} className="bg-orange-500 border border-orange-500/50 text-white hover:bg-orange-600 hover:-translate-y-1 py-5 rounded-3xl font-black tracking-wider uppercase text-sm transition-all shadow-xl shadow-orange-500/20">
                  Hard (10m)
                </button>
                <button onClick={() => handleReview(Rating.Good)} className="bg-blue-500 border border-blue-500/50 text-white hover:bg-blue-600 hover:-translate-y-1 py-5 rounded-3xl font-black tracking-wider uppercase text-sm transition-all shadow-xl shadow-blue-500/20">
                  Good (1d)
                </button>
                <button onClick={() => handleReview(Rating.Easy)} className="bg-green-500 border border-green-500/50 text-white hover:bg-green-600 hover:-translate-y-1 py-5 rounded-3xl font-black tracking-wider uppercase text-sm transition-all shadow-xl shadow-green-500/20">
                  Easy (4d)
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
