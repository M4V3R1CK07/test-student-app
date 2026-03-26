'use client'

import { useState, useEffect, useRef } from 'react'
import { useTimerStore } from '@/store/useTimerStore'

export default function PomodoroTimer() {
  const [timeLeft, setTimeLeft] = useState(25 * 60)
  const [isActive, setIsActive] = useState(false)
  const [isStrict, setIsStrict] = useState(false)
  const [mode, setMode] = useState<'focus' | 'break'>('focus')
  
  const audioContextRef = useRef<AudioContext | null>(null)
  const noiseNodeRef = useRef<AudioBufferSourceNode | null>(null)
  const gainNodeRef = useRef<GainNode | null>(null)

  const { addSession, focusedMinutes } = useTimerStore()

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft(t => t - 1), 1000)
    } else if (isActive && timeLeft === 0) {
      setIsActive(false)
      stopWhiteNoise()
      
      if (mode === 'focus') {
        addSession(25)
        setMode('break')
        setTimeLeft(5 * 60)
        
        if (isStrict && document.fullscreenElement) {
          document.exitFullscreen().catch(console.error)
        }
        alert("Focus session complete! Time for a break.")
      } else {
        setMode('focus')
        setTimeLeft(25 * 60)
        alert("Break complete! Ready to focus?")
      }
    }
    return () => clearInterval(interval)
  }, [isActive, timeLeft, mode, isStrict, addSession])

  useEffect(() => {
    const handleFullscreenChange = () => {
      // If strict mode is active and we drop out of fullscreen manually
      if (isStrict && isActive && mode === 'focus' && !document.fullscreenElement) {
        setIsActive(false)
        stopWhiteNoise()
        alert("Strict Mode Violation! You left fullscreen. Your session has been paused.")
      }
    }
    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange)
  }, [isStrict, isActive, mode])

  const toggleTimer = async () => {
    if (!isActive) {
      // Start flow
      if (isStrict && mode === 'focus' && !document.fullscreenElement) {
        try {
          await document.documentElement.requestFullscreen()
        } catch (err) {
          console.error("Fullscreen failed:", err)
        }
      }
      playWhiteNoise()
    } else {
      // Pause flow
      stopWhiteNoise()
    }
    setIsActive(!isActive)
  }

  const playWhiteNoise = () => {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext
    if (!AudioContextClass) return
    
    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContextClass()
    }
    
    if (audioContextRef.current.state === 'suspended') {
      audioContextRef.current.resume()
    }

    const ctx = audioContextRef.current
    const bufferSize = ctx.sampleRate * 2
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
    const data = buffer.getChannelData(0)
    
    for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1
    }
    
    const noise = ctx.createBufferSource()
    noise.buffer = buffer
    noise.loop = true
    
    const filter = ctx.createBiquadFilter()
    filter.type = 'lowpass'
    filter.frequency.value = 600 // Brown noise profile
    
    const gain = ctx.createGain()
    gain.gain.value = 0.5
    
    noise.connect(filter)
    filter.connect(gain)
    gain.connect(ctx.destination)
    
    noise.start()
    noiseNodeRef.current = noise
    gainNodeRef.current = gain
  }

  const stopWhiteNoise = () => {
    if (noiseNodeRef.current) {
      noiseNodeRef.current.stop()
      noiseNodeRef.current.disconnect()
      noiseNodeRef.current = null
    }
    if (gainNodeRef.current) {
      gainNodeRef.current.disconnect()
      gainNodeRef.current = null
    }
  }

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0')
    const s = (seconds % 60).toString().padStart(2, '0')
    return `${m}:${s}`
  }

  return (
    <div className="flex flex-col items-center justify-center p-8 w-full max-w-2xl mx-auto h-[600px] glass-panel rounded-3xl border border-white/20 relative shadow-2xl">
      <div className={`absolute -top-4 -right-4 w-32 h-32 blur-3xl rounded-full mix-blend-screen opacity-50 ${mode === 'focus' ? 'bg-primary' : 'bg-green-500'}`}></div>
      <div className={`absolute -bottom-4 -left-4 w-32 h-32 blur-3xl rounded-full mix-blend-screen opacity-50 ${mode === 'focus' ? 'bg-primary' : 'bg-green-500'}`}></div>

      <div className={`p-10 rounded-[64px] border border-white/10 flex flex-col items-center justify-center relative shadow-inner w-80 h-80 ${isActive ? 'bg-white/5 backdrop-blur-3xl' : 'bg-transparent'}`}>
        {isStrict && mode === 'focus' && (
          <div className="absolute top-8 text-red-500 font-bold uppercase tracking-widest text-xs flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
            </span>
            Strict Mode
          </div>
        )}
        
        <h2 className="text-sm font-black mb-2 opacity-60 uppercase tracking-[0.2em]">{mode}ing</h2>
        <div className="text-7xl font-black font-mono tracking-tighter text-foreground tabular-nums drop-shadow-md">
          {formatTime(timeLeft)}
        </div>
        
        <div className="mt-8">
          <button 
            onClick={toggleTimer}
            className={`px-10 py-3.5 rounded-full font-extrabold text-lg transition-all hover:-translate-y-1 shadow-2xl ${isActive ? 'bg-foreground/10 text-foreground border border-foreground/20' : 'bg-primary text-primary-foreground border border-primary/50'}`}
          >
            {isActive ? 'Pause' : 'Start Focus'}
          </button>
        </div>
      </div>
      
      <div className="mt-12 group">
        <label className="flex items-center gap-3 cursor-pointer font-bold opacity-70 group-hover:opacity-100 transition-opacity p-4 rounded-2xl bg-foreground/5 hover:bg-foreground/10 border border-transparent hover:border-foreground/10">
          <input 
            type="checkbox" 
            checked={isStrict} 
            onChange={(e) => !isActive && setIsStrict(e.target.checked)}
            disabled={isActive}
            className="w-5 h-5 rounded text-red-500 focus:ring-red-500 bg-background border-foreground/20 disabled:opacity-50 cursor-pointer"
          />
          Enable Strict Mode (Fullscreen & Audio)
        </label>
      </div>

      <div className="mt-8 text-center text-foreground/60 font-medium">
        Total Focused Minutes: <span className="text-foreground tracking-tight font-black text-xl ml-2">{focusedMinutes}</span>
      </div>
    </div>
  )
}
