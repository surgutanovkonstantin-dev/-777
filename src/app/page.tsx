'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export default function Home() {
  const [quotes, setQuotes] = useState<any[]>([])
  const [newQuote, setNewQuote] = useState('')
  const [loading, setLoading] = useState(true)

  // Загрузка цитат из базы данных
  const fetchQuotes = async () => {
    const { data, error } = await supabase
      .from('quotes')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (data) setQuotes(data)
    setLoading(false)
  }

  useEffect(() => {
    fetchQuotes()
  }, [])

  // Добавление новой цитаты
  const addQuote = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newQuote.trim()) return

    const { error } = await supabase
      .from('quotes')
      .insert([{ content: newQuote }])

    if (!error) {
      setNewQuote('')
      fetchQuotes() // Обновляем список
    } else {
      alert('Ошибка при добавлении: ' + error.message)
    }
  }

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-200 p-8 font-sans">
      <div className="max-w-2xl mx-auto mt-12">
        <h1 className="text-4xl font-bold mb-2 tracking-tight text-white">Egoist Sigma Gul 🗿</h1>
        <p className="text-neutral-400 mb-8">База данных великих мыслей. Напиши свою.</p>

        <form onSubmit={addQuote} className="mb-12 flex gap-2">
          <input
            type="text"
            value={newQuote}
            onChange={(e) => setNewQuote(e.target.value)}
            placeholder="Настоящий сигма всегда..."
            className="flex-1 bg-neutral-900 border border-neutral-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-neutral-600 transition-colors"
          />
          <button
            type="submit"
            className="bg-white text-black font-semibold px-6 py-3 rounded-lg hover:bg-neutral-200 transition-colors"
          >
            Отправить
          </button>
        </form>

        <div className="space-y-4">
          {loading ? (
            <p className="text-neutral-500 animate-pulse">Загрузка базы...</p>
          ) : quotes.length === 0 ? (
            <p className="text-neutral-500">Пока никто не оставил след в истории. Будь первым.</p>
          ) : (
            quotes.map((quote) => (
              <div key={quote.id} className="bg-neutral-900 border border-neutral-800 rounded-lg p-5">
                <p className="text-lg text-neutral-200">«{quote.content}»</p>
                <span className="text-xs text-neutral-500 mt-3 block">
                  {new Date(quote.created_at).toLocaleString('ru-RU')}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </main>
  )
}
