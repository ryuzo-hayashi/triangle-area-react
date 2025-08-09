// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/triangle-area-react/'   // ★ フルURLではなく先頭/末尾スラッシュ付きのパス
})