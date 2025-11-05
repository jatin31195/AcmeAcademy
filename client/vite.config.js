import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from "path";

export default defineConfig({
  base: '/', 
  plugins: [react(), tailwindcss()],
  build: {
    minify: 'esbuild', 
    sourcemap: false, 
    chunkSizeWarningLimit: 800, 
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'framer-motion'], 
        },
      },
    },
  },
  define: {
    'process.env.NODE_ENV': '"production"',
  },
  server: {
    host: true,
    port: 5173,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
})
