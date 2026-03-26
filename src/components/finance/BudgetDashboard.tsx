'use client'

import { useState, useEffect } from 'react'
import { useFinanceStore, Transaction } from '@/store/useFinanceStore'

export default function BudgetDashboard() {
  const { transactions, fetchTransactions, addTransaction, deleteTransaction } = useFinanceStore()
  
  const [amount, setAmount] = useState('')
  const [type, setType] = useState<'income' | 'expense'>('expense')
  const [category, setCategory] = useState('Food')
  const [description, setDescription] = useState('')

  useEffect(() => {
    fetchTransactions()
  }, [fetchTransactions])

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!amount || isNaN(Number(amount))) return

    // CRITICAL: Convert to integer cents safely before hitting store/DB to avoid float errors
    const amountInCents = Math.round(parseFloat(amount) * 100)

    await addTransaction({
      amount_cents: amountInCents,
      type,
      category,
      description
    })

    setAmount('')
    setDescription('')
  }

  // Calculate totals
  const totalIncomeCents = transactions.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount_cents, 0)
  const totalExpenseCents = transactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount_cents, 0)
  const balanceCents = totalIncomeCents - totalExpenseCents

  const formatCurrency = (cents: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(cents / 100)
  }

  return (
    <div className="flex flex-col lg:flex-row gap-8 w-full h-[calc(100vh-140px)]">
      
      {/* Left Panel: Overview & Add Form */}
      <div className="w-full lg:w-[450px] flex-shrink-0 flex flex-col gap-6 h-full overflow-y-auto custom-scrollbar pr-2">
        
        {/* Balance Card */}
        <div className="glass-panel p-8 rounded-3xl relative overflow-hidden border-white/20">
          <div className={`absolute top-0 right-0 w-40 h-40 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none opacity-20 ${balanceCents < 0 ? 'bg-red-500' : 'bg-green-500'}`}></div>
          <h2 className="text-sm font-black uppercase tracking-widest opacity-60 mb-2 relative z-10">Total Balance</h2>
          <div className={`text-5xl font-black tracking-tighter relative z-10 ${balanceCents < 0 ? 'text-red-500 drop-shadow-sm' : 'text-foreground'}`}>
            {formatCurrency(balanceCents)}
          </div>
          
          <div className="flex justify-between mt-8 relative z-10">
            <div>
              <p className="text-xs uppercase font-extrabold tracking-widest opacity-50 mb-1">Income</p>
              <p className="text-xl font-bold text-green-500">{formatCurrency(totalIncomeCents)}</p>
            </div>
            <div className="text-right">
              <p className="text-xs uppercase font-extrabold tracking-widest opacity-50 mb-1">Expenses</p>
              <p className="text-xl font-bold text-red-500">{formatCurrency(totalExpenseCents)}</p>
            </div>
          </div>
        </div>

        {/* Add Transaction Form */}
        <form onSubmit={handleAdd} className="glass-panel p-6 md:p-8 rounded-3xl border-white/10 flex flex-col gap-5 relative z-10">
          <h3 className="font-extrabold text-2xl tracking-tight">Add Transaction</h3>
          
          <div className="flex gap-2 p-1.5 bg-foreground/5 rounded-2xl border border-foreground/10">
            <button 
              type="button" 
              onClick={() => setType('expense')}
              className={`flex-1 py-2.5 rounded-xl font-bold text-sm transition-all ${type === 'expense' ? 'bg-red-500 text-white shadow-lg shadow-red-500/20' : 'text-foreground/60 hover:text-foreground hover:bg-foreground/5'}`}
            >
              Expense
            </button>
            <button 
              type="button" 
              onClick={() => setType('income')}
              className={`flex-1 py-2.5 rounded-xl font-bold text-sm transition-all ${type === 'income' ? 'bg-green-500 text-white shadow-lg shadow-green-500/20' : 'text-foreground/60 hover:text-foreground hover:bg-foreground/5'}`}
            >
              Income
            </button>
          </div>

          <div>
            <label className="block text-xs font-black uppercase tracking-widest mb-2 opacity-50">Amount (USD)</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-lg opacity-50">$</span>
              <input 
                type="number" 
                step="0.01" 
                min="0"
                required
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="w-full bg-foreground/5 border border-foreground/10 pl-10 pr-4 py-3.5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary text-2xl font-black font-mono tracking-tighter transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-xs font-black uppercase tracking-widest mb-2 opacity-50">Category</label>
              <div className="relative">
                <select 
                  value={category} 
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-foreground/5 border border-foreground/10 px-4 py-3.5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary font-bold appearance-none transition-all cursor-pointer"
                >
                  <option value="Food">🍽️ Food</option>
                  <option value="Housing">🏠 Housing</option>
                  <option value="Transport">🚗 Transport</option>
                  <option value="Education">📚 Education</option>
                  <option value="Entertainment">🎮 Entertainment</option>
                  <option value="Salary">💰 Salary/Income</option>
                  <option value="Other">✨ Other</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-foreground/50">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                </div>
              </div>
            </div>

            <div className="col-span-2">
              <label className="block text-xs font-black uppercase tracking-widest mb-2 opacity-50">Description</label>
              <input 
                type="text" 
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="E.g. Groceries, Rent..."
                className="w-full bg-foreground/5 border border-foreground/10 px-4 py-3.5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary font-medium transition-all"
              />
            </div>
          </div>

          <button type="submit" className="mt-2 w-full bg-primary text-primary-foreground py-4 rounded-2xl font-black tracking-wide text-lg hover:-translate-y-1 transition-all shadow-xl shadow-primary/20">
            Save {type === 'income' ? 'Income' : 'Expense'}
          </button>
        </form>
      </div>

      {/* Right Panel: Transaction List */}
      <div className="flex-1 glass-panel p-6 md:p-8 rounded-3xl border-white/10 flex flex-col h-full">
        <h3 className="font-extrabold text-2xl mb-6 tracking-tight">Recent Activity</h3>
        <div className="flex-1 overflow-y-auto space-y-3 custom-scrollbar pr-3">
          {transactions.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center opacity-30 text-center">
              <span className="text-6xl mb-6 grayscale">💳</span>
              <p className="font-extrabold text-xl">No transactions yet.</p>
              <p className="font-medium mt-2 max-w-xs">Add your first expense or income to start tracking your budget.</p>
            </div>
          )}
          {transactions.map(t => (
            <div key={t.id} className="flex items-center justify-between p-4 md:p-5 rounded-2xl bg-foreground/5 border border-foreground/10 hover:border-foreground/20 hover:bg-foreground/10 transition-all group">
              <div className="flex items-center gap-4 md:gap-5">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-xl shadow-sm ${t.type === 'income' ? 'bg-green-500/20 text-green-500 border border-green-500/20' : 'bg-red-500/20 text-red-500 border border-red-500/20'}`}>
                  {t.type === 'income' ? '+' : '-'}
                </div>
                <div>
                  <p className="font-extrabold text-lg">{t.category.replace(/[^\w\s]/gi, '').trim()}</p>
                  <p className="text-sm font-medium opacity-60 mt-0.5 max-w-[150px] md:max-w-xs truncate">{t.description || 'No description'}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 md:gap-6">
                <div className="text-right">
                  <p className={`font-black font-mono text-xl tracking-tighter ${t.type === 'income' ? 'text-green-500' : 'text-foreground'}`}>
                    {t.type === 'income' ? '' : '-'}{formatCurrency(t.amount_cents)}
                  </p>
                  <p className="text-xs font-bold opacity-40 uppercase tracking-widest mt-1">
                    {new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(new Date(t.created_at))}
                  </p>
                </div>
                <button 
                  onClick={() => deleteTransaction(t.id)}
                  className="opacity-0 group-hover:opacity-100 transition-all p-2.5 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500 hover:text-white"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      
    </div>
  )
}
