import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Forward /api/* to the Vercel dev server during local development.
      // Run: npx vercel dev  (serves the serverless functions on port 3000)
      // Then: npm run dev   (Vite on 5173, proxies /api to 3000)
      "/api": {
        target: "http://localhost:3000",
        changeOrigin: true,
      },
    },
  },
})
