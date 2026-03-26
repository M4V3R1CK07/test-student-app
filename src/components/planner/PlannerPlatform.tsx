'use client'

import { useEffect } from 'react'
import { usePlannerStore } from '@/store/usePlannerStore'
import TodoList from './TodoList'
import Calendar from './Calendar'

export default function PlannerPlatform() {
  const { fetchTasks, isLoading, error } = usePlannerStore()

  useEffect(() => {
    fetchTasks()
  }, [fetchTasks])

  return (
    <div className="flex flex-col lg:flex-row gap-6 w-full h-[calc(100vh-140px)]">
      <div className="flex-1 h-full">
        <Calendar />
      </div>
      <div className="w-full lg:w-[400px] h-full flex-shrink-0">
        <TodoList />
      </div>
    </div>
  )
}
