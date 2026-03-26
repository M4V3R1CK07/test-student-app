'use client'

import { useState } from 'react'
import { usePlannerStore, Task } from '@/store/usePlannerStore'

export default function TodoList() {
  const { tasks, addTask, updateTask, deleteTask } = usePlannerStore()
  const [title, setTitle] = useState('')
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title) return
    
    let start_time = null
    if (date && time) {
      // Create local date object, then convert to UTC ISO string
      const localDate = new Date(`${date}T${time}`)
      start_time = localDate.toISOString()
    }

    await addTask({
      title,
      description: '',
      start_time,
      end_time: null,
      is_completed: false
    })
    
    setTitle('')
    setDate('')
    setTime('')
  }

  return (
    <div className="glass-panel p-6 rounded-3xl h-full flex flex-col">
      <h2 className="text-2xl font-extrabold mb-6 tracking-tight">To-Do List</h2>
      
      <form onSubmit={handleCreate} className="flex flex-col gap-3 mb-6 bg-foreground/5 p-4 rounded-2xl border border-foreground/10">
        <input 
          value={title} onChange={(e) => setTitle(e.target.value)} 
          placeholder="What needs to be done?" 
          className="bg-transparent border-b border-foreground/20 px-2 py-2 text-lg focus:outline-none focus:border-primary transition-colors font-medium placeholder:text-foreground/40"
          required
        />
        <div className="flex gap-2">
          <input 
            type="date" value={date} onChange={(e) => setDate(e.target.value)}
            className="bg-background/50 rounded-xl px-3 py-2 text-sm flex-1 focus:outline-none focus:ring-2 focus:ring-primary backdrop-blur-md border border-foreground/10"
          />
          <input 
            type="time" value={time} onChange={(e) => setTime(e.target.value)}
            className="bg-background/50 rounded-xl px-3 py-2 text-sm flex-1 focus:outline-none focus:ring-2 focus:ring-primary backdrop-blur-md border border-foreground/10"
          />
        </div>
        <button type="submit" className="bg-primary text-primary-foreground font-bold py-2.5 rounded-xl mt-2 hover:scale-[1.02] shadow-lg shadow-primary/20 transition-all">
          Add Task
        </button>
      </form>

      <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
        {tasks.map(task => (
          <TaskItem key={task.id} task={task} onUpdate={updateTask} onDelete={deleteTask} />
        ))}
        {tasks.length === 0 && (
          <div className="text-center mt-12 opacity-50">
            <p className="text-4xl mb-2">✨</p>
            <p className="text-sm font-medium">All caught up! Nothing to do.</p>
          </div>
        )}
      </div>
    </div>
  )
}

function TaskItem({ task, onUpdate, onDelete }: { task: Task, onUpdate: any, onDelete: any }) {
  // Convert UTC sequence to Local for viewing
  const formattedTime = task.start_time 
    ? new Intl.DateTimeFormat('default', { 
        month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' 
      }).format(new Date(task.start_time))
    : 'No due date'

  return (
    <div className={`p-4 rounded-2xl border transition-all flex items-start gap-3 group ${task.is_completed ? 'bg-foreground/5 border-transparent opacity-50 grayscale' : 'bg-foreground/5 border-foreground/10 shadow-sm hover:border-primary/30'}`}>
      <input 
        type="checkbox" 
        checked={task.is_completed} 
        onChange={(e) => onUpdate(task.id, { is_completed: e.target.checked })}
        className="mt-1.5 w-5 h-5 rounded-md text-primary focus:ring-primary cursor-pointer border-foreground/20"
      />
      <div className="flex-1 min-w-0">
        <p className={`font-semibold truncate ${task.is_completed ? 'line-through' : ''}`}>{task.title}</p>
        <p className="text-xs font-medium text-foreground/60">{formattedTime}</p>
      </div>
      <button onClick={() => onDelete(task.id)} className="text-red-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity bg-red-400/10 p-1.5 rounded-lg flex-shrink-0">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
      </button>
    </div>
  )
}
