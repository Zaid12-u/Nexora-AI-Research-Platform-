import { useState } from 'react'
import { Search, ExternalLink, Users, Calendar, Loader2, Plus, X, Sparkles, MessageCircle, Send } from 'lucide-react'
import Sidebar from '../components/Sidebar'
import TopBar from '../components/TopBar'
import axios from 'axios'

const AI_URL = 'https://zaiddev123-nexora-ai-service.hf.space'
const AUTH_URL = 'https://nexora-ai-research-platform-production.up.railway.app'

export default function SearchPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [query, setQuery] = useState(localStorage.getItem('lastQuery') || '')
  const [results, setResults] = useState(JSON.parse(localStorage.getItem('lastResults') || '[]'))
  const [searched, setSearched] = useState(localStorage.getItem('lastResults') ? true : false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [deepMode, setDeepMode] = useState(false)
  const [deepResult, setDeepResult] = useState(JSON.parse(localStorage.getItem('lastDeepResult') || 'null'))
  const [activeQA, setActiveQA] = useState(null)
  const [question, setQuestion] = useState('')
  const [qaAnswer, setQaAnswer] = useState('')
  const [qaLoading, setQaLoading] = useState(false)

  const token = localStorage.getItem('token')

  const handleSearch = async (e) => {
    e.preventDefault()
    if (!query.trim()) return
    setLoading(true)
    setError('')
    setSearched(true)
    setDeepResult(null)
    setActiveQA(null)
    try {
      if (deepMode) {
        const res = await axios.post(`${AI_URL}/deep-search`, { query })
        setDeepResult(res.data)
        setResults(res.data.papers)
        localStorage.setItem('lastQuery', query)
        localStorage.setItem('lastResults', JSON.stringify(res.data.papers))
        localStorage.setItem('lastDeepResult', JSON.stringify(res.data))
        await axios.post(`${AUTH_URL}/api/history/save`,
          { query: `[Deep Search] ${query}`, results: res.data.papers },
          { headers: { Authorization: `Bearer ${token}` } }
        )
      } else {
        const res = await axios.post(`${AI_URL}/search`, { query, max_results: 10 })
        setResults(res.data.results)
        localStorage.setItem('lastQuery', query)
        localStorage.setItem('lastResults', JSON.stringify(res.data.results))
        localStorage.removeItem('lastDeepResult')
        await axios.post(`${AUTH_URL}/api/history/save`,
          { query, results: res.data.results },
          { headers: { Authorization: `Bearer ${token}` } }
        )
      }
    } catch (err) {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleQA = async (paper) => {
    if (!question.trim()) return
    setQaLoading(true)
    setQaAnswer('')
    try {
      const res = await axios.post(`${AI_URL}/qa`, {
        question,
        paper_title: paper.title,
        paper_abstract: paper.abstract
      })
      setQaAnswer(res.data.answer)
    } catch (err) {
      setQaAnswer('Error getting answer.')
    } finally {
      setQaLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <TopBar onOpen={() => setSidebarOpen(true)} title="Search Papers" />

      <div className="max-w-3xl mx-auto px-6 py-10">

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="flex gap-2 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" size={18} />
            <input
              type="text"
              placeholder="Search research papers..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3.5 bg-[#111] border border-[#1e1e1e] focus:border-emerald-500/50 rounded-xl focus:outline-none text-white placeholder-gray-600 text-sm transition-colors"
            />
          </div>
          <button
            type="button"
            onClick={() => setDeepMode(!deepMode)}
            className={`flex items-center gap-2 px-4 py-3.5 rounded-xl border text-sm font-medium transition-all duration-200
              ${deepMode
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                : 'bg-[#111] border-[#1e1e1e] text-gray-500 hover:text-gray-300 hover:border-[#2a2a2a]'
              }`}
          >
            {deepMode ? <X size={16} /> : <Plus size={16} />}
            Deep
          </button>
          <button
            type="submit"
            disabled={loading}
            className="bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-white font-medium px-6 py-3.5 rounded-xl flex items-center gap-2 transition-all duration-200 disabled:opacity-50 text-sm"
          >
            {loading ? <Loader2 className="animate-spin" size={16} /> : <Search size={16} />}
            {loading ? 'Searching...' : 'Search'}
          </button>
        </form>

        {/* Deep Mode Banner */}
        {deepMode && (
          <div className="flex items-center gap-2 bg-emerald-500/5 border border-emerald-500/15 px-4 py-2.5 rounded-xl mb-6">
            <Sparkles className="text-emerald-400" size={15} />
            <p className="text-emerald-400 text-xs">
              <span className="font-semibold">Deep Research ON</span> — AI analyzes top 5 papers and generates a summary
            </p>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl mb-6 text-sm">
            {error}
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-24">
            <div className="flex gap-1.5 mb-4">
              {[0, 1, 2].map((i) => (
                <div key={i} className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce"
                  style={{ animationDelay: `${i * 0.15}s` }} />
              ))}
            </div>
            <p className="text-gray-500 text-sm">
              {deepMode ? 'Analyzing papers...' : 'Searching...'}
            </p>
          </div>
        )}

        {/* Deep Summary */}
        {!loading && deepResult && (
          <div className="bg-[#111] border-l-2 border-emerald-500 rounded-xl p-5 mb-6">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="text-emerald-400" size={16} />
              <span className="text-white font-semibold text-sm">Deep Research Summary</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed whitespace-pre-line">
              {deepResult.summary}
            </p>
          </div>
        )}

        {/* Results */}
        {!loading && results.length > 0 && (
          <div className="space-y-3">
            <p className="text-gray-600 text-xs mb-4">{results.length} papers found</p>
            {results.map((paper, i) => (
              <div key={i} className="bg-[#111] border border-[#1e1e1e] hover:border-[#2a2a2a] rounded-xl p-5 transition-all duration-200 hover:shadow-lg hover:shadow-black/20 hover:-translate-y-0.5">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <h3 className="text-white font-semibold text-sm leading-snug flex-1">{paper.title}</h3>
                  <a href={paper.url} target="_blank" rel="noopener noreferrer"
                    className="text-gray-600 hover:text-emerald-400 flex-shrink-0 transition-colors">
                    <ExternalLink size={16} />
                  </a>
                </div>
                <p className="text-gray-500 text-xs leading-relaxed line-clamp-3 mb-3">{paper.abstract}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5 text-gray-600 text-xs">
                      <Users size={12} />
                      <span>{paper.authors?.slice(0, 2).join(', ')}{paper.authors?.length > 2 ? ` +${paper.authors.length - 2}` : ''}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-gray-600 text-xs">
                      <Calendar size={12} />
                      <span>{paper.published}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => { setActiveQA(activeQA === i ? null : i); setQaAnswer(''); setQuestion('') }}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200
                      ${activeQA === i
                        ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400'
                        : 'bg-[#1a1a1a] border border-[#2a2a2a] text-gray-500 hover:text-gray-300'
                      }`}
                  >
                    <MessageCircle size={12} />
                    Ask AI
                  </button>
                </div>

                {/* Q&A */}
                {activeQA === i && (
                  <div className="mt-4 pt-4 border-t border-[#1e1e1e]">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Ask anything about this paper..."
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleQA(paper)}
                        className="flex-1 px-3 py-2 bg-[#1a1a1a] border border-[#2a2a2a] focus:border-emerald-500/40 rounded-lg focus:outline-none text-white placeholder-gray-600 text-xs transition-colors"
                      />
                      <button onClick={() => handleQA(paper)} disabled={qaLoading}
                        className="bg-emerald-500 hover:bg-emerald-600 text-white px-3 py-2 rounded-lg transition-colors disabled:opacity-50">
                        {qaLoading ? <Loader2 className="animate-spin" size={14} /> : <Send size={14} />}
                      </button>
                    </div>
                    {qaAnswer && (
                      <div className="mt-3 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg p-3">
                        <div className="flex items-center gap-1.5 mb-2">
                          <Sparkles className="text-emerald-400" size={12} />
                          <span className="text-emerald-400 text-xs font-medium">AI Answer</span>
                        </div>
                        <p className="text-gray-300 text-xs leading-relaxed">{qaAnswer}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Empty */}
        {!loading && searched && results.length === 0 && (
          <div className="text-center py-24">
            <Search className="text-gray-800 mx-auto mb-3" size={40} />
            <p className="text-gray-500 text-sm">No papers found. Try a different query!</p>
          </div>
        )}

        {/* Initial */}
        {!searched && (
          <div className="text-center py-24">
            <div className="w-16 h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Search className="text-emerald-500" size={28} />
            </div>
            <p className="text-white font-medium mb-1">Search Research Papers</p>
            <p className="text-gray-600 text-sm">Try: "machine learning", "quantum computing"</p>
          </div>
        )}

      </div>
    </div>
  )
}