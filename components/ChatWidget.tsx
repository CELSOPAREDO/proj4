'use client'

import { useState, useRef, useEffect } from 'react'
import { ChatCircle, Robot, Close, Send } from 'griddy-icons'

type Message = {
  id: string;
  role: 'bot' | 'user';
  text: string;
}

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', role: 'bot', text: 'Hello! I am your Event Assistant. Ask me about upcoming events, how to register, or when the next event is!' }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    const userMsg: Message = { id: Date.now().toString(), role: 'user', text: input }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setLoading(true)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg.text })
      })
      const data = await res.json()
      
      setMessages(prev => [...prev, { id: Date.now().toString(), role: 'bot', text: data.response }])
    } catch (error) {
       setMessages(prev => [...prev, { id: Date.now().toString(), role: 'bot', text: 'Oops! Something went wrong connecting to my brain.' }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {/* Toggle Button */}
      <button 
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 w-14 h-14 bg-indigo-600 text-white rounded-full shadow-[0_4px_20px_0_rgba(79,70,229,0.4)] flex items-center justify-center hover:bg-indigo-700 hover:scale-105 hover:-translate-y-1 transition-all z-40 ${isOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
      >
        <ChatCircle size={24} />
      </button>

      {/* Chat Window */}
      <div className={`fixed bottom-6 right-6 w-full max-w-[350px] sm:w-[350px] h-[500px] bg-white rounded-2xl shadow-2xl border border-zinc-200 flex flex-col z-50 transition-all duration-300 origin-bottom-right ${isOpen ? 'scale-100 opacity-100' : 'scale-50 opacity-0 pointer-events-none'}`}>
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white p-4 rounded-t-2xl flex items-center justify-between shadow-sm relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/black-scales.png')] opacity-10"></div>
          <div className="flex items-center gap-3 relative z-10">
            <div className="bg-white/20 w-10 h-10 rounded-full flex items-center justify-center border border-white/30 shadow-inner">
               <Robot size={20} />
            </div>
            <div>
              <h3 className="font-bold text-sm tracking-wide">Event Assistant</h3>
              <p className="text-[11px] text-blue-100 font-medium">Online & ready to help you</p>
            </div>
          </div>
          <button onClick={() => setIsOpen(false)} className="relative z-10 text-white hover:bg-white/20 w-8 h-8 rounded-full flex items-center justify-center transition-colors">
             <Close size={16} />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 p-4 overflow-y-auto bg-zinc-50/50 space-y-4">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] p-3.5 px-4 text-sm font-medium leading-relaxed ${msg.role === 'user' ? 'bg-indigo-600 text-white shadow-md rounded-2xl rounded-tr-sm' : 'bg-white border border-zinc-200 text-zinc-800 shadow-sm rounded-2xl rounded-tl-sm'}`}>
                {msg.text}
              </div>
            </div>
          ))}
          {loading && (
             <div className="flex justify-start">
              <div className="max-w-[80%] p-4 bg-white border border-zinc-200 rounded-2xl rounded-tl-sm shadow-sm flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-zinc-400 animate-bounce"></span>
                <span className="w-2 h-2 rounded-full bg-zinc-400 animate-bounce" style={{ animationDelay: '150ms' }}></span>
                <span className="w-2 h-2 rounded-full bg-zinc-400 animate-bounce" style={{ animationDelay: '300ms' }}></span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Form */}
        <form onSubmit={sendMessage} className="p-3 bg-white border-t border-zinc-100 rounded-b-2xl flex gap-2">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your question..."
            maxLength={100}
            className="flex-1 bg-zinc-100 border-2 border-transparent rounded-xl px-4 py-2.5 text-sm focus:bg-white focus:border-indigo-100 focus:ring-4 focus:ring-indigo-50 transition-all outline-none"
          />
          <button type="submit" disabled={!input.trim() || loading} className="w-11 h-11 bg-indigo-600 text-white rounded-xl flex items-center justify-center hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-[0.96]">
            <Send size={18} />
          </button>
        </form>
      </div>
    </>
  )
}
