
import { defineConfig } from 'vite'

export default defineConfig({
  base: '/Langit-Pranaja/',
  build: {
    rollupOptions: {
      input: 'index.html', // Pastikan path ini benar untuk entry HTML
    },
  },
})
