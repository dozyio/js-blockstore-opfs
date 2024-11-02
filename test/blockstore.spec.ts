import { test, expect } from '@playwright/test'

test.describe('OPFSBlockstore', () => {
  const pageMainThread = 'http://localhost:3000/test/blockstore.html'

  test.beforeEach(async ({ page }) => {
    // eslint-disable-next-line no-console
    // page.on('console', msg => { console.log(msg.text()) })

    await page.goto(pageMainThread)
  })

  // skipped to stop thrashing storage
  test.skip('should handle writing more data than the storage quota allows', async ({ page }) => {
    const result = await page.evaluate(async () => {
      const { OPFSBlockstore } = (window as any)
      const { CID } = (window as any)
      const { sha256 } = (window as any)

      const store = new OPFSBlockstore('bs')
      await store.open()

      const maxDataSize = 3 * 1024 * 1024 * 1024 // 3 GB
      let totalDataWritten = 0
      const blockSize = 1024 * 1024 // 1 MB blocks
      let errorOccurred = null

      try {
        while (totalDataWritten < maxDataSize) {
          // Generate random data block
          const data = new Uint8Array(blockSize)
          const maxChunkSize = 65536 // Maximum allowed by crypto.getRandomValues

          for (let offset = 0; offset < data.length; offset += maxChunkSize) {
            const chunkSize = Math.min(maxChunkSize, data.length - offset)
            const chunk = data.subarray(offset, offset + chunkSize)
            crypto.getRandomValues(chunk)
          }

          // Create CID for the data
          const hash = await sha256.digest(data)
          const cid = CID.createV1(0x55, hash)

          // Attempt to put the block
          await store.put(cid, data)

          totalDataWritten += blockSize
        }
      } catch (error: any) {
        if (error.message !== undefined && error.message !== null) {
          errorOccurred = error.message
        } else {
          errorOccurred = error.toString()
        }
      }

      return {
        totalDataWritten,
        errorOccurred
      }
    })

    if (result.errorOccurred !== undefined && result.errorOccurred !== null) {
      let hasError = false

      if (result.errorOccurred.includes('QuotaExceededError') === true) {
        hasError = true
      }

      if (result.errorOccurred.includes('PutFailedError') === true) {
        hasError = true
      }

      expect(hasError).toBe(true)
    } else {
      // If no error occurred, the quota was not exceeded within the test limits
      // eslint-disable-next-line no-console
      console.warn('Quota was not exceeded within the test data limit.')
      expect(result.totalDataWritten).toBeGreaterThan(0)
    }
  })
})
