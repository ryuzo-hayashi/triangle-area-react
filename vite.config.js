// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
export default defineConfig({
  plugins: [react()],
  base: 'https://ryuzo-hayashi.github.io/triangle-area-react/' // ★ リポジトリ名に合わせて変更
})
