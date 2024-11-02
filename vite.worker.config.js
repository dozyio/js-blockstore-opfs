/** @type {import('vite').UserConfig} */
import { resolve } from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src-worker/opfs.worker.ts'),
      formats: ['es'],
      name: 'OPFSWorker',
      fileName: 'opfs-worker'
    },
    minify: true,
    sourcemap: false,
    emptyOutDir: true,
    outDir: 'dist-worker'
  },
  ignorePatterns: ['test/*'],
  server: {
    port: 3000
  }
})
