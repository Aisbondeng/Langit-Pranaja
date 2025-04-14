import { defineConfig } from 'vite'

export default defineConfig({
  // Mengatur base path untuk GitHub Pages
  base: '/Langit-Pranaja/',

  // Konfigurasi build
  build: {
    rollupOptions: {
      // Tentukan path ke file index.html (biasanya di root folder atau folder public)
      input: 'index.html',  // Ganti dengan path yang benar jika index.html di folder lain
    },
  },

  // Opsional: jika menggunakan alias atau konfigurasi lain
  resolve: {
    alias: {
      '@': '/src',
    },
  },
})
