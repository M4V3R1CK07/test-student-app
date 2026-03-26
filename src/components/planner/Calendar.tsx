'use client'

import { usePlannerStore } from '@/store/usePlannerStore'
import { useMemo } from 'react'

export default function Calendar() {
  const { tasks } = usePlannerStore()

  // Generate an array of the next 7 days in the user's local timezone
  const days = useMemo(() => {
    const arr = []
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    for (let i = 0; i < 7; i++) {
      const d = new Date(today)
      d.setDate(today.getDate() + i)
      arr.push(d)
    }
    return arr
  }, [])

  return (
    <div className="glass-panel p-6 md:p-8 rounded-3xl h-full flex flex-col">
      <h2 className="text-2xl font-extrabold mb-6 tracking-tight">Upcoming 7 Days</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 flex-1">
        {days.map((day, i) => {
          // Filter tasks assigned to this local day
          const dayTasks = tasks.filter(t => {
            if (!t.start_time) return false
            const tDate = new Date(t.start_time)
            return tDate.toDateString() === day.toDateString()
          })

          const isToday = i === 0

          return (
            <div key={day.toISOString()} className={`flex flex-col rounded-2xl border transition-all ${isToday ? 'border-primary shadow-lg shadow-primary/10 bg-primary/5' : 'border-foreground/10 bg-foreground/5'} overflow-hidden min-h-[150px]`}>
              <div className={`text-center py-3 border-b ${isToday ? 'border-primary/20 bg-primary/10' : 'border-foreground/10 bg-foreground/5'}`}>
                <div className="text-xs uppercase font-extrabold tracking-widest text-foreground/50">
                  {new Intl.DateTimeFormat('default', { weekday: 'short' }).format(day)}
                </div>
                <div className={`text-2xl font-black ${isToday ? 'text-primary' : ''}`}>
                  {day.getDate()}
                </div>
              </div>
              <div className="flex-1 p-2 flex flex-col gap-2 overflow-y-auto custom-scrollbar">
                {dayTasks.length === 0 && (
                  <div className="flex-1 flex items-center justify-center opacity-30 text-xs font-medium">Free</div>
                )}
                {dayTasks.map(t => (
                   <div key={t.id} className={`text-xs p-2.5 rounded-xl border ${t.is_completed ? 'bg-foreground/5 border-transparent line-through opacity-50' : 'bg-primary/10 border-primary/20 text-primary font-bold shadow-sm'}`}>
                     <span className="opacity-70 font-semibold mr-1">
                       {new Intl.DateTimeFormat('default', { hour: 'numeric', minute: '2-digit' }).format(new Date(t.start_time!))}
                     </span>
                     <br/>
                     <span className="truncate block mt-1">{t.title}</span>
                   </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
