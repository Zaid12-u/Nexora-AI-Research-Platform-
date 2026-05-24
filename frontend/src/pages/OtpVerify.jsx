import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { BookOpen, ShieldCheck, ArrowRight } from 'lucide-react'
import axios from 'axios'

const AUTH_URL = 'https://nexora-ai-research-platform-production.up.railway.app'

export default function OtpVerify() {
  const navigate = useNavigate()
  const location = useLocation()
  const email = location.state?.email || ''
  const [otp, setOtp] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await axios.post(`${AUTH_URL}/api/auth/verify-otp`, { email, otp })

      // Token + user save karo ✅
      localStorage.setItem('token', res.data.token)
      localStorage.setItem('user', JSON.stringify(res.data.user))

      navigate('/search')
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid OTP')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col">

      {/* Top Bar */}
      <div className="flex items-center justify-between px-8 py-5 border-b border-[#1e1e1e]">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2.5 hover:opacity-80 transition-opacity"
        >
          <div className="bg-emerald-500 p-2 rounded-xl">
            <BookOpen className="text-white" size={18} />
          </div>
          <span className="text-white font-bold text-lg">ResearchAI</span>
        </button>
        <p className="text-gray-600 text-sm">
          Wrong email?{' '}
          <button
            onClick={() => navigate('/register')}
            className="text-emerald-400 hover:text-emerald-300 font-medium transition-colors"
          >
            Go Back
          </button>
        </p>
      </div>

      {/* Form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">

          {/* Icon */}
          <div className="w-12 h-12 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center justify-center mb-6">
            <ShieldCheck className="text-emerald-400" size={22} />
          </div>

          <h2 className="text-2xl font-bold text-white mb-1">Verify your email</h2>
          <p className="text-gray-500 text-sm mb-1">We sent a 6-digit code to</p>
          <p className="text-emerald-400 text-sm font-medium mb-8">{email}</p>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl mb-5 text-xs">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3">
            <input
              type="text"
              placeholder="000000"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              maxLength={6}
              className="w-full px-4 py-4 bg-[#111] border border-[#1e1e1e] focus:border-emerald-500/50 rounded-xl focus:outline-none text-white text-center text-2xl tracking-[0.5em] font-bold placeholder-gray-700 transition-colors"
              required
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2 transition-all duration-200 disabled:opacity-50 text-sm"
            >
              {loading ? 'Verifying...' : 'Verify OTP'}
              {!loading && <ArrowRight size={16} />}
            </button>
          </form>

          <p className="text-gray-700 text-xs text-center mt-6">
            Check your spam folder if you don't see the email
          </p>

        </div>
      </div>

    </div>
  )
}