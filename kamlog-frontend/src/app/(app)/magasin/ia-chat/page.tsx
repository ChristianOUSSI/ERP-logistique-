// src/app/(app)/magasin/ia-chat/page.tsx - IA Chat Interface Page
'use client'

import { useState, useEffect } from 'react'
import { ModuleLayout } from '@/components/layout/ModuleLayout'
import { MessageCircle, Send, Loader2, Search, Clock, Trash2 } from 'lucide-react'
import { CardSkeletonLoader } from '@/components/ui/Loaders'
import { toast } from 'sonner'
import { aiAPI } from '@/lib/api-client'

export default function IAChatPage() {
  const [messages, setMessages] = useState<{ id: number; role: 'user' | 'assistant'; content: string; timestamp: string }[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // Load chat history from localStorage or start fresh
    const saved = localStorage.getItem('magasin_ia_chat')
    if (saved) {
      setMessages(JSON.parse(saved))
    }
  }, [])

  const saveMessages = () => {
    localStorage.setItem('magasin_ia_chat', JSON.stringify(messages))
  }

  const handleSend = async () => {
    if (!input.trim()) return

    const userMessage = {
      id: Date.now(),
      role: 'user' as const,
      content: input,
      timestamp: new Date().toISOString()
    }

    setMessages(prev => [...prev, userMessage])
    saveMessages()
    setInput('')
    setLoading(true)

    try {
      const response = await aiAPI.processNaturalLanguageQuery({
        query: userMessage.content,
        context: {
          // We could pass additional context like current module, user role, etc.
          module: 'magasin'
        }
      })

      const assistantMessage = {
        id: Date.now() + 1,
        role: 'assistant' as const,
        content: response.data.response,
        timestamp: new Date().toISOString()
      }

      setMessages(prev => [...prev, assistantMessage])
      saveMessages()
    } catch (error) {
      console.error('Error querying AI:', error)
      toast.error('Erreur lors de la communication avec l\'IA')

      // Add error message to chat
      const errorMessage = {
        id: Date.now() + 2,
        role: 'assistant' as const,
        content: 'Désolé, je n\'ai pas pu traiter votre demande. Veuillez réessayer.',
        timestamp: new Date().toISOString()
      }
      setMessages(prev => [...prev, errorMessage])
      saveMessages()
    } finally {
      setLoading(false)
    }
  }

  const handleClearChat = () => {
    if (window.confirm('Voulez-vous vraiment effacer l\'historique de la conversation ?')) {
      setMessages([])
      localStorage.removeItem('magasin_ia_chat')
    }
  }

  return (
    <ModuleLayout module="magasin">
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8 animate-in fade-in duration-500">

        {/* Header */}
        <div className="flex justify-between items-end mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-3">
              <MessageCircle className="w-8 h-8 text-indigo-600" />
              Assistant IA Magasin
            </h1>
            <p className="text-sm text-slate-500 mt-2">Posez vos questions en langage naturel pour obtenir des analyses, prévisions et conseils sur la gestion de vos magasins.</p>
          </div>
          <button
            onClick={handleClearChat}
            className="text-slate-400 hover:text-slate-600 hover:bg-slate-50 px-3 py-1.5 rounded transition-colors text-sm"
          >
            <Trash2 className="w-4 h-4" />
            Effacer
          </button>
        </div>

        {/* Chat Container */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="flex h-[600px] flex-col">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {loading && messages.length === 0 && (
                <div className="flex justify-center items-center py-8">
                  <CardSkeletonLoader className="h-4 w-32" />
                </div>
              )}
              {messages.map(message => (
                <div key={message.id} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} max-w-[80%] `}>
                  <div className={`px-4 py-2 rounded-xl max-w-xs break-words ${
                    message.role === 'user'
                      ? 'bg-blue-600 text-white self-end'
                      : 'bg-slate-100 text-slate-900 self-start'
                  }`}
                  >
                    <p className="whitespace-pre-wrap">{message.content}</p>
                    <span className="text-xs block text-opacity-70 mt-1">
                      {new Date(message.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </span>
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start max-w-[80%]">
                  <div className="px-4 py-2 rounded-xl bg-slate-100 text-slate-900 self-start max-w-xs break-words">
                    <div className="flex items-center space-x-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Réflexion en cours...</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="p-4 border-t border-slate-200 bg-white flex items-center gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleSend()
                  }
                }}
                placeholder="Posez votre question ici (ex: Quel est le stock prévisionnel pour la semaine prochaine ?)..."
                className="flex-1 px-4 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none text-sm disabled:opacity-50"
                disabled={loading}
              />
              <button
                onClick={handleSend}
                disabled={loading || !input.trim()}
                className={`px-4 py-2 rounded-xl text-sm font-bold ${loading || !input.trim() ? 'bg-slate-400 text-slate-300' : 'bg-indigo-600 hover:bg-indigo-700 text-white'} transition-colors`}
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Envoyer...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Envoyer
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Example Queries */}
        <div className="mt-6 p-4 bg-slate-50 rounded-xl border border-slate-200">
          <h3 className="font-bold text-slate-800 mb-2">Exemples de questions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <button
              onClick={() => {
                setInput("Quel est le stock prévisionnel pour les articles les plus vendus ?")
                handleSend()
              }}
              className="text-left p-2 rounded border border-slate-200 hover:bg-slate-100 transition-colors text-sm"
            >
              Stock prévisionnel
            </button>
            <button
              onClick={() => {
                setInput("Quels articles ont un taux de rotation lent ?")
                handleSend()
              }}
              className="text-left p-2 rounded border border-slate-200 hover:bg-slate-100 transition-colors text-sm"
            >
              Analyse de rotation
            </button>
            <button
              onClick={() => {
                setInput("Quel est le niveau de stock de sécurité recommandé pour l'article A123 ?")
                handleSend()
              }}
              className="text-left p-2 rounded border border-slate-200 hover:bg-slate-100 transition-colors text-sm"
            >
              Stock de sécurité
            </button>
            <button
              onClick={() => {
                setInput("Y a-t-il des anomalies dans les mouvements de stock cette semaine ?")
                handleSend()
              }}
              className="text-left p-2 rounded border border-slate-200 hover:bg-slate-100 transition-colors text-sm"
            >
              Détection d'anomalies
            </button>
          </div>
        </div>
      </div>
    </ModuleLayout>
  )
}