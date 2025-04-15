// ~/Langit-Pranaja/vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  root: './client',
  base: '/Langit-Pranaja/',
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'client/src') // Menetapkan alias '@' ke folder 'src'
    }
  }
})
