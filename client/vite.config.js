import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from "path";
export default defineConfig({
  plugins: [react(),tailwindcss()],
  server: {
    allowedHosts: [
      '54c618dfa4a8.ngrok-free.app' 
    ],
    host: true, 
    port: 5173
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src") 
    }
  }
})
