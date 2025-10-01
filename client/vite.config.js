import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(),tailwindcss()],
  server: {
    allowedHosts: [
      '54c618dfa4a8.ngrok-free.app' // replace with your current ngrok domain
    ],
    host: true, // allows external access
    port: 5173
  }
})
