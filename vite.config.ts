import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { portfolioSeo } from './scripts/seo.ts'

export default defineConfig({
  plugins: [react(), portfolioSeo()],
  server: { port: 5173 },
})
