import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useState } from 'react'
import Welcome from './pages/Welcome'
import Register from './pages/Register'
import OtpVerify from './pages/OtpVerify'
import Login from './pages/Login'
import Search from './pages/Search'
import History from './pages/History'
import GapFinder from './pages/GapFinder'
import IntroScreen from './components/IntroScreen'

function App() {
  const [introDone, setIntroDone] = useState(false)

  if (!introDone) {
    return <IntroScreen onComplete={() => setIntroDone(true)} />
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/register" element={<Register />} />
        
        <Route path="/login" element={<Login />} />
        <Route path="/search" element={<Search />} />
        <Route path="/history" element={<History />} />
        <Route path="/gap-finder" element={<GapFinder />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App