import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // three.js lives in its own chunk (the home page 3D world, ~145 kB gzipped), fetched after the page is interactive
    chunkSizeWarningLimit: 650,
  },
})
