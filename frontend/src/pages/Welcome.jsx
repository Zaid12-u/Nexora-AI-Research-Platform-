import { useNavigate } from 'react-router-dom'
import { Search, Sparkles, History, ArrowRight, Zap } from 'lucide-react'
import { useEffect, useState } from 'react'
import NexoraLogo from '../assets/nexora-logo.svg?react'

export default function Welcome() {
  const navigate = useNavigate()
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 100)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col">

      {/* Top Bar */}
      <div
        className={`flex items-center justify-between px-8 py-5 border-b border-[#1e1e1e] transition-all duration-700 ease-out
          ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}
      >
        <NexoraLogo className="w-36 h-auto" />
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/login')}
            className="text-gray-400 hover:text-white text-sm font-medium px-4 py-2 rounded-xl hover:bg-[#1a1a1a] transition-all duration-200"
          >
            Login
          </button>
          <button
            onClick={() => navigate('/register')}
            className="bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-white text-sm font-medium px-4 py-2 rounded-xl transition-all duration-200"
          >
            Get Started
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center">
        <div className="max-w-2xl mx-auto px-8 py-16 w-full">

          {/* Badge */}
          <div
            className={`inline-flex items-center gap-2 bg-[#111] border border-[#1e1e1e] px-3 py-1.5 rounded-full mb-8 transition-all duration-700 delay-100 ease-out
              ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
          >
            <Zap size={12} className="text-emerald-400" />
            <span className="text-gray-400 text-xs">AI Powered Research Engine</span>
          </div>

          {/* Heading */}
          <h1
            className={`text-5xl font-bold text-white mb-6 leading-tight transition-all duration-700 delay-200 ease-out
              ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
          >
            Discover Research
            <br />
            <span className="text-emerald-400">Smarter with AI</span>
          </h1>

          {/* Description */}
          <p
            className={`text-gray-500 text-lg mb-10 leading-relaxed max-w-lg transition-all duration-700 delay-300 ease-out
              ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
          >
            Stop wasting time on keyword searches. Let AI understand what you're looking for and find the most relevant papers — instantly.
          </p>

          {/* CTA */}
          <div
            className={`flex items-center gap-3 mb-16 transition-all duration-700 delay-[400ms] ease-out
              ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
          >
            <button
              onClick={() => navigate('/register')}
              className="bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-white font-semibold px-6 py-3 rounded-xl flex items-center gap-2 transition-all duration-200 text-sm"
            >
              Get Started Free
              <ArrowRight size={16} />
            </button>
            <button
              onClick={() => navigate('/login')}
              className="text-gray-400 hover:text-white font-medium px-6 py-3 rounded-xl border border-[#1e1e1e] hover:border-[#2a2a2a] transition-all duration-200 text-sm"
            >
              Login
            </button>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { icon: Search, title: "Semantic Search", desc: "AI understands meaning, not just keywords" },
              { icon: Sparkles, title: "Gap Finder", desc: "Discover what's missing in research" },
              { icon: History, title: "Search History", desc: "Track and revisit your research" },
            ].map(({ icon: Icon, title, desc }, i) => (
              <div
                key={i}
                style={{ transitionDelay: `${500 + i * 100}ms` }}
                className={`bg-[#111] border border-[#1e1e1e] hover:border-[#2a2a2a] p-4 rounded-xl transition-all duration-700 ease-out hover:-translate-y-0.5
                  ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
              >
                <div className="bg-emerald-500/10 w-8 h-8 rounded-lg flex items-center justify-center mb-3">
                  <Icon className="text-emerald-400" size={16} />
                </div>
                <p className="text-white text-sm font-semibold mb-1">{title}</p>
                <p className="text-gray-600 text-xs leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>

        </div>
      </div>

      {/* Footer */}
      <div
        className={`px-8 py-4 border-t border-[#1e1e1e] transition-all duration-700 delay-[800ms] ease-out
          ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
      >
        <p className="text-gray-700 text-xs text-center">Built for researchers • Powered by AI • Free to use</p>
      </div>

    </div>
  )
}