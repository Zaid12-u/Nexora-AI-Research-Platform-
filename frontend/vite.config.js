import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr'        // ← yeh add karo

export default defineConfig({
  plugins: [react(), svgr()],              // ← svgr() add karo
})