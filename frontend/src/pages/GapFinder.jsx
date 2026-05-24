import { useState } from 'react'
import {
  Search,
  Loader2,
  Sparkles,
  ArrowRight,
  BookOpen
} from 'lucide-react'
import Sidebar from '../components/Sidebar'
import TopBar from '../components/TopBar'
import axios from 'axios'

const AI_URL = 'https://zaiddev123-nexora-ai-service.hf.space'
const AUTH_URL = 'https://nexora-ai-research-platform-production.up.railway.app'

export default function GapFinder() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [query, setQuery] = useState(localStorage.getItem('lastGapQuery') || '')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(JSON.parse(localStorage.getItem('lastGapResult') || 'null'))
  const [error, setError] = useState('')
  const [searched, setSearched] = useState(localStorage.getItem('lastGapResult') ? true : false)

  const token = localStorage.getItem('token')

  const handleSearch = async (e) => {
    e.preventDefault()
    if (!query.trim()) return

    setLoading(true)
    setError('')
    setResult(null)
    setSearched(true)

    try {
      const res = await axios.post(`${AI_URL}/gap-finder`, { query })

      setResult(res.data)
      localStorage.setItem('lastGapQuery', query)
      localStorage.setItem('lastGapResult', JSON.stringify(res.data))

      await axios.post(
        `${AUTH_URL}/api/history/save`,
        { query: `[Gap Finder] ${query}`, results: res.data.papers },
        { headers: { Authorization: `Bearer ${token}` } }
      )
    } catch (err) {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <TopBar onOpen={() => setSidebarOpen(true)} title="Research Gap Finder" />

      <div className="max-w-3xl mx-auto px-6 py-10">

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="flex gap-2 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" size={18} />
            <input
              type="text"
              placeholder="e.g. 'diabetes prediction', 'NLP transformers'..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3.5 bg-[#111] border border-[#1e1e1e] focus:border-emerald-500/50 rounded-xl focus:outline-none text-white placeholder-gray-600 text-sm transition-colors"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-white font-medium px-6 py-3.5 rounded-xl flex items-center gap-2 transition-all duration-200 disabled:opacity-50 text-sm"
          >
            {loading ? <Loader2 className="animate-spin" size={16} /> : <ArrowRight size={16} />}
            {loading ? 'Analyzing...' : 'Analyze'}
          </button>
        </form>

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
            <p className="text-gray-500 text-sm">Analyzing 10 research papers...</p>
          </div>
        )}

        {/* Result */}
        {!loading && result && (
          <div className="space-y-6">
            <div className="bg-[#111] border-l-2 border-emerald-500 rounded-xl p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="text-emerald-400" size={16} />
                  <span className="text-white font-semibold text-sm">AI Analysis</span>
                </div>
                <span className="text-gray-600 text-xs">{result.papers_analyzed} papers analyzed</span>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed whitespace-pre-line">{result.analysis}</p>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-3">
                <BookOpen className="text-gray-600" size={15} />
                <span className="text-gray-500 text-xs font-medium uppercase tracking-wider">Papers Analyzed</span>
              </div>
              <div className="space-y-2">
                {result.papers?.map((paper, i) => (
                  <div key={i} className="bg-[#111] border border-[#1e1e1e] rounded-xl p-4">
                    <div className="flex items-start gap-3">
                      <span className="text-emerald-500 font-bold text-xs mt-0.5 w-5 flex-shrink-0">{i + 1}</span>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-white text-sm font-medium mb-1">{paper.title}</h4>
                        <p className="text-gray-600 text-xs">{paper.published} • {paper.authors?.slice(0, 2).join(', ')}</p>
                      </div>
                      <a href={paper.url} target="_blank" rel="noopener noreferrer"
                        className="text-gray-600 hover:text-emerald-400">
                        <ArrowRight size={14} />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Initial */}
        {!searched && (
          <div className="text-center py-24">
            <div className="w-16 h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Sparkles className="text-emerald-500" size={28} />
            </div>
            <p className="text-white font-medium mb-1">Find Research Gaps</p>
            <p className="text-gray-600 text-sm">Enter a topic to discover what's missing in research</p>
          </div>
        )}

      </div>
    </div>
  )
}