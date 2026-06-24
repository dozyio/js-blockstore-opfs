/** @type {import('aegir').PartialOptions} */
export default {
  dependencyCheck: {
    ignore: [
      'playwright-test'
    ],
    productionIgnorePatterns: [
      '/benchmark',
      '/dist',
      '/test',
      '.aegir.js',
      'playwright.config.ts',
      'vite.config.js',
      'vite.worker.config.js'
    ]
  }
}
