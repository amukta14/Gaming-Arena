import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/Gaming-Arena/', // 🔥 Set this to your repo name with a slash
})
