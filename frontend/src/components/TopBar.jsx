import { Menu } from 'lucide-react'
import NexoraLogo from '../assets/nexora-logo.svg?react'

export default function TopBar({ onOpen, title }) {
  return (
    <div className="sticky top-0 z-30 bg-[#111111] border-b border-[#1e1e1e] px-6 py-4 flex items-center gap-4">
      <button
        onClick={onOpen}
        className="text-gray-400 hover:text-white transition-colors p-2 rounded-xl hover:bg-[#1a1a1a]"
      >
        <Menu size={20} />
      </button>
      <NexoraLogo className="w-24 h-auto" />
    </div>
  )
}