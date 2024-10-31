/** @type {import('vite').UserConfig} */
import { resolve } from 'path'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

export default defineConfig({
  plugins: [
    dts()
  ],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      formats: ['es', 'cjs']
    },
    sourcemap: true,
    emptyOutDir: false
  },
  ignorePatterns: ['test/*'],
  server: {
    port: 3000
  }
})
