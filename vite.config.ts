/// <reference types="vitest" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    // MagicMoveCodeSlide lazy-loads Shiki + its grammars into their own
    // chunk, only fetched when a talk actually uses code-step slides — it's
    // large but never part of the main bundle, so the default warning here
    // would be a false alarm.
    chunkSizeWarningLimit: 1500,
  },
  test: {
    environment: 'jsdom',
    globals: true,
  },
})
