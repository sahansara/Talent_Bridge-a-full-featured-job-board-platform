import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],

  server: {
    host: '0.0.0.0',
    port: 5173,
    strictPort: true,

    watch: {
      usePolling: true,
      interval: 1000,
    },

    
    hmr: true,

    proxy: {
      '/api': {
        target: 'http://backend:3000',
        secure: false,
        changeOrigin: true,
      }
    }
  },
})
