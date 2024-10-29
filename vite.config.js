/** @type {import('vite').UserConfig} */
import { resolve } from 'path'
import { simpleWorkerPlugin } from 'simple-worker-vite/plugin'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

export default defineConfig({
  plugins: [
    dts(),
    simpleWorkerPlugin({
      minify: true,
      workers: [
        {
          name: 'opfs',
          srcPath: 'src/workers/opfs.worker.ts'
        }
      ]
    })
  ],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/workers/opfs.worker.ts'),
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
