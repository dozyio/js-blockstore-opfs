import { test, expect } from '@playwright/test'

test.describe('OPFSBlockstore WebWorker', () => {
  // test.beforeEach(async ({ page }) => {
  //   await page.goto('http://localhost:3000')
  //   await page.evaluate(async () => {
  //     const opfsRoot = await navigator.storage.getDirectory()
  //     // @ts-expect-error // entries() is a thing
  //     for await (const [name] of opfsRoot.entries()) {
  //       await opfsRoot.removeEntry(name)
  //     }
  //   })
  // })

  const pageWebWorker = 'http://localhost:3000/test-webworker.html'

  test('should put and get data', async ({ page }) => {
    await page.goto(pageWebWorker)

    const result = await page.evaluate(async () => {
      // Call methods exposed by the web worker
      const { CID } = (window as any)
      const { sha256 } = (window as any)
      const data = new TextEncoder().encode('Test Data')
      const hash = await sha256.digest(data)
      const cid = CID.createV1(0x55, hash)

      // @ts-expect-error // callWorkerMethod is a thing
      await window.callWorkerMethod('open')

      // @ts-expect-error // callWorkerMethod is a thing
      await window.callWorkerMethod('put', {
        key: cid.toString(),
        value: data.buffer
      })

      // Get data
      // @ts-expect-error // callWorkerMethod is a thing
      const dataBuffer = await window.callWorkerMethod('get', {
        key: cid.toString()
      })
      const retrievedData = new Uint8Array(dataBuffer)

      return {
        storedData: new TextDecoder().decode(retrievedData)
      }
    })

    expect(result.storedData).toBe('Test Data')
  })

  test('should check existence of a block', async ({ page }) => {
    await page.goto(pageWebWorker)

    const result = await page.evaluate(async () => {
      const { CID } = (window as any)
      const { sha256 } = (window as any)
      const data = new Uint8Array([4, 5, 6, 7])
      const hash = await sha256.digest(data)
      const cid = CID.createV1(0x55, hash)

      // @ts-expect-error // callWorkerMethod is a thing
      await window.callWorkerMethod('open')

      // @ts-expect-error // callWorkerMethod is a thing
      const existsBefore = await window.callWorkerMethod('has', {
        key: cid.toString()
      })

      // @ts-expect-error // callWorkerMethod is a thing
      await window.callWorkerMethod('put', {
        key: cid.toString(),
        value: data.buffer
      })

      // @ts-expect-error // callWorkerMethod is a thing
      const existsAfter = await window.callWorkerMethod('has', {
        key: cid.toString()
      })

      return { existsBefore, existsAfter }
    })

    expect(result.existsBefore).toBe(false)
    expect(result.existsAfter).toBe(true)
  })

  test('should delete a block', async ({ page }) => {
    await page.goto(pageWebWorker)

    const exists = await page.evaluate(async () => {
      const { CID } = (window as any)
      const { sha256 } = (window as any)
      const data = new Uint8Array([8, 9, 10, 11])
      const hash = await sha256.digest(data)
      const cid = CID.createV1(0x55, hash)

      // @ts-expect-error // callWorkerMethod is a thing
      await window.callWorkerMethod('open')

      // @ts-expect-error // callWorkerMethod is a thing
      await window.callWorkerMethod('put', {
        key: cid.toString(),
        value: data.buffer
      })

      // @ts-expect-error // callWorkerMethod is a thing
      await window.callWorkerMethod('delete', {
        key: cid.toString()
      })

      // @ts-expect-error // callWorkerMethod is a thing
      return window.callWorkerMethod('has', {
        key: cid.toString()
      })
    })

    expect(exists).toBe(false)
  })

  test('should throw when getting a block that does not exist', async ({ page }) => {
    await page.goto(pageWebWorker)

    const result = await page.evaluate(async () => {
      const { CID } = (window as any)
      const { sha256 } = (window as any)
      const data = new Uint8Array([4, 5, 6, 7])
      const hash = await sha256.digest(data)
      const cid = CID.createV1(0x55, hash)

      // @ts-expect-error // callWorkerMethod is a thing
      await window.callWorkerMethod('open')

      // Attempt to get the block, which should not exist
      try {
        // Get data
        // @ts-expect-error // callWorkerMethod is a thing
        await window.callWorkerMethod('get', {
          key: cid.toString()
        })
        // If no error is thrown, return null
        return null
      } catch (error: any) {
        // Return the error message
        return error.message
      }
    })

    expect(result).not.toBeNull()
    expect(result).toContain('NotFoundError')
  })

  test('should throw then deleting a block that does not exist', async ({ page }) => {
    await page.goto(pageWebWorker)

    const result = await page.evaluate(async () => {
      const { CID } = (window as any)
      const { sha256 } = (window as any)
      const data = new Uint8Array([8, 9, 10, 11])
      const hash = await sha256.digest(data)
      const cid = CID.createV1(0x55, hash)

      // @ts-expect-error // callWorkerMethod is a thing
      await window.callWorkerMethod('open')

      try {
        // @ts-expect-error // callWorkerMethod is a thing
        await window.callWorkerMethod('delete', {
          key: cid.toString()
        })

        // If no error is thrown, return null
        return null
      } catch (error: any) {
        // Return the error message
        return error.message
      }
    })

    expect(result).not.toBeNull()
    expect(result).toContain('NotFoundError')
  })

  test('should return storage estimate with quota and usage', async ({ page }) => {
    await page.goto(pageWebWorker)

    const estimate = await page.evaluate(async () => {
      const { OPFSBlockstore } = (window as any)
      const { OPFSMainThreadFS } = (window as any)

      const mainThreadFS = new OPFSMainThreadFS('bs')
      const store = new OPFSBlockstore(mainThreadFS)
      await store.open()

      // Call the free() method
      return store.free()
    })

    // Verify that estimate is an object
    expect(typeof estimate).toBe('object')
    expect(estimate).not.toBeNull()

    // Verify that estimate has 'quota' and 'usage' properties
    expect(estimate).toHaveProperty('quota')
    expect(estimate).toHaveProperty('usage')

    // Verify that 'quota' and 'usage' are numbers
    expect(typeof estimate.quota).toBe('number')
    expect(typeof estimate.usage).toBe('number')
  })

  test.skip('should put and get multiple blocks using putMany and getMany', async ({ page }) => {
    await page.goto(pageWebWorker)

    const result = await page.evaluate(async () => {
      const { OPFSBlockstore } = (window as any)
      const { OPFSMainThreadFS } = (window as any)
      const { CID } = (window as any)
      const { sha256 } = (window as any)

      const mainThreadFS = new OPFSMainThreadFS('bs')
      const store = new OPFSBlockstore(mainThreadFS)
      await store.open()

      // Prepare multiple blocks
      const dataBlocks = [
        new Uint8Array([0, 1, 2, 3]),
        new Uint8Array([4, 5, 6, 7]),
        new Uint8Array([8, 9, 10, 11])
      ]

      // Create CIDs and Pairs
      const pairs = await Promise.all(
        dataBlocks.map(async (data) => {
          const hash = await sha256.digest(data)
          const cid = CID.createV1(0x55, hash) // 0x55 is the multicodec code for 'raw'
          return { cid, block: data }
        })
      )

      // Put many blocks
      const putResults = []
      for await (const cid of store.putMany(pairs)) {
        putResults.push(cid.toString())
      }

      // Get many blocks
      const cids = pairs.map((pair) => pair.cid)
      const getResults = []
      for await (const { cid, block } of store.getMany(cids)) {
        getResults.push({
          cid: cid.toString(),
          block: Array.from(block)
        })
      }

      return {
        putResults,
        getResults
      }
    })

    // Verify that all CIDs from putResults match expected CIDs
    expect(result.putResults.length).toBe(3)
    expect(result.putResults).toEqual(
      expect.arrayContaining([
        expect.any(String),
        expect.any(String),
        expect.any(String)
      ])
    )

    // Verify that getResults match the original data
    expect(result.getResults.length).toBe(3)
    const expectedDataBlocks = [
      [0, 1, 2, 3],
      [4, 5, 6, 7],
      [8, 9, 10, 11]
    ]
    for (let i = 0; i < 3; i++) {
      expect(result.getResults[i].block).toEqual(expectedDataBlocks[i])
    }
  })

  test.skip('should delete multiple blocks using deleteMany', async ({ page }) => {
    await page.goto(pageWebWorker)

    const result = await page.evaluate(async () => {
      const { OPFSBlockstore } = (window as any)
      const { OPFSMainThreadFS } = (window as any)
      const { CID } = (window as any)
      const { sha256 } = (window as any)

      const mainThreadFS = new OPFSMainThreadFS('bs')
      const store = new OPFSBlockstore(mainThreadFS)
      await store.open()

      // Prepare multiple blocks
      const dataBlocks = [
        new Uint8Array([12, 13, 14, 15]),
        new Uint8Array([16, 17, 18, 19]),
        new Uint8Array([20, 21, 22, 23])
      ]

      // Create CIDs and Pairs
      const pairs = await Promise.all(
        dataBlocks.map(async (data) => {
          const hash = await sha256.digest(data)
          const cid = CID.createV1(0x55, hash)
          return { cid, block: data }
        })
      )

      // Put many blocks
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      for await (const _ of store.putMany(pairs)) {
        // Blocks stored
      }

      // Delete many blocks
      const cids = pairs.map((pair) => pair.cid)
      const deleteResults = []
      for await (const cid of store.deleteMany(cids)) {
        deleteResults.push(cid.toString())
      }

      // Check if blocks still exist
      const hasResults = await Promise.all(
        cids.map((cid) => store.has(cid))
      )

      return {
        deleteResults,
        hasResults
      }
    })

    // Verify that all CIDs were returned by deleteMany
    expect(result.deleteResults.length).toBe(3)
    expect(result.deleteResults).toEqual(
      expect.arrayContaining([
        expect.any(String),
        expect.any(String),
        expect.any(String)
      ])
    )

    // Verify that all blocks have been deleted
    for (const has of result.hasResults) {
      expect(has).toBe(false)
    }
  })

  // skipped to stop thrashing storage
  test.skip('should handle writing more data than the storage quota allows', async ({ page }) => {
    await page.goto(pageWebWorker)

    const result = await page.evaluate(async () => {
      const { OPFSBlockstore } = (window as any)
      const { OPFSMainThreadFS } = (window as any)
      const { CID } = (window as any)
      const { sha256 } = (window as any)

      const mainThreadFS = new OPFSMainThreadFS('bs')
      const store = new OPFSBlockstore(mainThreadFS)
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
        errorOccurred = error.message || error.toString()
      }

      return {
        totalDataWritten,
        errorOccurred
      }
    })

    // Log the results
    // console.log(`Total Data Written: ${result.totalDataWritten} bytes`);
    if (result.errorOccurred) {
      // Verify that an error occurred due to quota exceedance
      expect(result.errorOccurred).toContain('QuotaExceededError')
    } else {
      // If no error occurred, the quota was not exceeded within the test limits
      // eslint-disable-next-line no-console
      console.warn('Quota was not exceeded within the test data limit.')
      expect(result.totalDataWritten).toBeGreaterThan(0)
    }
  })
})
