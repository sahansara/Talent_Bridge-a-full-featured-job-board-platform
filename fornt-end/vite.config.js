
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
<<<<<<< Updated upstream
    port: 5173, 
    proxy: {
      '/api': {
        target: 'http://localhost:3000', 
        changeOrigin: true,
        secure: false,
        rewrite: (path) => {
          return path;
        },
      },
    },
  },
})
=======
    host: '0.0.0.0',
    port: 5173,
    strictPort: true,

    watch: {
      usePolling: true,
      interval: 1000,
    },

    hmr: true,

    // Proxy for local development only
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
      }
    }
  },

  // Build configuration
  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
        },
      },
    },
  },
})
>>>>>>> Stashed changes
