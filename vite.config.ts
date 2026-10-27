import { fileURLToPath, URL } from 'node:url'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

/**
 * The upstream API (https://breedhealthscore.com) does not send CORS headers, so a
 * browser cannot call it directly from another origin. The frontend therefore calls a
 * same-origin path (`/api/bhs/*`) that is proxied to the real API:
 *
 *   - `npm run dev` / `npm run preview` -> the proxy below
 *   - production (Vercel)               -> the rewrite in vercel.json
 *
 * The upstream API keeps being the single data source; nothing is mocked.
 */
const API_ORIGIN = 'https://breedhealthscore.com'

const apiProxy = {
  '/api/bhs': {
    target: API_ORIGIN,
    changeOrigin: true,
    secure: true,
    rewrite: (path: string) => path.replace(/^\/api\/bhs/, '/api'),
  },
}

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    proxy: apiProxy,
  },
  preview: {
    proxy: apiProxy,
  },
})
