import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor': ['react', 'react-dom', 'react-router-dom'],
          'animation': ['framer-motion', 'gsap'],
          'ui': ['lucide-react', '@radix-ui/react-icons']
        }
      }
    }
  },
  server: {
    proxy: {
      '/api': {
        target: process.env.VITE_API_BASE || 'http://localhost:5000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '/api')
      }
    }
  }
})
