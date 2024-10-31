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
      formats: ['es']
    },
    sourcemap: true,
    emptyOutDir: false,
    minify: false
  },
  ignorePatterns: ['test/*'],
  server: {
    port: 3000
  }
})
