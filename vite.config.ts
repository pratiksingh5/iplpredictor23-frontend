import path from "path"
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import Checker from 'vite-plugin-checker';

export default defineConfig({
  plugins: [
    tailwindcss(),
    react(),
    Checker({ typescript: true }) 
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
