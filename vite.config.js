import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Separate large libs
          react: ['react', 'react-dom'],
          vendor: ['axios', '@supabase/supabase-js', '@tanstack/react-query', 'lucide-react'],
        },
      },
    },
  },
})


