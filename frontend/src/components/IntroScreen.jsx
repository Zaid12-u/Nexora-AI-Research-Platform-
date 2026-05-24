import { useEffect, useState } from 'react'

export default function IntroScreen({ onComplete }) {
  const [displayed, setDisplayed] = useState('')
  const [fadeOut, setFadeOut] = useState(false)
  const fullText = 'Nexora'

  useEffect(() => {
    let i = 0
    const interval = setInterval(() => {
      if (i < fullText.length) {
        setDisplayed(fullText.slice(0, i + 1))
        i++
      } else {
        clearInterval(interval)
        setTimeout(() => {
          setFadeOut(true)
          setTimeout(onComplete, 600)
        }, 800)
      }
    }, 130)

    return () => clearInterval(interval)
  }, [])

  return (
    <div
      className={`fixed inset-0 bg-[#0a0a0a] flex flex-col items-center justify-center z-50 transition-opacity duration-600 ease-out
        ${fadeOut ? 'opacity-0' : 'opacity-100'}`}
    >
      
      <div
        className={`mb-6 transition-all duration-500 ease-out
          ${displayed.length > 0 ? 'opacity-100 scale-100' : 'opacity-0 scale-75'}`}
      >
        <div className="bg-emerald-500 w-16 h-16 rounded-2xl flex items-center justify-center">
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
            <line x1="8" y1="26" x2="8" y2="6"  stroke="#0d0d0d" stroke-width="4" stroke-linecap="round"/>
            <line x1="24" y1="26" x2="24" y2="6" stroke="#0d0d0d" stroke-width="4" stroke-linecap="round"/>
            <line x1="8" y1="6"  x2="24" y2="26" stroke="#0d0d0d" stroke-width="4" stroke-linecap="round"/>
          </svg>
        </div>
      </div>

      
      <div className="flex items-center gap-1">
        <h1 className="text-6xl font-bold tracking-tight">
          <span className="text-white">{displayed.slice(0, 3)}</span>
          <span className="text-emerald-400">{displayed.slice(3)}</span>
        </h1>
        
        {!fadeOut && (
          <span className="inline-block w-[3px] h-14 bg-emerald-400 ml-1 align-middle animate-pulse" />
        )}
      </div>

      
      <p
        className={`text-gray-600 text-sm mt-4 tracking-widest uppercase transition-all duration-500 ease-out
          ${displayed === fullText ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}
      >
        AI Research Platform
      </p>
    </div>
  )
}