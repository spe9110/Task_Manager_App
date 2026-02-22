import { defineConfig } from 'vite'
import { analyzer } from 'vite-bundle-analyzer'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    analyzer()
  ],
  server: {
    port: 5173,
    host: true,
    watch: {
      usePolling: true,
      interval: 100,
    },
    proxy: {
      '/api/v1': {
        target: 'https://task-manager-app-ohyg.onrender.com', // use service name, not localhost
        changeOrigin: true,
      },
    },
  },
})
