import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/__/auth': {
        target: 'https://student-cafe-app-v1-9382.firebaseapp.com',
        changeOrigin: true,
      }
    }
  }
})
