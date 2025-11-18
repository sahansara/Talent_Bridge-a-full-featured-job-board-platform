import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
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
    hmr: {
      host: 'localhost',
      port: 5173,
    },
    
    proxy: {
      '/api': {
        target: 'http://backend:3000',
        secure: false,
        rewrite: (path) => path 
      }
    }
  },
})