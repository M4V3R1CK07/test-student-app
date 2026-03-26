'use client'

import { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import 'katex/dist/katex.min.css'

export default function SocraticChat() {
  const [messages, setMessages] = useState<{role: string, content: string}[]>([
    { role: 'model', content: "Hello! I'm your Socratic AI Tutor. Rather than giving you direct answers, I'm here to guide your reasoning using the Feynman technique. What concept or problem are we exploring today?" }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage = { role: 'user', content: input }
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      const res = await fetch('http://localhost:8000/api/tutor/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...messages, userMessage] })
      })
      
      if (!res.ok) throw new Error('API Error')
      const data = await res.json()
      
      setMessages(prev => [...prev, { role: 'model', content: data.response }])
    } catch (err) {
      console.error(err)
      setMessages(prev => [...prev, { role: 'model', content: "Sorry, I had trouble connecting to the FastAPI server on port 8000. Is it running?" }])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] glass-panel rounded-3xl overflow-hidden border-white/20 shadow-2xl">
      <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-8 custom-scrollbar relative z-10">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] md:max-w-[70%] rounded-3xl p-6 shadow-md ${m.role === 'user' ? 'bg-primary text-primary-foreground rounded-br-sm' : 'bg-background/80 backdrop-blur-md border border-foreground/10 rounded-bl-sm'}`}>
              <div className={`text-xs uppercase tracking-widest font-black mb-3 ${m.role === 'user' ? 'opacity-80' : 'text-primary'}`}>
                {m.role === 'user' ? 'You' : 'Socratic Tutor'}
              </div>
              <div className="prose prose-invert max-w-none prose-p:leading-relaxed prose-pre:bg-black/50 prose-pre:rounded-xl">
                <ReactMarkdown
                  remarkPlugins={[remarkMath]}
                  rehypePlugins={[rehypeKatex]}
                >
                  {m.content}
                </ReactMarkdown>
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-background/80 backdrop-blur-md rounded-3xl rounded-bl-sm p-6 border border-foreground/10 w-32 flex justify-center shadow-md">
              <span className="flex gap-1.5 h-3">
                <span className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0ms' }}></span>
                <span className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '150ms' }}></span>
                <span className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '300ms' }}></span>
              </span>
            </div>
          </div>
        )}
      </div>
      
      <form onSubmit={handleSend} className="p-4 md:p-6 bg-foreground/5 backdrop-blur-2xl border-t border-foreground/10 flex gap-4 items-center relative z-20">
        <input 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Explain your reasoning..."
          className="flex-1 bg-background/50 border border-foreground/20 px-6 py-4 rounded-full focus:outline-none focus:ring-2 focus:ring-primary text-lg font-medium transition-all shadow-inner"
        />
        <button type="submit" disabled={isLoading} className="bg-primary text-primary-foreground w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center hover:scale-105 transition-all shadow-xl shadow-primary/30 disabled:opacity-50 disabled:hover:scale-100 flex-shrink-0">
          <svg className="w-6 h-6 md:w-7 md:h-7 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
        </button>
      </form>
    </div>
  )
}
