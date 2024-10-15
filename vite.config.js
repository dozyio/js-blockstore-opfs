import { defineConfig } from 'vite'

export default defineConfig({
  optimizeDeps: {
    include: ['multiformats']
  },
  server: {
    port: 3000
  }
})
